import {
    Module,
    customElements,
    ControlElement,
    Panel,
    observable,
    application,
    Modal,
    Upload
} from '@ijstech/components';
import { EVENT } from '../const/index';
import { IPageFooter, TEXTBOX_PATH } from '../interface/index';
import { PageRow } from '../page/index';
import { generateUUID } from '../utility/index';
import { getPageBlocks, pageObject } from '../store/index';
import { IDEToolbar } from '../common/index';
import { currentTheme  } from '../theme/index';
import './builderFooter.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['builder-footer']: FooterElement;
        }
    }
}

const Theme = currentTheme;

export interface FooterElement extends ControlElement {
    readonly?: boolean;
}

@customElements('builder-footer')
export class BuilderFooter extends Module {
    private pnlFooter: Panel;
    private pnlFooterMain: Panel;
    private pnlEditOverlay: Panel;
    private pnlOverlay: Panel;
    private pnlConfig: Panel;
    private mdUpload: Modal;
    private uploader: Upload;

    private _readonly: boolean = false;

    @observable()
    private showAddStack: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
        this.setData = this.setData.bind(this);
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            // if (!pageObject.footer?.elements?.length)
            this.updateFooter();
        })
    }

    async setData(value: IPageFooter) {
        pageObject.footer = value;
        await this.updateFooter();
    }

    private get _elements() {
        return pageObject.footer?.elements || [];
    }

    private get _image() {
        return pageObject.footer?.image || '';
    }

    private async updateFooter() {
        this.pnlFooterMain.clearInnerHTML();
        this.showAddStack = this._elements?.length === 0 && !this._image;
        this.pnlFooter.background = this.showAddStack ? {color: 'var(--builder-bg)', image: ''} : {image: this._image};
        this.pnlEditOverlay.visible = !this.showAddStack;
        this.pnlEditOverlay.classList.remove('flex');
        this.pnlConfig.visible = !this.showAddStack;
        if (!this.showAddStack) {
            const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
            const rowData = {
                id: 'footer',
                row: -1,
                elements: this._elements
            }
            await pageRow.setData(rowData);
            pageRow.parent = this.pnlFooterMain;
            this.pnlFooterMain.append(pageRow);
            this.pnlEditOverlay.classList.add('flex');
        }
        application.EventBus.dispatch(EVENT.ON_UPDATE_FOOTER);
    }

    private addFooter() {
        const pageBlocks = getPageBlocks();
        const textBlock = pageBlocks.find((v) => v.path === TEXTBOX_PATH);
        this.setData({
            image: '',
            elements: [{
                id: generateUUID(),
                column: 1,
                columnSpan: 12,
                // type: ElementType.COMPOSITE,
                module: textBlock,
                properties: {},
                elements: [{
                    id: generateUUID(),
                    column: 1,
                    columnSpan: 12,
                    module: textBlock,
                    // type: ElementType.PRIMITIVE,
                    properties: {},
                    tag: {
                        width: '100%',
                        height: '130px'
                    }
                }]
            }]
        })
    }

    private updateOverlay(value: boolean) {
        this.pnlEditOverlay.visible = value && !this.showAddStack;
        if (this.pnlEditOverlay.visible)
            this.pnlEditOverlay.classList.add('flex');
        else
            this.pnlEditOverlay.classList.remove('flex');
        this.pnlOverlay.visible = !this.pnlEditOverlay.visible && !this.showAddStack;
        this.pnlOverlay.height = this.pnlOverlay.visible ? document.body.offsetHeight + this.offsetHeight : 0;
        if (!this.pnlOverlay.visible) {
            const row = this.querySelector('ide-row');
            if (row) {
                row.classList.remove('active');
                const toolbars = row.querySelectorAll('ide-toolbar');
                toolbars.forEach((toolbar) => {
                    (toolbar as IDEToolbar).hideToolbars();
                })
            }
        }
    }

    onChangedBg() {
        this.uploader.clear();
        this.mdUpload.visible = true;
    }

    private async onUpdateImage() {
        const fileList = this.uploader.fileList || [];
        const file = fileList[0];
        const image = file ? await this.uploader.toBase64(file) as string : '';
        this.pnlFooter.background = {image};
        pageObject.footer = {...pageObject.footer, image};
        this.mdUpload.visible = false;
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.position = 'absolute',
        this.width = '100%';
        this.display = 'block';
        this.bottom = '0px';
        this.minHeight = '12rem';
    }

    render() {
        return (
            <i-vstack
                id="pnlFooter"
                width="100%" height="100%"
                minHeight='12rem'
                maxWidth="100%" maxHeight="40%"
            >
                <i-panel
                    id="pnlOverlay"
                    width="100%" height="100%"
                    background={{color: 'rgba(0,0,0,.6)'}}
                    position="absolute"
                    zIndex={29}
                    left="0px" bottom="100%"
                    visible={false}
                    onClick={() => this.updateOverlay(true)}
                ></i-panel>
                <i-hstack
                    id="pnlEditOverlay"
                    width="100%" height="100%"
                    position="absolute" top="0px" left="0px"
                    background={{color: 'rgba(0,0,0,.6)'}}
                    zIndex={29}
                    visible={false}
                    verticalAlignment="center" horizontalAlignment="center"
                    class="edit-stack"
                >
                     <i-button
                        class="btn-add"
                        icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: Theme.colors.secondary.light }}
                        padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                        border={{ radius: 2 }}
                        caption="Edit Footer"
                        onClick={() => this.updateOverlay(false)}
                    ></i-button>
                </i-hstack>
                <i-hstack
                    verticalAlignment="end"
                    horizontalAlignment="center"
                    width="100%" height="auto"
                    display='inline-block'
                    position="absolute" bottom="0px"
                    margin={{bottom: -10}}
                    class="edit-stack"
                    visible={this.showAddStack}
                >
                    <i-panel>
                        <i-button
                            id="btnAddFooter"
                            class="btn-add"
                            icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                            font={{ color: 'rgba(0,0,0,.54)' }}
                            background={{ color: Theme.colors.secondary.light }}
                            padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                            border={{ radius: 2 }}
                            caption="Add Footer"
                            onClick={() => this.addFooter()}
                        ></i-button>
                    </i-panel>
                </i-hstack>
                <i-panel id="pnlFooterMain" max-maxWidth="100%" maxHeight="100%"></i-panel>
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
                        class="btn-add"
                        icon={{ name: 'image', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: 'transparent' }}
                        padding={{ left: 6, right: 6 }} height="100%"
                        border={{ width: 0 }}
                        caption="Change Image"
                        onClick={() => this.onChangedBg()}
                    ></i-button>
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
                                onClick={this.onUpdateImage.bind(this)}
                            ></i-button>
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-vstack>
        )
    }
}
