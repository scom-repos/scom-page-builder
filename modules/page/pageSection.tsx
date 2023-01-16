import {
    Module,
    customElements,
    Control,
    Icon,
    Panel,
    Modal,
    application,
    ControlElement,
    Styles,
    VStack
} from '@ijstech/components';
import './pageSection.css';
import { PageBlockSettingsDialog } from '@page/dialogs';
import { ISectionData, IPageBlockData } from '@page/interface';
import { EVENT } from '@page/const';
import { RowSettingsDialog } from '@page/dialogs';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-section']: PageSectionElement;
        }
    }
}

export interface PageSectionElement extends ControlElement {
    readonly?: boolean;
    containerSize?: {
        width?: string;
        height?: string;
    }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-section')
export class PageSection extends Module {
    private _data: ISectionData = { data: null, module: null, tag: null, visibleOn: '', invisibleOn: ''};
    // private btnEdit: Icon;
    // private btnConfirm: Icon;
    // private btnDiscard: Icon;
    // private btnConfig: Icon;
    // private pnlPageSection: Panel;
    // private dragger: Panel;
    // private actionsBar: Panel;
    // private pnlOverlay: Panel;
    private pnlEmpty: Panel;
    private pnlLoading: VStack;
    private pnlSectionModule: Panel;
    private currentModule: any = null;
    private mdButtonGroup: Modal;
    private mdPageBlockSettings: PageBlockSettingsDialog;
    private editMode: boolean = false;
    private pageSectionWrapper: Panel;
    private _readonly: boolean;
    private _size: {
        width?: string;
        height?: string;
    }

    get size() {
        return this._size || {};
    }

    set size(value: { width?: string; height?: string }) {
        this._size = value;
        this.updateContainerSize();
    }

    async init() {
        super.init();
        this._readonly = this.getAttribute('readonly', true, false);
        this._size = this.getAttribute('containerSize', true, {});
        this.updateContainerSize();
        this.initEventListener();
    }

    setActive() {
        const pageSections = document.querySelectorAll('ide-section');
        if(pageSections) {
            for(const pageSection of pageSections) {
                pageSection.classList.remove('active');
            }
        }
        this.classList.add('active');
    }

    initEventListener() {
        this.onClick = (target, event) => {
            this.setActive();
        }
    }

    updateContainerSize() {
        const sizeWidth = this.size.width || 'none';
        const sizeHeight = this.size.height || 'none';
        if (this.pageSectionWrapper) {
            this.pageSectionWrapper.maxWidth = sizeWidth;
            this.pageSectionWrapper.maxHeight = sizeHeight;
            this.pageSectionWrapper.margin = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' };
        }
        if (this.pnlLoading) {
            this.pnlLoading.maxWidth = sizeWidth;
            this.pnlLoading.maxHeight = sizeHeight;
        }
        if (this.pnlSectionModule) {
            this.pnlSectionModule.maxWidth = sizeWidth;
            this.pnlSectionModule.maxHeight = sizeHeight;
        }
    }

    async handleSettingsClick(control: Control) {
        let events;
        if(this.currentModule) {
            if(this.currentModule.getEvents)
                events = this.currentModule.getEvents();
            if(this.currentModule.getConfigSchema) {
                const configSchema = this.currentModule.getConfigSchema();
                const configData = this.currentModule.getTag ? this.currentModule.getTag() : null;
                if (configSchema)
                    this.mdPageBlockSettings.show({
                        schema: configSchema,
                        configData,
                        events,
                        visibleOn: this._data.visibleOn,
                        invisibleOn: this._data.invisibleOn,
                    }, );
            }
        }
    }

    async handleDeleteSectionClick(control: Control) {
        if (document.querySelectorAll('ide-section')?.length > 1) {
            this.remove();
            application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
        } else this.clear();
    }

    clear() {
        this.currentModule = null;
        this._data = { data: null, module: null, tag: null };
        this.pnlSectionModule.clearInnerHTML();
        this.editMode = false;
        this.controlButton();
    }

    get data() {
        if (this.currentModule) this._data.tag = this.currentModule.getTag();
        if (!this._data.data && !this._data.module && !this._data.tag) return null;
        return this._data;
    }

    get module() {
        return this.currentModule;
    }

    async setData(value: ISectionData) {
    }

    controlButton() {
        // this.btnEdit.visible = !this.editMode && !!this.currentModule;
        // this.btnConfirm.visible = this.editMode && !!this.currentModule;
        // this.btnDiscard.visible = this.editMode && !!this.currentModule;
    }

    dropdown() {
        this.mdButtonGroup.visible = true;
    }

    async handlePageBlockSettingsSave(data: any) {
        if(this.currentModule && this.currentModule.onConfigSave) {
            await this.currentModule.onConfigSave(data.configData);
            application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
            this._data.visibleOn = data.visibleOn;
            this._data.invisibleOn = data.invisibleOn;
        }
    }

    async render() {
        return (
            <i-panel id={'pnlPageSection'} class={'page-section'}>
                <scpage-pageblock-settings-dialog id={'mdPageBlockSettings'} onSave={this.handlePageBlockSettingsSave.bind(this)}></scpage-pageblock-settings-dialog>
                <i-hstack>
                    <i-panel id="pageSectionWrapper" class="section-wrapper" width={'100%'} height="100%" position={'relative'}>
                        {/* <i-panel id={'actionsBar'} class="actions-bar">
                            <i-panel class="actions delete">
                                <i-icon
                                    name="trash"
                                    id="btnDelete"
                                    tooltip={{ content: 'Delete' }}
                                    onClick={this.handleDeleteSectionClick}></i-icon>
                            </i-panel>
                        </i-panel> */}
                        <i-panel
                            id={'pnlOverlay'}
                            position={'absolute'}
                            top={0}
                            bottom={0}
                            left={0}
                            right={0}
                            class={'drag-overlay'}
                        ></i-panel>
                        <i-panel id="pnlSectionModule"></i-panel>
                    </i-panel>
                </i-hstack>
            </i-panel>
        );
    }
}

export { IPageBlockData, RowSettingsDialog };
