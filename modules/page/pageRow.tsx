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
    Panel
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
    private pnlSections: HStack;
    private actionsBar: VStack;
    private dragStack: Panel;

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
            for (let i = 0; i < this.rowData.sections.length; i++) {
                const colSettings = columnsSettings[i];
                const sectionData = this.rowData.sections[i];
                const pageSection = (<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                this.pnlSections.append(pageSection);
                await pageSection.setData(sectionData);
            }
        } else if (this.rowData.config.columns) {
            for (let i = 0; i < this.rowData.config.columns; i++) {
                const colSettings = columnsSettings[i];
                const pageSection = (<ide-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></ide-section>) as PageSection;
                this.pnlSections.append(pageSection);
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
        const data = this.getData();
        if (!data) return;
        const pageRow = (
            <ide-row
                border={{
                    top: {width: '1px', style: 'dashed', color: Theme.divider}
                }}
            ></ide-row>
        );
        pageRow.setData(this.getData());
        this.parentNode?.insertBefore(pageRow, this.nextSibling);
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

    updateControl() {
        this.actionsBar.opacity = 0;
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
                <i-panel width="100%" height="100%">
                    <i-panel
                        position={'absolute'}
                        top={0}
                        bottom={0}
                        left={0}
                        right={0}
                        width="100%" height="100%"
                        background={{color: '#ddd'}}
                        class={'drag-overlay'}
                    ></i-panel>
                    <i-hstack id={'pnlSections'} width="100%" height="100%"></i-hstack>
                </i-panel>
                <scpage-row-settings-dialog
                    id={'rowSettings'}
                    onSave={this.handleSectionSettingSave}
                ></scpage-row-settings-dialog>
            </i-panel>
        );
    }
}
