import { Module, customElements, ControlElement, Styles, Panel, Button, Modal, Upload, Input, observable, application, Control } from '@ijstech/components';
import assets from '../assets';
import { EVENT } from '../const/index';
import { ElementType, ELEMENT_NAME, HeaderType, IPageHeader } from '../interface/index';
import { PageRow } from '../page/index';
import { getPageBlocks, pageObject } from '../store/index';
import { generateUUID } from '../utility/index';
import { currentTheme  } from '../theme/index';
import './builderHeader.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['builder-header']: HeaderElement;
        }
    }
}

const Theme = currentTheme;

export interface HeaderElement extends ControlElement {
    readonly?: boolean;
}

@customElements('builder-header')
export class BuilderHeader extends Module {
    private pnlHeader: Panel;
    private pnlHeaderMain: Panel;
    private pnlTitle: Panel;
    private pnlConfig: Panel;
    private pnlHeaderType: Panel;
    private pnlHeaderTypeMain: Panel;
    private btnAddLogo: Button;
    private pnlLogo: Panel;
    private mdUpload: Modal;
    private uploader: Upload;
    private nameInput: Input;
    private btnChangeImg: Button;

    private _readonly: boolean = false;
    private _isUpdatingBg: boolean = false;

    @observable()
    private showAddStack: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
        this.setData = this.setData.bind(this);
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            this.updateHeader();
        })
    }

    async setData(value: IPageHeader) {
        pageObject.header = value;
        await this.updateHeader();
    }

    private get _elements() {
        return pageObject.header.elements || [];
    }

    private get _image() {
        return pageObject.header.image || '';
    }

    private get _headerType() {
        return pageObject.header.headerType || '';
    }

    private async updateHeader() {
        this.pnlHeaderMain.clearInnerHTML();
        this.showAddStack = this._elements.length === 0 && !this._image;
        this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
        this.updateHeaderType();
        this.pnlConfig.visible = !this.showAddStack;
        if (!this.showAddStack) {
            const pageRow = (<ide-row width="100vw" maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
            const rowData = {
                id: 'header',
                row: 1,
                elements: this._elements
            }
            await pageRow.setData(rowData);
            pageRow.parent = this.pnlHeaderMain;
            this.pnlHeaderMain.appendChild(pageRow);
        }
    }

    private addHeader() {
        const pageBlocks = getPageBlocks();
        const textBlock = pageBlocks.find((v) => v.name === ELEMENT_NAME.TEXTBOX);
        this.setData({
            image: '',
            headerType: HeaderType.NORMAL,
            elements: [{
                id: generateUUID(),
                column: 4,
                columnSpan: 5,
                type: ElementType.PRIMITIVE,
                module: textBlock,
                properties: {},
                tag: {
                    width: '100%',
                    height: '130px'
                }
            }]
        })
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
            const image = file ? await this.uploader.toBase64(file) as string : '';
            this.pnlHeader.background = {image};
            pageObject.header = {...pageObject.header, image};
            this._isUpdatingBg = false;
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
        const header = pageObject.header;
        this.setData({...header, headerType: type.type});
        this.updateHeaderType();
    }

    private updateHeaderType() {
        if (!this._headerType || this.showAddStack) {
            this.height = 'auto';
            return;
        }
        switch (this._headerType) {
            case HeaderType.COVER:
                this.height = '100vh';
                this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                this.btnChangeImg.visible = true;
                break;
            case HeaderType.LARGE:
                this.height = 520;
                this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                this.btnChangeImg.visible = true;
                break;
            case HeaderType.NORMAL:
                this.height = 340;
                this.pnlHeader.background = this.showAddStack ? {color: '#fff', image: ''} : {image: this._image};
                this.btnChangeImg.visible = true;
                break;
            case HeaderType.TITLE:
                this.height = 180;
                this.pnlHeader.background = {color: '#fff', image: ''};
                this.btnChangeImg.visible = false;
                break;
        }
    }

    private renderHeaderType() {
        const headerTypes = [
            {
                caption: 'Cover',
                type: HeaderType.COVER,
                image: assets.fullPath('img/components/cover.svg')
            },
            {
                caption: 'Large Banner',
                type: HeaderType.LARGE,
                image: assets.fullPath('img/components/large.svg')
            },
            {
                caption: 'Banner',
                type: HeaderType.NORMAL,
                image: assets.fullPath('img/components/banner.svg')
            },
            {
                caption: 'Title Only',
                type: HeaderType.TITLE,
                image: assets.fullPath('img/components/title.svg')
            }
        ];
        this.pnlHeaderTypeMain.clearInnerHTML();
        this.pnlHeaderTypeMain.appendChild(
            <i-panel onClick={() => this.onToggleType(false)} class="pointer">
                <i-icon name="angle-left" width={24} height={24} fill="rgba(0,0,0,.54)"></i-icon>
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
                    <i-label caption={type.caption} font={{color: 'rgba(0,0,0,.54)'}}></i-label>
                </i-hstack>
            )
        })
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.display = "block";
        this.btnAddLogo.caption = this.pnlLogo ? 'Edit logo' : 'Add logo';
        this.renderHeaderType();
    }

    render() {
        return (
            <i-vstack id="pnlHeader" position="relative" width="100%" height="100%" maxHeight="100%" maxWidth="100%">
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
                    visible={false}
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
                    height="100%" maxHeight="100%"
                    horizontalAlignment="center" verticalAlignment="center"
                ></i-vstack>
                <i-hstack
                    horizontalAlignment="space-between"
                    position="absolute"
                    top="0px"
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
                            visible={false}
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
                        icon={{ name: 'image', fill: 'rgba(0,0,0,.54)' }}
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
                        icon={{ name: 'columns', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: 'transparent' }}
                        padding={{ left: 6, right: 6 }} height="100%"
                        border={{ width: 0, left: {width: '1px', style: 'solid', color: 'var(--builder-divider)'} }}
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
                    class="custom-box"
                    height="auto" width="auto"
                >
                    <i-hstack
                        id="pnlHeaderTypeMain"
                        gap="1rem"
                        margin={{left: 8, top: 8, bottom: 8, right: 8}}
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
