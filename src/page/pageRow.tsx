import {
    Module,
    customElements,
    application,
    ControlElement,
    Control,
    VStack,
    observable,
    GridLayout,
    Styles
} from '@ijstech/components';
import { PageSection } from './pageSection';
import { RowSettingsDialog } from '../dialogs/index';
import './pageRow.css';
import { EVENT } from '../const/index';
import { IPageElement, IPageSection, GAP_WIDTH, MIN_COLUMN, IPageSectionConfig } from '../interface/index';
import { getDragData, getMargin, getPageConfig, pageObject, setDragData } from '../store/index';
import {
    commandHistory,
    UpdateRowCommand,
    ResizeElementCommand,
    DragElementCommand,
    UpdateRowSettingsCommand,
    GroupElementCommand,
    AddElementCommand,
    UngroupElementCommand,
    RemoveToolbarCommand
} from '../command/index';
import { IDEToolbar } from '../common/toolbar';
import { generateUUID } from '../utility/index';
const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-row']: PageRowElement;
        }
    }
}

export interface PageRowElement extends ControlElement {
    readonly?: boolean;
}
const ROW_BOTTOM_CLASS = 'row-bottom-block';
const ROW_TOP_CLASS = 'row-top-block';

@customElements('ide-row')
export class PageRow extends Module {
    private actionsBar: VStack;
    private dragStack: VStack;
    private pnlRow: GridLayout;
    private mdRowSetting: RowSettingsDialog;
    private pnlEmty: VStack;

    private _readonly: boolean;
    private isResizing: boolean = false;
    private currentWidth: number;
    private currentHeight: number;
    private currentElement: PageSection;
    private currentToolbar: IDEToolbar;
    private rowId: string = '';
    private rowData: IPageSection;
    private isDragging: boolean = false;
    private gridColumnWidth: number = 0;
    private _selectedSection: PageSection;

    @observable()
    private isCloned: boolean = true;
    @observable()
    private isChanged: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
    }

    get data(): any {
        return this.rowId ? pageObject.getRow(this.rowId) : this.rowData;
    }

    get selectedElement(): PageSection {
        return this._selectedSection;
    }

    private get maxColumn() {
        const rowId = this.id?.replace('row-', '');
        return pageObject.getColumnsNumber(rowId);
    }
    
    private get align() {
        const rowId = this.id?.replace('row-', '');
        const config = pageObject.getRowConfig(rowId);
        return config?.align || 'left';
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        const hasData = this.data?.elements?.length;
        this.toggleUI(hasData);
        this.renderFixedGrid();
        this.initEventListeners();
        this.initEventBus();
        this.appendChild(
            <i-panel
                position="absolute"
                width="100%"
                height="16px"
                bottom="-8px"
                zIndex={90}
                border={{radius: '5px'}}
                class={ROW_BOTTOM_CLASS}
            ></i-panel>
        )
        this.appendChild(
            <i-panel
                position="absolute"
                width="100%"
                height="16px"
                top="-8px"
                zIndex={90}
                border={{radius: '5px'}}
                class={ROW_TOP_CLASS}
            ></i-panel>
        )
    }

    toggleUI(value: boolean) {
        if (this.pnlRow) this.pnlRow.opacity = value ? 1 : 0;
        if (this.pnlEmty) this.pnlEmty.visible = !value;
        this.updateAlign();
    }

    private async createNewElement(i: number) {
        const sectionData = this.data.elements[i];
        return this.createElementFn(sectionData);
    }

    private async createElementFn(data: IPageElement) {
        const pageSection = (
            <ide-section
                id={data.id}
                readonly={this._readonly}
                display="block"
                maxWidth="100%"
                maxHeight="100%"
                position="relative"
                minWidth={0}
            ></ide-section>
        ) as PageSection;
        if (!this._readonly) {
            pageSection.setAttribute('draggable', 'true');
            pageSection.style.gridRow = '1';
            pageSection.style.gridColumn = `${data.column || 1} / span ${
                data.columnSpan || 1
            }`;
            pageSection.setAttribute('data-column', `${data.column || 1}`);
            pageSection.setAttribute('data-column-span', `${data.columnSpan || 1}`);
        }
        pageSection.visible = !!data;
        this.pnlRow.appendChild(pageSection);
        await pageSection.setData(this.rowId, data);
        return pageSection;
    }

    async addElement(data: IPageElement) {
        if (!data) return;
        const element = await this.createElementFn(data);
        this.toggleUI(true);
        return element;
    }

    private async clearData() {
        const children = this.pnlRow?.querySelectorAll('ide-section');
        if (children?.length) {
            children.forEach((item: PageSection) => {
                item.onHide();
                item.remove();
            });
        }
    }

    async setData(rowData: IPageSection) {
        this.clearData();
        const { id, row, elements, config } = rowData;

        this.id = `row-${id}`;
        this.rowId = id;
        this.rowData = rowData;
        this.setAttribute('data-row', `${row}`);
        this.updateRowConfig(config || getPageConfig());
        this.isCloned = this.parentElement?.nodeName !== 'BUILDER-HEADER';
        this.isChanged = this.parentElement?.nodeName !== 'BUILDER-HEADER';

        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                await this.createNewElement(i);
            }
        }
        this.actionsBar.minHeight = '100%';
        this.updateColumn();
        const hasData = this.data?.elements?.length;
        this.toggleUI(hasData);
    }

    updateRowConfig(config: IPageSectionConfig) {
        const { image = '', backgroundColor, maxWidth, margin, align } = config || {};
        if (image) this.background.image = image;
        if (backgroundColor) this.background.color = backgroundColor;
        this.maxWidth = maxWidth ?? '100%';
        if (margin) this.margin = getMargin(margin);
        this.width = margin?.x && margin?.x !== 'auto' ? 'auto' : '100%';
        if (align) this.updateAlign();
    }

    private onOpenRowSettingsDialog() {
        this.mdRowSetting.show(this.rowId);
    }

    private onSaveRowSettings(data: IPageSectionConfig) {
        const updateCmd = new UpdateRowSettingsCommand(this, data);
        commandHistory.execute(updateCmd);
    }

    updateColumn() {
        this.updateGrid();
        this.updateFixedGrid();
    }

    private updateGrid() {
        this.updateGridColumnWidth();
        const fixedGrid = this.pnlRow.querySelector('.fixed-grid');
        fixedGrid && this.updateGridColumn(fixedGrid as GridLayout);
        this.updateGridColumn(this.pnlRow);
    }

    private updateAlign() {
        this.updateGridColumnWidth();
        let alignValue = 'start';
         switch(this.align) {
            case 'right':
                alignValue = 'end';
                break;
            case 'center':
                alignValue = 'center';
                break;
        }
        this.pnlRow.grid = { horizontalAlignment: alignValue as any };
        this.pnlRow.style.maxWidth = '100%';
        if (alignValue === 'start') {
            this.pnlRow.templateColumns = [`repeat(${this.maxColumn}, minmax(${GAP_WIDTH}px, 1fr))`];
        } else {
            this.pnlRow.templateColumns = ['min-content'];
            const sections = Array.from(this.pnlRow.querySelectorAll('ide-section'));
            const unitWidth = Number((1 / this.maxColumn).toFixed(3)) * 100;
            for (let section of sections) {
                const columnSpan = Number((section as HTMLElement).dataset.columnSpan);
                const widthNumber = columnSpan * this.gridColumnWidth + ((columnSpan - 1) * GAP_WIDTH);
                (section as Control).width = widthNumber ? `${widthNumber}px` : `${columnSpan * unitWidth}%`;
            }
        }
    }

    private updateGridColumnWidth() {
        this.gridColumnWidth = (this.pnlRow.offsetWidth - GAP_WIDTH * (this.maxColumn - 1)) / this.maxColumn;
    }

    private async onClone() {
        const rowData = pageObject.getRow(this.rowId);
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, { rowData, id: this.id });
    }

    onDeleteRow() {
        const prependRow = this.previousElementSibling;
        const appendRow = this.nextElementSibling;
        const rowCmd = new UpdateRowCommand(this, this.parent, this.data, true, prependRow?.id || '', appendRow?.id || '');
        commandHistory.execute(rowCmd);
    }

    onMoveUp() {
        this.actionsBar.classList.add('hidden');
        this.dragStack.classList.add('hidden');
    }
    onMoveDown() {
        this.actionsBar.classList.remove('hidden');
        this.dragStack.classList.remove('hidden');
    }

    private renderFixedGrid() {
        this.pnlRow.clearInnerHTML();
        this.pnlRow.appendChild(<i-panel class="rectangle"></i-panel>);
        const grid = (
            <i-grid-layout
                position="absolute"
                width="100%"
                height="100%"
                minHeight="3rem"
                top="0px"
                left="0px"
                class="fixed-grid"
            ></i-grid-layout>
        );
        for (let i = 0; i < this.maxColumn; i++) {
            const elm = <i-panel class="fixed-grid-item"></i-panel>;
            elm.setAttribute('data-column', `${i + 1}`);
            elm.style.gridColumn = `${i + 1}`;
            grid.append(elm);
        }
        this.pnlRow.appendChild(grid);
    }

    private updateFixedGrid() {
        const grid = this.pnlRow.querySelector('.fixed-grid') as Control;
        if (!grid) return;
        grid.clearInnerHTML();
        for (let i = 0; i < this.maxColumn; i++) {
            const elm = <i-panel class="fixed-grid-item"></i-panel>;
            elm.setAttribute('data-column', `${i + 1}`);
            elm.style.gridColumn = `${i + 1}`;
            grid.append(elm);
        }
    }

    private updateGridColumn(grid: GridLayout) {
        grid.templateColumns = [`repeat(${this.maxColumn}, minmax(${GAP_WIDTH}px, 1fr))`];
        grid.gap = { column: `${GAP_WIDTH}px` };
    }

    private initEventListeners() {
        this.onClick = (target, event) => this.setActive();
        let self = this;
        let newWidth: number = 0;
        let newHeight: number = 0;
        let currentDot: Control;
        let startX: number = 0;
        let startY: number = 0;
        let toolbar: Control;
        let dragStartTarget: Control;
        let dragOverTarget: Control;
        type OverlapType = "none" | "self" | "mutual"; // | "border";
        const parentWrapper = self.closest('#editor') || document;

        this.addEventListener('mousedown', (e) => {
            const target = e.target as Control;
            const section = target.closest('ide-section') as PageSection;

            if (section)
                this._selectedSection = section;
            else 
                this._selectedSection = undefined;

            const parent = target.closest('.resize-stack') as Control;
            if (!parent) return;
            e.preventDefault();
            const resizableElm = section;
            self.currentElement = resizableElm;
            toolbar = target.closest('ide-toolbar') as Control;
            self.addDottedLines();
            self.isResizing = true;
            currentDot = parent;
            startX = e.clientX;
            startY = e.clientY;
            self.currentWidth = toolbar.offsetWidth;
            self.currentHeight = toolbar.offsetHeight;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function mouseMoveHandler(e: MouseEvent) {
            if (!self.isResizing || !toolbar) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            if (currentDot.classList.contains('topLeft')) {
                newWidth = self.currentWidth - deltaX;
                newHeight = self.currentHeight - deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('topRight')) {
                newWidth = self.currentWidth + deltaX;
                newHeight = self.currentHeight - deltaY;
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('bottomLeft')) {
                newWidth = self.currentWidth - deltaX;
                newHeight = self.currentHeight + deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('bottomRight')) {
                newWidth = self.currentWidth + deltaX;
                newHeight = self.currentHeight + deltaY;
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('top')) {
                newHeight = self.currentHeight - deltaY;
                updateDimension(undefined, newHeight)
            } else if (currentDot.classList.contains('bottom')) {
                newHeight = self.currentHeight + deltaY;
                updateDimension(undefined, newHeight)
            } else if (currentDot.classList.contains('left')) {
                newWidth = self.currentWidth - deltaX;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, undefined)
            } else if (currentDot.classList.contains('right')) {
                newWidth = self.currentWidth + deltaX;
                updateDimension(newWidth, undefined)
            }
        }

        function mouseUpHandler(e: MouseEvent) {
            e.preventDefault();
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            self.removeDottedLines();
            self.isResizing = false;
            if (!toolbar) return;
            toolbar.width = 'initial';
            toolbar.height = 'initial';
            const contentStack = toolbar.querySelector('#contentStack') as Control
            if (contentStack) {
                contentStack.height = 'initial';
                contentStack.width = 'initial';
            }
            self.currentElement.width = 'initial';
            self.currentElement.height = 'initial';
            const resizeCmd = new ResizeElementCommand(
                self.currentElement,
                toolbar,
                self.currentWidth,
                self.currentHeight,
                newWidth,
                newHeight
            );
            commandHistory.execute(resizeCmd);
            self.currentElement.style.left = 'initial';
            self.currentElement = null;
            toolbar = null;
        }

        function updateDimension(newWidth?: number, newHeight?: number) {
            if (newWidth !== undefined) toolbar.width = newWidth;
            if (newHeight !== undefined) toolbar.height = newHeight;
            const contentStack = toolbar.querySelector('#contentStack') as Control
            if (contentStack) {
                if (newWidth !== undefined) contentStack.width = newWidth;
                if (newHeight !== undefined) contentStack.height = newHeight;
            }
        }

        function updateClass(elm: Control, className: string) {
            if (elm.visible) {
                if (className === 'is-dragenter') {
                    const blocks = parentWrapper.getElementsByClassName('is-dragenter');
                    for (let block of blocks) {
                        block.classList.remove('is-dragenter');
                    }
                }
                elm.classList.add(className);
            } else {
                elm.classList.remove(className);
            }
        }

        this.addEventListener('dragstart', function (event) {
            const eventTarget = event.target as Control;
            if (eventTarget instanceof PageRow) return;
            const targetSection = eventTarget.closest && eventTarget.closest('ide-section') as PageSection;
            const toolbars = targetSection ? Array.from(targetSection.querySelectorAll('ide-toolbar')) : [];
            const targetToolbar = toolbars.find(elm => elm.classList.contains('active')) as IDEToolbar;
            const cannotDrag = toolbars.find(toolbar => toolbar.classList.contains('is-editing') || toolbar.classList.contains('is-setting'));
            if (targetSection && !cannotDrag) {
                self.pnlRow.templateColumns = [`repeat(${self.maxColumn}, 1fr)`];
                self.currentElement = targetSection;
                self.currentToolbar = targetToolbar;
                application.EventBus.dispatch(EVENT.ON_SET_DRAG_TOOLBAR, targetToolbar);
                self.currentElement.opacity = 0;
                application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, targetSection);
                self.addDottedLines();
            } else {
                event.preventDefault();
            }
            dragStartTarget = eventTarget;
        });

        this.addEventListener('drag', function (event) {});

        document.addEventListener('dragend', function (event) {
            if (self.currentElement && !self.currentElement.classList.contains('builder-item'))
                self.currentElement.opacity = 1;
            resetDragTarget();
        });

        function dragEnter(enterTarget: Control, clientX: number, clientY: number, isOverlap: boolean = false) {
            const elementConfig = getDragData();
            const pageRow = enterTarget.closest('ide-row') as PageRow;
            if (pageRow && elementConfig?.module?.name === 'sectionStack') {
                pageRow.classList.add('row-entered');
            }
            if (!enterTarget || !self.currentElement) return;
            const rowBottom = enterTarget.closest(`.${ROW_BOTTOM_CLASS}`) as Control;
            const rowTop = enterTarget.closest(`.${ROW_TOP_CLASS}`) as Control;
            if (rowBottom) {
                updateClass(rowBottom, 'is-dragenter');
                return;
            } else if (rowTop) {
                updateClass(rowTop, 'is-dragenter');
                return;
            } else {
                const dragEnter = parentWrapper.querySelector('.is-dragenter') as Control;
                dragEnter && dragEnter.classList.remove('is-dragenter');
            }
            let target: Control;
            if (isOverlap)
                target = findNearestFixedGridInRow(clientX);
            else
                target = enterTarget.closest('.fixed-grid-item') as Control;
            self.addDottedLines();
            if (target) {
                const column = Number(target.dataset.column);
                const columnSpan = self.currentElement.dataset.columnSpan ? Number(self.currentElement.dataset.columnSpan) : MIN_COLUMN ;
                const colSpan = Math.min(columnSpan, self.maxColumn);
                const colStart = Math.min(column, self.maxColumn - colSpan + 1);
                const grid = target.closest('.grid');
                const sections = Array.from(grid?.querySelectorAll('ide-section'));
                const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column));
                const findedSection = sortedSections.find((section: Control) => {
                    const sectionColumn = Number(section.dataset.column);
                    const sectionColumnSpan = Number(section.dataset.columnSpan);
                    const colData = colStart + colSpan;
                    return colStart >= sectionColumn && colData <= sectionColumn + sectionColumnSpan;
                });
                if (findedSection && findedSection!=self.currentElement) return;
                self.updateGridColumnWidth();
                const rectangle = target
                    .closest('.fixed-grid')
                    .parentNode.querySelector(`.rectangle`) as Control;
                rectangle.style.display = 'block';
                rectangle.style.left = (self.gridColumnWidth + GAP_WIDTH) * (colStart - 1) + 'px';
                rectangle.style.width =
                   self.gridColumnWidth * columnSpan + GAP_WIDTH * (columnSpan - 1) + 'px';
            } else {
                const section = enterTarget.closest('ide-section') as Control;
                if (section && !section.isSameNode(self.currentElement)) {
                    const toolbar = enterTarget.closest('ide-toolbar') as Control;
                    if (toolbar) {
                        const { y, height} = toolbar.getBoundingClientRect();
                        const bottomBlock = toolbar.querySelector('.bottom-block') as Control;
                        const topBlock = toolbar.querySelector('.top-block') as Control;
                        if (bottomBlock) {
                            bottomBlock.visible = Math.ceil(clientY) >= Math.ceil(y + height) - 2;
                            updateClass(bottomBlock, 'is-dragenter');
                        }
                        
                        if (topBlock) {
                            topBlock.visible = Math.ceil(clientY) <= Math.ceil(y) + 2;
                            updateClass(topBlock, 'is-dragenter');
                        }
                    }

                    const curElmCol = Number(section?.dataset?.column);
                    const curElmColSpan = Number(section?.dataset?.columnSpan);
                    const sections = Array.from(section.closest('#pnlRow')?.querySelectorAll('ide-section'));
                    const nextElm = sections.find((el: Control) => {
                        const column = Number(el.dataset.column);
                        return !isNaN(column) && (curElmCol + curElmColSpan === column);
                    }) as Control;
                    const showHiddenBlock = curElmCol === 1 && (curElmCol + curElmColSpan === self.maxColumn + 1) ||
                        (nextElm) ||
                        (curElmCol + curElmColSpan === self.maxColumn + 1);
                    if (showHiddenBlock) {
                        const { left, right } = section.getBoundingClientRect();
                        const backBlock = section.querySelector('.back-block') as Control;
                        const frontBlock = section.querySelector('.front-block') as Control;

                        if (backBlock) {
                            backBlock.visible = Math.abs(clientX - right) <= 15;
                            updateClass(backBlock, 'is-dragenter');
                        }

                        if (frontBlock) {
                            frontBlock.visible = Math.abs(clientX - left) <= 15  && curElmCol === 1;
                            updateClass(frontBlock, 'is-dragenter');
                        }
                    }
                }
            }
        }

        function dragLeave(leaveTarget: Control, clientX: number, isOverlap: boolean = false) {
            let target: Control;
            if (isOverlap)
                target = findNearestFixedGridInRow(clientX);
            else
                target = leaveTarget.closest('.fixed-grid-item') as Control;
            if (target)
                updateRectangles();
            else {
                const blocks = parentWrapper.getElementsByClassName('is-dragenter');
                const currentSection = leaveTarget.closest('ide-section') as Control;
                const currentRow = leaveTarget.closest('ide-row') as Control;
                const isCurrentEnter = (block: Control) => {
                    let result = false;
                    if (block.classList.contains(ROW_BOTTOM_CLASS)) {
                        const blockRow = block.closest('ide-row') as Control;
                        result = currentRow && blockRow && currentRow.id === blockRow.id;
                    } else if (block.classList.contains(ROW_TOP_CLASS)) {
                        const blockRow = block.closest('ide-row') as Control;
                        result = currentRow && blockRow && currentRow.id === blockRow.id;
                    }  else {
                        const blockSection = block.closest('ide-section') as Control;
                        result = currentSection && blockSection && currentSection.id === blockSection.id;
                    }
                    return result;
                }
                for (const block of blocks) {
                    if (isCurrentEnter(block as Control)) continue;
                    const visible = block.classList.contains(ROW_BOTTOM_CLASS) || block.classList.contains(ROW_TOP_CLASS);
                    (block as Control).visible = visible;
                    block.classList.remove('is-dragenter');
                }
            }
            const pageRows = parentWrapper.getElementsByClassName('row-entered');
            for (const row of pageRows) {
                const currentRow = leaveTarget.closest('ide-row') as Control;
                if (currentRow && row && currentRow.id === row.id)
                    continue;
                row.classList.remove('row-entered');
            }
        }

        this.addEventListener('dragenter', function (event) {
            const eventTarget = event.target as Control;
            const overlap = isOverlapWithSection(eventTarget, dragStartTarget, event.clientX)
            if (overlap.overlapType == "self")
                dragEnter(eventTarget, event.clientX, event.clientY, true);
            else 
                dragEnter(eventTarget, event.clientX, event.clientY);
        });

        document.addEventListener('dragover', function (event) {
            event.preventDefault();
            const eventTarget = event.target as Control;
            let enterTarget: Control;
            const overlap = isOverlapWithSection(eventTarget, dragStartTarget, event.clientX)
            // if target overlap with itself
            if (overlap.overlapType == "self") {
                const cursorPosition = { x: event.clientX, y: event.clientY };
                const elements = self.pnlRow.querySelectorAll('.fixed-grid-item');

                let nearestElement = null;
                let minDistance = Number.MAX_VALUE;

                // time complexity = O(columnSpan)
                elements.forEach((element) => {
                    const bounds = element.getBoundingClientRect();
                    const distanceLeft = Math.abs(bounds.left - cursorPosition.x);
                    const distanceRight = Math.abs(bounds.right - cursorPosition.x);
                    if (distanceLeft < minDistance) {
                        minDistance = distanceLeft;
                        nearestElement = element;
                    }
                    if (distanceRight < minDistance) {
                        minDistance = distanceRight;
                        nearestElement = element;
                    }
                });
                enterTarget = nearestElement;
            } else return

            if (enterTarget == dragOverTarget) return

            // leave previous element: dragOverTarget
            dragLeave(dragOverTarget, event.clientX, true);

            // enter current element: enterTarget
            dragEnter(enterTarget, event.clientX, event.clientY, true)

            dragOverTarget = enterTarget;
        });

        document.addEventListener('dragleave', function (event) {
            const eventTarget = event.target as Control;
            dragLeave(eventTarget, event.clientX);
        });

        function findNearestFixedGridInRow(clientX: number) {
            const elements = self.pnlRow.querySelectorAll('.fixed-grid-item');

            let nearestElement = null;
            let minDistance = Number.MAX_VALUE;

            // time complexity = O(columnSpan)
            elements.forEach((element) => {
                const bounds = element.getBoundingClientRect();
                const distanceLeft = Math.abs(bounds.left - clientX);
                const distanceRight = Math.abs(bounds.right - clientX);
                if (distanceLeft < minDistance) {
                    minDistance = distanceLeft;
                    nearestElement = element;
                }
                if (distanceRight < minDistance) {
                    minDistance = distanceRight;
                    nearestElement = element;
                }
            });
            return nearestElement;
        }

        function isOverlapWithSection(dropTarget: HTMLElement, dragTarget: HTMLElement, clientX: number): {overlapType: OverlapType, section: HTMLElement|undefined} {
            if (!dropTarget || !dragTarget) return {
                overlapType: "none", section: undefined
            }
            const dragTargetSection = dragTarget.closest('ide-section') as HTMLElement;
            if (dragStartTarget==null || dragStartTarget==undefined) return {
                overlapType: "mutual", section: undefined
            }
            const toolbars = dragTargetSection.querySelectorAll('ide-toolbar');
            const isUngrouping: boolean = toolbars.length && toolbars.length > 1 && self.currentToolbar!=undefined;
            const nearestCol = findNearestFixedGridInRow(clientX)
            const dropColumn: number = parseInt(nearestCol.getAttribute("data-column"));
            const grid = dropTarget.closest('.grid');
            if (!grid) return {
                overlapType: "none", section: undefined
            }

            const isPageRow = dropTarget.classList.contains('page-row');
            let dropElm = (
                isPageRow
                    ? dropTarget.querySelector('.is-dragenter')
                    : dropTarget.closest('.is-dragenter')
            ) as Control;
            
            // drop on the front-block, back-block or bottom block
            if (dropElm) return {
                overlapType: "none", section: undefined
            }

            const sections: HTMLElement[] = Array.from(grid?.querySelectorAll('ide-section'));
            const sortedSections: HTMLElement[] = sections.sort((a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column));

            const startOfDragingElm: number = dropColumn;
            const endOfDragingElm: number = dropColumn + parseInt(dragTargetSection.dataset.columnSpan) - 1;

            for (let i=0; i<sortedSections.length; i++) {
                const element = sortedSections[i];
                const condition = isUngrouping? true : element!=dragTargetSection;
                if (condition){

                    const startOfDroppingElm: number = parseInt(element.dataset.column);
                    const endOfDroppingElm: number = parseInt(element.dataset.column) + parseInt(element.dataset.columnSpan) - 1;
                    const condition1: boolean = startOfDragingElm >= startOfDroppingElm && startOfDragingElm <= endOfDroppingElm;
                    const condition2: boolean = startOfDroppingElm >= startOfDragingElm && startOfDroppingElm <= endOfDragingElm;

                    // overlap with other section
                    if (condition1 || condition2) return {
                        overlapType: "mutual", section: element
                    }
                }
            }
            // overlap with border
            // if (endOfDragingElm >= self.maxColumn && (self.maxColumn - endOfLastElmInRow < parseInt(dragTargetSection.dataset.columnSpan))) return {
            //     overlapType: "border", section: undefined
            // }
            // overlap with itself
            if (dropTarget==dragTarget || dragTarget.contains(dropTarget)) return {
                overlapType: "self", section: undefined
            }
            // no overlap
            return {
                overlapType: "none", section: undefined
            }
        }

        this.addEventListener('drop', async function (event) {
            const elementConfig = getDragData();
            const eventTarget = event.target as Control;
            const pageRow = eventTarget.closest('ide-row') as PageRow;
            event.preventDefault();
            event.stopPropagation();

            if (pageRow && elementConfig?.module?.name === 'sectionStack') {
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { prependId: pageRow.id });
                return;
            }

            if (!self.currentElement) return;

            const numberOfToolbars = self.currentElement.querySelectorAll('ide-toolbar').length
            const isUngrouping: boolean = self.currentToolbar && numberOfToolbars > 1

            // if target overlap with other section
            const overlap = isOverlapWithSection(eventTarget, dragStartTarget, event.clientX);

            // collide with other section
            if (overlap.overlapType == "mutual"/* || overlap.overlapType == "border"*/) return;
            // drag on the gap of fixed panel
            if (overlap.overlapType == "none" && eventTarget.classList.contains('fixed-grid')) return;
            // is ungrouping and draging on the original section
            if (overlap.overlapType == "self" && isUngrouping) return;

            if (pageRow && elementConfig?.module?.name === 'sectionStack')
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { prependId: pageRow.id });
            if (!self.currentElement) return;

            let nearestFixedItem = eventTarget.closest('.fixed-grid-item') as Control;
            // if target overlap with itself
            if (overlap.overlapType == "self")
                nearestFixedItem = findNearestFixedGridInRow(event.clientX);

            const config = { id: generateUUID() };
            // check if drop on a new row
            if (nearestFixedItem) {
                const column = Number(nearestFixedItem.dataset.column);
                const columnSpan = self.currentElement.dataset.columnSpan ?
                    Number(self.currentElement.dataset.columnSpan) : MIN_COLUMN;
                const colSpan = Math.min(columnSpan, self.maxColumn);
                const colStart = Math.min(column, self.maxColumn - colSpan + 1);
                const grid = nearestFixedItem.closest('.grid');
                const sections = Array.from(grid?.querySelectorAll('ide-section'));
                const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column));
                const findedSection = sortedSections.find((section: Control) => {
                    const sectionColumn = Number(section.dataset.column);
                    const sectionColumnSpan = Number(section.dataset.columnSpan);
                    const colData = colStart + colSpan;
                    const sectionData = sectionColumn + sectionColumnSpan;
                    return colStart >= sectionColumn && colData <= sectionData;
                });
                if (findedSection || self.isDragging) return;
                self.isDragging = true;

                // ungrouping elm
                if (isUngrouping) {
                    const dropElm = eventTarget;
                    const dragCmd = new UngroupElementCommand(self.currentToolbar.data, false, self.currentToolbar, dropElm, config);
                    commandHistory.execute(dragCmd);
                    self.currentElement.opacity = 1;
                    updateRectangles();
                } else if (self.currentElement.data) {
                    const dragCmd = new DragElementCommand(self.currentElement, nearestFixedItem);
                    commandHistory.execute(dragCmd);
                } else if (elementConfig) {
                    const dragCmd = new AddElementCommand(self.getNewElementData(), true, false, nearestFixedItem);
                    commandHistory.execute(dragCmd);

                // dragging elm (no group/ungroup)
                } else {
                    if (self.currentElement.data) {
                        const dragCmd = new DragElementCommand(self.currentElement, nearestFixedItem);
                        commandHistory.execute(dragCmd);
                    } else if (getDragData()) {
                        const dragCmd = new AddElementCommand(self.getNewElementData(), true, false, nearestFixedItem);
                        commandHistory.execute(dragCmd);
                    }
                }
                self.isDragging = false;
            
            // drop on a new row
            } else {
                const dropElm = parentWrapper.querySelector('.is-dragenter') as Control;
                if (self.isDragging) return;
                const inEmptyPnl = eventTarget.closest('#pnlEmty');
                if (dropElm && !inEmptyPnl) {
                    self.isDragging = true;
                    dropElm.classList.remove('is-dragenter');
                    if (dropElm.classList.contains('bottom-block')) {
                        if (isUngrouping) {
                            const dropElement = eventTarget;
                            const dragCmd = new UngroupElementCommand(self.currentToolbar.data, true, self.currentToolbar, dropElement, config);
                            commandHistory.execute(dragCmd);
                            self.currentElement.opacity = 1;
                            resetDragTarget();
                        } else {
                            const newConfig = self.getNewElementData();
                            const dragCmd = new GroupElementCommand(dropElm, elementConfig ? null : self.currentElement, {...newConfig, firstId: generateUUID()}, true);
                            commandHistory.execute(dragCmd);
                        }
                    } else if (dropElm.classList.contains('top-block')) {
                        if (isUngrouping) {
                            const dropElement = eventTarget;
                            const dragCmd = new UngroupElementCommand(self.currentToolbar.data, true, self.currentToolbar, dropElement, config);
                            commandHistory.execute(dragCmd);
                            self.currentElement.opacity = 1;
                            resetDragTarget();
                        } else {
                            const newConfig = self.getNewElementData();
                            const dragCmd = new GroupElementCommand(dropElm, elementConfig ? null : self.currentElement, {...newConfig, firstId: generateUUID()}, false);
                            commandHistory.execute(dragCmd);
                        }
                    } else if (dropElm.classList.contains(ROW_BOTTOM_CLASS)) {
                        const targetRow = dropElm.closest('ide-row') as PageRow;
                        targetRow && self.onAppendRow(targetRow);
                    } else if (dropElm.classList.contains(ROW_TOP_CLASS)) {
                        const targetRow = dropElm.closest('ide-row') as PageRow;
                        targetRow && self.onPrependRow(targetRow);
                    } else {
                        const isAppend = dropElm.classList.contains('back-block');
                        const dragCmd = elementConfig ?
                            new AddElementCommand(self.getNewElementData(), isAppend, false, dropElm, null) :
                            new DragElementCommand(self.currentElement, dropElm, isAppend);
                        await commandHistory.execute(dragCmd);
                    }
                    self.isDragging = false;
                } else if (pageRow && !self.isDragging) {
                    self.isDragging = true;
                    if (elementConfig) {
                        const parentId = pageRow?.id.replace('row-', '');
                        const elements = parentId ? pageObject.getRow(parentId)?.elements || [] : [];
                        const hasData = elements.find((el: IPageElement) => Object.keys(el.module || {}).length || el.elements?.length);
                        const dragCmd = !hasData && new AddElementCommand(self.getNewElementData(), true, true, null, pageRow);
                        dragCmd && await commandHistory.execute(dragCmd);
                    } else {
                        if (isUngrouping) {
                            const dropElement = eventTarget;
                            const dragCmd = new UngroupElementCommand(self.currentToolbar.data, false, self.currentToolbar, dropElement, config);
                            commandHistory.execute(dragCmd);
                            self.currentElement.opacity = 1;
                            resetDragTarget();
                        } else {
                            const dragCmd = new DragElementCommand(self.currentElement, pageRow, true, true);
                            commandHistory.execute(dragCmd);
                        }
                        
                    }
                    self.isDragging = false;
                }
                self.removeDottedLines();
                updateRectangles();
            }
        });

        function resetDragTarget() {
            self.currentElement = null;
            dragStartTarget = null;
            dragOverTarget = null;
            application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, null);
            self.isDragging = false;
            setDragData(null);
            self.removeDottedLines();
            updateRectangles();
            removeClass('is-dragenter');
            removeClass('row-entered');
            removeClass('is-dragging');
        }

        function removeClass(className: string) {
            const elements = parentWrapper.getElementsByClassName(className);
            for (const element of elements) {
                const isNotHidden = element.classList.contains(ROW_BOTTOM_CLASS) || element.classList.contains(ROW_TOP_CLASS);
                if (className === 'is-dragenter' && !isNotHidden) {
                    (element as Control).visible = false;
                }
                element.classList.remove(className);
            }
        }

        function updateRectangles() {
            const rectangles = parentWrapper.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
        }
    }

    async onPrependRow(pageRow: PageRow) {
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { appendId: pageRow.id });
        const newPageRow = pageRow.previousElementSibling as PageRow;
        if (newPageRow) {
            const dragCmd = getDragData() ?
                new AddElementCommand(this.getNewElementData(), true, true, null, newPageRow) :
                new DragElementCommand(this.currentElement, newPageRow, true, true);
            await commandHistory.execute(dragCmd);
        }
    }

    async onAppendRow(pageRow: PageRow) {
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { prependId: pageRow.id });
        const newPageRow = pageRow.nextElementSibling as PageRow;
        if (newPageRow) {
            const dragCmd = getDragData() ?
                new AddElementCommand(this.getNewElementData(), true, true, null, newPageRow) :
                new DragElementCommand(this.currentElement, newPageRow, true, true);
            await commandHistory.execute(dragCmd);
        }
    }

    async onAddRow() {
        const dragCmd = getDragData() ?
            new AddElementCommand(this.getNewElementData(), true, true, null, this) :
            new DragElementCommand(this.currentElement, this, true, true);
        await commandHistory.execute(dragCmd);
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_SET_DRAG_ELEMENT, async (el: any) => this.currentElement = el);
        application.EventBus.register(this, EVENT.ON_SET_DRAG_TOOLBAR, async (el: any) => this.currentToolbar = el)
        application.EventBus.register(this, EVENT.ON_UPDATE_PAGE_CONFIG, async (data: any) => {
            const { config, rowsConfig } = data;
            if (!config) return;
            const id = this.id.replace('row-', '');
            const sectionConfig = pageObject.getRowConfig(id) || {};
            let newConfig = { ...getPageConfig(), ...sectionConfig, ...config };
            if (rowsConfig) {
                const parsedData = rowsConfig[id] ? JSON.parse(rowsConfig[id]) : {};
                newConfig = {...newConfig, ...parsedData};
            }
            pageObject.updateSection(id, { config: newConfig });
            this.updateRowConfig(newConfig);
            this.updateGridColumnWidth();
        });
    }

    private getNewElementData() {
        const elementConfig = {...(getDragData() || {})};
        const id = generateUUID();
        const elementId = generateUUID();
        return {...elementConfig, id, elementId};
    }

    private addDottedLines() {
        const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
        for (let i = 0; i < fixedGridItems.length; i++) {
            fixedGridItems[i].classList.add('border-x-dotted');
        }
        const fixedGrids = document.getElementsByClassName('fixed-grid');
        for (let i = 0; i < fixedGrids.length; i++) {
            fixedGrids[i].classList.add('border-dotted');
        }
    }

    private removeDottedLines() {
        const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
        for (let i = 0; i < fixedGridItems.length; i++) {
            fixedGridItems[i].classList.remove('border-x-dotted');
        }
        const fixedGrids = document.getElementsByClassName('fixed-grid');
        for (let i = 0; i < fixedGrids.length; i++) {
            fixedGrids[i].classList.remove('border-dotted');
        }
    }

    private setActive() {
        const pageRows = document.querySelectorAll('ide-row');
        if (pageRows) {
            for (const row of pageRows) {
                row.classList.remove('active');
                const toolbars = row.querySelectorAll('ide-toolbar');
                toolbars.forEach((toolbar: IDEToolbar) => toolbar.hideToolbars())
            }
        }
        this.classList.add('active');
    }

    private onAddSection(type: number) {
        const prependId = type === 1 ? this.id : '';
        const appendId = type === -1 ? this.id : '';
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, { prependId, appendId });
    }

    render() {
        return (
            <i-panel
                id="pnlRowWrap"
                class={'page-row'}
                width="100%"
                height="100%"
                padding={{ left: '3rem', right: '3rem' }}
            >
                <i-button
                    caption=''
                    icon={{name: 'plus', width: 14, height: 14, fill: Theme.colors.primary.contrastText}}
                    background={{color: Theme.colors.primary.main}}
                    padding={{top: 5, bottom: 5, left: 5, right: 5}}
                    top="-12px" left="50%" zIndex={100}
                    class="btn-add"
                    onClick={() => this.onAddSection(-1)}
                ></i-button>
                <i-vstack id={'actionsBar'} class="row-actions-bar" verticalAlignment="center">
                    <i-vstack
                        background={{ color: '#fff' }}
                        border={{ radius: '20px' }}
                        maxWidth="100%"
                        maxHeight="100%"
                        horizontalAlignment="center"
                        padding={{top: 5, bottom: 5}}
                        class="bar-shadow"
                    >
                        <i-panel
                            class="actions"
                            tooltip={{ content: 'Section settings', placement: 'right' }}
                            visible={this.isChanged}
                            onClick={() => this.onOpenRowSettingsDialog()}
                        >
                            <i-icon name="cog" width={16} height={16} fill="#80868b"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnClone"
                            class="actions"
                            tooltip={{ content: 'Duplicate section', placement: 'right' }}
                            visible={this.isCloned}
                            onClick={this.onClone}
                        >
                            <i-icon name="clone" width={16} height={16} fill="#80868b"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnDelete"
                            class="actions delete"
                            tooltip={{ content: 'Delete section', placement: 'right' }}
                            onClick={this.onDeleteRow}
                        >
                            <i-icon name="trash" width={16} height={16} fill="#80868b"></i-icon>
                        </i-panel>
                    </i-vstack>
                </i-vstack>
                <i-vstack
                    id="dragStack"
                    height="100%"
                    verticalAlignment="center"
                    position="absolute"
                    left="0px"
                    top="0px"
                    class="drag-stack"
                >
                    <i-grid-layout
                        verticalAlignment="center"
                        autoFillInHoles={true}
                        columnsPerRow={2}
                        class="main-drag"
                    >
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                        <i-icon name="circle" width={3} height={3}></i-icon>
                    </i-grid-layout>
                </i-vstack>
                <i-vstack
                    id="pnlEmty"
                    width="100%"
                    visible={false}
                    verticalAlignment='center' horizontalAlignment='center'
                    class="pnl-empty"
                >
                    <i-panel
                        padding={{top: '3rem', bottom: '3rem'}}
                        margin={{top: '3rem', bottom: '3rem'}}
                        width="100%"
                        border={{width: '1px', style: 'dashed', color: 'var(--builder-divider)'}}
                        class="text-center"
                    >
                        <i-label
                            caption='Drag Elements Here'
                            font={{transform: 'uppercase', color: 'var(--builder-color)', size: '1.25rem'}}
                            opacity={0.5}
                        ></i-label>
                    </i-panel>
                </i-vstack>
                <i-grid-layout
                    id="pnlRow"
                    width="100%"
                    height="100%"
                    maxWidth="100%"
                    maxHeight="100%"
                    position="relative"
                    class="grid"
                    opacity={0}
                ></i-grid-layout>
                <ide-row-settings-dialog
                    id="mdRowSetting"
                    onSave={this.onSaveRowSettings.bind(this)}
                ></ide-row-settings-dialog>
                <i-button
                    caption=''
                    icon={{name: 'plus', width: 14, height: 14, fill: Theme.colors.primary.contrastText}}
                    background={{color: Theme.colors.primary.main}}
                    padding={{top: 5, bottom: 5, left: 5, right: 5}}
                    bottom="-12px" left="50%" zIndex={100}
                    class="btn-add"
                    onClick={() => this.onAddSection(1)}
                ></i-button>
            </i-panel>
        );
    }
}
