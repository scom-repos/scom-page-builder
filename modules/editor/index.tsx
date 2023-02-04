import { application, Button, customModule, Modal, Module, Panel, Upload, Input } from '@ijstech/components';
import { IDEToolbar } from '@page/common';
import { EVENT, textStyles } from '@page/const';
import { ElementType, IPageBlockData } from '@page/interface';
import { PageRow, PageRows } from '@page/page';
import { LightTheme  } from '@page/theme';
import { generateUUID } from '@page/utility';
import './index.css';

const Theme = LightTheme;
interface IElementConfig {
    module: IPageBlockData;
    type: ElementType;
}

@customModule
export class Editor extends Module {
    private pageRows: PageRows;
    private btnAddHeader: Button;
    private headerStack: Panel;
    private titleStack: Panel;
    private logoPanel: Panel;
    private mdUpload: Modal;
    private uploader: Upload;
    private nameInput: Input;
    private btnAddLogo: Button;

    async onLoad() {
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_ADD_ELEMENT, (data: IElementConfig) => {
            if (!data) return;
            this.onAddElement(data);
        });
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            const headerRow = this.querySelector('#headerRow');
            this.btnAddHeader.visible = !headerRow;
            if (!headerRow) this.headerStack.background = {color: '#fff'};
        })
    }

    private async onAddElement(data: IElementConfig) {
        const { type, module } = data;
        let row: PageRow;
        let element = {
            id: generateUUID(),
            column: 1,
            columnSpan: 1,
            type,
            module,
            properties: {}
        }
        let rowData = {
            id: generateUUID(),
            // config: {
            //     width: '100%',
            //     columns: 1,
            //     isCloned: true,
            //     isChanged: true
            // },
            row: 0,
            elements: [element]
        };
        row = await this.pageRows.appendRow(rowData);
    }

    private onShowModal() {
        this.mdUpload.visible = true;
    }

    private async onUploadLogo() {
        const fileList = this.uploader.fileList || [];
        const file = fileList[0];
        if (this.titleStack.contains(this.logoPanel))
            this.titleStack.removeChild(this.logoPanel);
        if (!file) {
            this.mdUpload.visible = false;
            this.btnAddLogo.caption = 'Add logo';
            this.logoPanel = null;
            return;
        }
        const imgStr = await this.uploader.toBase64(file) as string;
        this.logoPanel = (
            <i-panel>
                <i-image url={imgStr} minWidth="50" height="auto"></i-image>
            </i-panel>
        );
        this.btnAddLogo.caption = 'Edit logo';
        this.titleStack.insertBefore(this.logoPanel, this.nameInput);
        this.mdUpload.visible = false;
    }

    private renderHeader() {
        const row: PageRow = (
            <ide-row
                id="headerRow"
                background={{color: 'transparent'}}
            ></ide-row>
        );
        row.classList.add('text-center');
        row.setData({
            id: generateUUID(),
            row: 0,
            // config: {
            //     width: '100%',
            //     height: '340px',
            //     columns: 1,
            //     isCloned: false,
            //     isChanged: false
            // },
            elements: []
        })
        row.click();
        this.btnAddHeader.visible = false;
        this.headerStack.appendChild(row);
        this.headerStack.background = {color: 'rgba(34,110,147,1) url(https://ssl.gstatic.com/atari/images/simple-header-blended-small.png)'}
    }

    init() {
        super.init();
        this.renderHeader();
        this.btnAddLogo.caption = this.logoPanel ? 'Edit logo' : 'Add logo';
    }

    render() {
        return (
            <i-panel id="editor" width={'100%'} height={'100%'}>
                <ide-header
                    id={'pageHeader'}
                    dock={'top'}
                    border={{ bottom: { width: 1, style: 'solid', color: '#dadce0' } }}
                ></ide-header>
                <i-grid-layout
                    templateColumns={['auto', '400px']}
                    autoFillInHoles={true}
                    dock="fill"
                    height="100%"
                >
                    <i-panel
                        class="main-content"
                        height="100%"
                        overflow={{ y: 'auto' }}
                        background={{ color: Theme.background.default }}
                        border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}
                    >
                        <i-panel
                            id="pageContent"
                            maxWidth={1400}
                            width="100%"
                            overflow={{x: 'hidden', y: 'auto'}}
                            margin={{ left: 'auto', right: 'auto', bottom: '1rem' }}
                        >
                            <ide-rows
                                id="pageRows"
                                maxWidth={1280}
                                minHeight="100vh"
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                padding={{bottom: '1rem'}}
                                background={{color: '#fff'}}
                                draggable={true}
                                class="pnl-editor-wrapper"
                            >
                                <i-vstack id="headerStack" position="relative" width="100%">
                                    <i-hstack
                                        id="titleStack"
                                        class="page-title"
                                        height="3.5rem" minWidth="12.5rem"
                                        gap="1.125rem"
                                        padding={{left: '1.125rem', right: '1.125rem', top: '0.5rem', bottom: '0.5rem'}}
                                        background={{color: 'transparent'}}
                                    >
                                        <i-input
                                            id="nameInput"
                                            placeholder='Enter site name'
                                            height="100%" width="100%"
                                            class="custom-input"
                                        ></i-input>
                                    </i-hstack>
                                    <i-hstack
                                        horizontalAlignment="space-between"
                                        position="absolute"
                                        top="4rem" zIndex={15}
                                        width="100%"
                                        padding={{left: 10, bottom: 5, right: 10}}
                                        class="header-stack"
                                    >
                                        <i-panel>
                                            <i-button
                                                id="btnAddLogo"
                                                class="btn-add"
                                                icon={{ name: 'image', fill: 'rgba(0,0,0,.54)' }}
                                                font={{color: 'rgba(0,0,0,.54)'}}
                                                background={{color: Theme.colors.secondary.light}}
                                                padding={{top: 10, left: 6, right: 6, bottom: 10}}
                                                border={{radius: 2}}
                                                caption="Add logo"
                                                onClick={() => this.onShowModal()}
                                            ></i-button>
                                        </i-panel>
                                        <i-panel>
                                            <i-button
                                                id="btnAddHeader"
                                                class="btn-add"
                                                icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                                                font={{color: 'rgba(0,0,0,.54)'}}
                                                background={{color: Theme.colors.secondary.light}}
                                                padding={{top: 10, left: 6, right: 6, bottom: 10}}
                                                border={{radius: 2}}
                                                caption="Add header"
                                                visible={false}
                                                onClick={() => this.renderHeader()}
                                            ></i-button>
                                        </i-panel>
                                        <i-panel></i-panel>
                                    </i-hstack>
                                </i-vstack>
                            </ide-rows>
                        </i-panel>
                    </i-panel>
                    <i-panel class="main-sidebar" height="100%" overflow={{ y: 'auto' }}>
                        <ide-sidebar
                            id={'pageSidebar'}
                            width="100%"
                        ></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
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
            </i-panel>
        );
    }
}
