import { application, Container, customModule, Module, Panel } from '@ijstech/components';
import {} from '@ijstech/eth-contract'
import { BuilderFooter, BuilderHeader } from './builder/index';
import { EVENT } from './const/index';
import { ElementType, IPageBlockData, IPageData } from './interface/index';
import { PageRows } from './page/index';
import { pageObject } from './store/index';
import { LightTheme  } from './theme/index';
import { generateUUID } from './utility/index';
import './index.css';

const Theme = LightTheme;
interface IElementConfig {
    module: IPageBlockData;
    type: ElementType;
}

@customModule
export default class Editor extends Module {
    private pageRows: PageRows;
    private builderHeader: BuilderHeader;
    private builderFooter: BuilderFooter;
    private contentWrapper: Panel;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
    }

    getData() {
        return {
            header: pageObject.header,
            sections: pageObject.sections,
            footer: pageObject.footer
        }
    }

    async setData(value: IPageData) {
        pageObject.header = value.header;
        pageObject.sections = value.sections;
        pageObject.footer = value.footer;

        try {
            await this.builderHeader.setData(value.header);
            await this.pageRows.setRows(value.sections);
            await this.builderFooter.setData(value.footer);
        } catch(error) {
            console.log('setdata', error)
        }
    }

    onLoad() {
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_ADD_ELEMENT, (data: IElementConfig) => {
            if (!data) return;
            this.onAddRow(data);
        });
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {})
        application.EventBus.register(this, EVENT.ON_UPDATE_FOOTER, async () => this.onUpdateWrapper())
    }

    private async onAddRow(data: IElementConfig) {
        const { type, module } = data;
        let element = {
            id: generateUUID(),
            column: 1,
            columnSpan: 12,
            type,
            module,
            properties: {} as any
        }
        if (module.name === "..Block/OTC" || module.name === '..Block/NFT Minter')
            element.properties.width = 300;
        let rowData = {
            id: generateUUID(),
            row: 0,
            elements: [element]
        };
        return await this.pageRows.appendRow(rowData);
    }

    private onUpdateWrapper() {
        this.contentWrapper.minHeight = `calc((100vh - 6rem) - ${this.builderFooter.offsetHeight}px)`;
        this.contentWrapper.padding = {bottom: this.builderFooter.offsetHeight};
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
                            margin={{ left: 'auto', right: 'auto'}}
                        >
                            <i-panel
                                maxWidth={1280}
                                minHeight="100vh"
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                background={{color: '#fff'}}
                                class="pnl-editor-wrapper"
                            >
                                <i-panel
                                    id="contentWrapper"
                                    padding={{bottom: '12rem'}}
                                    minHeight="calc((100vh - 6rem) - 12rem)"
                                >
                                    <builder-header id="builderHeader"></builder-header>
                                    <ide-rows id="pageRows" draggable={true}></ide-rows>
                                </i-panel>
                                <builder-footer id="builderFooter"></builder-footer>
                            </i-panel>
                        </i-panel>
                    </i-panel>
                    <i-panel class="main-sidebar" height="100%" overflow={{ y: 'auto' }}>
                        <ide-sidebar id={'pageSidebar'} width="100%"></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
            </i-panel>
        );
    }
}
