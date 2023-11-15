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
    Panel,
    Modal,
} from '@ijstech/components';
import {PageSection} from './pageSection';
import {PageMenu} from './pageMenu'
import {RowSettingsDialog} from '../dialogs/index';
import './pageRow.css';
import {EVENT} from '../const/index';
import {IPageElement, IPageSection, GAP_WIDTH, IPageSectionConfig, INIT_COLUMN_SPAN, MAX_COLUMN} from '../interface/index';
import {getDragData, getMargin, getPageConfig, pageObject, setDragData} from '../store/index';
import {
    commandHistory,
    UpdateRowCommand,
    ResizeElementCommand,
    DragElementCommand,
    UpdateRowSettingsCommand,
    GroupElementCommand,
    AddElementCommand,
    UngroupElementCommand,
} from '../command/index';
import {IDEToolbar} from '../common/toolbar';
import {generateUUID, checkDragDropResult, findNearestSectionInRow, getDropFrontBackResult} from '../utility/index';
const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-row']: PageRowElement
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
    private pnlRowContainer: Panel;
    private pnlRowWrap: Panel;
    private pnlRow: GridLayout;
    private mdRowSetting: RowSettingsDialog;
    private pnlEmty: VStack;
    private pnlLoading: Panel;

    private _readonly: boolean;
    private isResizing: boolean = false;
    private currentWidth: number;
    private currentHeight: number;
    private currentElement: PageSection;
    private currentToolbar: IDEToolbar;
    private rowId: string = '';
    private rowData: IPageSection;
    private isDragging: boolean = false;
    private _gridColumnWidth: number = 0;
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

    get maxColumn() {
        const rowId = this.id?.replace('row-', '');
        return pageObject.getColumnsNumber(rowId);
    }

    private get align() {
        const rowId = this.id?.replace('row-', '');
        const config = pageObject.getRowConfig(rowId);
        return config?.align || 'left';
    }

    get gridColumnWidth() {
        return this._gridColumnWidth
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
                height="3px"
                bottom="-3px"
                zIndex={90}
                // border={{radius: '5px'}}
                class={ROW_BOTTOM_CLASS}
            ></i-panel>
        );
        this.appendChild(
            <i-panel
                position="absolute"
                width="100%"
                height="3px"
                top="-3px"
                zIndex={90}
                // border={{radius: '5px'}}
                class={ROW_TOP_CLASS}
            ></i-panel>
        );
    }

    toggleUI(value: boolean) {
        if (this.pnlRow) this.pnlRow.opacity = value ? 1 : 0;
        if (this.pnlEmty) this.pnlEmty.visible = !value;
        this.updateAlign();
    }

    private async createNewElement(sectionData: any) {
        return this.createElementFn(sectionData);
    }

    private async createElementFn(data: IPageElement) {
        const isElmExist = this.pnlRow?.querySelector(`ide-section[id='${data.id}']`);
        if (isElmExist) return;
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
            pageSection.style.gridColumn = `${data.column || 1} / span ${data.columnSpan || 1}`;
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
        if (this.pnlLoading) this.pnlLoading.visible = true;
        const element = await this.createElementFn(data);
        this.toggleUI(true);
        if (this.pnlLoading) this.pnlLoading.visible = false;
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
        const {id, row, elements, config} = rowData;

        this.id = `row-${id}`;
        this.rowId = id;
        this.rowData = rowData;
        this.setAttribute('data-row', `${row}`);
        this.updateRowConfig(config || getPageConfig());
        this.isCloned = this.parentElement?.nodeName !== 'BUILDER-HEADER';
        this.isChanged = this.parentElement?.nodeName !== 'BUILDER-HEADER';
        if (config?.customTextSize && config?.textSize){
            this.classList.add(`font-${config.textSize}`)}
        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                await this.createNewElement(elements[i]);
            }
        }
        this.actionsBar.minHeight = '100%';
        this.updateColumn();
        const hasData = this.data?.elements?.length;
        this.toggleUI(hasData);
    }

    updateRowConfig(config: IPageSectionConfig) {
        const { align, fullWidth, customBackground, backgroundColor, customTextColor, textColor, customTextSize, textSize, border, borderColor,
        customBackdrop, backdropImage, backdropColor, padding, sectionWidth } = config || {};

        if(sectionWidth) {
            this.pnlRowContainer.width = sectionWidth;
        }
        //
        // const sectionEl = this;
        // const innerEl = this.pnlRowContainer;
        //
        // if(sectionWidth !== undefined) {
        //     innerEl.width = sectionWidth;
        //     innerEl.maxWidth = sectionWidth;
        // }
        //
        // if(fullWidth) {
        //     if(customBackground && backgroundColor) {
        //         sectionEl.style.setProperty('--custom-background-color', backgroundColor);
        //         innerEl.style.setProperty('--custom-background-color', backgroundColor);
        //     }
        //     else {
        //         sectionEl.style.removeProperty('--custom-background-color');
        //         innerEl.style.removeProperty('--custom-background-color');
        //     }
        // }
        // else {
        //     if(customBackdrop) {
        //         if(backdropImage) {
        //             const ipfsUrl = `https://ipfs.scom.dev/ipfs`;
        //             sectionEl.style.setProperty('--custom-background-color', `url("${ipfsUrl}/${backdropImage}")`);
        //         }
        //         else if(backdropColor) {
        //             sectionEl.style.setProperty('--custom-background-color', backdropColor);
        //         }
        //     }
        //     else {
        //         sectionEl.style.removeProperty('--custom-background-color');
        //     }
        //     if(customBackground) {
        //         // Add background image later
        //         if(backgroundColor) {
        //             innerEl.style.setProperty('--custom-background-color', backgroundColor);
        //         }
        //     }
        //     else {
        //         innerEl.style.removeProperty('--custom-background-color');
        //     }
        // }
        //
        // if(customTextSize && textSize) {
        //     sectionEl.classList.add(`font-${textSize}`);
        // }
        // else {
        //     sectionEl.classList.forEach(v => {
        //         if(v.indexOf('font-') >= 0)
        //             sectionEl.classList.remove(v);
        //     })
        // }
        //
        // if(border && borderColor) {
        //     innerEl.border = {
        //         width: 2,
        //         style: 'solid',
        //         color: borderColor,
        //         radius: 10
        //     }
        // }
        //
        // if(padding) {
        //     innerEl.padding = padding;
        // }

        // if (!fullWidth) {
        //     if (image) this.background.image = image;
        //     if (border) {
        //         this.pnlRowWrap.border = { width: 2, style: 'solid', color: borderColor || Theme.divider }
        //     } else {
        //         this.pnlRowWrap.border.width = 0
        //     }
        //     // this.background.color = 'transparent';
        //     if (backdropImage)
        //         this.background.image = backdropImage;
        //     if (!image && !backdropImage) this.background.image = undefined
        // } else {
        //     this.pnlRowWrap.border.width = 0
        //     // if (backgroundColor)
        //         // this.background.color = backgroundColor;
        //     if (customBackground)
        //         this.style.setProperty('--custom-background-color', backgroundColor)
        //     else
        //         this.style.removeProperty('--custom-background-color')
        //     this.background.image = ''
        // }
        // if (backgroundColor) {
        //     this.pnlRowContainer.background.color = backgroundColor;
        // }
        // if (textColor) this.pnlRowContainer.font = {color: textColor};
        // this.pnlRowContainer.maxWidth = sectionWidth ?? '100%';
        // if (margin) this.pnlRowContainer.margin = getMargin(margin);
        // this.pnlRowContainer.width = margin?.x && margin?.x !== 'auto' ? 'auto' : '100%';
        // this.pnlRowWrap.padding = { 
        //     top: pt !== undefined ? pt : ptb !== undefined ? ptb : 0,
        //     bottom: pb !== undefined ? pb : ptb !== undefined ? ptb : 0,
        //     left: pl !== undefined ? pl : plr !== undefined ? plr : 0,
        //     right: pr !== undefined ? pr : plr !== undefined ? plr : 0,
        // }
        // this.pnlRowWrap.padding = padding || {};
        // if (align) this.updateAlign();
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
        switch (this.align) {
            case 'right':
                alignValue = 'end';
                break;
            case 'center':
                alignValue = 'center';
                break;
        }
        this.pnlRow.grid = {horizontalAlignment: alignValue as any};
        this.pnlRow.style.maxWidth = '100%';
        if (alignValue === 'start') {
            this.pnlRow.templateColumns = [`repeat(${this.maxColumn}, minmax(${GAP_WIDTH}px, 1fr))`];
        } else {
            this.pnlRow.templateColumns = ['min-content'];
            const sections = Array.from(this.pnlRow.querySelectorAll('ide-section'));
            const unitWidth = Number((1 / this.maxColumn).toFixed(3)) * 100;
            for (let section of sections) {
                const columnSpan = Number((section as HTMLElement).dataset.columnSpan);
                const widthNumber = columnSpan * this._gridColumnWidth + (columnSpan - 1) * GAP_WIDTH;
                (section as Control).width = widthNumber ? `${widthNumber}px` : `${columnSpan * unitWidth}%`;
            }
        }
    }

    private updateGridColumnWidth() {
        this._gridColumnWidth = (this.pnlRow.offsetWidth - GAP_WIDTH * (this.maxColumn - 1)) / this.maxColumn;
    }

    private async onClone() {
        const rowData = pageObject.getRow(this.rowId);
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, {rowData, id: this.id});
    }

    onDeleteRow() {
        const prependRow = this.previousElementSibling;
        const appendRow = this.nextElementSibling;
        const rowCmd = new UpdateRowCommand(this, this.parent, this.data, true, prependRow?.id || '', appendRow?.id || '');
        commandHistory.execute(rowCmd);
        if(!prependRow && !appendRow) {
            // create empty section
            const newId = generateUUID();
            const pageRows = this.parent.closest('ide-rows') as any;
            pageRows.setRows([
                {
                  "id": `${newId}`,
                  "row": 0,
                  "elements": []
                }
            ]);
        }
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
        grid.gap = {column: `${GAP_WIDTH}px`};
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
        const parentWrapper = self.closest('#editor') || document;
        let ghostImage: Control;
        let mouseDownEl: Control;

        this.addEventListener('mousedown', (e) => {
            const target = e.target as Control;
            const section = target.closest('ide-section') as PageSection;
            mouseDownEl = target;

            if (section) this._selectedSection = section;
            else this._selectedSection = undefined;

            const parent = target.closest('.resize-stack') as Control;
            if (!parent) return;
            e.preventDefault();
            const resizableElm = section;
            self.currentElement = resizableElm;
            toolbar = target.closest('ide-toolbar') as Control;
            self.addDottedLines();
            toggleAllToolbarBoarder(true);
            self.isResizing = true;
            currentDot = parent;
            startX = e.clientX;
            startY = e.clientY;
            self.currentWidth = toolbar.offsetWidth;
            self.currentHeight = toolbar.offsetHeight;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function getNewWidth(newHeight: number) {
            return (self.currentWidth / self.currentHeight) * newHeight;
        }

        function mouseMoveHandler(e: MouseEvent) {
            const isImage = (toolbar as any).module?.nodeName === 'I-SCOM-IMAGE';
            if (!self.isResizing || !toolbar) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            if (currentDot.classList.contains('topLeft')) {
                newWidth = self.currentWidth - deltaX;
                newHeight = self.currentHeight - deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, newHeight);
            } else if (currentDot.classList.contains('topRight')) {
                newWidth = self.currentWidth + deltaX;
                newHeight = self.currentHeight - deltaY;
                updateDimension(newWidth, newHeight);
            } else if (currentDot.classList.contains('bottomLeft')) {
                newWidth = self.currentWidth - deltaX;
                newHeight = self.currentHeight + deltaY;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, undefined);
            } else if (currentDot.classList.contains('bottomRight')) {
                newWidth = self.currentWidth + deltaX;
                newHeight = self.currentHeight + deltaY;
                updateDimension(newWidth, undefined);
            } else if (currentDot.classList.contains('top')) {
                newHeight = self.currentHeight - deltaY;
                updateDimension(undefined, newHeight);
            } else if (currentDot.classList.contains('bottom')) {
                newHeight = self.currentHeight + deltaY;
                if (isImage) {
                    newWidth = getNewWidth(newHeight);
                    updateDimension(newWidth, undefined);
                } else {
                    updateDimension(undefined, newHeight);
                }
            } else if (currentDot.classList.contains('left')) {
                newWidth = self.currentWidth - deltaX;
                self.currentElement.style.left = deltaX + 'px';
                updateDimension(newWidth, undefined);
            } else if (currentDot.classList.contains('right')) {
                newWidth = self.currentWidth + deltaX;
                updateDimension(newWidth, undefined);
            }
        }

        function mouseUpHandler(e: MouseEvent) {
            e.preventDefault();
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            self.removeDottedLines();
            toggleAllToolbarBoarder(false);
            self.isResizing = false;
            if (!toolbar) return;
            toolbar.width = 'initial';
            toolbar.height = 'initial';
            const contentStack = toolbar.querySelector('#contentStack') as Control;
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
            startX = 0;
        }

        function updateDimension(newWidth?: number, newHeight?: number) {
            toolbar.width = newWidth || 'auto';
            toolbar.height = newHeight || 'auto';
            const contentStack = toolbar.querySelector('#contentStack') as Control;
            if (contentStack) {
                contentStack.width = newWidth || 'auto';
                contentStack.height = newHeight || 'auto';
            }
        }

        function updateClass(elm: Control, className: string) {
            if (elm.visible && !elm.classList.contains('is-dragging')) {
                if (className === 'is-dragenter') {
                    removeMergeBlocks();
                }
                elm.classList.add(className);
                removeRectangles();
            } else {
                elm.classList.remove(className);
            }
        }

        function removeMergeBlocks() {
            const blocks = parentWrapper.getElementsByClassName('is-dragenter');
            for (let block of blocks) {
                block.classList.remove('is-dragenter');
            }
        }

        function findClosestToolbarInSection(section: Control, clientY: number): {toolbar: IDEToolbar; index: number} {
            if (!section) return;
            const toolbars = section.querySelectorAll('ide-toolbar');
            for (let i = 0; i < toolbars.length; i++) {
                const toolbarBound = toolbars[i].getBoundingClientRect();
                if (
                    (i == 0 && clientY <= toolbarBound.top) ||
                    (i == toolbars.length - 1 && clientY >= toolbarBound.bottom) ||
                    (toolbarBound.top <= clientY && toolbarBound.top + toolbarBound.height >= clientY)
                ) {
                    return {toolbar: toolbars[i] as IDEToolbar, index: i};
                }
            }
        }

        this.addEventListener('dragstart', function (event) {
            const eventTarget = event.target as Control;
            if (eventTarget instanceof PageRow) return;
            const targetSection = eventTarget.closest && (eventTarget.closest('ide-section') as PageSection);
            const targetToolbar = findClosestToolbarInSection(targetSection, event.clientY)?.toolbar;
            const toolbars = targetSection ? Array.from(targetSection.querySelectorAll('ide-toolbar')) : [];
            const cannotDrag = toolbars.find((toolbar) => {
                return toolbar.classList.contains('is-editing') || toolbar.classList.contains('is-setting');
            });
            const isCurrentTxt = targetToolbar?.classList.contains('is-textbox') && (!mouseDownEl || !mouseDownEl.closest('.dragger'));
            if (targetSection && (!cannotDrag && !isCurrentTxt)) {
                self.pnlRow.templateColumns = [`repeat(${self.maxColumn}, 1fr)`];
                self.currentElement = targetSection;
                startX = event.offsetX;
                startY = event.offsetY;

                if (targetToolbar?.classList.contains('active') || toolbars.length == 1)
                    application.EventBus.dispatch(EVENT.ON_SET_DRAG_TOOLBAR, targetToolbar);
                else self.currentToolbar = undefined;

                const allToolbars = parentWrapper.querySelectorAll('ide-toolbar');
                allToolbars.forEach((toolbar: IDEToolbar) => {
                    toolbar.hideToolbars();
                    toolbar.classList.remove('active');
                });

                self.currentElement.style.zIndex = '1';
                self.currentElement.classList.add('is-dragging');
                let dragElm = null;
                if (!self.currentToolbar || toolbars.length === 1) {
                    dragElm = self.currentElement;
                    const imgs = self.currentElement.querySelectorAll('img');
                    for (let img of imgs) {
                        (img as HTMLElement).setAttribute('draggable', 'false');
                    }
                } else {
                    dragElm = self.currentToolbar;
                    self.currentToolbar.style.zIndex = '1';
                    self.currentToolbar.classList.add('is-dragging');
                }
                ghostImage = dragElm.cloneNode(true) as Control;

                application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, targetSection);
                self.addDottedLines();
                toggleAllToolbarBoarder(true);
            } else {
                event.preventDefault();
            }
            dragStartTarget = eventTarget;
        });

        this.addEventListener('drag', function (event) {
            const toolbars = self.currentElement ? self.currentElement.querySelectorAll('ide-toolbar') : [];
            const dragElm = !self.currentToolbar || toolbars.length === 1 ? self.currentElement : self.currentToolbar;
            if (ghostImage) {
                ghostImage.style.position = 'absolute';
                ghostImage.style.opacity = '1';
                ghostImage.style.zIndex = '-1';
                ghostImage.style.pointerEvents = 'none';
                event.dataTransfer.setDragImage(ghostImage, startX, startY);
                dragElm.style.opacity = '0';
                ghostImage = null;
            }
        });

        document.addEventListener('dragend', function (event) {
            resetDragTarget();
            resetPageRow();
            toggleAllToolbarBoarder(false);
        });

        function toggleAllToolbarBoarder(toggle: boolean) {
            const toolbars = parentWrapper.querySelectorAll('ide-toolbar');
            if (toggle) {
                toolbars.forEach((toolbar) => {
                    // if (self.currentToolbar != toolbar) {
                    toolbar.classList.add('to-be-dropped');
                    // }
                });
            } else {
                toolbars.forEach((toolbar) => {
                    toolbar.classList.remove('to-be-dropped');
                });
            }
        }

        function resetPageRow() {
            self.pnlRow.minHeight = 'auto';
            self.toggleUI(!!self.data?.elements?.length);
        }

        function updateDropBlocksAndRectangle(enterTarget: Control, clientX: number, clientY: number) {
            if (!enterTarget /* || !self.currentElement*/) return;
            removeRectangles();
            if (enterTarget.closest('#pnlEmty')) {
                self.pnlRow.minHeight = '180px';
                self.toggleUI(true);
                self.addDottedLines();
                toggleAllToolbarBoarder(true);
                return;
            }

            const dragEnter = parentWrapper.querySelector('.is-dragenter') as Control;
            dragEnter && dragEnter.classList.remove('is-dragenter');

            const target: Control = findNearestFixedGridInRow(clientX);

            self.addDottedLines();
            toggleAllToolbarBoarder(true);

            if (self.isUngrouping()) {
                self.updateGridColumnWidth();
                const targetRow = target.closest('ide-row') as Control;
                const nearestDropSection = findNearestSectionInRow(targetRow as PageRow, clientX, clientY, false)
                const nearestDropSectionBound = nearestDropSection?.getBoundingClientRect() || {};
                const isFront = (clientX < nearestDropSectionBound.left) ? true : false;
                const dragSectionCol = parseInt(self.currentElement.dataset.column);
                const dragSectionColSpan = parseInt(self.currentElement.dataset.columnSpan);
                const newSectionData = getDropFrontBackResult(targetRow, nearestDropSection, dragSectionCol, dragSectionColSpan, isFront, self.currentToolbar.data);
                showRectangle(targetRow, newSectionData.newElmdata.column, newSectionData.newElmdata.columnSpan);
                return;
            }

            if (target) {
                const dropRow = target.closest('ide-row');
                let offsetLeft = 0;
                if (!getDragData()?.module) {
                    const dragRow = self.currentElement.closest('ide-row');
                    if (dragRow?.id && dropRow?.id && dragRow.id === dropRow.id) {
                        offsetLeft = Math.floor((startX + GAP_WIDTH) / (self._gridColumnWidth + GAP_WIDTH));
                    }
                }
                const targetCol = Number(target.dataset.column);
                let column: number;
                const exceedFrontLimit: boolean = targetCol - offsetLeft <= 0;
                const exceedBackLimit: boolean = targetCol - offsetLeft + Number(self.currentElement.dataset.columnSpan) > 12;
                if (exceedFrontLimit && !exceedBackLimit) {
                    column = 1;
                } else if (!exceedFrontLimit && exceedBackLimit) {
                    column = self.maxColumn - Number(self.currentElement.dataset.columnSpan) + 1;
                } else {
                    column = targetCol - offsetLeft;
                }
                const columnSpan = self.currentElement?.dataset.columnSpan
                    ? Number(self.currentElement.dataset.columnSpan)
                    : INIT_COLUMN_SPAN;
                const colSpan = Math.min(columnSpan, self.maxColumn);
                let colStart = Math.min(column, self.maxColumn);
                const sections = Array.from(dropRow?.querySelectorAll('ide-section'));
                const sortedSections = sections.sort(
                    (a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column)
                );
                let spaces = 0;
                let findedSection = null;
                let isUpdated: boolean = false;
                for (let i = 0; i < sortedSections.length; i++) {
                    const section = sortedSections[i] as Control;
                    const sectionColumn = Number(section.dataset.column);
                    const sectionColumnSpan = Number(section.dataset.columnSpan);
                    const sectionData = sectionColumn + sectionColumnSpan;
                    if (colStart >= sectionData && (self.maxColumn - colStart) + 1 < colSpan && !isUpdated) {
                        colStart = sectionData;
                        isUpdated = true;
                    }
                    const colData = colStart + colSpan;
                    if ((colStart >= sectionColumn && colData <= sectionData) || (colStart < sectionData && colData > sectionData)) {
                        findedSection = section;
                    }
                    if (self.currentElement?.id !== section.id) {
                        spaces += sectionColumnSpan;
                    }
                }
                self.updateGridColumnWidth();
                const targetRowPnl = target.closest('#pnlRow') as Control;
                showRectangle(targetRowPnl, colStart, Math.min(columnSpan, MAX_COLUMN - spaces));
            } else {
                const section = enterTarget.closest('ide-section') as Control;
                const isDraggingEl = section && section.classList.contains('is-dragging');
                if (section && section.id !== self.currentElement.id && !isDraggingEl) {
                    const toolbar = enterTarget.closest('ide-toolbar') as Control;
                    if (toolbar) {
                        const {y, height} = toolbar.getBoundingClientRect();
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
                        return !isNaN(column) && curElmCol + curElmColSpan === column;
                    }) as Control;
                    const showHiddenBlock =
                        (curElmCol === 1 && curElmCol + curElmColSpan === self.maxColumn + 1) ||
                        nextElm ||
                        curElmCol + curElmColSpan === self.maxColumn + 1;
                    if (showHiddenBlock) {
                        const {left, right} = section.getBoundingClientRect();
                        const backBlock = section.querySelector('.back-block') as Control;
                        const frontBlock = section.querySelector('.front-block') as Control;

                        if (backBlock) {
                            backBlock.visible = Math.abs(clientX - right) <= 15;
                            updateClass(backBlock, 'is-dragenter');
                        }

                        if (frontBlock) {
                            frontBlock.visible = Math.abs(clientX - left) <= 15 && curElmCol === 1;
                            updateClass(frontBlock, 'is-dragenter');
                        }
                    }
                }
            }
        }

        this.addEventListener('dragenter', function (event) {
            const eventTarget = event.target as HTMLElement;
            const elementConfig = getDragData();
            if (elementConfig?.module?.name === 'sectionStack') return;
            if (eventTarget && (eventTarget.classList.contains('fixed-grid-item') || eventTarget.classList.contains('fixed-grid'))) {
                updateDropBlocksAndRectangle(eventTarget as Control, event.clientX, event.clientY);
            }
        });

        this.addEventListener('dragover', function (event) {
            event.preventDefault();
            const eventTarget = event.target as Control;

            // prevent bad performance
            if (dragOverTarget == eventTarget && eventTarget.classList.contains('fixed-grid-item')) return;

            const elementConfig = getDragData();
            const isLayout = elementConfig?.module?.name === 'sectionStack';

            // temporary disable dragging layout to section
            if (isLayout) return;

            const dragStartTargetSection = (dragStartTarget) ? dragStartTarget.closest('ide-section') as HTMLElement : undefined;
            const dragDropResult = checkDragDropResult({
                dropTarget: eventTarget,
                dragSection: dragStartTargetSection,
                dragToolbar: (self.currentToolbar)? self.currentToolbar : undefined,
                clientX: event.clientX,
                clientY: event.clientY,
                startX: startX,
                isUngroup: self.isUngrouping(),
                isLayout: isLayout,
                layoutLength: isLayout? elementConfig?.module?.elements?.length : undefined
            });

            if (dragDropResult.canDrop && dragDropResult.details) {

                // dragover rowBlock
                if (dragDropResult.details.rowBlock) {
                    updateClass(dragDropResult.details.rowBlock as Control, 'is-dragenter');
                }

                // dragover section
                else if (dragDropResult.details.section && dragDropResult.details.dropSide) {

                    // show section's front/back block
                    if (dragDropResult.details.isMouseOn) {
                        const section = dragDropResult.details.section;
                        if (dragDropResult.details.dropSide == "front") {
                            const frontBlock = section.querySelector('.front-block') as Control;
                            if (frontBlock) {
                                frontBlock.visible = true;
                                updateClass(frontBlock, 'is-dragenter');
                            }
                        } else if (dragDropResult.details.dropSide == "back") {
                            const backBlock = section.querySelector('.back-block') as Control;
                            if (backBlock) {
                                backBlock.visible = true;
                                updateClass(backBlock, 'is-dragenter');
                            }
                        } else {
                            console.error("Section's dropSide can only be 'front' or 'back'")
                        }
                    }

                    // show frame
                    else {
                        updateDropBlocksAndRectangle(eventTarget, event.clientX, event.clientY);
                    }
                }

                // dragover toolbar(element)
                else if (dragDropResult.details.toolbar && dragDropResult.details.dropSide) {
                    const toolbar = dragDropResult.details.toolbar;
                    if (dragDropResult.details.dropSide == "top") {
                        const topBlock = toolbar.querySelector('.top-block') as Control;
                        if (topBlock) {
                            topBlock.visible = true;
                            updateClass(topBlock, 'is-dragenter');
                        }
                    } else if (dragDropResult.details.dropSide == "bottom") {
                        const bottomBlock = toolbar.querySelector('.bottom-block') as Control;
                        if (bottomBlock) {
                            bottomBlock.visible = true;
                            updateClass(bottomBlock, 'is-dragenter');
                        }
                    } else {
                        console.error("Toolbar(element)'s dropSide can only be 'top' or 'bottom'")
                    }
                }

                // dragover empty space, show frame
                else { 
                    updateDropBlocksAndRectangle(eventTarget , event.clientX, event.clientY);
                }
            }
            dragOverTarget = eventTarget;
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

        this.addEventListener('drop', async function (event) {
            self.pnlRow.minHeight = 'auto';
            const elementConfig = getDragData();
            if (elementConfig?.module) {
                const widgetModal = parentWrapper.querySelector('#mdWidget') as Modal;
                if (widgetModal) widgetModal.visible = false;
            }
            const eventTarget = event.target as Control;
            const pageRow = eventTarget.closest('ide-row') as PageRow;
            event.preventDefault();
            event.stopPropagation();

            self.removeDottedLines();
            toggleAllToolbarBoarder(false);
            removeRectangles();

            if (pageRow && elementConfig?.module?.name === 'sectionStack') {
                // add section
                application.EventBus.dispatch(EVENT.ON_ADD_SECTION, {
                    prependId: pageRow.id,
                    elements: elementConfig.elements,
                });
                return;
            }

            // if (!self.currentElement) return;

            const isUngrouping: boolean = self.isUngrouping();
            const dragStartTargetSection = (dragStartTarget) ? dragStartTarget.closest('ide-section') as HTMLElement : undefined;
            const isLayout = elementConfig?.module?.name === 'sectionStack';
            const dragDropResult = checkDragDropResult({
                dropTarget: eventTarget,
                dragSection: dragStartTargetSection,
                dragToolbar: (self.currentToolbar)? self.currentToolbar : undefined,
                clientX: event.clientX,
                clientY: event.clientY,
                startX: startX,
                isUngroup: self.isUngrouping(),
                isLayout: isLayout,
                layoutLength: isLayout? elementConfig?.module?.elements?.length : undefined
            });

            if (dragDropResult.canDrop && dragDropResult.details) {

                // let dropElm = parentWrapper.querySelector('.is-dragenter') as Control;
                const dropSection = dragDropResult.details.section as Control;

                // drop on rowBlock
                if (dragDropResult.details.rowBlock) {
                    const targetRow = dragDropResult.details.rowBlock.closest('ide-row') as PageRow;
                    // TODO: accept layout
                    if (dragDropResult.details.rowBlock.classList.contains('row-top-block')) {
                        targetRow && self.onPrependRow(targetRow);
                    } else if (dragDropResult.details.rowBlock.classList.contains('row-bottom-block')) {
                        targetRow && self.onAppendRow(targetRow);
                    } else {
                        console.error("no rowBlock found")
                    }
                }

                else if (dragDropResult.details.section && dragDropResult.details.dropSide) {
                    // drop on section && merge with section's front/back block
                    if (dragDropResult.details.isMouseOn) {
                        if (isUngrouping) {
                            const dragCmd = new UngroupElementCommand(
                                self.currentToolbar,
                                self.currentElement,
                                eventTarget,
                                {id: generateUUID()},
                                dragDropResult.details.dropSide,
                                event.clientX,
                                event.clientY
                            );
                            dragCmd && commandHistory.execute(dragCmd);
                            resetDragTarget();
                        } else {
                            const isAppend = dragDropResult.details.dropSide == "back";
                            const dropBlock = isAppend? dropSection.querySelector('.front-block') : dropSection.querySelector('.back-block');

                            const dragCmd = elementConfig
                                // TODO: accept layout
                                ? new AddElementCommand(self.getNewElementData(), isAppend, false, dropBlock as Control, null)
                                : new DragElementCommand(self.currentElement, dropBlock as Control, isAppend);
                            await commandHistory.execute(dragCmd);
                        }
                    }

                    // ungroup/drag elm to empty space + collision
                    else {
                        if (isUngrouping) {
                            const dragCmd = new UngroupElementCommand(
                                self.currentToolbar,
                                self.currentElement,
                                eventTarget,
                                {id: generateUUID()},
                                'none', // Todo
                                event.clientX,
                                event.clientY
                            );
                            dragCmd && commandHistory.execute(dragCmd);
                            resetDragTarget();
                        } else {
                            const isAppend = dragDropResult.details.dropSide == "back";
                            const dropBlock = isAppend? dropSection.querySelector('.front-block') : dropSection.querySelector('.back-block');
                            const dragCmd = elementConfig
                                // TODO: accept layout
                                ? new AddElementCommand(self.getNewElementData(), isAppend, false, dropSection, null)
                                : new DragElementCommand(self.currentElement, dropBlock as Control, isAppend);
                            await commandHistory.execute(dragCmd);
                        }
                    }
                }

                // drop on toolbar(element)
                else if (dragDropResult.details.toolbar && dragDropResult.details.dropSide) {
                    if (isUngrouping) {
                        const dropElement = eventTarget;
                        const config = {id: generateUUID()};
                        const dragCmd = new UngroupElementCommand(
                            self.currentToolbar,
                            self.currentElement,
                            dropElement,
                            config,
                            dragDropResult.details.dropSide,
                            event.clientX,
                            event.clientY
                        );
                        dragCmd && commandHistory.execute(dragCmd);
                        resetDragTarget();
                    } else {
                        const newConfig = self.getNewElementData();
                        const dragCmd = new GroupElementCommand(
                            dragDropResult.details.toolbar as Control,
                            elementConfig ? null : self.currentElement,
                            {...newConfig, firstId: generateUUID()},
                            dragDropResult.details.dropSide == "bottom"
                        );
                        commandHistory.execute(dragCmd);
                    }
                }

                // ungroup/drag elm to empty space + no collision
                else {
                    if (isUngrouping) {
                        const config = {id: generateUUID()};
                        const dragCmd = new UngroupElementCommand(
                            self.currentToolbar,
                            self.currentElement,
                            eventTarget,
                            config,
                            'none',
                            event.clientX,
                            event.clientY
                        );
                        dragCmd && commandHistory.execute(dragCmd);
                        resetDragTarget();
                    } else {
                        const offsetLeft = Math.floor((startX + GAP_WIDTH) / (self.gridColumnWidth + GAP_WIDTH));
                        let nearestFixedItem = dragDropResult.details.nearestPanel;
                        let column = Number(nearestFixedItem.dataset.column);

                        const exceedFrontLimit: boolean = column - offsetLeft <= 0;
                        const exceedBackLimit: boolean = column - offsetLeft + Number(self.currentElement.dataset.columnSpan) > 12;
                        let targetCol: number;
                        if (exceedFrontLimit && !exceedBackLimit) {
                            targetCol = 1;
                        } else if (!exceedFrontLimit && exceedBackLimit) {
                            targetCol = self.maxColumn - Number(self.currentElement.dataset.columnSpan) + 1;
                        } else {
                            targetCol = column - offsetLeft;
                        }

                        nearestFixedItem = pageRow.querySelector(`.fixed-grid-item[data-column='${targetCol}']`)

                        const dragCmd = (elementConfig)?
                            new AddElementCommand(
                                self.getNewElementData(),
                                true, false,
                                nearestFixedItem as Control,
                                pageRow
                            ) :
                            new DragElementCommand(
                                self.currentElement,
                                nearestFixedItem as Control,
                                true, false
                            );
                        dragCmd && commandHistory.execute(dragCmd);
                    }
                }
            }
            removeMergeBlocks();
        });

        function resetDragTarget() {
            updateDraggingUI();
            self.currentElement = null;
            dragStartTarget = null;
            dragOverTarget = null;
            application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, null);
            self.isDragging = false;
            setDragData(null);
            self.removeDottedLines();
            toggleAllToolbarBoarder(false);
            removeRectangles();
            removeClass('is-dragenter');
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

        function showRectangle(targetRow: HTMLElement, colStart: number, columnSpan: number) {
            removeRectangles();
            const rectangle = targetRow.querySelector(`.rectangle`) as Control;
            if (!rectangle) return;
            rectangle.style.display = 'block';
            rectangle.style.left = (self._gridColumnWidth + GAP_WIDTH) * (colStart - 1) + 'px';
            rectangle.style.width = self._gridColumnWidth * columnSpan + GAP_WIDTH * (columnSpan - 1) + 'px';
        }

        function removeRectangles() {
            const rectangles = parentWrapper.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
        }

        function updateDraggingUI() {
            if (self.currentElement) {
                self.currentElement.opacity = 1;
                self.currentElement.style.zIndex = '';
                self.currentElement.classList.remove('is-dragging');
            }
            if (self.currentToolbar) {
                self.currentToolbar.opacity = 1;
                self.currentToolbar.style.zIndex = '';
                self.currentToolbar.classList.remove('is-dragging');
            }
        }
    }

    async onPrependRow(pageRow: PageRow) {
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, {appendId: pageRow.id});
        const newPageRow = pageRow.previousElementSibling as PageRow;
        const config = {id: generateUUID()};
        if (newPageRow) {
            const dragCmd = getDragData()
                // TODO: accept layout
                ? new AddElementCommand(this.getNewElementData(), true, true, null, newPageRow)
                : this.isUngrouping()
                ? new UngroupElementCommand(this.currentToolbar, this.currentElement, newPageRow, config, 'none')
                : new DragElementCommand(this.currentElement, newPageRow, true, true);
            await commandHistory.execute(dragCmd);
        }
    }

    async onAppendRow(pageRow: PageRow) {
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, {prependId: pageRow.id});
        const newPageRow = pageRow.nextElementSibling as PageRow;
        const config = {id: generateUUID()};
        if (newPageRow) {
            const dragCmd = getDragData()
                // TODO: accept layout
                ? new AddElementCommand(this.getNewElementData(), true, true, null, newPageRow)
                : this.isUngrouping()
                ? new UngroupElementCommand(this.currentToolbar, this.currentElement, newPageRow, config, 'none')
                : new DragElementCommand(this.currentElement, newPageRow, true, true);
            await commandHistory.execute(dragCmd);
        }
    }

    async onAddRow() {
        const dragCmd = getDragData()
            ? new AddElementCommand(this.getNewElementData(), true, true, null, this)
            : new DragElementCommand(this.currentElement, this, true, true);
        await commandHistory.execute(dragCmd);
    }

    private isUngrouping() {
        if (!this.currentToolbar || getDragData()) return false;
        const section = this.currentToolbar.closest('ide-section');
        const toolbars = section.querySelectorAll('ide-toolbar');
        return toolbars && toolbars.length && toolbars.length > 1 ? true : false;
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_SET_DRAG_ELEMENT, async (el: any) => (this.currentElement = el));
        application.EventBus.register(this, EVENT.ON_SET_DRAG_TOOLBAR, async (el: any) => (this.currentToolbar = el));
        application.EventBus.register(this, EVENT.ON_UPDATE_PAGE_CONFIG, async (data: any) => {
            const {config, rowsConfig} = data;
            if (!config) return;
            const id = this.id.replace('row-', '');
            const sectionConfig = pageObject.getRowConfig(id) || {};
            const pageConfig = getPageConfig();
            const combinedPageConfig = {...pageConfig, ...config};
            sectionConfig.sectionWidth = combinedPageConfig.sectionWidth || 1000;
            sectionConfig.customWidgetsBackground = combinedPageConfig.customWidgetsBackground;
            sectionConfig.customWidgetsColor = combinedPageConfig.customWidgetsColor;
            sectionConfig.widgetsBackground = combinedPageConfig.widgetsBackground;
            sectionConfig.widgetsColor = combinedPageConfig.widgetsColor;
            if(sectionConfig.padding) {
                if(sectionConfig.padding.top === undefined && sectionConfig.padding.bottom === undefined && combinedPageConfig.ptb !== undefined) {
                    sectionConfig.padding.top = sectionConfig.padding.bottom = combinedPageConfig.ptb;
                }
                if(sectionConfig.padding.left === undefined && sectionConfig.padding.right === undefined && combinedPageConfig.plr !== undefined) {
                    sectionConfig.padding.left = sectionConfig.padding.right = combinedPageConfig.plr;
                }
            }
            pageObject.updateSection(id, {config: JSON.parse(JSON.stringify(sectionConfig))});
            if (sectionConfig.backgroundColor && sectionConfig.customBackground)
                this.pnlRowContainer.style.setProperty('--custom-background-color', sectionConfig.backgroundColor)
            else
                this.pnlRowContainer.style.removeProperty('--custom-background-color')
            if (sectionConfig.customTextColor && sectionConfig.textColor)
                this.pnlRowContainer.style.setProperty('--custom-text-color', sectionConfig.textColor)
            else
                this.pnlRowContainer.style.removeProperty('--custom-text-color')
            for (let i = this.classList.length - 1; i >= 0; i--) {
                const className = this.classList[i];
                if (className.startsWith('font-')) {
                    this.classList.remove(className);
                }
            }
            Reflect.deleteProperty(sectionConfig, 'backgroundColor')
            Reflect.deleteProperty(sectionConfig, 'textColor')
            this.updateRowConfig(sectionConfig);
            this.updateGridColumnWidth();
        });
    }

    showSection(rowId: string) {
        if (rowId == this.rowId)
            this.setActive();
        this.currentToolbar = undefined;
    }

    showBottomBlock() {
        const PageRows = this.closest('ide-rows');
        if (!PageRows) return;

        const bottomBlock = this.querySelector('.row-bottom-block') as Control;

        if (bottomBlock) {
            bottomBlock.visible = true;

            const blocks = PageRows.getElementsByClassName('is-dragenter');
            for (let block of blocks) {
                block.classList.remove('is-dragenter');
            }
            bottomBlock.classList.add('is-dragenter');
        }
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
            if ((fixedGridItems[i] as any).dataset.column == 0) fixedGridItems[i].classList.add('border-x-dotted-left');
            else if ((fixedGridItems[i] as any).dataset.column == MAX_COLUMN) fixedGridItems[i].classList.add('border-x-dotted-right');
            else fixedGridItems[i].classList.add('border-x-dotted');
        }
        const fixedGrids = document.getElementsByClassName('fixed-grid');
        for (let i = 0; i < fixedGrids.length; i++) {
            fixedGrids[i].classList.add('border-dotted');
        }
    }

    private removeDottedLines() {
        const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
        for (let i = 0; i < fixedGridItems.length; i++) {
            if ((fixedGridItems[i] as any).dataset.column == 0) fixedGridItems[i].classList.remove('border-x-dotted-left');
            else if ((fixedGridItems[i] as any).dataset.column == MAX_COLUMN) fixedGridItems[i].classList.remove('border-x-dotted-right');
            else fixedGridItems[i].classList.remove('border-x-dotted');
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
                toolbars.forEach((toolbar: IDEToolbar) => toolbar.hideToolbars());
            }
        }
        this.classList.add('active');
        const parent = this.closest('#editor') || document;
        const menu = parent.querySelector('i-scom-page-builder-menu') as PageMenu;
        menu?.setfocusCard(this.rowId);
    }

    private onAddSection(type: number) {
        const prependId = type === 1 ? this.id : '';
        const appendId = type === -1 ? this.id : '';
        application.EventBus.dispatch(EVENT.ON_ADD_SECTION, {prependId, appendId});
    }

    render() {
        return (
            <i-panel
                id="pnlRowContainer"
                class={'page-row-container'}
                height="100%"
                margin={{
                    top: 0,
                    bottom: 0,
                    left: 'auto',
                    right: 'auto'
                }}
                background={{color: 'var(--custom-background-color, var(--background-main))'}}
                font={{color: 'var(--custom-text-color, var(--text-primary))'}}
            >
                <i-panel
                    id="pnlRowWrap"
                    class={'page-row'} width="100%" height="100%"
                >
                    <i-button
                        caption=""
                        icon={{
                            name: 'plus',
                            width: 14,
                            height: 14,
                            fill: Theme.colors.primary.contrastText,
                        }}
                        background={{color: Theme.colors.primary.main}}
                        padding={{top: 5, bottom: 5, left: 5, right: 5}}
                        top="-12px"
                        left="50%"
                        zIndex={970}
                        class="btn-add"
                        onClick={() => this.onAddSection(-1)}
                    ></i-button>
                    <i-vstack id={'actionsBar'} class="row-actions-bar" verticalAlignment="center">
                        <i-vstack
                            background={{color: '#fff'}}
                            border={{radius: 5}}
                            maxWidth="100%"
                            maxHeight="100%"
                            horizontalAlignment="center"
                            padding={{top: 4, bottom: 4, left: 4, right: 4}}
                            gap="0.25rem"
                            class="bar-shadow"
                            zIndex={979}
                        >
                            <i-panel
                                class="actions"
                                tooltip={{content: 'Section settings', placement: 'right'}}
                                visible={this.isChanged}
                                onClick={() => this.onOpenRowSettingsDialog()}
                            >
                                <i-icon name="cog" width={16} height={16} fill="#80868b"></i-icon>
                            </i-panel>
                            <i-panel
                                id="btnClone"
                                class="actions"
                                tooltip={{content: 'Duplicate section', placement: 'right'}}
                                visible={this.isCloned}
                                onClick={this.onClone}
                            >
                                <i-icon name="clone" width={16} height={16} fill="#80868b"></i-icon>
                            </i-panel>
                            <i-panel
                                id="btnDelete"
                                class="actions delete"
                                tooltip={{content: 'Delete section', placement: 'right'}}
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
                        <i-grid-layout verticalAlignment="center" autoFillInHoles={true} columnsPerRow={2} class="main-drag">
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
                        verticalAlignment="center"
                        horizontalAlignment="center"
                        class="pnl-empty"
                    >
                        <i-vstack
                            id="pnlLoading"
                            padding={{top: '0.5rem', bottom: '0.5rem'}}
                            visible={false}
                            height="100%"
                            width="100%"
                            class="i-loading-overlay"
                        >
                            <i-vstack class="i-loading-spinner" horizontalAlignment="center" verticalAlignment="center">
                                <i-icon
                                    class="i-loading-spinner_icon"
                                    name="spinner"
                                    width={24}
                                    height={24}
                                    fill={Theme.colors.primary.main}
                                />
                                <i-label
                                    caption="Loading..."
                                    font={{color: Theme.colors.primary.main, size: '1rem'}}
                                    class="i-loading-spinner_text"
                                />
                            </i-vstack>
                        </i-vstack>
                        <i-panel
                            padding={{top: '3rem', bottom: '3rem'}}
                            margin={{top: '3rem', bottom: '3rem'}}
                            width="100%"
                            border={{
                                width: '1px',
                                style: 'dashed',
                                color: 'var(--builder-divider)',
                            }}
                            class="text-center"
                        >
                            <i-label
                                caption="Drag Elements Here"
                                font={{
                                    transform: 'uppercase',
                                    color: 'var(--custom-text-color, var(--text-primary))',
                                    size: '1.25rem',
                                }}
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
                    <ide-row-settings-dialog id="mdRowSetting" onSave={this.onSaveRowSettings.bind(this)}></ide-row-settings-dialog>
                    <i-button
                        caption=""
                        icon={{
                            name: 'plus',
                            width: 14,
                            height: 14,
                            fill: Theme.colors.primary.contrastText,
                        }}
                        background={{color: Theme.colors.primary.main}}
                        padding={{top: 5, bottom: 5, left: 5, right: 5}}
                        bottom="-12px"
                        left="50%"
                        zIndex={970}
                        class="btn-add"
                        onClick={() => this.onAddSection(1)}
                    ></i-button>
                </i-panel>
            </i-panel>
        );
    }
}
