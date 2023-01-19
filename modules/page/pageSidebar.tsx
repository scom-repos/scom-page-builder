import {
    Module,
    customElements,
    ControlElement,
    Styles,
    GridLayout,
    Control,
    Icon,
    VStack,
    application,
    Modal,
    Upload
} from '@ijstech/components';
import assets from '@page/assets';
import { EVENT, textStyles } from '@page/const';
import { IRowData } from '@page/interface';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-sidebar']: PageSidebarElement;
        }
    }
}

import './pageSidebar.css';

export interface PageSidebarElement extends ControlElement {}
interface IContentBlock {
    image: string;
    columns: number;
}

@customElements('ide-sidebar')
export class PageSidebar extends Module {
    private blockStack: GridLayout;
    private componentsStack: VStack;
    private mdUpload: Modal;
    private uploader: Upload;

    private _contentBlocks: IContentBlock[] = [];
    private _components: any[] = [];

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    initEventBus() {
    }

    init() {
        super.init();
        this.renderUI();
    }

    private renderBlockStack() {
        this._contentBlocks = [
            {
                image: 'img/blocks/block1.svg',
                columns: 2
            },
            {
                image: 'img/blocks/block2.svg',
                columns: 2
            },
            {
                image: 'img/blocks/block3.svg',
                columns: 2
            },
            {
                image: 'img/blocks/block4.svg',
                columns: 3
            }
        ]
        this.blockStack.clearInnerHTML();
        this._contentBlocks.forEach(block => {
            let config = { width: '100%', columns: block.columns };
            let sectionData: any = {};
            sectionData.toolList = [
                textStyles,
                {
                    caption: `<i-icon name="bold" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                    onClick: () => {}
                },
                {
                    caption: `<i-icon name="italic" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                    onClick: () => {}
                },
                {
                    caption: `<i-icon name="trash" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                    onClick: async() => {}
                }
            ];
            sectionData.component = {
                type: 'Input',
                properties: {
                    minHeight: '2.5rem',
                    width: '100%',
                    minWidth: 200
                }
            };
            this.blockStack.appendChild(
                <i-vstack
                    class="block-image pointer"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    onClick={() => this.onAddRow({ config, sections: [sectionData, sectionData] })}
                >
                    <i-image width="auto" height="100%" url={assets.fullPath(block.image)}></i-image>
                </i-vstack>
            )
        })
    }

    private renderComponentsStack() {
        this._components = [
            {
                name: 'Button',
                onClick: () => this.onAddComponent('button')
            },
            {
                name: 'Divider',
                onClick: () => this.onAddComponent('divider')
            },
            {
                name: 'Table',
                onClick: () => this.onAddComponent('table')
            },
            {
                name: 'Carousel',
                onClick: () => this.onAddComponent('carousel')
            }
        ]
        this.componentsStack.clearInnerHTML();
        this._components.forEach(component => {
            this.componentsStack.appendChild(
                <i-hstack
                    height={48}
                    verticalAlignment="center"
                    gap="1rem"
                    padding={{left: '1rem', right: '1rem'}}
                    class="pointer"
                    onClick={() => component.onClick()}
                >
                    <i-panel>
                        <i-icon name="circle" width={24} height={24}></i-icon>
                    </i-panel>
                    <i-label caption={component.name} font={{weight: 600}}></i-label>
                </i-hstack>
            )
        })
    }

    private renderUI() {
        this.renderBlockStack();
        this.renderComponentsStack();
    }

    private onToggleBlock(source: Control) {
        this.blockStack.visible = !this.blockStack.visible;
        const icon = source.querySelector('i-icon') as Icon;
        icon && (icon.name = this.blockStack.visible ? 'angle-up' : 'angle-down');
    }

    private onAddRow(rowData: IRowData) {
        application.EventBus.dispatch(EVENT.ON_ADD_ROW, rowData);
    }

    private onAddComponent(name: string) {
        if (name === 'image') {
            this.mdUpload.visible = true;
        } else {
            application.EventBus.dispatch(EVENT.ON_ADD_COMPONENT, { name });
        }
    }

    private async onUploadImage() {
        const fileList = this.uploader.fileList || [];
        const file = fileList[0];
        if (!file) {
            this.mdUpload.visible = false;
            return;
        }
        const imgStr = await this.uploader.toBase64(file);
        application.EventBus.dispatch(EVENT.ON_ADD_COMPONENT, { name: 'image', config: { url: imgStr } });
        this.mdUpload.visible = false;
    }

    private onShowModal() {
        this.mdUpload.visible = true;
    }

    render() {
        return (
            <i-panel class="navigator" height={'100%'} maxWidth="100%">
                <i-tabs 
                    class="insert-tabs"
                >
                    <i-tab
                        caption='Insert'
                        background={{color: 'transparent'}}
                    >
                        <i-panel height="100%" overflow={{y: 'hidden'}}>
                            <i-grid-layout templateColumns={['repeat(2, 1fr)']} templateRows={['repeat(2, 5rem)']} margin={{top: 6}}>
                                <i-vstack
                                    class="text-center pointer"
                                    verticalAlignment="center" horizontalAlignment='center'
                                    minWidth={88} gap="0.5rem"
                                    onClick={() => this.onAddComponent('textbox')}
                                >
                                    <i-icon name="text-width" width={24} height={24}></i-icon>
                                    <i-label caption='Text box'></i-label>
                                </i-vstack>
                                <i-vstack
                                    class="text-center pointer"
                                    verticalAlignment="center" horizontalAlignment='center'
                                    minWidth={88} gap="0.5rem"
                                    onClick={() => this.onShowModal()}
                                >
                                    <i-icon name="image" width={24} height={24}></i-icon>
                                    <i-label caption='Image'></i-label>
                                </i-vstack>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="code" width={24} height={24}></i-icon>
                                    <i-label caption='Embed'></i-label>
                                </i-vstack>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="hdd" width={24} height={24}></i-icon>
                                    <i-label caption='Drive'></i-label>
                                </i-vstack>
                            </i-grid-layout>
                            <i-vstack
                                border={{bottom: { width: 1, style: 'solid', color: Theme.divider}, top: { width: 1, style: 'solid', color: Theme.divider}}}
                            >
                                <i-hstack
                                    horizontalAlignment="space-between"
                                    verticalAlignment="center"
                                    padding={{top: 8, bottom: 8, left: '1.5rem', right: 0}}
                                    class="pointer"
                                    onClick={(source) => this.onToggleBlock(source)}
                                >
                                    <i-label caption="Content blocks" font={{weight: 600, size: '0.75rem', transform: 'uppercase'}}></i-label>
                                    <i-icon name="angle-down" fill={Theme.text.primary} width={24} height={24}></i-icon>
                                </i-hstack>
                                <i-grid-layout
                                    id="blockStack"
                                    templateColumns={['repeat(2, 1fr)']}
                                    gap={{column: 12, row: 12}}
                                    border={{bottom: { width: 1, style: 'solid', color: Theme.divider}}}
                                    padding={{left: '8px', right: '8px', bottom: '1rem'}}
                                ></i-grid-layout>
                            </i-vstack>
                            <i-vstack
                                id="componentsStack"
                                padding={{top: '8px', bottom: '8px'}}
                            ></i-vstack>
                        </i-panel>
                    </i-tab>
                    <i-tab caption='Pages'>
                        <i-panel padding={{left: '1rem', right: '1rem', top: '1rem'}}>
                            <i-label caption='Pages'></i-label>
                        </i-panel>
                    </i-tab>
                </i-tabs>
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
                                class="btn-add"
                                onClick={this.onUploadImage.bind(this)}
                            ></i-button>
                        </i-hstack>
                    </i-vstack>
                </i-modal>
            </i-panel>
        );
    }
}
