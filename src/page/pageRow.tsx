import {
    Module,
    customElements,
    application,
    ControlElement,
    Control,
    VStack,
    observable,
    GridLayout,
    Styles,
    Panel
} from '@ijstech/components';
import { PageSection, RowSettingsDialog } from './pageSection';
import './pageRow.css';
import { EVENT } from '../const/index';
import { IPageElement, IPageSection } from '../interface/index';
import { getDragData, pageObject, setDragData } from '../store/index';
import {
    commandHistory,
    UpdateRowCommand,
    ResizeElementCommand,
    DragElementCommand,
    MAX_COLUMN,
    UpdateColorCommand,
    UpdateTypeCommand,
    AddElementCommand,
    MIN_COLUMN
} from '../command/index';
import { IDEToolbar } from '../common/index';
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

@customElements('ide-row')
export class PageRow extends Module {
    private actionsBar: VStack;
    private dragStack: VStack;
    private pnlRow: GridLayout;
    private mdRowSetting: RowSettingsDialog;
    private pnlEmty: VStack;
    private pnlWrap: Panel;

    private _readonly: boolean;
    private isResizing: boolean = false;
    private currentWidth: number;
    private currentHeight: number;
    private currentElement: PageSection;
    private rowId: string = '';
    private rowData: IPageSection;
    private isDragging: boolean = false;

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

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.renderFixedGrid();
        this.initEventListeners();
        const hasData = this.data?.elements?.length;
        this.toggleUI(hasData);
        application.EventBus.register(this, EVENT.ON_SET_DRAG_ELEMENT, async (el: any) => this.currentElement = el)
    }

    toggleUI(value: boolean) {
        if (this.pnlWrap) this.pnlWrap.opacity = value ? 1 : 0;
        if (this.pnlEmty) this.pnlEmty.visible = !value;
    }

    private async createNewElement(i: number) {
        const sectionData = this.data.elements[i];
        return this.createElementFn(sectionData);
    }

    private async createElementFn(data: IPageElement) {
        const pageSection = (
            <ide-section
                readonly={this._readonly}
                display="block"
                maxWidth="100%"
                maxHeight="100%"
                position="relative"
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
        if (children?.length) children.forEach((item) => item.remove());
    }

    async setData(rowData: IPageSection) {
        this.clearData();
        const { id, row, image, elements, backgroundColor } = rowData;

        this.id = `row-${id}`;
        this.rowId = id;
        this.rowData = rowData;
        this.setAttribute('data-row', `${row}`);
        if (image) this.background.image = image;
        else if (backgroundColor) this.background.color = backgroundColor;

        this.isCloned = this.parentElement?.nodeName !== 'BUILDER-HEADER';
        this.isChanged = this.parentElement?.nodeName !== 'BUILDER-HEADER';

        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                await this.createNewElement(i);
            }
        }
        this.actionsBar.minHeight = '100%';
        const hasData = this.data?.elements?.length;
        this.toggleUI(hasData);
    }

    private onOpenRowSettingsDialog() {
        this.mdRowSetting.show();
    }

    private onSaveRowSettings(color: string) {
        const updateCmd = new UpdateColorCommand(this, color);
        commandHistory.execute(updateCmd);
    }

    private async onClone() {
        const rowData = pageObject.getRow(this.rowId);
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, { rowData, id: this.id });
    }

    onDeleteRow() {
        const prependRow = this.previousElementSibling;
        const rowCmd = new UpdateRowCommand(this, this.parent, this.data, true, prependRow ? prependRow.id : '');
        commandHistory.execute(rowCmd);
    }

    onMoveUp() {
        this.actionsBar.classList.add('hidden');
        this.dragStack.classList.add('hidden');
        this.background = { color: '#f2f2f2' };
    }
    onMoveDown() {
        this.actionsBar.classList.remove('hidden');
        this.dragStack.classList.remove('hidden');
        this.background = { color: 'initial' };
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
        for (let i = 0; i < 12; i++) {
            const elm = <i-panel class="fixed-grid-item"></i-panel>;
            elm.setAttribute('data-column', `${i + 1}`);
            elm.style.gridColumn = `${i + 1}`;
            grid.append(elm);
        }
        this.pnlRow.appendChild(grid);
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
        let grids = document.getElementsByClassName('grid');
        const gapWidth = 15;
        const gridColumnWidth = (this.pnlRow.offsetWidth - gapWidth * 11) / 12;
        for (const grid of grids) {
            const gridElm = grid as GridLayout;
            gridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
            gridElm.gap = { column: `${gapWidth}px` };
        }

        let fixedGrids = document.getElementsByClassName('fixed-grid');
        for (const fixedGrid of fixedGrids) {
            const fixedGridElm = fixedGrid as GridLayout;
            fixedGridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
            fixedGridElm.gap = { column: `${gapWidth}px` };
        }

        this.addEventListener('mousedown', (e) => {
            const target = e.target as Control;
            const parent = target.closest('.resize-stack') as Control;
            if (!parent) return;
            e.preventDefault();
            const resizableElm = target.closest('ide-section') as PageSection;
            self.currentElement = resizableElm;
            toolbar = self.currentElement.querySelector('ide-toolbar');
            self.addDottedLines();
            this.isResizing = true;
            currentDot = parent;
            startX = e.clientX;
            startY = e.clientY;
            this.currentWidth = toolbar.offsetWidth;
            this.currentHeight = toolbar.offsetHeight;
        });

        document.addEventListener('mouseup', (e) => {
            e.preventDefault();
            self.removeDottedLines();
            this.isResizing = false;
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
                this.currentWidth,
                this.currentHeight,
                newWidth,
                newHeight
            );
            commandHistory.execute(resizeCmd);
            self.currentElement.style.left = 'initial';
            self.currentElement = null;
            toolbar = null;
        });

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
                elm.classList.add(className);
            } else {
                elm.classList.remove(className);
            }
        }

        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing || !toolbar) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (currentDot.classList.contains('topLeft')) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight - deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('topRight')) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight - deltaY;
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('bottomLeft')) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight + deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('bottomRight')) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight + deltaY;
                updateDimension(newWidth, newHeight)
            } else if (currentDot.classList.contains('top')) {
                newHeight = this.currentHeight - deltaY;
                updateDimension(undefined, newHeight)
            } else if (currentDot.classList.contains('bottom')) {
                newHeight = this.currentHeight + deltaY;
                updateDimension(undefined, newHeight)
            } else if (currentDot.classList.contains('left')) {
                newWidth = this.currentWidth - deltaX;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, undefined)
            } else if (currentDot.classList.contains('right')) {
                newWidth = this.currentWidth + deltaX;
                updateDimension(newWidth, undefined)
            }
        });

        this.addEventListener('dragstart', function (event) {
            const eventTarget = event.target as Control;
            if (eventTarget instanceof PageRow) return;
            const target = eventTarget.closest && eventTarget.closest('ide-section') as PageSection;
            const toolbar = target?.querySelector('ide-toolbar') as Control;
            const cannotDrag =
                toolbar &&
                (toolbar.classList.contains('is-editing') ||
                    toolbar.classList.contains('is-setting'));
            if (target && !cannotDrag) {
                self.currentElement = target;
                self.currentElement.opacity = 0;
                application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, target);
                self.addDottedLines();
            } else {
                event.preventDefault();
            }
        });

        this.addEventListener('drag', function (event) {});

        document.addEventListener('dragend', function (event) {
            if (self.currentElement) self.currentElement.opacity = 1;
            self.currentElement = null;
            self.isDragging = false;
            setDragData(null);
            self.removeDottedLines();
            let rectangles = document.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
            let backBlocks = document.getElementsByClassName('is-dragenter');
            for (const block of backBlocks) {
                (block as Control).visible = false;
                block.classList.remove('is-dragenter');
            }
            let blocks = document.getElementsByClassName('dragenter');
            for (const block of blocks) {
                block.classList.remove('dragenter');
            }
            let components = document.getElementsByClassName('is-dragging');
            for (const component of components) {
                component.classList.remove('is-dragging');
            }
        });

        this.addEventListener('dragenter', function (event) {
            const eventTarget = event.target as Control;
            const elementConfig = getDragData();
            const pageRow = eventTarget.closest('ide-row') as PageRow;
            if (pageRow && elementConfig?.module?.name === 'sectionStack') {
                pageRow.classList.add('dragenter');
            }
            if (!eventTarget || !self.currentElement) return;
            const target = eventTarget.closest('.fixed-grid-item') as Control;
            if (target) {
                const column = Number(target.dataset.column);
                const columnSpan = self.currentElement.dataset.columnSpan ? Number(self.currentElement.dataset.columnSpan) : MIN_COLUMN ;
                const colSpan = Math.min(columnSpan, 12);
                const colStart = Math.min(column, 12 - colSpan + 1);
                const grid = target.closest('.grid');
                const sections = Array.from(grid?.querySelectorAll('ide-section'));
                const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(a.dataset.column) - Number(b.dataset.column));
                const findedSection = sortedSections.find((section: Control) => {
                    const sectionColumn = Number(section.dataset.column);
                    const sectionColumnSpan = Number(section.dataset.columnSpan);
                    const colData = colStart + colSpan;
                    return colStart >= sectionColumn && colData <= sectionColumn + sectionColumnSpan;
                });
                if (findedSection) return;
                const rectangle = target
                    .closest('.fixed-grid')
                    .parentNode.querySelector(`.rectangle`) as Control;
                rectangle.style.display = 'block';
                rectangle.style.left = (gridColumnWidth + gapWidth) * (colStart - 1) + 'px';
                rectangle.style.width =
                    gridColumnWidth * columnSpan + gapWidth * (columnSpan - 1) + 'px';
            } else {
                const section = eventTarget.closest('ide-section') as Control;
                if (section && !section.isSameNode(self.currentElement)) {
                    const toolbar = eventTarget.closest('ide-toolbar') as Control;
                    if (toolbar) {
                        const { y, height} = toolbar.getBoundingClientRect();
                        const bottomBlock = toolbar.querySelector('.bottom-block') as Control;
                        if (bottomBlock) {
                            bottomBlock.visible = Math.ceil(event.clientY) >= Math.ceil(y + height) - 2;
                            updateClass(bottomBlock, 'is-dragenter');
                        }
                    }

                    const curElmCol = Number(section?.dataset?.column);
                    const curElmColSpan = Number(section?.dataset?.columnSpan);
                    const sections = Array.from(section.closest('#pnlRow')?.querySelectorAll('ide-section'));
                    const nextElm = sections.find((el: Control) => {
                        const column = Number(el.dataset.column);
                        return !isNaN(column) && (curElmCol + curElmColSpan === column);
                    }) as Control;
                    const showHiddenBlock = curElmCol === 1 && (curElmCol + curElmColSpan === MAX_COLUMN + 1) ||
                        (nextElm) ||
                        (curElmCol + curElmColSpan === MAX_COLUMN + 1);
                    if (showHiddenBlock) {
                        const { left, right } = section.getBoundingClientRect();
                        const backBlock = section.querySelector('.back-block') as Control;
                        const frontBlock = section.querySelector('.front-block') as Control;

                        if (backBlock) {
                            backBlock.visible = Math.abs(event.clientX - right) <= 15;
                            updateClass(backBlock, 'is-dragenter');
                        }

                        if (frontBlock) {
                            frontBlock.visible = Math.abs(event.clientX - left) <= 15  && curElmCol === 1;
                            updateClass(frontBlock, 'is-dragenter');
                        }
                    }
                }
            }
        });

        document.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        document.addEventListener('dragleave', function (event) {
            const eventTarget = event.target as Control;
            let rectangles = document.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
            const blocks = document.getElementsByClassName('is-dragenter')
            for (const block of blocks) {
                const currentSection = eventTarget.closest('ide-section') as Control;
                const blockSection = block.closest('ide-section');
                if (currentSection && blockSection && currentSection.id === blockSection.id)
                    continue;
                (block as Control).visible = false;
                block.classList.remove('is-dragenter');
            }
            const pageRows = document.getElementsByClassName('dragenter');
            for (const row of pageRows) {
                const currentRow = eventTarget.closest('ide-row') as Control;
                if (currentRow && row && currentRow.id === row.id)
                    continue;
                row.classList.remove('dragenter');
            }
        });

        this.addEventListener('drop', async function (event) {
            const elementConfig = getDragData();
            const eventTarget = event.target as Control;
            const pageRow = eventTarget.closest('ide-row') as PageRow;
            self.removeDottedLines();
            event.preventDefault();
            event.stopPropagation();
            if (pageRow && elementConfig?.module?.name === 'sectionStack')
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION, pageRow.nextSibling ? pageRow.id : '');
            if (!self.currentElement) return;

            const nearestFixedItem = eventTarget.closest('.fixed-grid-item') as Control;
            if (nearestFixedItem) {
                const column = Number(nearestFixedItem.dataset.column);
                const columnSpan = self.currentElement.dataset.columnSpan ?
                    Number(self.currentElement.dataset.columnSpan) : MIN_COLUMN;
                const colSpan = Math.min(columnSpan, 12);
                const colStart = Math.min(column, 12 - colSpan + 1);
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
                if (self.currentElement.data) {
                    const dragCmd = new DragElementCommand(self.currentElement, nearestFixedItem);
                    commandHistory.execute(dragCmd);
                } else if (getDragData()) {
                    const dragCmd = new AddElementCommand(self.getNewElementData(), true, false, nearestFixedItem);
                    commandHistory.execute(dragCmd);
                }
                self.isDragging = false;
            } else {
                const isPageRow = eventTarget.classList.contains('page-row');
                const dropElm = (
                    isPageRow
                        ? eventTarget.querySelector('.is-dragenter')
                        : eventTarget.closest('.is-dragenter')
                ) as Control;
                if (self.isDragging) return;

                if (dropElm) {
                    self.isDragging = true;
                    dropElm.classList.remove('is-dragenter');
                    const isBottomBlock = dropElm.classList.contains('bottom-block');
                    if (isBottomBlock) {
                        const config = getDragData();
                        const dragCmd = new UpdateTypeCommand(dropElm, config ? null : self.currentElement, config);
                        commandHistory.execute(dragCmd);
                    } else {
                        let dragCmd = null;
                        if (getDragData()) {
                            const isAppend = dropElm.classList.contains('back-block');
                            dragCmd = new AddElementCommand(self.getNewElementData(), isAppend, false, dropElm, null);
                        } else {
                            dragCmd = new DragElementCommand(self.currentElement, dropElm);
                        }
                        await commandHistory.execute(dragCmd);
                    }
                    self.isDragging = false;
                } else if (pageRow && !self.isDragging) {
                    self.isDragging = true;
                    if (elementConfig) {
                        const parentId = pageRow?.id.replace('row-', '');
                        const elements = parentId ? pageObject.getRow(parentId)?.elements || [] : [];
                        let dragCmd = null;
                        if (elements.length) {
                            let backBlocks = Array.from(document.getElementsByClassName('is-dragenter'));
                            const activedBlock = backBlocks.find((block: Control) => block.visible) as Control;
                            if (!activedBlock) return;
                            dragCmd = new AddElementCommand(self.getNewElementData(), activedBlock.classList.contains('back-block'), false, activedBlock);
                        }
                        else
                            dragCmd = new AddElementCommand(self.getNewElementData(), true, true, null, pageRow);
                        await commandHistory.execute(dragCmd);
                    } else {
                        const dragCmd = new DragElementCommand(self.currentElement, pageRow);
                        commandHistory.execute(dragCmd);
                    }
                    self.isDragging = false;
                }
            }
        });
    }

    private getNewElementData() {
        const elementConfig = {...(getDragData() || {})};
        const id = generateUUID();
        return {...elementConfig, id};
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

    render() {
        return (
            <i-panel
                id="pnlRowWrap"
                class={'page-row'}
                width="100%"
                height="100%"
                padding={{ left: '3rem', right: '3rem' }}
            >
                <i-vstack id={'actionsBar'} class="row-actions-bar" verticalAlignment="center">
                    <i-vstack
                        background={{ color: '#fff' }}
                        border={{ radius: '20px' }}
                        maxWidth="100%"
                        maxHeight="100%"
                        horizontalAlignment="center"
                        padding={{top: 5, bottom: 5}}
                    >
                        <i-panel
                            id="btnSetting"
                            class="actions"
                            tooltip={{ content: 'Section colors', placement: 'right' }}
                            visible={this.isChanged}
                            onClick={this.onOpenRowSettingsDialog}
                        >
                            <i-icon name="palette" width={16} height={16} fill="#80868b"></i-icon>
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
                >
                    <i-panel
                        padding={{top: '3rem', bottom: '3rem'}}
                        margin={{top: '3rem', bottom: '3rem'}}
                        width="100%"
                        border={{width: '1px', style: 'dashed', color: Theme.divider}}
                        class="text-center"
                    >
                        <i-label
                            caption='Drag Elements Here'
                            font={{transform: 'uppercase', color: Theme.divider, size: '1.25rem'}}
                        ></i-label>
                    </i-panel>
                </i-vstack>
                <i-panel id="pnlWrap" opacity={0}>
                    <i-grid-layout
                        id="pnlRow"
                        width="100%"
                        height="100%"
                        maxWidth="100%"
                        maxHeight="100%"
                        position="relative"
                        class="grid"
                    ></i-grid-layout>
                </i-panel>
                <ide-row-settings-dialog
                    id="mdRowSetting"
                    onSave={this.onSaveRowSettings.bind(this)}
                ></ide-row-settings-dialog>
            </i-panel>
        );
    }
}
