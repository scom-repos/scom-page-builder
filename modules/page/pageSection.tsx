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
    ComboBox,
    VStack
} from '@ijstech/components';
import './pageSection.css';
import { SelectModuleDialog, PageBlockSettingsDialog } from '@page/dialogs';
import { ISectionData, IPageBlockData, ISiteData, IPageData } from '@page/interface';
import { EVENT } from '@page/const';
import { RowSettingsDialog } from '@page/dialogs';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-page-section']: PageSectionElement;
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

interface ICodeInfoFileContent {
    version: ISemanticVersion;
    codeCID: string;
    source: string;
}

interface ISemanticVersion {
    major: number;
    minor: number;
    patch: number;
}

const fetchFileContentByCID = async (ipfsCid: string) => {
    let result;
    try {
        result = await fetch(`https://ipfs.scom.dev/ipfs/${ipfsCid}`);
    } catch (err) {
        const IPFS_Gateway = 'https://ipfs.io/ipfs/{CID}';
        result = await fetch(IPFS_Gateway.replace('{CID}', ipfsCid));
    }
    return result;
};

const getSCConfigByCid = async (cid: string) => {
    let scConfig;
    let result = await fetchFileContentByCID(cid);
    let codeInfoFileContent = (await result.json()) as ICodeInfoFileContent;
    let ipfsCid = codeInfoFileContent.codeCID;
    if (ipfsCid) {
        try {
            let scConfigRes = await fetchFileContentByCID(`${ipfsCid}/dist/scconfig.json`);
            scConfig = await scConfigRes.json();
        } catch (err) {}
    }
    return scConfig;
};

const Theme = Styles.Theme.ThemeVars;

@customElements('scpage-page-section')
export class PageSection extends Module {
    private _data: ISectionData = { data: null, module: null, tag: null, visibleOn: '', invisibleOn: ''};
    private btnEdit: Icon;
    private btnConfirm: Icon;
    private btnDiscard: Icon;
    private btnConfig: Icon;
    private pnlPageSection: Panel;
    // private dragger: Panel;
    // private actionsBar: Panel;
    // private pnlOverlay: Panel;
    private pnlEmpty: Panel;
    private pnlLoading: VStack;
    private pnlSectionModule: Panel;
    private currentModule: any = null;
    private mdSelectModule: SelectModuleDialog;
    private mdRowSettings: RowSettingsDialog;
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
        this.pnlEmpty.visible = !this._readonly;
        this.initEventListener();
        this.controlButton();
    }

    setActive() {
        const pageSections = document.querySelectorAll('scpage-page-section');
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
        if (this.pnlEmpty) {
            this.pnlEmpty.maxWidth = sizeWidth;
            this.pnlEmpty.maxHeight = sizeHeight;
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

    // Edit
    async handleEditClick(control: Control, event: Event) {
        if (!this.currentModule) return;
        this.currentModule.edit();
        this.editMode = true;
        this.controlButton();
    }

    // Confirm
    async handleConfirmClick() {
        if (this.currentModule) {
            if (this.currentModule.validate && !this.currentModule.validate()) return;
            this.currentModule.confirm();
            this._data.data = this.currentModule.getData();
            this._data.tag = this.currentModule.getTag();
        }
        // window.dispatchEvent(new Event('mindlinkupdate'));
        application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
        this.editMode = false;
        this.controlButton();
    }

    // Discard
    async handleDiscardClick(control: Control) {
        if (this.currentModule) this.currentModule.discard();
        this.editMode = false;
        this.controlButton();
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
        if (document.querySelectorAll('scpage-page-section')?.length > 1) {
            this.remove();
            // window.dispatchEvent(new Event('mindlinkupdate'));
            application.EventBus.dispatch(EVENT.ON_UPDATE_SECTIONS);
        } else this.clear();
    }

    clear() {
        this.currentModule = null;
        this._data = { data: null, module: null, tag: null };
        this.pnlEmpty.visible = true;
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
        if(value.visibleOn) {
            application.EventBus.register(this, value.invisibleOn, () => {
                this.visible = true;
            })
        }
        if(value.invisibleOn) {
            application.EventBus.register(this, value.invisibleOn, () => {
                this.visible = false;
            })
        }
        this._data = value;
        if (this.currentModule) {
            this.currentModule.setData(value.data);
            this.currentModule.setTag(value.tag);
        } else {
            if (value.module) {
                await this.setModule(value.module.ipfscid);
                if (this.currentModule) {
                    this.currentModule.setData(value.data);
                    this.currentModule.setTag(value.tag);
                }
            }
        }
    }

    async setModule(ipfscid: string) {
        if (this._readonly) {
            this.pnlLoading.visible = true;
        }
        const scconfig = await getSCConfigByCid(ipfscid);
        const main: string = scconfig.main;
        const response = await fetchFileContentByCID(ipfscid);
        const result = await response.json();
        const codeCID = result.codeCID;
        let module: any;
        if (main.startsWith("@")) {
            scconfig.rootDir = `https://ipfs.scom.dev/ipfs/${codeCID}/dist`;
            module = await (application as any).newModule(main, scconfig, true);
        } else {
            const mainScriptPath = `https://ipfs.scom.dev/ipfs/${main.replace(
                '{root}',

                codeCID + '/dist'
            )}`;
            const dependencies = scconfig.dependencies;
            for (let key in dependencies) {
                dependencies[key] = dependencies[key].replace(
                    '{root}',
                    'https://ipfs.scom.dev/ipfs/' + codeCID + '/dist'
                );
            }
            module = (await application.newModule(mainScriptPath, { dependencies })) as any;
        }
        if (module) {
            this.pnlSectionModule.append(module);
            module.onConfirm = this.handleConfirmClick.bind(this);
            module.onDiscard = this.handleDiscardClick.bind(this);
            module.onEdit = this.handleEditClick.bind(this);
            // if (module.confirm) module.confirm();
            this.currentModule = module;
        }
        this.pnlEmpty.visible = false;
        if (this._readonly) {
            this.pnlLoading.visible = false;
        }
        this.controlButton();
    }

    async setLocalModule(pageBlockData: IPageBlockData) {
        if(!pageBlockData.localPath) return;
        if (this._readonly) {
            this.pnlLoading.visible = true;
        }
        const scconfigRes = await fetch(`${pageBlockData.localPath}/scconfig.json`);
        const scconfig = await scconfigRes.json();
        scconfig.rootDir = pageBlockData.localPath;
        const module = (await application.newModule(scconfig.main, scconfig, true)) as any;
        if (module) {
            this.pnlSectionModule.append(module);
            module.onConfirm = this.handleConfirmClick.bind(this);
            module.onDiscard = this.handleDiscardClick.bind(this);
            module.onEdit = this.handleEditClick.bind(this);
            if (module.confirm) module.confirm();
            this.currentModule = module;
        }
        this.pnlEmpty.visible = false;
        if (this._readonly) {
            this.pnlLoading.visible = false;
        }
        this.controlButton();
    }

    async selectModule() {
        if (this._readonly) return;
        this.setActive();
        this.mdSelectModule.show();
    }

    controlButton() {
        this.btnEdit.visible = !this.editMode && !!this.currentModule;
        this.btnConfirm.visible = this.editMode && !!this.currentModule;
        this.btnDiscard.visible = this.editMode && !!this.currentModule;
    }

    dropdown() {
        this.mdButtonGroup.visible = true;
    }

    // async handleConfirmSelectModule() {
    //     const moduleCard = document.querySelector('i-module-card.active');
    //     if (moduleCard) {
    //         const ipfscid = (moduleCard as ModuleCard).ipfscid;
    //         this._data.module = (moduleCard as ModuleCard).data;
    //         await this.setModule(ipfscid);
    //         if (this.currentModule && this.currentModule.defaultEdit) {
    //             this.currentModule.edit();
    //             this.editMode = true;
    //             this.controlButton();
    //         }
    //     }
    //     this.mdSelectModule.visible = false;
    // }

    async handleOnSelectModule(selectedModule: IPageBlockData) {
        if (this._readonly) return;
        const ipfscid = selectedModule.ipfscid;
        this._data.module = selectedModule;
        if (selectedModule.local) await this.setLocalModule(selectedModule);
        else await this.setModule(ipfscid);
        if (this.currentModule && this.currentModule.defaultEdit) {
            this.currentModule.edit();
            this.editMode = true;
            this.controlButton();
        }
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
                <scpage-select-module-dialog
                    id={'mdSelectModule'}
                    onSelectModule={this.handleOnSelectModule}></scpage-select-module-dialog>
                <scpage-pageblock-settings-dialog id={'mdPageBlockSettings'} onSave={this.handlePageBlockSettingsSave.bind(this)}></scpage-pageblock-settings-dialog>
                <i-hstack>
                    <i-panel id="pageSectionWrapper" class="section-wrapper" width={'100%'} position={'relative'}>
                        <i-panel id={'actionsBar'} class="actions-bar">
                            <i-panel class="actions-edit">
                                <i-panel class="actions">
                                    <i-icon
                                        name="pencil-alt"
                                        id="btnEdit"
                                        tooltip={{ content: 'Edit' }}
                                        onClick={this.handleEditClick}></i-icon>
                                </i-panel>
                                <i-panel class="actions">
                                    <i-icon
                                        name={'check'}
                                        id="btnConfirm"
                                        visible={false}
                                        tooltip={{ content: 'Save' }}
                                        onClick={this.handleConfirmClick}></i-icon>
                                </i-panel>
                                <i-panel class="actions">
                                    <i-icon
                                        name={'times'}
                                        id="btnDiscard"
                                        visible={false}
                                        tooltip={{ content: 'Discard' }}
                                        onClick={this.handleDiscardClick}></i-icon>
                                </i-panel>
                                <i-panel class="actions">
                                    <i-icon
                                        name={'cog'}
                                        id="btnConfig"
                                        visible={true}
                                        tooltip={{ content: 'Settings' }}
                                        onClick={this.handleSettingsClick}></i-icon>
                                </i-panel>
                            </i-panel>
                            <i-panel class="actions delete">
                                <i-icon
                                    name="trash"
                                    id="btnDelete"
                                    tooltip={{ content: 'Delete' }}
                                    onClick={this.handleDeleteSectionClick}></i-icon>
                            </i-panel>
                        </i-panel>
                        <i-panel
                            id={'pnlOverlay'}
                            position={'absolute'}
                            top={0}
                            bottom={0}
                            left={0}
                            right={0}
                            class={'drag-overlay'}></i-panel>
                        <i-panel>
                            <i-vstack
                                id={'pnlEmpty'}
                                height={486}
                                width={'100%'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                class={'pointer section-empty'}
                                onClick={this.selectModule}>
                                {/*<i-label*/}
                                {/*    caption={'Start designing your section:'}*/}
                                {/*    font={{ size: '18px' }}></i-label>*/}
                                <i-label
                                    margin={{ top: '5px' }}
                                    caption={'Click to add a new page block'}
                                    font={{ size: '20px' }}></i-label>
                            </i-vstack>
                            <i-vstack
                                id="pnlLoading"
                                height={486}
                                horizontalAlignment="center"
                                verticalAlignment="center"
                                padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
                                visible={false}>
                                <i-panel class={'spinner'}></i-panel>
                            </i-vstack>
                            <i-panel id="pnlSectionModule"></i-panel>
                        </i-panel>

                    </i-panel>
                </i-hstack>
            </i-panel>
        );
    }
}

export { IPageBlockData, SelectModuleDialog, RowSettingsDialog };
