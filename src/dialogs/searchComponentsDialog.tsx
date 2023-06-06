import {
    customElements,
    Module,
    ControlElement,
    Modal,
    Styles,
    Pagination,
    observable,
    HStack,
    application
} from '@ijstech/components';
import { assignAttr } from '../utility/index';
import './searchComponentsDialog.css';
import { addPageBlock, getSearchData, getSearchOptions } from '../store/index';
import assets from '../assets';
import { IPageBlockData, PAGE_SIZE } from '../interface/index';
import { EVENT } from '../const/index';
const Theme = Styles.Theme.ThemeVars;

export interface SearchComponentsDialogElement extends ControlElement {}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-search-components-dialog']: SearchComponentsDialogElement;
        }
    }
}

@customElements('ide-search-components-dialog')
export class SearchComponentsDialog extends Module {
    private mdSearch: Modal;
    private paginationElm: Pagination;
    private pnlComponents: HStack;

    @observable()
    private totalPage: number = 0;
    private pageNumber: number = 0;

    init() {
        super.init();
        assignAttr(this);
    }

    private get components() {
        return getSearchData()?.items || [];
    }

    private get total() {
        return getSearchData()?.total || 0;
    }

    hide() {
        this.mdSearch.visible = false;
    }

    show() {
        this.mdSearch.visible = true;
        this.resetPaging();
    }

    private onSelectIndex = () => {
        const pageNumber = this.paginationElm.currentPage;
        this.pageNumber = pageNumber;
        this.onFetchData();
    };

    private resetPaging = () => {
        this.pageNumber = 1;
        if (this.paginationElm) {
            this.paginationElm.currentPage = 1;
        }
    };

    renderUI = () => {
        let nodes = [];
        this.totalPage = Math.ceil(this.total / PAGE_SIZE);
        this.paginationElm.visible = this.totalPage > 1;
        if (!this.components.length) {
            this.pnlComponents.clearInnerHTML();
            this.pnlComponents.appendChild(
                <i-label caption="No components" margin={{ top: 'auto', bottom: 'auto' }} />
            );
            return;
        }
        for (const item of this.components) {
            const pnl = (
                <i-vstack
                    class="text-center pointer pnl-component"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    gap="0.5rem"
                    overflow={'hidden'}
                    background={{color: Theme.action.hover}}
                    border={{radius: 8, width: 1, style: 'solid', color: Theme.text.primary}}
                    width={'calc(33.33% - 7px)'}
                    minWidth={200}
                    minHeight={100}
                    padding={{top: 10, bottom: 10, left: 10, right: 10}}
                    onClick={() => this.onSelected(item)}
                >
                    <i-image
                        url={item.imgUrl || assets.icons.logo}
                        width={24}
                        height={24}
                        display="block"
                    ></i-image>
                    <i-label
                        caption={item.name}
                        font={{size: '0.813rem'}} opacity={0.7}
                        maxHeight={34} overflow={"hidden"}
                    ></i-label>
                </i-vstack>
            )
            nodes.push(pnl);
        }
        this.pnlComponents.clearInnerHTML();
        this.pnlComponents.append(...nodes);
    };

    private onSearch = () => {
        this.resetPaging();
        this.onFetchData();
    };

    private onFetchData() {
        const oldOptions = getSearchOptions();
        application.EventBus.dispatch(EVENT.ON_FETCH_COMPONENTS, {
            category: oldOptions.category || '',
            pageNumber: this.pageNumber,
            pageSize: oldOptions.pageSize
        });
    }

    private onSelected(item: IPageBlockData) {
        this.mdSearch.visible = false;
        addPageBlock(item);
        application.EventBus.dispatch(EVENT.ON_UPDATE_SIDEBAR);
    }

    render() {
        return (
            <i-modal
                id={'mdSearch'}
                minWidth={400}
                maxWidth={900}
                title="Search"
                closeOnBackdropClick={false}
                closeIcon={{ name: 'times' }}
                class="search-modal"
            >
                <i-panel padding={{ top: '1rem', bottom: '2rem', left: '1rem', right: '1rem' }}>
                    <i-vstack id="pnlMain" gap='1rem'>
                        <i-input
                            id="inputSearch"
                            width={300}
                            maxWidth="100%"
                            height={32}
                            border={{ radius: 5, style: 'solid', width: 1, color: Theme.text.primary }}
                            placeholder="Search components"
                            onChanged={this.onSearch}
                        />
                        <i-hstack
                            id="pnlComponents"
                            minHeight={120}
                            gap={10}
                            wrap="wrap"
                            horizontalAlignment="center"
                        />
                        <i-pagination
                            id="paginationElm"
                            margin={{ top: 16, bottom: 16, left: 'auto', right: 'auto' }}
                            width="auto"
                            currentPage={this.pageNumber}
                            totalPages={this.totalPage}
                            onPageChanged={this.onSelectIndex}
                        />
                    </i-vstack>
                </i-panel>
            </i-modal>
        );
    }
}
