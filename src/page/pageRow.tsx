import {
    Module,
    customElements,
    application,
    ControlElement,
    Control,
    VStack,
    observable,
    GridLayout
} from '@ijstech/components';
import { PageSection } from './pageSection';
import './pageRow.css';
import { EVENT } from '../const/index';
import { IPageSection } from '../interface/index';
import { pageObject } from '../store/index';
import { commandHistory, ElementCommand, ResizeElementCommand } from '../utility/index';

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

    private rowData: IPageSection;
    private _readonly: boolean;
    private isResizing: boolean = false;
    private currentWidth: number;
    private currentHeight: number;
    private currentElement: PageSection;

    @observable()
    private isCloned: boolean = true;
    @observable()
    private isChanged: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_RESIZE, this.onResized);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.renderFixedGrid();
        this.initEventBus();
        this.initEventListeners();
    }

    private async createNewElement(i: number) {
        const sectionData = this.rowData.elements[i];
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
            pageSection.style.gridColumn = `${sectionData.column || 1} / span ${sectionData.columnSpan || 1}`;
            pageSection.setAttribute('data-column', `${sectionData.column || 1}`);
            pageSection.setAttribute('data-column-span', `${sectionData.columnSpan || 1}`);
        }
        this.pnlRow.appendChild(pageSection);
        await pageSection.setData(this.rowData.id, sectionData);
        return pageSection;
    }

    // private appendColumnsLayout(col: number) {
    //     const length = this.pnlElements.children.length;
    //     for (let i = 0; i < col; i++) {
    //         const el = <i-vstack id={`dropzone-tmp-${length + i}`} opacity={0} class="dropzone"></i-vstack>;
    //         this.pnlElements.appendChild(el);
    //     }
    // }

    // async setData(rowData: IPageSection) {
    //     this.pnlElements.clearInnerHTML();
    //     this.rowData = rowData;
    //     const { id, row, image, elements, backgroundColor } = this.rowData;

    //     this.id = `row-${id}`;
    //     this.setAttribute('row', `${row}`);
    //     if (image)
    //         this.background.image = image;
    //     else if(backgroundColor)
    //         this.background.color = backgroundColor;

    //     this.isCloned = this.parentElement.nodeName !== 'BUILDER-HEADER';
    //     this.isChanged = this.parentElement.nodeName !== 'BUILDER-HEADER';

    //     const unitWidth = Number(this.pnlElements.offsetWidth) / 12;
    //     if (elements && elements.length > 0) {
    //         if (elements.length === 1 && elements[0]?.properties?.width === '100%') {
    //             await this.createNewElement(0);
    //             this.pnlElements.templateColumns = ['repeat(1, 1fr)'];
    //         } else {
    //             const columns = elements.length;
    //             const configColumns = columns > 12 ? 12 : columns;
    //             let missingCols = 12 - configColumns;
    //             for (let i = 0; i < elements.length; i++) {
    //                 const pageSection = await this.createNewElement(i);
    //                 const ratio = Math.ceil(Number(pageSection.width) / unitWidth);
    //                 missingCols -= (ratio - 1);
    //             }
    //             for (let i = 0; i < missingCols; i++) {
    //                 const el = <i-vstack id={`dropzone${i}`} opacity={0} class="dropzone"></i-vstack>;
    //                 this.pnlElements.appendChild(el);
    //             }
    //             this.pnlElements.templateColumns = ['minmax(auto, 100%)', `repeat(${missingCols + configColumns - 1}, ${unitWidth}px)`];
    //         }
    //     }
    //     this.actionsBar.minHeight = '100%';
    // }

    private async clearData() {
        const children = this.pnlRow.querySelectorAll('ide-section');
        if (children && children.length)
            children.forEach(item => item.remove());
    }

    async setData(rowData: IPageSection) {
        this.clearData();
        this.rowData = rowData;
        const { id, row, image, elements, backgroundColor } = this.rowData;

        this.id = `row-${id}`;
        this.setAttribute('row', `${row}`);
        if (image)
            this.background.image = image;
        else if(backgroundColor)
            this.background.color = backgroundColor;

        this.isCloned = this.parentElement.nodeName !== 'BUILDER-HEADER';
        this.isChanged = this.parentElement.nodeName !== 'BUILDER-HEADER';

        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                await this.createNewElement(i);
            }
        }
        this.actionsBar.minHeight = '100%';
    }

    onOpenRowSettingsDialog() {
        // this.rowSettings.setConfig(this.rowData.config);
        // this.rowSettings.show();
    }

    private async onClone() {
        const rowData = pageObject.getSection(this.rowData.id); // await this.getData();
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, { rowData, id: this.id });
    }

    private onResized(data: any) {
        // const unitWidth = Number(this.pnlElements.offsetWidth) / 12;
        // const { newWidth, oldWidth } = data;
        // let list = Array.from(this.pnlElements.children);
        // if (newWidth > oldWidth) {
        //     let ratio = Math.ceil(newWidth / unitWidth);
        //     for (let i = list.length - 1; i >= 0 && ratio !== 1; i--) {
        //         const node = list[i] as Control;
        //         if (node.nodeName !== 'IDE-SECTION') {
        //             this.pnlElements.removeChild(node);
        //             ratio--;
        //         }
        //     }
        // } else {
        //     let ratio = Math.ceil((oldWidth - newWidth) / unitWidth);
        //     this.appendColumnsLayout(ratio - 1);
        // }
        // let templateColumns = [];
        // list = Array.from(this.pnlElements.children);
        // for (let i = 0; i < list.length; i++) {
        //     const node = list[i] as Control;
        //     templateColumns.push(node.nodeName === 'IDE-SECTION' ? 'minmax(auto, 100%)' : `${unitWidth}px`);
        // }
        // this.pnlElements.templateColumns = templateColumns;
    }

    onDeleteRow() {
        // this.remove();
        // application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
        const rowCmd = new ElementCommand(this, this.parent, this.rowData, true);
        commandHistory.execute(rowCmd);
    }

    onMoveUp() {
        this.actionsBar.classList.add('hidden');
        this.dragStack.classList.add('hidden');
        this.background = {color: '#f2f2f2'};
    }
    onMoveDown() {
        this.actionsBar.classList.remove('hidden');
        this.dragStack.classList.remove('hidden');
        this.background = {color: 'initial'};
    }

    private renderFixedGrid() {
        this.pnlRow.clearInnerHTML();
        this.pnlRow.appendChild(
            <i-panel class="rectangle"></i-panel>
        )
        const grid = (
            <i-grid-layout
                position="absolute"
                width="100%" height="100%"
                top="0px" left="0px"
                class="fixed-grid"
            ></i-grid-layout>
        )
        for (let i = 0; i < 12; i++) {
            const elm = (
                <i-panel class="fixed-grid-item"></i-panel>
            );
            elm.setAttribute('data-column', `${i + 1}`);
            elm.style.gridColumn = `${i + 1}`;
            grid.append(elm);
        }
        this.pnlRow.appendChild(grid);
    }

    private initEventListeners() {
        let self = this;
        let newWidth: number = 0;
        let newHeight: number = 0;
        let newLeft: number = 0;
        let currentDot: Control;
        let startX: number = 0;
        let startY: number = 0;
        let grids = document.getElementsByClassName('grid');
        const gapWidth = 15;
        const gridColumnWidth = (this.pnlRow.offsetWidth - gapWidth * 11) / 12;
        for (const grid of grids) {
            const gridElm = grid as GridLayout;
            gridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
            gridElm.gap = {column: `${gapWidth}px`};
        }

        let fixedGrids = document.getElementsByClassName('fixed-grid');
        for (const fixedGrid of fixedGrids) {
            const fixedGridElm = fixedGrid as GridLayout;
            fixedGridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
            fixedGridElm.gap = {column: `${gapWidth}px`};
        }

        function addDottedLines() {
            const fixedGridItems = document.getElementsByClassName("fixed-grid-item");
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.add('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName("fixed-grid");
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.add('border-dotted');
            }
        }

        function removeDottedLines() {
            const fixedGridItems = document.getElementsByClassName("fixed-grid-item");
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.remove('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName("fixed-grid");
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.remove('border-dotted');
            }
        }

        document.addEventListener("mousedown", e => {
            const target = e.target as Control;
            const parent = target.closest('.resize-stack') as Control;
            if (!parent) return;
            e.preventDefault();
            const resizableElm = target.closest('ide-section') as PageSection;
            self.currentElement = resizableElm;
            addDottedLines();
            this.isResizing = true;
            currentDot = parent;
            startX = e.clientX;
            startY = e.clientY;
            this.currentWidth = resizableElm.offsetWidth;
            this.currentHeight = resizableElm.offsetHeight;
        });

        document.addEventListener("mouseup", e => {
            e.preventDefault();
            if (!self.currentElement) return;
            this.isResizing = false;
            removeDottedLines();
            const width = newWidth;
            const numberOfColumns = Math.ceil((width + gapWidth) / (gridColumnWidth + gapWidth));
            const colSpan = Math.min(numberOfColumns, 12);
            const columnStart = Math.ceil((Number(self.currentElement.left) + gapWidth) / (gridColumnWidth + gapWidth));
            const colStart = Math.min(columnStart, (12 - colSpan) + 1);
            self.currentElement.setAttribute('data-column-span', `${colSpan}`);
            self.currentElement.style.gridColumn = `${colStart} / span ${colSpan}`;
            self.currentElement.style.width = 'initial';
            self.currentElement.style.left = 'initial';
            self.currentElement.style.height = 'initial';
            const resizeCmd = new ResizeElementCommand(self.currentElement, this.currentWidth, this.currentHeight);
            commandHistory.execute(resizeCmd);
            self.currentElement = null;
        });

        document.addEventListener("mousemove", e => {
            if (!this.isResizing) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (currentDot.classList.contains("topLeft")) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight - deltaY;
                newLeft = deltaX;
                self.currentElement.left = deltaX + "px"
                self.currentElement.width = newWidth + "px";
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("topRight")) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight - deltaY;
                self.currentElement.width = newWidth + "px";
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("bottomLeft")) {
                newWidth = this.currentWidth - deltaX;
                newHeight = this.currentHeight + deltaY;
                newLeft = deltaX;
                self.currentElement.left = deltaX + "px"
                self.currentElement.width = newWidth + "px";
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("bottomRight")) {
                newWidth = this.currentWidth + deltaX;
                newHeight = this.currentHeight + deltaY;
                self.currentElement.width = newWidth + "px";
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("top")) {
                newHeight = this.currentHeight - deltaY;
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("bottom")) {
                newHeight = this.currentHeight + deltaY;
                self.currentElement.height = newHeight + "px";
            } else if (currentDot.classList.contains("left")) {
                newWidth = this.currentWidth - deltaX;
                self.currentElement.left = deltaX + "px"
                self.currentElement.width = newWidth + "px";
            } else if (currentDot.classList.contains("right")) {
                newWidth = this.currentWidth + deltaX;
                self.currentElement.width = newWidth + "px";
            }
        })

        document.addEventListener("dragstart", function (event) {
            const target = (event.target as Control).closest('ide-section') as PageSection;
            if (target) {
                self.currentElement = target;
                self.currentElement.opacity = 0;
                addDottedLines();
            } else {
                event.preventDefault();
            }
        });

        document.addEventListener("drag", function (event) {});

        document.addEventListener("dragend", function (event) {
            if (self.currentElement) self.currentElement.opacity = 1;
            self.currentElement = null;
            removeDottedLines();
            let rectangles = document.getElementsByClassName('rectangle');
            for (const rectangle of rectangles) {
                (rectangle as Control).style.display = 'none';
            }
        });

        document.addEventListener("dragenter", function (event) {
            const target = (event.target as Control).closest('.fixed-grid-item') as Control;
            if (target) {
                const column = Number(target.getAttribute('data-column'));
                const rectangle = target.closest('.fixed-grid').parentNode.querySelector(`.rectangle`) as Control;
                rectangle.style.display = 'block';
                const columnSpan = Number(self.currentElement.dataset.columnSpan);
                const colSpan = Math.min(columnSpan, 12);
                const colStart = Math.min(column, (12 - colSpan) + 1);
                rectangle.style.left = (gridColumnWidth + gapWidth) * (colStart - 1) + 'px';
                rectangle.style.width = (gridColumnWidth * columnSpan) + (gapWidth * (columnSpan - 1)) + 'px';
            }
        });

        document.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        document.addEventListener("dragleave", function (event) {
            const target = (event.target as Control).closest('.fixed-grid-item') as Control;
            if (target) {
                target.style.border = "";
                let rectangles = document.getElementsByClassName('rectangle');
                for (const rectangle of rectangles) {
                    (rectangle as Control).style.display = 'none';
                }
            }
        });

        document.addEventListener("drop", function (event) {
            event.preventDefault();
            const target = (event.target as Control).closest('.fixed-grid-item') as Control;
            if (target) {
                target.style.border = "";
                const column = Number(target.getAttribute('data-column'));
                const grid = target.closest('.grid');
                const columnSpan = Number(self.currentElement.dataset.columnSpan);
                let startCol = column;
                let distance = (12 - columnSpan) + 1;
                if (columnSpan > 1 && column > distance) {
                    startCol = distance;
                }
                self.currentElement.style.gridRow = '1';
                self.currentElement.style.gridColumn = `${startCol} / span ${columnSpan}`;
                self.currentElement.setAttribute('data-column', `${startCol}`);
                grid.appendChild(self.currentElement);
            }
        });
    }

    render() {
        return (
            <i-panel class={'page-row'} width="100%" height="100%" padding={{left: '3rem', right: '3rem'}}>
                <i-vstack
                    id={'actionsBar'}
                    class="row-actions-bar"
                    verticalAlignment="center"
                >
                    <i-panel
                        background={{color: '#fff'}}
                        border={{radius: '20px'}}
                        maxWidth="100%"
                        maxHeight="100%"
                    >
                        <i-panel
                            id="btnSetting"
                            class="actions"
                            tooltip={{content: 'Section colors', placement: 'right'}}
                            visible={this.isChanged}
                            onClick={this.onOpenRowSettingsDialog}
                        >
                            <i-icon name="palette"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnClone"
                            class="actions"
                            tooltip={{content: 'Duplicate section', placement: 'right'}}
                            visible={this.isCloned}
                            onClick={this.onClone}
                        >
                            <i-icon name="clone"></i-icon>
                        </i-panel>
                        <i-panel
                            id="btnDelete"
                            class="actions delete"
                            tooltip={{content: 'Delete section', placement: 'right'}}
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
                    left="0px" top="0px"
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
            </i-panel>
        );
    }
}
