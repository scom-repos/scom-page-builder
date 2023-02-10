import {
    Module,
    customElements,
    application,
    ControlElement,
    Control,
    VStack,
    observable,
    GridLayout,
    Panel
} from '@ijstech/components';
import { PageSection } from './pageSection';
import './pageRow.css';
import { EVENT } from '../const/index';
import { IPageSection } from '../interface/index';
import { pageObject } from '../store/index';
import { commandHistory, ElementCommand } from '../utility/index';

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
    private pnlElements: GridLayout;
    private actionsBar: VStack;
    private dragStack: VStack;
    private pnlRow: Panel;

    private rowData: IPageSection;
    private _readonly: boolean;

    @observable()
    private isCloned: boolean = true;
    @observable()
    private isChanged: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
        // this.getData = this.getData.bind(this);
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_RESIZE, this.onResized);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.initEventBus();
        this.renderFixedGrid();
    }

    private async createNewElement(i: number) {
        const sectionData = this.rowData.elements[i];
        const pageSection = (
            <ide-section
                readonly={this._readonly}
            ></ide-section>
        ) as PageSection;
        this.pnlElements.appendChild(pageSection);
        await pageSection.setData(this.rowData.id, sectionData);
        return pageSection;
    }

    private appendColumnsLayout(col: number) {
        const length = this.pnlElements.children.length;
        for (let i = 0; i < col; i++) {
            const el = <i-vstack id={`dropzone-tmp-${length + i}`} opacity={0} class="dropzone"></i-vstack>;
            this.pnlElements.appendChild(el);
        }
    }

    async setData(rowData: IPageSection) {
        this.pnlElements.clearInnerHTML();
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

        const unitWidth = Number(this.pnlElements.offsetWidth) / 12;
        if (elements && elements.length > 0) {
            if (elements.length === 1 && elements[0]?.properties?.width === '100%') {
                await this.createNewElement(0);
                this.pnlElements.templateColumns = ['repeat(1, 1fr)'];
            } else {
                const columns = elements.length;
                const configColumns = columns > 12 ? 12 : columns;
                let missingCols = 12 - configColumns;
                for (let i = 0; i < elements.length; i++) {
                    const pageSection = await this.createNewElement(i);
                    const ratio = Math.ceil(Number(pageSection.width) / unitWidth);
                    missingCols -= (ratio - 1);
                }
                for (let i = 0; i < missingCols; i++) {
                    const el = <i-vstack id={`dropzone${i}`} opacity={0} class="dropzone"></i-vstack>;
                    this.pnlElements.appendChild(el);
                }
                this.pnlElements.templateColumns = ['minmax(auto, 100%)', `repeat(${missingCols + configColumns - 1}, ${unitWidth}px)`];
            }
        }
        this.actionsBar.minHeight = '100%';
    }

    // async getData(): Promise<IPageSection> {
    //     const sections = this.pnlElements.querySelectorAll('ide-section');
    //     const sectionDataList: IPageElement[] = [];
    //     for (const section of sections) {
    //         const sectionData = await (section as PageSection).getData();
    //         if (!sectionData) continue;
    //         sectionDataList.push(sectionData);
    //     }
    //     this.rowData.elements = sectionDataList;
    //     return this.rowData;
    // }

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
        const unitWidth = Number(this.pnlElements.offsetWidth) / 12;
        const { newWidth, oldWidth } = data;
        let list = Array.from(this.pnlElements.children);
        if (newWidth > oldWidth) {
            let ratio = Math.ceil(newWidth / unitWidth);
            for (let i = list.length - 1; i >= 0 && ratio !== 1; i--) {
                const node = list[i] as Control;
                if (node.nodeName !== 'IDE-SECTION') {
                    this.pnlElements.removeChild(node);
                    ratio--;
                }
            }
        } else {
            let ratio = Math.ceil((oldWidth - newWidth) / unitWidth);
            this.appendColumnsLayout(ratio - 1);
        }
        let templateColumns = [];
        list = Array.from(this.pnlElements.children);
        for (let i = 0; i < list.length; i++) {
            const node = list[i] as Control;
            templateColumns.push(node.nodeName === 'IDE-SECTION' ? 'minmax(auto, 100%)' : `${unitWidth}px`);
        }
        this.pnlElements.templateColumns = templateColumns;
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
        const grid = (
            <i-grid-layout
                position="absolute"
                width="100%" height="100%"
                top="0px" left="0px"
            ></i-grid-layout>
        )
        for (let i = 0; i < 12; i++) {
            const elm = (
                <i-panel
                    class="fixed-grid-item"
                    grid={{column: i + 1}}
                ></i-panel>
            );
            grid.append(elm);
        }
        this.pnlRow.appendChild(grid);
    }

    render() {
        return (
            <i-panel id="pnlRow" class={'page-row'}  width="100%" height="100%">
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
                    left={0} top={0}
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
                <i-panel width="100%" height="100%" maxWidth="100%" padding={{left: '3rem', right: '3rem'}}>
                    <i-grid-layout
                        id={'pnlElements'}
                        maxWidth="100%" maxHeight="100%"
                        width="100%" height="100%"
                        gap={{column: 15}}
                        templateColumns={['repeat(12, 1fr)']}
                    ></i-grid-layout>
                </i-panel>
            </i-panel>
        );
    }
}
