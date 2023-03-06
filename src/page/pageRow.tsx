import {
    Module,
    customElements,
    application,
    ControlElement,
    Control,
    VStack,
    observable,
    GridLayout,
} from '@ijstech/components';
import { PageSection, RowSettingsDialog } from './pageSection';
import './pageRow.css';
import { EVENT } from '../const/index';
import { IPageSection } from '../interface/index';
import { pageObject } from '../store/index';
import {
    commandHistory,
    ElementCommand,
    ResizeElementCommand,
    DragElementCommand,
    MAX_COLUMN,
    UpdateElementCommand,
} from '../utility/index';
import { IDEToolbar } from '../common/index';

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

    private _readonly: boolean;
    private isResizing: boolean = false;
    private currentWidth: number;
    private currentHeight: number;
    private currentElement: PageSection;
    private rowId: string = '';
    private rowData: IPageSection;

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

    private initEventBus() {
        // application.EventBus.register(this, EVENT.ON_RESIZE, this.onResized);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.renderFixedGrid();
        this.initEventBus();
        this.initEventListeners();
    }

    private async createNewElement(i: number) {
        const sectionData = this.data.elements[i];
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
            pageSection.style.gridColumn = `${sectionData.column || 1} / span ${
                sectionData.columnSpan || 1
            }`;
            pageSection.setAttribute('data-column', `${sectionData.column || 1}`);
            pageSection.setAttribute('data-column-span', `${sectionData.columnSpan || 1}`);
        }
        pageSection.visible = !!sectionData;
        this.pnlRow.appendChild(pageSection);
        await pageSection.setData(this.rowId, sectionData);
        return pageSection;
    }

    private async clearData() {
        const children = this.pnlRow.querySelectorAll('ide-section');
        if (children && children.length) children.forEach((item) => item.remove());
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

        this.isCloned = this.parentElement.nodeName !== 'BUILDER-HEADER';
        this.isChanged = this.parentElement.nodeName !== 'BUILDER-HEADER';

        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                await this.createNewElement(i);
            }
        }
        this.actionsBar.minHeight = '100%';
    }

    private onOpenRowSettingsDialog() {
        this.mdRowSetting.show();
    }

    private onSaveRowSettings(color: string) {
        const updateCmd = new UpdateElementCommand(this, color);
        commandHistory.execute(updateCmd);
    }

    private async onClone() {
        const rowData = pageObject.getRow(this.rowId);
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, { rowData, id: this.id });
    }

    onDeleteRow() {
        const rowCmd = new ElementCommand(this, this.parent, this.data, true);
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

        function addDottedLines() {
            const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.add('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName('fixed-grid');
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.add('border-dotted');
            }
        }

        function removeDottedLines() {
            const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.remove('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName('fixed-grid');
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.remove('border-dotted');
            }
        }

        this.addEventListener('mousedown', (e) => {
            const target = e.target as Control;
            const parent = target.closest('.resize-stack') as Control;
            if (!parent) return;
            e.preventDefault();
            const resizableElm = target.closest('ide-section') as PageSection;
            self.currentElement = resizableElm;
            toolbar = self.currentElement.querySelector('ide-toolbar');
            addDottedLines();
            this.isResizing = true;
            currentDot = parent;
            startX = e.clientX;
            startY = e.clientY;
            this.currentWidth = toolbar.offsetWidth;
            this.currentHeight = toolbar.offsetHeight;
        });

        document.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (!toolbar) return;
            this.isResizing = false;
            removeDottedLines();
            toolbar.width = 'initial';
            toolbar.height = 'initial';
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
            self.currentElement.left = 'initial';
            self.currentElement = null;
            toolbar = null;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing || !toolbar) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (currentDot.classList.contains('topLeft')) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight - deltaY;
                self.currentElement.left = deltaX + 'px';
                toolbar.width = newWidth + 'px';
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('topRight')) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight - deltaY;
                toolbar.width = newWidth + 'px';
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('bottomLeft')) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight + deltaY;
                self.currentElement.left = deltaX + 'px';
                toolbar.width = newWidth + 'px';
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('bottomRight')) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight + deltaY;
                toolbar.width = newWidth + 'px';
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('top')) {
                newHeight = this.currentHeight - deltaY;
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('bottom')) {
                newHeight = this.currentHeight + deltaY;
                toolbar.height = newHeight + 'px';
            } else if (currentDot.classList.contains('left')) {
                newWidth = this.currentWidth - deltaX;
                self.currentElement.left = deltaX + 'px';
                toolbar.width = newWidth + 'px';
            } else if (currentDot.classList.contains('right')) {
                newWidth = this.currentWidth + deltaX;
                toolbar.width = newWidth + 'px';
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
                addDottedLines();
            } else {
                event.preventDefault();
            }
        });

        document.addEventListener('drag', function (event) {});

        document.addEventListener('dragend', function (event) {
            if (self.currentElement) self.currentElement.opacity = 1;
            self.currentElement = null;
            removeDottedLines();
            let rectangles = document.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
            let backBlocks = document.getElementsByClassName('back-block');
            for (const block of backBlocks) {
                (block as Control).visible = false;
                block.classList.remove('is-dragenter');
            }
        });

        document.addEventListener('dragenter', function (event) {
            const eventTarget = event.target as Control;
            if (!eventTarget || !self.currentElement) return;
            const target = eventTarget.closest('.fixed-grid-item') as Control;
            if (target) {
                const column = Number(target.dataset.column);
                const columnSpan = Number(self.currentElement.dataset.columnSpan);
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
                        const hiddenBlock = section.querySelector('.back-block') as Control;
                        hiddenBlock && (hiddenBlock.visible = true);
                    }
                }
                const backBlock = eventTarget.closest('.back-block') as Control;
                backBlock && backBlock.classList.add('is-dragenter');
            }
        });

        document.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        document.addEventListener('dragleave', function (event) {
            const eventTarget = event.target as Control;
            const target = eventTarget.closest('.fixed-grid-item') as Control;
            if (target) {
                target.style.border = '';
                let rectangles = document.getElementsByClassName('rectangle');
                for (const rectangle of rectangles) {
                    (rectangle as Control).style.display = 'none';
                }
            } else {
                const block  = eventTarget.closest('.back-block') as Control;
                if (block) {
                    block.visible = false;
                    block.classList.remove('is-dragenter');
                }
            }
        });

        document.addEventListener('drop', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!self.currentElement) return;
            const eventTarget = event.target as Control;
            const target = eventTarget.closest('.fixed-grid-item') as Control;
            if (target) {
                const column = Number(target.dataset.column);
                const columnSpan = Number(self.currentElement.dataset.columnSpan);
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
                if (!findedSection) {
                    const dragCmd = new DragElementCommand(self.currentElement, target);
                    commandHistory.execute(dragCmd);
                }
            } else {
                const isPageRow = eventTarget.classList.contains('page-row');
                const dropElm = (
                    isPageRow
                        ? eventTarget.querySelector('.is-dragenter')
                        : eventTarget.closest('.is-dragenter')
                ) as Control;
                if (dropElm) {
                    dropElm.classList.remove('is-dragenter');
                    const dragCmd = new DragElementCommand(self.currentElement, dropElm);
                    commandHistory.execute(dragCmd);
                }
            }
        });
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
                    <i-panel
                        background={{ color: '#fff' }}
                        border={{ radius: '20px' }}
                        maxWidth="100%"
                        maxHeight="100%"
                    >
                        <i-panel
                            id="btnSetting"
                            class="actions"
                            tooltip={{ content: 'Section colors', placement: 'right' }}
                            visible={this.isChanged}
                            onClick={this.onOpenRowSettingsDialog}
                        >
                            <i-icon name="palette"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnClone"
                            class="actions"
                            tooltip={{ content: 'Duplicate section', placement: 'right' }}
                            visible={this.isCloned}
                            onClick={this.onClone}
                        >
                            <i-icon name="clone"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnDelete"
                            class="actions delete"
                            tooltip={{ content: 'Delete section', placement: 'right' }}
                            onClick={this.onDeleteRow}
                        >
                            <i-icon name="trash"></i-icon>
                        </i-panel>
                    </i-panel>
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
                <i-grid-layout
                    id="pnlRow"
                    width="100%"
                    height="100%"
                    maxWidth="100%"
                    maxHeight="100%"
                    position="relative"
                    class="grid"
                ></i-grid-layout>
                <ide-row-settings-dialog
                    id="mdRowSetting"
                    onSave={this.onSaveRowSettings.bind(this)}
                ></ide-row-settings-dialog>
            </i-panel>
        );
    }
}
