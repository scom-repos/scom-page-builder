import {
    Module,
    customElements,
    application,
    ControlElement,
    Styles,
    Control,
    HStack
} from '@ijstech/components';
import { PageSection } from './pageSection';
import './pageRow.css';

import { RowSettingsDialog } from '@page/dialogs';
import { EVENT } from '@page/const';
import { IRowData, ISectionData, IRowSettings } from '@page/interface';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-page-row']: PageRowElement;
        }
    }
}

export interface PageRowElement extends ControlElement {
    readonly?: boolean;
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scpage-page-row')
export class PageRow extends Module {
    private rowSettings: RowSettingsDialog;
    private pnlSections: HStack;
    private rowData: IRowData;
    private _readonly: boolean;

    constructor(parent?: any) {
        super(parent);
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
    }

    onShow() {
    }

    onLoad() {
    }

    async setData(rowData: IRowData) {
        console.log('rowData config', rowData.config);
        if (!this.pnlSections) this.pnlSections = new HStack();
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

        const columnsSettings = this.rowData.config.columnsSettings || {};
        if (this.rowData.sections && this.rowData.sections.length > 0) {
            for (let i = 0; i < this.rowData.sections.length; i++) {
                const colSettings = columnsSettings[i];
                const sectionData = this.rowData.sections[i];
                const pageSection = (<scpage-page-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></scpage-page-section>) as PageSection;
                this.pnlSections.append(pageSection);
                await pageSection.setData(sectionData);
            }
        } else if (this.rowData.config.columns) {
            for (let i = 0; i < this.rowData.config.columns; i++) {
                const colSettings = columnsSettings[i];
                const pageSection = (<scpage-page-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></scpage-page-section>) as PageSection;
                this.pnlSections.append(pageSection);
            }
        }
    }

    async getData() {
        const sections = this.pnlSections.querySelectorAll('scpage-page-section');
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

    private onChangeColor() {}

    private onClone() {}

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
            const sections = this.pnlSections.querySelectorAll('scpage-page-section');
            if (sections) {
                let pageSections = [];
                for (let i = 0; i < config.columns; i++) {
                    const colSettings = columnsSettings[i];
                    const section = (sections[i] as PageSection);
                    if (section && section.module) {
                        section.maxWidth = colSettings?.width || '100%';
                        section.size = colSettings?.size || {};
                        pageSections.push(section);
                        continue;
                    };
                    pageSections.push(<scpage-page-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}} readonly={this._readonly}></scpage-page-section>);
                }
                this.pnlSections.clearInnerHTML();
                this.pnlSections.append(...pageSections);
            }
            else {
                const sections = this.pnlSections.querySelectorAll('scpage-page-section');
                const delNum = this.rowData.config.columns - config.columns;
                let delCount = 0;
                if (sections) {
                    // this.pnlSections.clearInnerHTML();
                    // Clear empty section
                    for(let section of sections) {
                        if(delCount >= delNum) break;
                        if (section && (section as PageSection).module) continue;
                        else {
                            section.remove();
                            delCount++;
                        }
                    }
                    if(delCount < delNum) {
                        const sections2 = this.pnlSections.querySelectorAll('scpage-page-section');
                        if(sections2) {
                            for (let i = 0; i < delNum - delCount; i++) {
                                // sections2[sections2.length - 1].remove();
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

    // async handleAddPageClick(after = false) {
    //     const pageRow: PageRow = <scpage-page-row></scpage-page-row>;
    //     pageRow.setData({
    //         config: {
    //             width: '100%',
    //             height: '100%',
    //             columns: 1,
    //         },
    //         sections: []
    //     });
    //     if (after) {
    //         this.parentNode?.insertBefore(pageRow, this.nextSibling);
    //     } else {
    //         this.parentNode?.insertBefore(pageRow, this);
    //     }
    // }

    async handleDeleteSectionClick(control: Control) {
        if (document.querySelectorAll('scpage-page-section')?.length > 1) {
            this.remove();
            application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
        }
    }

    async render() {
        return (
            <i-panel class={'page-row'}>
                <i-panel class="section-wrapper">
                    {/* <i-button
                        id="btnAddBefore"
                        class="btn-add"
                        icon={{ name: 'plus', fill: Theme.colors.primary.contrastText }}
                        caption="Add Row"
                        onClick={() => this.handleAddPageClick()}></i-button> */}
                    {/* <i-button
                        id="btnAddAfter"
                        class="btn-add"
                        icon={{ name: 'plus', fill: Theme.colors.primary.contrastText }}
                        caption="Add Row"
                        onClick={() => this.handleAddPageClick(true)}></i-button> */}

                    <i-panel id={'actionsBar'} class="row-actions-bar">
                        <i-panel class="actions">
                            <i-icon name="palette" onClick={this.onChangeColor}></i-icon>
                        </i-panel>
                        <i-panel class="actions">
                            <i-icon name="clone" onClick={this.onClone}></i-icon>
                        </i-panel>
                        <i-panel class="actions delete">
                            <i-icon name="trash" onClick={this.handleDeleteSectionClick}></i-icon>
                        </i-panel>
                    </i-panel>
                    <i-hstack id={'pnlSections'}></i-hstack>
                    <scpage-row-settings-dialog
                        id={'rowSettings'}
                        onSave={this.handleSectionSettingSave}></scpage-row-settings-dialog>
                </i-panel>
            </i-panel>
        );
    }
}
