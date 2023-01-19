import {
    Module,
    customElements,
    ControlElement,
    Styles,
    GridLayout
} from '@ijstech/components';
import { SelectModuleDialog } from '@page/dialogs';
import { IRowData, IPageData } from '@page/interface';
import { PageSection } from './pageSection';
import { PageRow } from './pageRow';
import { PageFooter } from './pageFooter';
import { PagePaging } from './pagePaging';
import './pageRows.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-rows']: PageRowsElement;
        }
    }
}

export interface PageRowsElement extends ControlElement {
    readonly?: boolean;
    draggable?: boolean;
}

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-rows')
export class PageRows extends Module {
    private rows: IRowData[] = [];
    private pnlRows: GridLayout;
    private pagePaging: PagePaging;
    private pageFooter: PageFooter;
    private currentRow: PageRow;

    private _readonly: boolean;
    private _draggable: boolean;

    constructor(parent?: any) {
        super(parent);
        this.dragStartHandler = this.dragStartHandler.bind(this);
        this.dragEndHandler = this.dragEndHandler.bind(this);

        this.dragOverHandler = this.dragOverHandler.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.draggable = this.getAttribute('draggable', true, false);
    }

    get draggable(): boolean {
        return this._draggable;
    }
    set draggable(value: boolean) {
        if (this._draggable === value) return;
        this._draggable = value;
        // if (this.draggable) {
        //     this.pnlRows.ondragover = this.dragOverHandler;
        //     this.pnlRows.ondrop = this.dropHandler;
        //   } else {
        //     this.pnlRows.ondragover = null;
        //     this.pnlRows.ondrop = null;
        //   }
        // this.handleDrag();
    }

    // private handleDrag() {
    //     const rows = Array.from(this.pnlRows.querySelectorAll('ide-row'));
    //     if (!rows?.length) return;
    //     rows.forEach((row: PageRow, rowid: number) => {
    //         row.id = `row-${rowid}`;
    //         this.initDragEvent(row);
    //     });
    // }

    private dragStartHandler(event: DragEvent) {
        const target = event.target as any;
        const pageRow = target.closest('ide-row');
        if (!pageRow) return;
        this.currentRow = pageRow;
        pageRow.updateControl();
        pageRow.classList.add('dragging');
        const rows = this.pnlRows.querySelectorAll('ide-row');
        rows.forEach(row => {
            if (!row.isEqualNode(pageRow))
                row.classList.add('dropzone');
        })
    }

    private dragEndHandler(event: DragEvent) {
        const pageRow = (event.target as any).closest('ide-row');
        pageRow.classList.remove("dragging");
        const rows = this.pnlRows.querySelectorAll('ide-row');
        rows.forEach(row => {
            row.classList.remove("dropzone", "dragenter");
        })
    }

    private dragEnterHandler(event: DragEvent) {
        const target = event.target as HTMLElement;
        const pageRow = target.closest('ide-row');
        if (!pageRow.isEqualNode(this.currentRow))
            pageRow.classList.add("dragenter");
    }

    private dragLeaveHandler(event: DragEvent) {
        const target = event.target as HTMLElement;
        const pageRow = target.closest('ide-row');
        pageRow.classList.remove("dragenter");
    }

    private dragOverHandler(event: DragEvent) {
        event.preventDefault();
    }

    private dropHandler(event: DragEvent) {
        event.preventDefault();
        if (!this.currentRow) return;
        const target = event.target as HTMLElement;
        const dropElm = target instanceof PageRow ? target : target.closest('ide-row') as PageRow;
        dropElm.classList.remove("dragenter");
        if (dropElm && !this.currentRow.isSameNode(dropElm)) {
            let dragIndex = 0;
            let dropIndex = 0;
            const rows = this.pnlRows.querySelectorAll('ide-row');
            for (let i = 0; i < rows.length; i++) {
            if (this.currentRow.isEqualNode(rows[i])) { dragIndex = i; }
            if (dropElm.isEqualNode(rows[i])) { dropIndex = i; }
            }
            const [dragRowData] = this.rows.splice(dragIndex, 1);
            this.rows.splice(dropIndex, 0, dragRowData);

            if (dragIndex < dropIndex) {
                this.pnlRows.insertBefore(this.currentRow, dropElm.nextSibling);
            } else {
                this.pnlRows.insertBefore(this.currentRow, dropElm);
            }
        }
        this.currentRow = null;
    }

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
        if (
            (!this.rows || (this.rows && this.rows.length == 0)) &&
            window.location.hash.indexOf('/edit') >= 0
        ) {
            this.rows = [
                {
                    config: {
                        width: '100%',
                        height: '100%',
                        columns: 1,
                    },
                    sections: []
                }
            ];
        }
        for (let i = 0; i < this.rows.length; i++) {
            const rowData = this.rows[i];
            const pageRow = (<ide-row></ide-row>) as PageRow;
            pageRow.id = `row-${i}`;
            this.initDragEvent(pageRow);
            if (!this._readonly)
                pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
            this.pnlRows.append(pageRow);
            await pageRow.setData(rowData);
        }
    }

    private initDragEvent(row: PageRow) {
        if (this.draggable) {
            row.ondragstart = this.dragStartHandler;
            row.ondragend = this.dragEndHandler;

            row.ondragover = this.dragOverHandler;
            row.ondrop = this.dropHandler;
            row.ondragenter = this.dragEnterHandler;
            row.ondragleave = this.dragLeaveHandler;
            row.setAttribute('draggable', 'true');
        } else {
            row.ondragstart = null;
            row.ondragend = null;

            row.ondragover = null;
            row.ondrop = null;
            row.ondragenter = null;
            row.ondragleave = null;
            row.setAttribute('draggable', 'false');
        }
    }

    async appendRow(rowData: IRowData) {
        if (!this.rows) this.rows = [];
        const pageRow = (<ide-row></ide-row>) as PageRow;
        if (!this._readonly)
            pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
        this.pnlRows.append(pageRow);
        this.rows.push(rowData);
        pageRow.id = `row-${this.rows.length - 1}`;
        this.initDragEvent(pageRow);
        await pageRow.setData(rowData);
        return pageRow;
    }

    clearRows() {
        this.pnlRows.clearInnerHTML();
    }

    set footerVisible(value: boolean) {
        this.pageFooter.visible = value;
    }

    set footerSticky(value: boolean) {
        this.pageFooter.sticky = value;
    }

    set footerCopyright(value: string) {
        this.pageFooter.footer = value;
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
                <i-grid-layout id={'pnlRows'} class={'container'} verticalAlignment="center" columnsPerRow={1}></i-grid-layout>
                <scpage-page-paging id={'pagePaging'} visible={false}></scpage-page-paging>
                <scpage-page-footer
                    id={'pageFooter'}
                    class={'boxed-style'}
                    visible={false}
                ></scpage-page-footer>
            </i-panel>
        );
    }
}

export { SelectModuleDialog, PageSection, PageFooter };
