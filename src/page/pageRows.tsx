import {
    Module,
    customElements,
    ControlElement,
    Panel,
    application,
    Control,
    VStack,
} from '@ijstech/components';
import { IPageSection } from '../interface/index';
import { PageSection } from './pageSection';
import { PageRow } from './pageRow';
import { PageFooter } from './pageFooter';
import { EVENT } from '../const/index';
import { generateUUID } from '../utility/index';
import { UpdateRowCommand, commandHistory, MoveElementCommand } from '../command/index';
import { IDEToolbar } from '../common/index';
import { pageObject } from '../store/index';
import { currentTheme } from '../theme/index';
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

const Theme = currentTheme;

@customElements('ide-rows')
export class PageRows extends Module {
    private pnlRows: VStack;
    // private pagePaging: PagePaging;
    private pageFooter: PageFooter;
    private currentRow: PageRow;
    private enteredRow: PageRow;
    private pnlRowOverlay: Panel;

    private currentPosition: any;
    private _readonly: boolean;
    private _draggable: boolean;
    private isDragging: boolean = false;

    constructor(parent?: any) {
        super(parent);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.initEventBus();
        this.getRows = this.getRows.bind(this);
        this.setRows = this.setRows.bind(this);
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_CLONE, this.onClone);
        application.EventBus.register(this, EVENT.ON_ADD_SECTION, this.onCreateSection);
    }

    _handleClick(event: MouseEvent): boolean {
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
            row.classList.remove('dropzone');
            dragStack.removeEventListener('mousedown', this.mouseDownHandler, false);
        }
        dragStack.ondragstart = function () {
            return false;
        };
    }

    private mouseDownHandler(event: MouseEvent) {
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const currentDragEl =
            target instanceof PageRow ? target : (target.closest('ide-row') as PageRow);
        if (currentDragEl && !this.isDragging) {
            this.isDragging = true;
            this.currentRow = currentDragEl;
            const data = this.currentRow.getBoundingClientRect();
            const { top, left } = this.pnlRows.getBoundingClientRect();
            this.currentPosition = data;
            this.pnlRowOverlay.width = this.currentPosition.width;
            this.pnlRowOverlay.height = this.currentPosition.height;
            this.pnlRowOverlay.zIndex = '1';
            this.pnlRowOverlay.left = this.currentPosition.left - left;
            this.pnlRowOverlay.top = this.currentPosition.top - top;
            this.currentRow.classList.add('row-dragged');
            document.addEventListener('mousemove', this.mouseMoveHandler);
            document.addEventListener('mouseup', this.mouseUpHandler);
            this.click();
        }
    }

    private mouseUpHandler(event: MouseEvent) {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.currentRow.classList.remove('row-dragged');
        this.resetCurrentRow();
        this.isDragging = false;
        const rows = this.pnlRows.querySelectorAll('ide-row');
        for (let row of rows) {
            row.classList.remove('row-entered');
        }
        const canDrop = this.currentRow && this.enteredRow && this.enteredRow.classList.contains('dropzone');
        if (canDrop && !this.currentRow.isSameNode(this.enteredRow)) {
            const moveRowCmd = new MoveElementCommand(
                this.currentRow,
                this.enteredRow,
                this.pnlRows,
                pageObject.sections
            );
            commandHistory.execute(moveRowCmd);
        }
        this.pnlRowOverlay.visible = false;
        this.pnlRowOverlay.zIndex = '-1';
        this.currentRow = null;
        this.enteredRow = null;
        this.currentPosition = null;
    }

    private mouseMoveHandler(event: MouseEvent) {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        const dropzones = (this.querySelectorAll('.dropzone') || []) as PageRow[];
        const centerPoints = this.getDropzoneCenterPoints(dropzones);
        let nearestElement = null;
        let shortestDistance = Infinity;
        
        for (let data of centerPoints) {
            const { centerX, centerY, dropzone } = data;
            const dx = centerX - mouseX;
            const dy = centerY - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestElement = dropzone;
            }
            dropzone.classList.remove('row-entered');
        }
        if (nearestElement && !nearestElement.isSameNode(this.currentRow)) {
            nearestElement.classList.add('row-entered');
            this.enteredRow = nearestElement as PageRow;
            this.pnlRowOverlay.visible = true;
            this.pnlRowOverlay.zIndex = '1';
            this.updateCurrentRow(mouseX - this.currentPosition.x, mouseY - this.currentPosition.y);
        } else {
            this.enteredRow = null;
        }
    }

    private getDropzoneCenterPoints(dropzones: PageRow[]) {
        const centerPoints = [];
        for (let dropzone of dropzones) {
            const rect = dropzone.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            centerPoints.push({ centerX, centerY, dropzone });
        }
        return centerPoints;
    }

    private resetCurrentRow() {
        if (!this.currentRow) return;
        this.currentRow.style.transform = 'none';
        this.pnlRowOverlay.visible = false;
        this.pnlRowOverlay.zIndex = '-1';
        this.currentRow.onMoveDown();
    }

    private updateCurrentRow(x: number, y: number) {
        this.currentRow.style.transform = `translate(${x}px, ${y}px)`;
        this.currentRow.style.width = this.currentPosition.width;
        this.currentRow.style.height = this.currentPosition.height;
        this.currentRow.onMoveUp();
    }

    getRows(): IPageSection[] {
        return pageObject.sections;
    }

    async setRows(rows: IPageSection[]) {
        pageObject.sections = rows;
        await this.renderRows();
    }

    async renderRows() {
        this.clearRows();
        for (let i = 0; i < pageObject.sections.length; i++) {
            const rowData = pageObject.sections[i];
            const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
            if (!this._readonly) {
                pageRow.border = { top: { width: '1px', style: 'dashed', color: 'var(--builder-divider)' } };
                this.initDragEvent(pageRow);
            }
            pageRow.visible = !!rowData?.elements?.length;
            pageRow.parent = this.pnlRows;
            this.pnlRows.append(pageRow);
            await pageRow.setData(rowData);
        }
    }

    async appendRow(rowData: IPageSection, prependId?: string) {
        const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
        if (!this._readonly) {
            pageRow.border = { top: { width: '1px', style: 'dashed', color: 'var(--builder-divider)' } };
            this.initDragEvent(pageRow);
        }
        pageRow.visible = !!rowData?.elements?.length;
        const addRowCmd = new UpdateRowCommand(pageRow, this.pnlRows, rowData, false, prependId);
        commandHistory.execute(addRowCmd);
        await pageRow.setData(rowData);
        return pageRow;
    }

    async onClone(data: { rowData: IPageSection; id: string }) {
        const { rowData, id } = data;
        const row = this.pnlRows.querySelector(`#${id}`);
        if (!row) return;
        const clonedData = JSON.parse(JSON.stringify(rowData));
        const newId = generateUUID();
        const newElements = clonedData.elements.map((el) => {
            el.id = generateUUID();
            return el;
        });

        await this.appendRow(
            { ...clonedData, elements: newElements, id: newId, row: this.getRows().length },
            id
        );
    }

    private async onCreateSection(params?: {prependId?: string, appendId?: string}) {
        const { prependId = '', appendId = '' } = params || {};
        const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
        if (!this._readonly) {
            pageRow.border = { top: { width: '1px', style: 'dashed', color: 'var(--builder-divider)' } };
            this.initDragEvent(pageRow);
        }
        const rowData = {
            id: generateUUID(),
            row: this.getRows().length,
            elements: [],
        };
        const addRowCmd = new UpdateRowCommand(
            pageRow,
            this.pnlRows,
            rowData,
            false,
            prependId || '',
            appendId || ''
        );
        commandHistory.execute(addRowCmd);
        await pageRow.setData(rowData);
        return pageRow;
    }

    clearRows() {
        this.pnlRows?.clearInnerHTML();
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

    render() {
        return (
            <i-panel height="100%">
                <i-vstack
                    id={'pnlRows'}
                    class={'container'}
                    verticalAlignment="center"
                    maxWidth="100%"
                    height="100%"
                ></i-vstack>
                <i-panel
                    id="pnlRowOverlay"
                    position={'fixed'}
                    zIndex={-1}
                    visible={false}
                    opacity={0.4}
                    background={{ color: '#ddd' }}
                    class={'drag-overlay'}
                ></i-panel>
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
