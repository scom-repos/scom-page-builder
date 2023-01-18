import {
    Module,
    customElements,
    ControlElement,
    Styles,
    VStack
} from '@ijstech/components';
import { SelectModuleDialog } from '@page/dialogs';
import { IRowData, IPageData } from '@page/interface';
import { PageSection } from './pageSection';
import { PageRow } from './pageRow';
import { PageFooter } from './pageFooter';
import { PagePaging } from './pagePaging';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-rows']: PageRowsElement;
        }
    }
}

export interface PageRowsElement extends ControlElement {
    readonly?: boolean;
}

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-rows')
export class PageRows extends Module {
    private rows: IRowData[];
    private pnlRows: VStack;
    private pagePaging: PagePaging;
    private pageFooter: PageFooter;

    private _readonly: boolean;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    async init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
    }

    initEventBus() {}

    async getRows(): Promise<IRowData[]> {
        const rows = this.pnlRows.querySelectorAll('ide-row');
        const rowDataList: IRowData[] = [];
        for (const row of rows) {
            const rowData = (row as PageRow).getData();
            rowDataList.push(rowData);
        }
        return rowDataList;
    }

    async setRows(rows: IRowData[]) {
        this.rows = rows;
        await this.renderRows();
    }

    async renderRows() {
        this.clearRows();
        if ((!this.rows || (this.rows && this.rows.length == 0)) && window.location.hash.indexOf('/edit') >= 0) {
            this.rows = [{
                config: {
                    width: '100%',
                    height: '100%',
                    columns: 1,
                },
                sections: []
            }]
        }
        for (const rowData of this.rows) {
            const pageRow = (<ide-row></ide-row> as PageRow);
            this.pnlRows.append(pageRow);
            await pageRow.setData(rowData);
        }
    }

    async appendRow(rowData: IRowData) {
        if(!this.rows) this.rows = [];
        const pageRow = (<ide-row></ide-row> as PageRow);
        if (!this._readonly)
            pageRow.border = {top: {width: '1px', style: 'dashed', color: Theme.divider}};
        this.pnlRows.append(pageRow);
        this.rows.push(rowData);
        await pageRow.setData(rowData);
        return pageRow;
    }

    clearRows() {
        this.pnlRows.clearInnerHTML();
    }

    set footerVisible(value: boolean) {
        this.pageFooter.visible = value
    }

    set footerSticky(value: boolean) {
        this.pageFooter.sticky = value
    }

    set footerCopyright(value: string) {
        this.pageFooter.footer = value
    }

    async setPaging(pages: IPageData[], currPage: IPageData) {
        await this.pagePaging.setPaging(pages, currPage);
    }

    setPagingVisibility(pagingVisible: boolean) {
        this.pagePaging.setVisible(pagingVisible);
    }

    updatePaging() {
        this.pagePaging.renderUI();
    }

    async render() {
        return (
            <i-panel>
                <i-vstack id={'pnlRows'} class={'container'} alignItems={'center'}></i-vstack>
                <scpage-page-paging id={"pagePaging"} visible={false}></scpage-page-paging>
                <scpage-page-footer id={'pageFooter'} class={'boxed-style'} visible={false}></scpage-page-footer>
            </i-panel>
        );
    }
}

export { SelectModuleDialog, PageSection, PageFooter };
