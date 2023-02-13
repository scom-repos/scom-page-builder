import {
    Module,
    customElements,
    ControlElement,
    Styles,
    Panel,
    application,
    Control,
    VStack
} from '@ijstech/components';
import { IPageData, IPageSection } from '../interface/index';
import { PageSection } from './pageSection';
import { PageRow } from './pageRow';
import { PageFooter } from './pageFooter';
import { PagePaging } from './pagePaging';
import './pageRows.css';
import { EVENT } from '../const/index';
import { ElementCommand, commandHistory, MoveElementCommand } from '../utility/index';
import { IDEToolbar } from '../common/index';
import { pageObject } from '../store/index';

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
    private pnlRows: VStack;
    private pagePaging: PagePaging;
    private pageFooter: PageFooter;
    private currentRow: PageRow;
    private pnlRowOverlay: Panel;

    private currentPosition: any;
    private _readonly: boolean;
    private _draggable: boolean;
    private isDragging: boolean = false;

    constructor(parent?: any) {
        super(parent);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.onMoveHandler = this.onMoveHandler.bind(this);
        this.initEventBus();
        this.getRows = this.getRows.bind(this);
        this.setRows = this.setRows.bind(this);
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_CLONE, this.onClone);
    }

    _handleClick(event: Event): boolean {
        if (this._readonly) return super._handleClick(event, true);
        const toolbars = document.querySelectorAll('ide-toolbar');
        for (const toolbar of toolbars) {
            (toolbar as IDEToolbar).hideToolbars();
        }
        return super._handleClick(event, true);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        this.draggable = this.getAttribute('draggable', true, false);
        super.init();
    }

    get draggable(): boolean {
        return this._draggable;
    }
    set draggable(value: boolean) {
        if (this._draggable === value) return;
        this._draggable = value;
        this.handleDrag();
    }

    private handleDrag() {
        if (!this.pnlRows) return;
        const rows = Array.from(this.pnlRows.querySelectorAll('ide-row'));
        if (!rows?.length) return;
        rows.forEach((row: PageRow, rowid: number) => {
            this.initDragEvent(row);
        });
    }

    private initDragEvent(row: PageRow) {
        const dragStack = row.querySelector('#dragStack') as Control;
        if (!dragStack) return;
        if (this.draggable) {
            row.classList.add('dropzone');
            dragStack.addEventListener('mousedown', this.mouseDownHandler, false);
        } else {
            dragStack.removeEventListener('mousedown', this.mouseDownHandler, false);
        }
        dragStack.ondragstart = function() {
            return false;
        };
    }

    private mouseDownHandler(event: MouseEvent) {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const currentDragEl = target instanceof PageRow ? target : target.closest('ide-row') as PageRow;
        if (currentDragEl && !this.isDragging) {
            this.isDragging = true;
            this.currentRow = currentDragEl;
            const data = this.currentRow.getBoundingClientRect();
            this.currentPosition = data;
            this.pnlRowOverlay.width = this.currentPosition.width;
            this.pnlRowOverlay.height = this.currentPosition.height;
            this.pnlRowOverlay.zIndex = '1';
            this.pnlRowOverlay.left = this.currentPosition.left;
            this.pnlRowOverlay.top = this.currentPosition.top;
            document.addEventListener('mousemove', this.onMoveHandler);
            document.addEventListener('mouseup', this.mouseUpHandler);
            this.click();
        }
    }

    private mouseUpHandler(event: MouseEvent) {
        document.removeEventListener('mousemove', this.onMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.resetCurrentRow();
        const target = event.target as HTMLElement;
        const dropElm = target instanceof PageRow ? target : target.closest('ide-row') as PageRow;
        if (!dropElm || !dropElm.classList.contains('dropzone')) {
            event.preventDefault();
            this.pnlRowOverlay.visible = false;
            this.pnlRowOverlay.zIndex = '-1';
            return;
        }
        dropElm.classList.remove("dragenter");
        if (!this.currentRow) {
            event.preventDefault();
            this.pnlRowOverlay.visible = false;
            this.pnlRowOverlay.zIndex = '-1';
            return;
        }
        if (dropElm && !this.currentRow.isSameNode(dropElm)) {
            // let dragIndex = 0;
            // let dropIndex = 0;
            // const rows = this.pnlRows.querySelectorAll('ide-row');
            // for (let i = 0; i < rows.length; i++) {
            //     if (this.currentRow.isEqualNode(rows[i])) { dragIndex = i; }
            //     if (dropElm.isEqualNode(rows[i])) { dropIndex = i; }
            // }
            // const [dragRowData] = this.rows.splice(dragIndex, 1);
            // this.rows.splice(dropIndex, 0, dragRowData);
            
            // if (dragIndex < dropIndex) {
            //     this.pnlRows.insertBefore(this.currentRow, dropElm.nextSibling);
            // } else {
            //     this.pnlRows.insertBefore(this.currentRow, dropElm);
            // }
            const moveRowCmd = new MoveElementCommand(this.currentRow, dropElm, this.pnlRows, pageObject.sections);
            commandHistory.execute(moveRowCmd);
        }
        this.currentRow = null;
        this.currentPosition = null;
        this.isDragging = false;
    }

    private resetCurrentRow() {
        if (!this.currentRow) return;
        this.currentRow.style.transform = 'none';
        this.currentRow.classList.remove('dragging');
        this.pnlRowOverlay.visible = false;
        this.pnlRowOverlay.zIndex = '-1';
        this.currentRow.onMoveDown();
    }

    private updateCurrentRow(x: number, y: number) {
        this.currentRow.classList.add('dragging');
        this.currentRow.style.transform = `translate(${x}px, ${y}px)`;
        this.currentRow.style.width = this.currentPosition.width;
        this.currentRow.style.height = this.currentPosition.height;
        this.currentRow.onMoveUp();
    }

    private onMoveHandler(event: MouseEvent) {
        let x = event.clientX;
        let y = event.clientY;
        const target = event.target as HTMLElement;
        const dropZone = target instanceof PageRow ? target : target.closest('ide-row') as PageRow;
        const rows = this.pnlRows.querySelectorAll('ide-row');
        rows.forEach(row => {
            row.classList.remove("dragenter");
        })
        if (dropZone && !dropZone.isEqualNode(this.currentRow) && dropZone.classList.contains('dropzone'))
            dropZone.classList.add('dragenter')
        this.pnlRowOverlay.visible = true;
        this.pnlRowOverlay.zIndex = '1';
        this.updateCurrentRow(x - this.currentPosition.x, y - this.currentPosition.y);
    }

    async getRows(): Promise<IPageSection[]> {
        // const rows = this.pnlRows.querySelectorAll('ide-row');
        // const rowDataList: IPageSection[] = [];
        // for (const row of rows) {
        //     const rowData = await (row as PageRow).getData();
        //     rowDataList.push(rowData);
        // }
        // return rowDataList;
        return pageObject.sections;
    }

    async setRows(rows: IPageSection[]) {
        pageObject.sections = rows;
        await this.renderRows();
    }

    async renderRows() {
        this.clearRows();
        if (
            (!pageObject.sections || (pageObject.sections && pageObject.sections.length == 0)) &&
            window.location.hash.indexOf('/edit') >= 0
        ) {
            pageObject.sections = [];
        }
        for (let i = 0; i < pageObject.sections.length; i++) {
            const rowData = pageObject.sections[i];
            const pageRow = (<ide-row maxWidth="100%"></ide-row>) as PageRow;
            this.initDragEvent(pageRow);
            if (!this._readonly)
                pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
            this.pnlRows.append(pageRow);
            await pageRow.setData(rowData);
        }
    }

    async appendRow(rowData: IPageSection) {
        rowData.row = pageObject.sections.length;
        const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
        if (!this._readonly) {
            pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
            this.initDragEvent(pageRow);
        }
        const addRowCmd = new ElementCommand(pageRow, this.pnlRows, rowData);
        commandHistory.execute(addRowCmd);
        await pageRow.setData(rowData);
        return pageRow;
    }

    async onClone(data: { rowData: IPageSection, id: string }) {
        const { rowData, id } = data;
        const row = this.pnlRows.querySelector(`#${id}`)
        if (!row) return;
        let newRow = await this.appendRow(rowData)
        this.pnlRows.insertBefore(row, newRow);
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

    render() {
        return (
            <i-panel height="100%">
                <i-vstack
                    id={'pnlRows'}
                    class={'container'}
                    verticalAlignment="center"
                    maxWidth="100%" height="100%"
                ></i-vstack>
                <i-panel
                    id="pnlRowOverlay"
                    position={'fixed'}
                    zIndex={-1}
                    visible={false}
                    opacity={0.4}
                    background={{color: '#ddd'}}
                    class={'drag-overlay'}
                ></i-panel>
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

export { PageSection, PageFooter };
