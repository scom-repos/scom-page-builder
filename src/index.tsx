import { application, Container, Control, ControlElement, customElements, customModule, Module, Panel, Styles, VStack } from '@ijstech/components';
// import { } from '@ijstech/eth-contract'
import { BuilderFooter, BuilderHeader } from './builder/index';
import { EVENT } from './const/index';
import { IPageData, IPageBlockData, IPageElement, IOnFetchComponentsOptions, IOnFetchComponentsResult, ICategory, ThemeType } from './interface/index';
import { PageRow, PageRows, PageSidebar, PageMenu } from './page/index';
import { getDragData, getRootDir, setRootDir as _setRootDir, pageObject, setPageBlocks, setSearchData, setSearchOptions, getSearchData, getPageBlocks, getCategories, setCategories, setTheme, getBackgroundColor, getFontColor, getDivider, getDefaultPageConfig, getMargin, setDefaultPageConfig, getFontSize } from './store/index';
import { currentTheme } from './theme/index';
import './index.css';
import { SearchComponentsDialog } from './dialogs/index';
import { commandHistory } from './command/index';
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
    private pageMenu: PageMenu;
    private mdComponentsSearch: SearchComponentsDialog;
    private pnlEditor: Panel;
    private pageContent: VStack;

    private events: any[] = [];
    private currentElement: any;
    private isFirstLoad: boolean = false;
    private _theme: ThemeType = 'light';
    private boundHandleKeyUp = this.onKeyUp.bind(this);

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
        // this.pageSidebar.renderUI();
    }

    get categories() {
        return getCategories();
    }

    set categories(value: ICategory[]) {
        setCategories(value);
        // this.pageSidebar.renderUI();
        this.pageSidebar.renderWidgetCategories();
    }

    get theme() {
        return this._theme ?? 'light';
    }

    set theme(value: ThemeType) {
        this._theme = value ?? 'light';
        setTheme(this.theme);
        const bgColor = getBackgroundColor(this.theme);
        const fontColor = getFontColor(this.theme);
        const fontSize = getFontSize();
        const dividerColor = getDivider(this.theme);
        this.style.setProperty('--builder-bg', bgColor);
        this.style.setProperty('--builder-color', fontColor);
        this.style.setProperty('--builder-font-size', fontSize)
        this.style.setProperty('--builder-divider', dividerColor);
    }

    get commandHistoryIndex(): number {
        return commandHistory.commandIndex;
    }

    isChanged(index?: number): boolean {
        return commandHistory.commandIndex !== (index??-1);
    }
    
    async reset() {
        pageObject.sections = [];
        pageObject.footer = undefined;
        pageObject.config = undefined;
        commandHistory.reset();
        setDefaultPageConfig({});
        try {
            await this.pageRows.setRows([]);
            await this.builderFooter.setData(undefined);
            this.updatePageConfig();
        } catch (error) {
        }
    }

    async onFetchComponents(options: IOnFetchComponentsOptions): Promise<IOnFetchComponentsResult> {
        return { items: [], total: 0 };
    }

    private initScrollEvent(containerElement: Control) {
        let scrollPos = 0;
        let ticking = false;
        const scrollSpeed = 1000;
        const scrollThreshold = 100;
        const self = this;
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
            const pageRowsRect = this.pageRows.getBoundingClientRect();
            const pnlEditorRect = this.pnlEditor.getBoundingClientRect();
            // dragover on the below of rows
            if (event.clientY <= pnlEditorRect.height + pnlEditorRect.y && event.clientY >= pageRowsRect.height + pageRowsRect.y) {
                const lastRows = this.pageRows.querySelector('ide-row:last-child');
                application.EventBus.dispatch(EVENT.ON_SHOW_BOTTOM_BLOCK, lastRows);
            }
        });

        function adjustScrollSpeed(mouseY: number) {
            const { top, bottom } = containerElement.getBoundingClientRect();
            const isNearTop = mouseY < top + scrollThreshold;
            const isNearBottom = mouseY > bottom - scrollThreshold;
            const isNearWindowTop = mouseY <= scrollThreshold;
            const isNearWindowBottom = mouseY > window.innerHeight - scrollThreshold;

            if (isNearTop || isNearWindowTop) {
                // const scrollFactor = 1 + (scrollThreshold - scrollAmountTop) / scrollThreshold;
                containerElement.scrollTop -= scrollSpeed;
            } else if (isNearBottom || (isNearWindowBottom && bottom > window.innerHeight)) {
                // const scrollFactor = 1 + (scrollThreshold - scrollAmountBottom) / scrollThreshold;
                containerElement.scrollTop += scrollSpeed;
            } else {
                containerElement.scrollTo({ behavior: 'smooth', top: containerElement.scrollTop });
            }
        }

        containerElement.addEventListener('drop', (event) => {
            const elementConfig = getDragData();
            if (elementConfig?.module?.name === 'sectionStack') {
                // add section
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { defaultElements: elementConfig.defaultElements });
            } else {
                const dragEnter = this.pnlEditor.querySelector('.is-dragenter') as Control;
                const pageRow = dragEnter && dragEnter.closest('ide-row') as PageRow;
                if (pageRow) {
                    const customDropEvent = new Event('drop', { bubbles: true, cancelable: true });
                    pageRow.dispatchEvent(customDropEvent);
                } else if (!pageObject.sections?.length) {
                    // add section
                    application.EventBus.dispatch(EVENT.ON_ADD_SECTION);
                    const pageRow = this.pnlEditor.querySelector('ide-row') as PageRow;
                    if (pageRow && pageRow.onAddRow) pageRow.onAddRow();
                }
            }
        });
    }

    private initDragEvent(containerElement: Control) {
        // remove ghost image when dragging
        // containerElement.addEventListener("dragstart", async ( event ) => {
        //     const img = new Image();
        //     img.src = "http://placehold.it/150/000000/ffffff";
        //     img.style.opacity = '0'
        //     event.dataTransfer.setDragImage(img, window.outerWidth, window.outerHeight);
        // }, false);
    }

    private initEventListeners() {
        this.initScrollEvent(this.pnlWrap);
        this.initDragEvent(this.pageContent);
    }

    private onKeyUp(event: KeyboardEvent) {
        const toolbars = Array.from(this.pnlEditor.querySelectorAll('ide-toolbar'))
        const cannotRedoUndo = toolbars.find(
            (toolbar) => toolbar.classList.contains('is-editing') || toolbar.classList.contains('is-setting')
        );
        if (event.code === 'KeyZ' && event.ctrlKey && !cannotRedoUndo) {
            commandHistory.undo();
        } else if (event.code === 'KeyY' && event.ctrlKey && !cannotRedoUndo) {
            commandHistory.redo();
        }
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
        return {
            // header: pageObject.header,
            sections: pageObject.getNonNullSections(),
            footer: pageObject.footer,
            config: pageObject.config
        };
    }

    async setData(value: IPageData) {
        // pageObject.header = value.header;
        document.addEventListener('keyup', this.boundHandleKeyUp);
        pageObject.sections = value?.sections || [];
        pageObject.footer = value?.footer;
        pageObject.config = value?.config;
        setDefaultPageConfig(value?.config);
        try {
            // await this.builderHeader.setData(value.header);
            await this.pageRows.setRows(value?.sections || []);
            await this.builderFooter.setData(value?.footer);
            this.updatePageConfig();
        } catch (error) {
            console.log('setdata', error);
        }
        application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
    }

    private updatePageConfig() {
        const { backgroundColor, backgroundImage, margin, sectionWidth } = getDefaultPageConfig();
        this.style.setProperty('--builder-bg', backgroundColor);
        if (this.pnlEditor) {
            this.pnlEditor.maxWidth = '100%'; // maxWidth ?? '100%';
            const marginStyle = getMargin(margin);
            this.pnlEditor.margin = marginStyle;
            this.pnlEditor.style.width = `calc(100% - (2 * ${marginStyle.left}))`;
        }
    }

    onHide() {
        for (let event of this.events) {
            event.unregister();
        }
        this.events = [];
        application.EventBus.dispatch(EVENT.ON_CLOSE_BUILDER);
        document.removeEventListener('keyup', this.boundHandleKeyUp);
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
        this.events.push(
            application.EventBus.register(this, EVENT.ON_UPDATE_PAGE_BG, async (data: { image: string }) => {
                if (data.image) this.pnlEditor.style.backgroundImage = `url(${data.image})`
            })
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
                {/* <ide-header
                    id={'pageHeader'}
                    border={{ bottom: { width: 1, style: 'solid', color: '#dadce0' } }}
                ></ide-header> */}
                {/* <i-grid-layout
                    templateColumns={['auto', 'minmax(auto, 235px)']}
                    autoFillInHoles={true}
                    height="calc(100% -64px)"
                    overflow="hidden"
                > */}
                    <i-panel
                        id="pnlWrap"
                        height="100%"
                        width="100%"
                        overflow={{ y: 'auto', x: 'hidden' }}
                        background={{ color: '#f7f3ef' }}
                    >
                        <i-vstack
                            id="pageContent"
                            // maxWidth="calc(100% - 6em)"
                            width="100%"
                            horizontalAlignment='center'
                            // margin={{ top: '3.5rem', left: 'auto', right: 'auto' }}
                            // padding={{top: '1rem', bottom: '1rem'}}
                        >
                            <i-panel
                                id="pnlEditor"
                                // maxWidth={1024}
                                minHeight="100vh"
                                width="100%"
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
                        </i-vstack>
                    </i-panel>
                    {/* <i-panel
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
                    </i-panel> */}
                {/* </i-grid-layout> */}
                <i-scom-page-builder-sidebar id="pageSidebar" zIndex={990}></i-scom-page-builder-sidebar>
                <ide-search-components-dialog
                    id="mdComponentsSearch"
                ></ide-search-components-dialog>
            </i-vstack>
        );
    }
}
