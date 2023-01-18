import { application, Button, customModule, Module, Panel, Styles } from '@ijstech/components';
import { EVENT, textStyles } from '@page/const';
import { IRowData } from '@page/interface';
import { PageRow, PageRows } from '@page/page';
import { LightTheme  } from '@page/theme';
import './index.css';

const Theme = LightTheme;

interface IComponentConfig {
    name: string;
    config?: any
}

@customModule
export class Editor extends Module {
    private pageRows: PageRows;
    private btnAddHeader: Button;
    private headerStack: Panel;

    async onLoad() {
        this.initEventListener();
        this.initEventBus();
    }

    initEventListener() {}

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_ADD_COMPONENT, (componentConfig: IComponentConfig) => {
            if (!componentConfig) return;
            this.onAddComponent(componentConfig);
        });
        application.EventBus.register(this, EVENT.ON_ADD_ROW, (data: IRowData) => {
            if (!data) return;
            this.onAddRow(data);
        });
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            const headerRow = this.querySelector('#headerRow');
            this.btnAddHeader.visible = !headerRow;
            if (!headerRow) this.headerStack.background = {color: '#fff'};
        })
    }

    private async onAddComponent(config: IComponentConfig) {
        console.log('add component: ', config.name);
        let sectionData: any = {};
        let row: PageRow;
        switch(config.name) {
            case 'textbox':
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
                        onClick: async() => {
                            row.remove();
                        }
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
                break;
            case 'button':
                sectionData.toolList = [
                    {
                        caption: `<i-icon name="trash" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    }
                ];
                sectionData.component = {
                    type: 'Button',
                    properties: {
                        minHeight: '2.5rem',
                        minWidth: 100,
                        padding: {left: '1.5rem', right: '1.5rem'}
                    }
                };
                break;
            case 'divider':
                sectionData.component = {
                    type: 'Divider',
                    properties: {
                        border: {bottom: {width: '1px', style: 'solid', color: Theme.divider}},
                        height: 1,
                        width: '100%'
                    }
                };
                break;
            case 'image':
                sectionData.toolList = [
                    {
                        caption: `<i-icon name="trash" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    }
                ];
                sectionData.component = {
                    type: 'Image',
                    properties: {
                        height: 'auto',
                        minWidth: 100,
                        ...config.config
                    }
                };
                break;
        }
        let rowData = {
            config: {
                width: '100%',
                columns: 1,
                isCloned: config.name !== 'Divider',
                isChanged: config.name !== 'Divider'
            },
            sections: [sectionData]
        };
        row = await this.pageRows.appendRow(rowData);
    }

    private async onAddRow(rowData: IRowData) {
        let row = await this.pageRows.appendRow(rowData);
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
            config: {
                width: '100%',
                height: '340px',
                columns: 1,
                isCloned: false,
                isChanged: false
            },
            sections: [
                {
                    toolList: [
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
                            onClick: () => {
                                row.remove();
                            }
                        }
                    ],
                    component: {
                        type: 'Input',
                        properties: {
                            minHeight: '6.25rem',
                            width: '60%',
                            margin: { left: 'auto', right: 'auto'},
                            font: {color: '#fff', size: '2rem'},
                            value: 'Home'
                        }
                    },
                    height: '100%',
                    width: '100%'
                }
            ]
        })
        row.click();
        this.btnAddHeader.visible = false;
        this.headerStack.appendChild(row);
        this.headerStack.background = {color: 'rgba(34,110,147,1) url(https://ssl.gstatic.com/atari/images/simple-header-blended-small.png)'}
    }

    private onAddLogo() {}

    init() {
        super.init();
        this.renderHeader();
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
                            height="100%" width="100%"
                            overflow={{x: 'hidden'}}
                            margin={{ left: 'auto', right: 'auto', bottom: '1rem' }}
                        >
                            <ide-rows
                                id="pageRows"
                                maxWidth={1280}
                                height="100%"
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                background={{color: '#fff'}}
                                class="pnl-editor-wrapper"
                            >
                                <i-vstack id="headerStack" position="relative" width="100%">
                                    <i-hstack class="page-title" height="3.5rem" minWidth="12.5rem" background={{color: 'transparent'}}>
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
                                                onClick={() => this.onAddLogo()}
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
                    <i-panel class="main-sidebar" height="100%" overflow={{ y: 'hidden' }}>
                        <ide-sidebar id={'pageSidebar'} width="100%"></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
            </i-panel>
        );
    }
}
