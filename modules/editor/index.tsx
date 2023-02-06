import { application, customModule, Module } from '@ijstech/components';
import { BuilderFooter, BuilderHeader } from '@page/builder';
import { EVENT } from '@page/const';
import { ElementType, IPageBlockData, IPageData } from '@page/interface';
import { PageRows } from '@page/page';
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
    private builderHeader: BuilderHeader;
    private builderFooter: BuilderFooter;

    async getData() {
        return {
            header: this.builderHeader.data,
            sections: await this.pageRows.getRows(),
            footer: this.builderFooter.data
        }
    }

    async setData(value: IPageData) {
        this.builderHeader.data = value.header;
        this.pageRows.setRows(value.sections);
        this.builderFooter.data = value.footer;
    }

    async onLoad() {
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_ADD_ELEMENT, (data: IElementConfig) => {
            if (!data) return;
            this.onAddRow(data);
        });
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {})
    }

    private async onAddRow(data: IElementConfig) {
        const { type, module } = data;
        let element = {
            id: generateUUID(),
            column: 1,
            columnSpan: 1,
            type,
            module,
            properties: {} as any
        }
        if (module.name === "@PageBlock/OTC" || module.name === '@PageBlock/NFT Minter')
            element.properties.width = 300;
        let rowData = {
            id: generateUUID(),
            row: 0,
            elements: [element]
        };
        return await this.pageRows.appendRow(rowData);
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
                        padding={{bottom: '1rem'}}
                    >
                        <i-panel
                            id="pageContent"
                            maxWidth={1400}
                            width="100%"
                            // overflow={{x: 'hidden', y: 'auto'}}
                            margin={{ left: 'auto', right: 'auto'}}
                        >
                            <i-panel
                                maxWidth={1280}
                                minHeight="100vh"
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                background={{color: '#fff'}}
                                class="pnl-editor-wrapper"
                            >
                                <builder-header id="builderHeader"></builder-header>
                                <ide-rows
                                    id="pageRows"
                                    draggable={true}
                                ></ide-rows>
                                <builder-footer id="builderFooter"></builder-footer>
                            </i-panel>
                        </i-panel>
                    </i-panel>
                    <i-panel class="main-sidebar" height="100%" overflow={{ y: 'auto' }}>
                        <ide-sidebar
                            id={'pageSidebar'}
                            width="100%"
                        ></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
            </i-panel>
        );
    }
}
