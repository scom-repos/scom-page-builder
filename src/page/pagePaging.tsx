import { application, ControlElement, customElements, Module, Panel, HStack, Label } from '@ijstech/components';
import './pagePaging.css';
import { IPageData } from "../interface/index";
import { EVENT } from '../const/index';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-page-paging']: PagePagingElement;
        }
    }
}

export interface PagePagingElement extends ControlElement {
    pagesData?: IPageData[];
    currentPageData?: IPageData;
}

@customElements('scpage-page-paging')
export class PagePaging extends Module {
    private _visiblePagesData: IPageData[] = [];
    private _currentPageData: IPageData;
    private currentPageIndex: number = 0;
    private prevPage: HStack;
    private nextPage: HStack;
    private prevPageWrapper: HStack;
    private nextPageWrapper: HStack;
    private prevPageLabel: Label;
    private nextPageLabel: Label;
    private prevPageNotExist: boolean = true;
    private nextPageNotExist: boolean = true;
    private isCurrentPageActive: boolean = true;

    constructor(parent?: any) {
        super(parent);
    }

    async init() {
        this._visiblePagesData = this.getAttribute('pagesData', true);
        this._currentPageData = this.getAttribute('currentPageData', true);
        super.init();
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(
            this,
            EVENT.ON_PAGING_UPDATE,
            async (pages: IPageData[], currPage?: IPageData) => {
                this.setPaging(pages, currPage);
            }
        );
    }

    get pagesData() {
        return this._visiblePagesData;
    }

    set pagesData(value: IPageData[]) {
        this._visiblePagesData = value;
    }

    get currentPageData() {
        return this._currentPageData;
    }

    set currentpageData(value: IPageData) {
        this._currentPageData = value;
    }

    async setPaging(pages: IPageData[], currPage?: IPageData) {
        this._visiblePagesData = pages.filter(element => element.visible == true)

        let currentPageURL: string;
        if (currPage == undefined) {
            let isCurrentPageActive = this._visiblePagesData.includes(this._currentPageData)
            currentPageURL = isCurrentPageActive? this._currentPageData.url : "nullUrl"

        } else {
            this._currentPageData = currPage
            currentPageURL = currPage.url;
        }
        
        this.currentPageIndex = this._visiblePagesData.findIndex(element => element.url == currentPageURL);

        this.prevPageNotExist = (this.currentPageIndex == 0 || this.currentPageIndex == -1)
        this.nextPageNotExist = (this.currentPageIndex == this._visiblePagesData.length - 1 || this.currentPageIndex == -1)

        this.renderUI();
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    async renderUI() {

        if (this._visiblePagesData == undefined) return;

        this.prevPageWrapper.visible = this.prevPageNotExist ? false : true;
        this.nextPageWrapper.visible = this.nextPageNotExist ? false : true;

        if (this.prevPageNotExist && this.nextPageNotExist) {
            this.prevPageWrapper.width = '0%'
            this.nextPageWrapper.width = '0%'
        } else if (this.prevPageNotExist) {
            this.prevPageWrapper.width = '0%'
            this.nextPageWrapper.width = '100%'
        } else if (this.nextPageNotExist) {
            this.prevPageWrapper.width = '100%'
            this.nextPageWrapper.width = '0%'
        } else {
            this.prevPageWrapper.width = '50%'
            this.nextPageWrapper.width = '50%'
        }

        if (this.currentPageIndex != -1) {
            this.prevPageLabel.caption = this.prevPageNotExist ? "" : this._visiblePagesData[this.currentPageIndex - 1].name;
            this.nextPageLabel.caption = this.nextPageNotExist ? "" : this._visiblePagesData[this.currentPageIndex + 1].name;
        }
    }

    navToPrevPage() {
        if (this.prevPageNotExist || this.currentPageIndex == -1) return;
        application.EventBus.dispatch(EVENT.ON_SWITCH_PAGE, this._visiblePagesData[this.currentPageIndex - 1]);
    }

    navToNextPage() {
        if (this.nextPageNotExist || this.currentPageIndex == -1) return;
        application.EventBus.dispatch(EVENT.ON_SWITCH_PAGE, this._visiblePagesData[this.currentPageIndex + 1]);
    }

    render() {
        return (
            <i-hstack class={'paging'} id={'paging-container'} padding={{ left: '15px', top: '10px', right: '15px', bottom: '10px' }}
                height={'auto'} width={'100%'} justifyContent="space-between" gap="15px">

                <i-hstack id="prevPageWrapper" width='50%' height='85px'>
                    <i-hstack id={'prevPage'} class="pointer raise shadow" width='100%' height="100%" onClick={this.navToPrevPage}
                        border={{ radius: '4px', width: '1px', style: 'solid', color: 'rgba(227,232,237,1.00)' }}
                        padding={{ top: '16px', right: '16px', bottom: '16px', left: '16px' }}
                        verticalAlignment="center" justifyContent="space-between">
                        <i-icon name="arrow-left" width='20px' height='20px' margin={{ right: '20px' }}></i-icon>
                        <i-vstack height="100%" maxWidth="70%" gap="7px" horizontalAlignment='end'>
                            <i-label caption="Previous" font={{ color: 'grey', size: "12px" }}></i-label>
                            <i-label id='prevPageLabel' maxWidth={'100%'} class="cut-text" caption="prevPage" font={{ name: "roboto", size: "20px" }}></i-label>
                        </i-vstack>
                    </i-hstack>
                </i-hstack>

                <i-hstack id="nextPageWrapper" width='50%' height='85px'>
                    <i-hstack id={'nextPage'} class="pointer raise shadow" width='100%' height="100%" onClick={this.navToNextPage}
                        border={{ radius: '4px', width: '1px', style: 'solid', color: 'rgba(227,232,237,1.00)' }}
                        padding={{ top: '16px', right: '16px', bottom: '16px', left: '16px' }}
                        verticalAlignment="center" justifyContent="space-between">
                        <i-vstack height="100%" maxWidth="70%" gap="7px" horizontalAlignment='start'>
                            <i-label caption="Next" font={{ color: 'grey', size: "12px" }}></i-label>
                            <i-label id='nextPageLabel' maxWidth={'100%'} class="cut-text" caption="nextPage" font={{ name: "roboto", size: "20px" }}></i-label>
                        </i-vstack>
                        <i-icon name="arrow-right" width='20px' height='20px' margin={{ left: '20px' }}></i-icon>
                    </i-hstack>
                </i-hstack>

            </i-hstack>
        );
    }
}