import { application, Button, customModule, HStack, Input, Module, Styles } from '@ijstech/components';
import { IDEToolbar } from '@page/common';
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

    initEventListener() {
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_ADD_COMPONENT, (componentConfig: IComponentConfig) => {
            if (!componentConfig) return;
            this.onAddComponent(componentConfig);
        });

        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            const rows = await this.pageRows.getRows();
            console.log('rows: ', rows);
            // for (const page of this.pages) {
            //     if (this.currentPage.url === page.url) {
            //         page.rows = rows;
            //     }
            // }
            // if (this.updatedPage.indexOf(this.currentPage.url) < 0)
            //     this.updatedPage.push(this.currentPage.url);
        });
    }

    private async onAddComponent(config: IComponentConfig) {
        console.log('add component: ', config.name);
        const paddingStyle = {top: '1.5rem', bottom: '1.5rem'};
        const row: PageRow = <ide-row padding={paddingStyle}></ide-row>;
        row.setData({
            config: {
                width: '100%',
                columns: 1
            },
            sections: []
        })
        let component = await IDEToolbar.create({
            padding: {left: '3rem', right: '3rem'},
            display: 'block'
        }) as IDEToolbar;
        switch(config.name) {
            case 'textbox':
                component.toolList = [
                    textStyles,
                    {
                        caption: `<i-icon name="bold" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    },
                    {
                        caption: `<i-icon name="italic" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    }
                ]
                component.appendItem(new Input(undefined, {
                    minHeight: '2.5rem',
                    width: '100%'
                }))
                break;
            case 'button':
                component.toolList = [
                    {
                        caption: `<i-icon name="trash" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    }
                ]
                component.appendItem(new Button(undefined, {
                    minHeight: '2.5rem',
                    minWidth: 100,
                    padding: {left: '1.5rem', right: '1.5rem'}
                }))
                break;
            case 'divider':
                component.toolList = [
                    {
                        caption: `<i-icon name="trash" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`,
                        onClick: () => {}
                    }
                ]
                component.appendItem(new HStack(undefined, {
                    border: {bottom: {width: '1px', style: 'solid', color: Theme.divider}},
                    height: 1
                }))
                break;
        }
        row.appendChild(component);
        this.pageRows.appendChild(row);
    }

    private renderHeader() {
        this.pageRows.clearInnerHTML();
        const row: PageRow = <ide-row></ide-row>;
        row.classList.add('page-header');
        row.setData({
            config: {
                width: '100%',
                height: '340px',
                columns: 1
            },
            sections: [
                
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
