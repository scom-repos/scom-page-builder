import { application, Button, customModule, HStack, Input, Module, Styles } from '@ijstech/components';
import { EVENT, textStyles } from '@page/const';
import { PageRow, PageRows } from '@page/page';
import './index.css';

const Theme = Styles.Theme.ThemeVars;

interface IComponentConfig {
    name: string;
    config?: any
}

@customModule
export class Editor extends Module {
    private pageRows: PageRows;

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
    }

    private async onAddComponent(config: IComponentConfig) {
        console.log('add component: ', config.name);
        const row: PageRow = <ide-row
            border={{
                top: {width: '1px', style: 'dashed', color: Theme.divider}
            }}
        ></ide-row>;
        let sectionData: any = {};
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
                        onClick: () => {
                            row.remove();
                            console.log(this.pageRows)
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
        }
        row.setData({
            config: {
                width: '100%',
                columns: 1
            },
            sections: [sectionData]
        });
        this.pageRows.appendChild(row);
    }

    private renderHeader() {
        const row: PageRow = <ide-row></ide-row>;
        row.classList.add('page-header');
        row.setData({
            config: {
                width: '100%',
                height: '340px',
                columns: 1,
                backgroundImageUrl: 'https://ssl.gstatic.com/atari/images/simple-header-blended-small.png',
                backgroundColor: 'rgba(34,110,147,1)'
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
                            minHeight: '2.5rem',
                            width: '100%',
                            minWidth: '50%'
                        }
                    }
                }
            ]
        })
        this.pageRows.appendChild(row);
    }

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
                            margin={{ left: 'auto', right: 'auto' }}
                            width="100%"
                        >
                            <ide-rows
                                id="pageRows"
                                maxWidth={1280}
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                class="pnl-editor-wrapper"
                            >
                                <i-hstack class="page-title" height="3.5rem" minWidth="12.5rem">
                                    <i-input
                                        id="nameInput"
                                        placeholder='Enter site name'
                                        height="100%" width="100%"
                                        class="custom-input"
                                    ></i-input>
                                </i-hstack>
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
