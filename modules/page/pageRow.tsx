import {
    Module,
    customElements,
    application,
    ControlElement,
    Styles,
    Control,
    HStack,
    VStack,
    observable,
    GridLayout
} from '@ijstech/components';
import { PageSection } from './pageSection';
import './pageRow.css';

import { RowSettingsDialog } from '@page/dialogs';
import { EVENT } from '@page/const';
import { IRowData, ISectionData, IRowSettings } from '@page/interface';

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

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-row')
export class PageRow extends Module {
    private rowSettings: RowSettingsDialog;
    private pnlSections: GridLayout;
    private actionsBar: VStack;
    private dragStack: VStack;

    private rowData: IRowData;
    private _readonly: boolean;

    @observable()
    private isCloned: boolean = true;
    @observable()
    private isChanged: boolean = true;

    constructor(parent?: any) {
        super(parent);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
    }

    async setData(rowData: IRowData) {
        console.log('rowData config', rowData.config);
        this.pnlSections.clearInnerHTML();
        this.rowData = rowData;
        if (this.rowData.config.width) {
            this.width = this.rowData.config.width;
        }
        if (this.rowData.config.height) {
            // use minHeight instead of height to avoid the overflow of inner containers
            // when the markdown editor is in edit mode
            this.minHeight = this.rowData.config.height;
        }

        // Background
        if(this.rowData.config.backgroundImageUrl) {
            this.background.image = this.rowData.config.backgroundImageUrl;
        }
        else if(this.rowData.config.backgroundColor) {
            this.background.color = this.rowData.config.backgroundColor;
        }

        this.isCloned = typeof this.rowData.config.isCloned === 'boolean' ? this.rowData.config.isCloned : true;
        this.isChanged = typeof this.rowData.config.isChanged === 'boolean' ? this.rowData.config.isChanged : true;

        const columnsSettings = this.rowData.config.columnsSettings || {};
        if (this.rowData.sections && this.rowData.sections.length > 0) {
            if (this.rowData.sections.length === 1 && this.rowData.sections[0]?.width === '100%') {
                const colSettings = columnsSettings[0];
                const sectionData = this.rowData.sections[0];
                const pageSection = (<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                this.pnlSections.append(pageSection);
                await pageSection.setData(sectionData);
                this.pnlSections.templateColumns = ['repeat(1, 1fr)'];
            } else {
                const columns = this.rowData.sections.length;
                const configColumns = columns > 12 ? 12 : columns;
                let missingCols = 12 - configColumns;
                const unitWidth = Number(this.width) / 12;
                let minWidth = 0;
                for (let i = 0; i < this.rowData.sections.length; i++) {
                    const colSettings = columnsSettings[i];
                    const sectionData = this.rowData.sections[i];
                    const pageSection = (<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                    this.pnlSections.append(pageSection);
                    await pageSection.setData(sectionData);
                    const ratio = Math.ceil(Number(pageSection.width) / unitWidth);
                    missingCols -= (ratio - 1);
                }
                for (let i = 0; i < missingCols; i++) {
                    const el = <i-vstack opacity={0}></i-vstack>;
                    this.pnlSections.append(el);
                    minWidth = el.width;
                }
                this.pnlSections.templateColumns = ['minmax(auto, 100%)', `repeat(${missingCols + configColumns - 1}, ${minWidth}px)`];
            }
        } else if (this.rowData.config.columns) {
            const columns = this.rowData.config.columns;
            const configColumns = columns > 12 ? 12 : columns < 0 ? 1 : columns;
            let minWidth = 0;
            if (columns === 1 && columnsSettings[0]?.width === '100%') {
                const colSettings = columnsSettings[0];
                const pageSection = (<ide-section width="100%" containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                this.pnlSections.append(pageSection);
                this.pnlSections.templateColumns = ['repeat(1, 1fr)'];
            } else {
                const missingCols = 12 - configColumns - 1;
                for (let i = 0; i < configColumns; i++) {
                    const colSettings = columnsSettings[i];
                    const pageSection = (<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                    this.pnlSections.append(pageSection);
                }
                for (let i = 0; i < missingCols; i++) {
                    const el = <i-vstack opacity={0}></i-vstack>;
                    this.pnlSections.append(el);
                    minWidth = el.width;
                }
                this.pnlSections.templateColumns = ['minmax(auto, 100%)', `repeat(11, ${minWidth}px)`];
            }
        }
        this.actionsBar.minHeight = this.rowData?.config?.height || '100%';
    }

    getData() {
        const sections = this.pnlSections.querySelectorAll('ide-section');
        const sectionDataList: ISectionData[] = [];
        for (const section of sections) {
            const sectionData = (section as PageSection).data;
            if (!sectionData) continue;
            sectionDataList.push(sectionData);
        }
        this.rowData.sections = sectionDataList;
        return this.rowData;
    }

    onOpenRowSettingsDialog() {
        this.rowSettings.setConfig(this.rowData.config);
        this.rowSettings.show();
    }

    private onClone() {
        const rowData = this.getData();
        if (!rowData) return;
        application.EventBus.dispatch(EVENT.ON_CLONE, { rowData, id: this.id });
    }

    async handleSectionSettingSave(config: IRowSettings) {
        if(config.width && config.width != this.rowData.config.width) {
            this.rowData.config.width = config.width;
            this.width = config.width;
        }
        if(config.height && config.height != this.rowData.config.height) {
            this.rowData.config.height = config.height;
            this.height = config.height;
        }
        if (config.columnsSettings) {
            this.rowData.config.columnsSettings = config.columnsSettings;
        }
        // Background
        if(config.backgroundImageUrl) {
            this.background.image = config.backgroundImageUrl;
        }
        else if(config.backgroundColor) {
            this.background.color = config.backgroundColor;
        }
        this.rowData.config.backgroundImageUrl = config.backgroundImageUrl;
        this.rowData.config.backgroundColor = config.backgroundColor;

        const columnsSettings = config.columnsSettings || {};
        if(config.columns) {
            const sections = this.pnlSections.querySelectorAll('ide-section');
            if (sections) {
                let pageSections = [];
                for (let i = 0; i < config.columns; i++) {
                    const colSettings = columnsSettings[i];
                    const section = (sections[i] as PageSection);
                    if (section && section.component) {
                        section.maxWidth = colSettings?.width || '100%';
                        section.size = colSettings?.size || {};
                        pageSections.push(section);
                        continue;
                    };
                    pageSections.push(<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>);
                }
                this.pnlSections.clearInnerHTML();
                this.pnlSections.append(...pageSections);
            }
            else {
                const sections = this.pnlSections.querySelectorAll('ide-section');
                const delNum = this.rowData.config.columns - config.columns;
                let delCount = 0;
                if (sections) {
                    for(let section of sections) {
                        if(delCount >= delNum) break;
                        if (section && (section as PageSection).component) continue;
                        else {
                            section.remove();
                            delCount++;
                        }
                    }
                    if(delCount < delNum) {
                        const sections2 = this.pnlSections.querySelectorAll('ide-section');
                        if(sections2) {
                            for (let i = 0; i < delNum - delCount; i++) {
                                if(sections2[sections2.length - 1])
                                    sections2[sections2.length - 1].remove();
                            }
                        }
                    }
                }
            }
            this.rowData.config.columns = config.columns;
        }

        application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS, null)
    }

    async onDeleteRow(control: Control) {
        this.remove();
        application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
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

    async render() {
        return (
            <i-panel class={'page-row'}  width="100%" height="100%">
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
                            tooltip={{content: 'Section section', placement: 'right'}}
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
                        id={'pnlSections'}
                        maxWidth="100%"
                        width="100%" height="100%"
                        gap={{column: 15}}
                        templateColumns={['repeat(12, 1fr)']}
                    ></i-grid-layout>
                </i-panel>
                <scpage-row-settings-dialog
                    id={'rowSettings'}
                    onSave={this.handleSectionSettingSave}
                ></scpage-row-settings-dialog>
            </i-panel>
        );
    }
}
