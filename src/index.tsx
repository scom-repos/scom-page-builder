import { application, Container, Control, ControlElement, customElements, customModule, Module, Panel, Styles } from '@ijstech/components';
import { } from '@ijstech/eth-contract'
import { BuilderFooter, BuilderHeader } from './builder/index';
import { EVENT } from './const/index';
import { IPageData, IPageBlockData, IPageElement, IOnFetchComponentsOptions, IOnFetchComponentsResult, ICategory, ThemeType } from './interface/index';
import { PageRows, PageSidebar } from './page/index';
import { getDragData, getRootDir, setRootDir as _setRootDir, pageObject, setPageBlocks, setSearchData, setSearchOptions, getSearchData, getPageBlocks, getCategories, setCategories, setTheme, getBackgroundColor, getFontColor, getDivider } from './store/index';
import { currentTheme } from './theme/index';
import './index.css';
import { SearchComponentsDialog } from './dialogs/index';
export { IOnFetchComponentsOptions, IOnFetchComponentsResult };

const Theme = currentTheme;
type onFetchComponentsCallback = (options: IOnFetchComponentsOptions) => Promise<IOnFetchComponentsResult>

interface PageBuilderElement extends ControlElement {
    rootDir?: string;
    components?: IPageBlockData[];
    categories?: ICategory[];
    theme?: ThemeType;
    onFetchComponents?: onFetchComponentsCallback;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-page-builder']: PageBuilderElement;
        }
    }
}

@customElements('i-scom-page-builder')
@customModule
export default class Editor extends Module {
    private pageRows: PageRows;
    // private builderHeader: BuilderHeader;
    private builderFooter: BuilderFooter;
    private pnlWrap: Panel;
    private pageSidebar: PageSidebar;
    private mdComponentsSearch: SearchComponentsDialog;

    private events: any[] = [];
    private currentElement: any;
    private isFirstLoad: boolean = false;
    private _theme: ThemeType = 'light';

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.initEventBus();
    }

    get rootDir() {
        return getRootDir();
    }

    set rootDir(value: string) {
        _setRootDir(value);
    }

    get components() {
        return getPageBlocks();
    }

    set components(value: IPageBlockData[]) {
        setPageBlocks(value);
        this.pageSidebar.renderUI();
    }

    get categories() {
        return getCategories();
    }

    set categories(value: ICategory[]) {
        setCategories(value);
        this.pageSidebar.renderUI();
    }

    get theme() {
        return this._theme ?? 'light';
    }

    set theme(value: ThemeType) {
        this._theme = value ?? 'light';
        setTheme(this.theme);
        const bgColor = getBackgroundColor(this.theme);
        const fontColor = getFontColor(this.theme);
        const dividerColor = getDivider(this.theme);
        this.style.setProperty('--builder-bg', bgColor);
        this.style.setProperty('--builder-color', fontColor);
        this.style.setProperty('--builder-divider', dividerColor);
    }

    async onFetchComponents(options: IOnFetchComponentsOptions): Promise<IOnFetchComponentsResult> {
        return { items: [], total: 0 };
    }

    private initScrollEvent(containerElement: Control) {
        let scrollPos = 0;
        let ticking = false;
        const scrollSpeed = 1000;
        const scrollThreshold = 100;
        containerElement.addEventListener("dragover", (event) => {
            event.preventDefault();
            if (!this.currentElement && !getDragData()) return;
            scrollPos = event.clientY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    adjustScrollSpeed(scrollPos);
                    ticking = false;
                });
                ticking = true;
            }
        });

        function adjustScrollSpeed(mouseY: number) {
            const { top, bottom } = containerElement.getBoundingClientRect();
            const isNearTop = mouseY < top + scrollThreshold;
            const isNearBottom = mouseY > bottom - scrollThreshold;
            const isNearWindowTop = mouseY <= scrollThreshold;
            const isNearWindowBottom = mouseY > window.innerHeight - scrollThreshold;
            const scrollAmountTop = Math.max(scrollThreshold - (mouseY - top), 0);
            const scrollAmountBottom = Math.max(scrollThreshold - (bottom - mouseY), 0);

            if (isNearTop || isNearWindowTop) {
                const scrollFactor = 1 + (scrollThreshold - scrollAmountTop) / scrollThreshold;
                containerElement.scrollTop -= scrollSpeed * scrollFactor;
            } else if (isNearBottom || (isNearWindowBottom && bottom > window.innerHeight)) {
                const scrollFactor = 1 + (scrollThreshold - scrollAmountBottom) / scrollThreshold;
                containerElement.scrollTop += scrollSpeed * scrollFactor;
            } else {
                containerElement.scrollTo({ behavior: 'auto', top: containerElement.scrollTop });
            }
        }

        containerElement.addEventListener('drop', (event) => {
            const elementConfig = getDragData();
            if (elementConfig?.module?.name === 'sectionStack') {
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION);
            }
        });
    }

    private initEventListeners() {
        this.initScrollEvent(this.pnlWrap);
    }

    init() {
        const rootDir = this.getAttribute('rootDir', true);
        if (rootDir) this.setRootDir(rootDir);
        const components = this.getAttribute('components', true);
        if (components) setPageBlocks(components);
        const categories = this.getAttribute('categories', true);
        if (categories) setCategories(categories);
        const onFetchComponents = this.getAttribute('onFetchComponents', true);
        if (onFetchComponents) this.onFetchComponents = onFetchComponents.bind(this);
        super.init();
        this.initEventListeners();
        this.initData();
        this.theme = this.getAttribute('theme', true);
    }

    setRootDir(value: string) {
        _setRootDir(value);
    }

    getData() {
        const hasData = (el: IPageElement) => el.type === 'primitive' || (el.type === 'composite' && el.elements?.length);
        return {
            // header: pageObject.header,
            sections: pageObject.sections.filter(section => {
                const hasElements = !!section.elements?.length;
                if (hasElements) {
                    const elements = [...section.elements].filter(hasData);
                    section.elements = elements;
                }
                return !!section.elements.length;
            }),
            footer: pageObject.footer,
            config: pageObject.config
        };
    }

    async setData(value: IPageData) {
        // pageObject.header = value.header;
        pageObject.sections = value?.sections || [];
        pageObject.footer = value?.footer;
        pageObject.config = value?.config;
        try {
            // await this.builderHeader.setData(value.header);
            await this.pageRows.setRows(value?.sections || []);
            await this.builderFooter.setData(value?.footer);
            const hasBg = pageObject?.config?.backgroundColor || getBackgroundColor();
            this.style.setProperty('--builder-bg', hasBg);
        } catch (error) {
            console.log('setdata', error);
        }
    }

    onHide() {
        for (let event of this.events) {
            event.unregister();
        }
        this.events = [];
        application.EventBus.dispatch(EVENT.ON_CLOSE_BUILDER);
    }

    private initEventBus() {
        this.events.push(
            application.EventBus.register(this, EVENT.ON_UPDATE_FOOTER, async () => this.onUpdateWrapper())
        );
        this.events.push(
            application.EventBus.register(this, EVENT.ON_SET_DRAG_ELEMENT, async (el: any) => this.currentElement = el)
        )
        this.events.push(
            application.EventBus.register(this, EVENT.ON_TOGGLE_SEARCH_MODAL, this.onToggleSearch)
        )
        this.events.push(
            application.EventBus.register(this, EVENT.ON_FETCH_COMPONENTS, this.onSearch)
        )
    }

    private onUpdateWrapper() {
        //     this.contentWrapper.minHeight = `calc((100vh - 6rem) - ${this.builderFooter.offsetHeight}px)`;
        //     this.contentWrapper.padding = {bottom: this.builderFooter.offsetHeight};
    }

    private async onToggleSearch(visible: boolean) {
        if (visible)
            this.mdComponentsSearch.show();
        else
            this.mdComponentsSearch.hide();
    }

    private async onSearch(options?: IOnFetchComponentsOptions) {
        const params = {...options } || {
            category: undefined,
            pageNumber: undefined,
            pageSize: undefined
        };
        const { items = [], total = 0 } = await this.onFetchComponents(params);
        setSearchData({ items, total })
        setSearchOptions(params);
        this.mdComponentsSearch.renderUI();
    }

    private async initData() {
        if (this.isFirstLoad) return;
        await this.onSearch();
        this.components = getSearchData()?.items || [];
        this.isFirstLoad = true;
    }

    render() {
        return (
            <i-vstack
                id="editor"
                width={'100%'}
                height={'100%'}
                maxHeight="100vh"
                overflow={'hidden'}
            >
                <ide-header
                    id={'pageHeader'}
                    border={{ bottom: { width: 1, style: 'solid', color: '#dadce0' } }}
                ></ide-header>
                <i-grid-layout
                    templateColumns={['auto', 'minmax(auto, 235px)']}
                    autoFillInHoles={true}
                    height="calc(100% -64px)"
                    overflow="hidden"
                >
                    <i-panel
                        id="pnlWrap"
                        height="100%"
                        width="100%"
                        overflow={{ y: 'auto', x: 'hidden' }}
                        background={{ color: Theme.background.default }}
                        border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}
                        padding={{ bottom: '1rem' }}
                    >
                        <i-panel
                            id="pageContent"
                            maxWidth={1400}
                            width="100%"
                            margin={{ left: 'auto', right: 'auto' }}
                        >
                            <i-panel
                                maxWidth={1280}
                                minHeight="100vh"
                                margin={{ top: 8, bottom: 8, left: 60, right: 60 }}
                                background={{ color: 'var(--builder-bg)' }}
                                class="pnl-editor-wrapper"
                            >
                                <i-panel
                                    id="contentWrapper"
                                    padding={{ bottom: '12rem' }}
                                    minHeight="calc((100vh - 6rem) - 12rem)"
                                >
                                    {/* <builder-header id="builderHeader"></builder-header> */}
                                    <ide-rows id="pageRows" draggable={true}></ide-rows>
                                </i-panel>
                                <builder-footer id="builderFooter"></builder-footer>
                            </i-panel>
                        </i-panel>
                    </i-panel>
                    <i-panel
                        id="pnlSidebar"
                        height="100%"
                        overflow={{ x: 'hidden', y: 'auto' }}
                        class="pnl-scrollable"
                    >
                        <ide-sidebar
                            id={'pageSidebar'}
                            display={'block'}
                            width="100%"
                        ></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
                <ide-search-components-dialog
                    id="mdComponentsSearch"
                ></ide-search-components-dialog>
            </i-vstack>
        );
    }
}
