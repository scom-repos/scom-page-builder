import { Module, customElements, ControlElement, Styles, Panel, Button, Modal, Upload, Input, observable, application, Control } from '@ijstech/components';
import assets from '@page/assets';
import { EVENT } from '@page/const';
import { HeaderType, IPageElement, IPageHeader } from '@page/interface';
import { PageRow } from '@page/page';
import { generateUUID } from '@page/utility';
import './builderHeader.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['builder-header']: HeaderElement;
        }
    }
}

const Theme = Styles.Theme.ThemeVars;

export interface HeaderElement extends ControlElement {
    readonly?: boolean;
}

@customElements('builder-header')
export class BuilderHeader extends Module {
    private pnlHeader: Panel;
    private pnlHeaderMain: Panel;
    private btnAddLogo: Button;
    private pnlTitle: Panel;
    private pnlLogo: Panel;
    private mdUpload: Modal;
    private uploader: Upload;
    private nameInput: Input;
    private btnChangeImg: Button;
    private pnlConfig: Panel;
    private pnlHeaderType: Panel;
    private pnlHeaderTypeMain: Panel;

    private _headerType: HeaderType;
    private _image: string;
    private _elements: IPageElement[];
    private _data: IPageHeader = {
        headerType: 'banner',
        image: '',
        elements: []
    };
    private _readonly: boolean = false;
    private _isUpdatingBg: boolean = false;

    @observable()
    private showAddStack: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            // TODO: update data
            if (!this.pnlHeaderMain.hasChildNodes()) {
                this.showAddStack = true;
                this.pnlHeader.background = {color: '#fff', image: ''};
                this.pnlConfig.visible = false;
                this.pnlHeaderType.visible = false;
            }
        })
    }

    get data(): IPageHeader {
        return {
            image: this._image,
            elements: this._elements,
            headerType: this._headerType
        };
    }
    set data(value: IPageHeader) {
        this._data = value;
        this._headerType = value.headerType;
        this._image = value.image;
        this._elements = value.elements;
        this.updateHeader();
    }

    private async updateHeader() {
        this.showAddStack = this._elements.length === 0;
        this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
        !this.showAddStack && this.nameInput.classList.add('has-header');
        this.pnlConfig.visible = !this.showAddStack;
        this.pnlHeaderMain.clearInnerHTML();
        const pageRow = (<ide-row maxWidth="100%"></ide-row>) as PageRow;
        let rowData = {
            id: generateUUID(),
            row: 0,
            elements: this._elements
        }
        await pageRow.setData(rowData);
        pageRow.parent = this.pnlHeaderMain;
        this.pnlHeaderMain.append(pageRow);
    }

    private addHeader() {
        this.data = {
            image: 'https://ssl.gstatic.com/atari/images/simple-header-blended-small.png',
            headerType: 'banner',
            elements: [{
                id: generateUUID(),
                column: 1,
                columnSpan: 4,
                type: 'primitive',
                module: {
                    name: "Image",
                    description: 'Image (dev)',
                    localPath: 'modules/pageblocks/scom-image', // for testing
                    local: true
                },
                properties: {}
            }]
        }
    }

    private onShowUpload() {
        this.uploader.clear();
        this.mdUpload.visible = true;
    }

    private onChangedBg() {
        this._isUpdatingBg = true;
        this.onShowUpload();
    }

    private onToggleType(value: boolean) {
        this.pnlHeaderType.visible = value;
        this.pnlConfig.visible = !value;
    }

    private async onUpdateImage() {
        const fileList = this.uploader.fileList || [];
        const file = fileList[0];
        if (this._isUpdatingBg) {
            const image = await this.uploader.toBase64(file) as string;
            this.pnlHeader.background = {image};
            this._image = image;
        } else {
            if (this.pnlTitle.contains(this.pnlLogo))
                this.pnlTitle.removeChild(this.pnlLogo);
            if (!file) {
                this.mdUpload.visible = false;
                this.btnAddLogo.caption = 'Add logo';
                this.pnlLogo = null;
                return;
            }
            const imgStr = await this.uploader.toBase64(file) as string;
            this.pnlLogo = (
                <i-panel>
                    <i-image url={imgStr} width="35" height="auto" display="block"></i-image>
                </i-panel>
            );
            this.btnAddLogo.caption = 'Edit logo';
            this.pnlTitle.insertBefore(this.pnlLogo, this.nameInput);
        }

        this.mdUpload.visible = false;
    }

    private onActiveType(source: Control, type: any) {
        const types = Array.from(this.pnlHeaderTypeMain.querySelectorAll('.type'));
        types.forEach(type => {
            type.classList.remove('active');
        })
        source.classList.add('active');
        type.onClick();
    }

    private renderHeaderType() {
        const headerTypes = [
            {
                caption: 'Cover',
                image: assets.fullPath('img/components/cover.svg'),
                onClick: () => {
                    this.pnlHeader.height = '100vh';
                    this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                    this.btnChangeImg.visible = true;
                }
            },
            {
                caption: 'Large Banner',
                image: assets.fullPath('img/components/large.svg'),
                onClick: () => {
                    this.pnlHeader.height = 520;
                    this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                    this.btnChangeImg.visible = true;
                }
            },
            {
                caption: 'Banner',
                image: assets.fullPath('img/components/banner.svg'),
                onClick: () => {
                    this.pnlHeader.height = 340;
                    this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                    this.btnChangeImg.visible = true;
                }
            },
            {
                caption: 'Title Only',
                image: assets.fullPath('img/components/title.svg'),
                onClick: () => {
                    this.pnlHeader.height = 180;
                    this.pnlHeader.background = {color: '#fff', image: ''};
                    this.btnChangeImg.visible = false;
                }
            }
        ];
        this.pnlHeaderTypeMain.clearInnerHTML();
        this.pnlHeaderTypeMain.appendChild(
            <i-panel onClick={() => this.onToggleType(false)} class="pointer">
                <i-icon name="caret-left" width={24} height={24} fill={Theme.text.primary}></i-icon>
            </i-panel>
        )
        headerTypes.forEach(type => {
            this.pnlHeaderTypeMain.appendChild(
                <i-hstack
                    gap="10px" class="type"
                    verticalAlignment="center"
                    onClick={(source: Control) => this.onActiveType(source, type)}
                >
                    <i-panel>
                        <i-image url={type.image} width={34} height={34}></i-image>
                    </i-panel>
                    <i-label caption={type.caption}></i-label>
                </i-hstack>
            )
        })
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.btnAddLogo.caption = this.pnlLogo ? 'Edit logo' : 'Add logo';
        this.renderHeaderType();
    }

    render() {
        return (
            <i-vstack id="pnlHeader" position="relative" width="100%">
                <i-hstack
                    id="pnlTitle"
                    class="page-title"
                    height="3.5rem"
                    minWidth="12.5rem"
                    gap="1.125rem"
                    padding={{
                        left: '1.125rem',
                        right: '1.125rem',
                        top: '0.5rem',
                        bottom: '0.5rem',
                    }}
                    background={{ color: 'transparent' }}
                    verticalAlignment="center"
                >
                    <i-input
                        id="nameInput"
                        placeholder="Enter site name"
                        height="100%"
                        width="100%"
                        class="custom-input"
                    ></i-input>
                </i-hstack>
                <i-vstack
                    id="pnlHeaderMain"
                    height="calc(100% - 36px - 52px)"
                    horizontalAlignment="center" verticalAlignment="center"
                ></i-vstack>
                <i-hstack
                    horizontalAlignment="space-between"
                    position="absolute"
                    top="4rem"
                    zIndex={15}
                    width="100%"
                    padding={{ left: 10, bottom: 5, right: 10 }}
                    class="edit-stack"
                >
                    <i-panel>
                        <i-button
                            id="btnAddLogo"
                            class="btn-add"
                            icon={{ name: 'image', fill: 'rgba(0,0,0,.54)' }}
                            font={{ color: 'rgba(0,0,0,.54)' }}
                            background={{ color: Theme.colors.secondary.light }}
                            padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                            border={{ radius: 2 }}
                            caption="Add logo"
                            onClick={() => this.onShowUpload()}
                        ></i-button>
                    </i-panel>
                    <i-panel>
                        <i-button
                            id="btnAddHeader"
                            class="btn-add"
                            icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                            font={{ color: 'rgba(0,0,0,.54)' }}
                            background={{ color: Theme.colors.secondary.light }}
                            padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                            border={{ radius: 2 }}
                            caption="Add header"
                            visible={this.showAddStack}
                            onClick={() => this.addHeader()}
                        ></i-button>
                    </i-panel>
                    <i-panel></i-panel>
                </i-hstack>
                <i-hstack
                    id="pnlConfig"
                    background={{ color: '#fafafa' }}
                    bottom="0px" left="0px" position="absolute"
                    verticalAlignment="center"
                    border={{ radius: 2 }}
                    margin={{left: 12, top: 12, bottom: 12, right: 12}}
                    height="40px"
                    class="custom-box"
                    visible={false}
                >
                    <i-button
                        id="btnChangeImg"
                        class="btn-add"
                        icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: 'transparent' }}
                        padding={{ left: 6, right: 6 }} height="100%"
                        border={{ width: 0 }}
                        caption="Change Image"
                        onClick={() => this.onChangedBg()}
                    ></i-button>
                    <i-button
                        id="btnChangeType"
                        class="btn-add"
                        icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: 'transparent' }}
                        padding={{ left: 6, right: 6 }} height="100%"
                        border={{ width: 0, left: {width: '1px', style: 'solid', color: Theme.divider} }}
                        caption="Header Type"
                        onClick={() => this.onToggleType(true)}
                    ></i-button>
                </i-hstack>
                <i-panel
                    id="pnlHeaderType"
                    visible={false}
                    background={{ color: '#fafafa' }}
                    bottom="0px" left="0px" position="absolute"
                    border={{ radius: 2 }}
                    margin={{left: 12, top: 12, bottom: 12, right: 12}}
                    padding={{left: 8, top: 8, bottom: 8, right: 8}}
                    class="custom-box"
                    height="40px" width="auto"
                >
                    <i-hstack
                        id="pnlHeaderTypeMain"
                        gap="1rem"
                        height="100%" width="100%"
                        verticalAlignment="center"
                    ></i-hstack>
                </i-panel>
                <i-modal
                    id='mdUpload'
                    title='Select Image'
                    closeIcon={{ name: 'times' }}
                    width={400}
                    closeOnBackdropClick={false}
                >
                    <i-vstack padding={{top: '1rem'}} gap="1rem">
                        <i-upload
                            id='uploader'
                            draggable
                            caption='Drag and Drop image'
                            class="custom-uploader"
                        ></i-upload>
                        <i-hstack horizontalAlignment="end">
                            <i-button
                                id="btnAddImage"
                                icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                                font={{color: 'rgba(0,0,0,.54)'}}
                                background={{color: Theme.colors.secondary.light}}
                                padding={{top: 10, left: 6, right: 6, bottom: 10}}
                                border={{radius: 2}}
                                caption="Add Image"
                                onClick={this.onUpdateImage.bind(this)}
                            ></i-button>
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-vstack>
        );
    }
}
