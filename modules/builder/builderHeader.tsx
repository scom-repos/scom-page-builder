import { Module, customElements, ControlElement, Styles, Panel, Button, Modal, Upload, Input, observable, application } from '@ijstech/components';
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

    private _headerType: HeaderType;
    private _image: string;
    private _elements: IPageElement[];
    private _data: IPageHeader;
    private _readonly: boolean = false;

    @observable()
    private showEdit: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            // TODO: update data
            if (!this.pnlHeaderMain.hasChildNodes()) {
                this.showEdit = true;
                this.pnlHeader.background = {color: '#fff', image: ''};
            }
        })
    }

    get data() {
        return this._data;
    }
    set data(value: IPageHeader) {
        this._data = value;
        this._headerType = value.headerType;
        this._image = value.image;
        this._elements = value.elements;
        this.updateHeader();
    }

    private async updateHeader() {
        this.showEdit = this._elements.length === 0;
        this.pnlHeader.background = this.showEdit ? {color: '#fff', image: ''} : {image: this._image};
        !this.showEdit && this.nameInput.classList.add('has-header');
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
        this.mdUpload.visible = true;
    }

    private async onUploadLogo() {
        const fileList = this.uploader.fileList || [];
        const file = fileList[0];
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
        this.mdUpload.visible = false;
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.btnAddLogo.caption = this.pnlLogo ? 'Edit logo' : 'Add logo';
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
                <i-panel id="pnlHeaderMain"></i-panel>
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
                            visible={this.showEdit}
                            onClick={() => this.addHeader()}
                        ></i-button>
                    </i-panel>
                    <i-panel></i-panel>
                </i-hstack>
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
                                onClick={this.onUploadLogo.bind(this)}
                            ></i-button>
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-vstack>
        );
    }
}
