import {
    Module,
    customElements,
    Panel,
    ControlElement,
    HStack,
    Button,
    Modal,
    IRenderUIOptions,
    IDataSchema,
    VStack,
    application,
    Form
} from '@ijstech/components';
import { EVENT } from '../const/index';
import { ELEMENT_NAME, IPageBlockAction, IPageBlockData, IPageElement, ThemeType } from '../interface/index';
import { getRootDir, pageObject } from '../store/index';
import { isEmpty } from '../utility/index';
import { commandHistory, RemoveToolbarCommand, ReplaceElementCommand } from '../command/index';
import { currentTheme  } from '../theme/index';
import './toolbar.css';
import { PageSection } from '../page/pageSection';
import { PageRow } from '../page/pageRow';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-toolbar']: ToolbarElement;
        }
    }
}

export interface ToolbarElement extends ControlElement {
    readonly?: boolean;
}
type IPosition = 'left'|'right'|'bottomLeft'|'bottomRight'|'bottom';
const Theme = currentTheme;

const SINGLE_CONTENT_BLOCK_ID = 'single-content-block__';

@customElements('ide-toolbar')
export class IDEToolbar extends Module {
    private _toolList: any[] = [];
    private _readonly: boolean;
    private currentAction: IPageBlockAction = null;

    private contentStack: Panel;
    private toolsStack: Panel;
    private toolbar: HStack;
    private _eResizer: Panel;
    private _wResizer: Panel;
    private _nResizer: Panel;
    private _neResizer: Panel;
    private _nwResizer: Panel;
    private _component: any = null;
    private dragStack: Panel;
    private pnlForm: Panel;
    private pnlFormMsg: Panel;
    private mdActions: Modal;
    private backdropStack: VStack
    private form: Form;

    private _rowId: string;
    private _elementId: string;
    private _currentSingleContentBlockId: string;
    private _currentReplaceData: IPageElement = null;
    private events: any[] = [];

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
        this.fetchModule = this.fetchModule.bind(this);
    }

    get data() {
        return pageObject.getElement(this.rowId, this.elementId/*, true*/);
    }

    get currentReplaceData() {
        return this._currentReplaceData;
    }

    get module() {
        return this._component;
    }

    get toolList() {
        return this._toolList || [];
    }
    set toolList(value: any[]) {
        this._toolList = value;
        this.renderToolbars();
    }

    get rowId() {
        return this._rowId;
    }
    set rowId(value: string) {
        this._rowId = value;
    }

    get elementId() {
        return this._elementId;
    }
    set elementId(value: string) {
        this._elementId = value;
    }

    get readonly() {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = value;
    }

    private adjustCursorByAction() {
        if (this.currentAction.name == "Edit")
            this.contentStack.classList.remove('move'); 
        else
            this.contentStack.classList.add('move');
    }

    private async renderToolbars() {
        this.toolbar.clearInnerHTML();
        for (let i = 0; i < this.toolList.length; i++) {
            const tool = this.toolList[i];
            let elm = await Button.create({
                padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                width: 48,
                height: 48,
                border: {radius: '50%'},
                tooltip: tool.name ? { trigger: 'hover', content: tool.name, color: '#555555' } : undefined,
                background: {color: 'transparent'},
                visible: tool.visible ? tool.visible() : true,
                caption: `<i-icon name="${tool.icon}" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                onClick: () => {
                    this.currentAction = tool;
                    if (isEmpty(tool.userInputDataSchema) && isEmpty(tool.customUI)) {
                        const commandIns = this.currentAction.command(this, null);
                        commandHistory.execute(commandIns);
                    } else {
                        this.mdActions.visible = true;
                        this.pnlForm.visible = true;
                    }
                    this.adjustCursorByAction();
                    this.hideToolbars();
                }
            });
            elm.classList.add('toolbar');
            if (tool.name) elm.setAttribute('tool-name', tool.name);
            this.toolbar.appendChild(elm);
        }
        const removeBtn = await Button.create({
            padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
            width: 48,
            height: 48,
            border: {radius: '50%'},
            tooltip: { trigger: 'hover', content: 'Delete', color: '#555555' },
            background: {color: 'transparent'},
            caption: `<i-icon name="trash" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
            onClick: () => {
                const removeCmd = new RemoveToolbarCommand(this);
                commandHistory.execute(removeCmd);
                this.hideToolbars();
            }
        });
        removeBtn.classList.add('toolbar');
        this.toolbar.appendChild(removeBtn);
    }

    private onShowModal() {
        this.classList.add('is-setting');
        this.pnlFormMsg.visible = false;
        this.renderToolbarAction(this.currentAction);
    }

    private onCloseModal() {
        this.classList.remove('is-setting');
    }

    private async renderToolbarAction(action: IPageBlockAction) {
        this.pnlForm.clearInnerHTML();
        const builderTarget = this._component.getConfigurators().find((conf: any) => conf.target === 'Builders');
        const data = builderTarget?.getData ? await builderTarget.getData() : this.data.properties;
        if (data.height === 'auto') data.height = this.offsetHeight;
        if (data.width === 'auto') data.width = this.offsetWidth;
        let properties = data;
        if (this.isContentBlock()) {
            properties = this._currentSingleContentBlockId ? data[this._currentSingleContentBlockId].properties : data
        }
        const tag = builderTarget?.getTag ? await builderTarget.getTag() : (this.data.tag || {});
        this.mdActions.title = action.name || 'Update Settings';
        if (action.customUI) {
            const customUI = action.customUI;
            let element = null;
            if (action.isReplacement) {
                element = customUI.render({...properties, ...tag}, this.replaceComponent.bind(this));
            } else {
                element = customUI.render({...properties, ...tag}, this.onSave.bind(this));
            }
            this.pnlForm.append(element);
            this.form.visible = false
        }
        else {
            if (typeof tag.width === 'number' && (action.userInputDataSchema.properties?.width as IDataSchema)?.type === 'string') {
                tag.width = "" + tag.width;
            }
            if (typeof tag.height === 'number' && (action.userInputDataSchema.properties?.height as IDataSchema)?.type === 'string') {
                tag.height = "" + tag.height;
            }
            const options: IRenderUIOptions = {
                columnWidth: '100%',
                columnsPerRow: 1,
                confirmButtonBackgroundColor: Theme.colors.primary.main,
                confirmButtonFontColor: Theme.colors.primary.contrastText,
                jsonSchema: action.userInputDataSchema,
                dateTimeFormat: 'MM/DD/YYYY HH:mm',
                data: {...properties, ...tag}
            }
            if (action.userInputUISchema) options.jsonUISchema = action.userInputUISchema;
            // if (action.useRenderUI || action.name === 'Advanced') {
            //     renderUI(this.pnlForm, options, this.onSave.bind(this));
            //     this.form.visible = false;
            //     this.mdActions.refresh();
            //     return;
            // }
            // console.log('form x', options.data, this.data);
            this.form.uiSchema = action.userInputUISchema;
            this.form.jsonSchema = action.userInputDataSchema;
            this.form.formOptions = {
                columnWidth: '100%',
                columnsPerRow: 1,
                confirmButtonOptions: {
                    caption: 'Confirm',
                    backgroundColor: Theme.colors.primary.main,
                    fontColor: Theme.colors.primary.contrastText,
                    hide: false,
                    onClick: async () => {
                        const data = await this.form.getFormData();
                        const commandIns = this.currentAction.command(this, data);
                        commandHistory.execute(commandIns);
                        this.mdActions.visible = false;
                    }
                },                
                dateTimeFormat: {
                    date: 'YYYY-MM-DD',
                    time: 'HH:mm:ss',
                    dateTime: 'MM/DD/YYYY HH:mm'
                },
            };
            this.form.renderForm();
            this.form.clearFormData();
            const formData = action.name === 'Theme Settings' ? (tag || {}) : (properties || {})
            this.form.setFormData({...formData});
            this.form.visible = true;
        }
        this.mdActions.refresh();
    }

    private onSave(result: boolean, data: any) {
        if (result) {
            const commandIns = this.currentAction.command(this, data);
            commandHistory.execute(commandIns);
            this.mdActions.visible = false;
        } else if (data?.errors) {
            // this.pnlFormMsg.visible = true;
            // this.renderError(data.errors || []);
        }
    }

    private isTexbox(data: IPageBlockData | undefined) {
        if (data)
            return data.name.toLowerCase() === ELEMENT_NAME.TEXTBOX.toLowerCase();
        else
            return false;
    }

    private isContentBlock() {
        return this.data?.module?.name === ELEMENT_NAME.CONTENT_BLOCK;
    }

    showToolbars() {
        if (this.toolList.length)
            this.toolsStack.visible = true;
        this.contentStack && this.contentStack.classList.add('active');
        this.classList.add('active');
        let pnl = this.closest('ide-section #pnlMain')
        if (pnl)
            pnl.classList.remove('section-border')
    }

    hideToolbars() {
        this.toolsStack.visible = false;
        this.contentStack && this.contentStack.classList.remove('active');
        this.classList.remove('active');
        let pnl = this.closest('ide-section #pnlMain')
        if (pnl)
            pnl.classList.add('section-border')
    }

    private getActions() {
        if (this._component?.getConfigurators) {
            const configs = this._component.getConfigurators() || [];
            const builderTarget = configs.find(conf => conf.target === 'Builders');
            if (builderTarget?.getActions) return builderTarget.getActions();
        }
        return [];
    }

    updateToolbar() {
        this.toolList = this.getActions() || [];
    }

    private renderResizeStack(data: IPageElement) {
        this._eResizer = this.renderResizer('left');
        this._wResizer = this.renderResizer('right');
        this._nResizer = this.renderResizer('bottom');
        this._neResizer = this.renderResizer('bottomLeft');
        this._nwResizer = this.renderResizer('bottomRight');
        const showFull = true; // data?.module?.disableClicked;
        if (this._nResizer) this._nResizer.visible = showFull;
        if (this._neResizer) this._neResizer.visible = showFull;
        if (this._nwResizer) this._nwResizer.visible = showFull;
    }

    private renderResizer(position: IPosition) {
        const stack = <i-vstack
            minWidth={8}
            verticalAlignment="center" horizontalAlignment="center"
            zIndex={20}
            position="absolute"
            class="resize-stack"
        ></i-vstack>
        const iconEl = <i-icon
            name="circle"
            fill={Theme.colors.primary.main}
            height={16} width={16}
            class="resize-icon"
        ></i-icon>
        switch (position) {
            case 'left':
                stack.top = 0;
                stack.left = -2;
                stack.height = '100%';
                iconEl.margin = {left: -8};
                break;
            case 'right':
                stack.top = 0;
                stack.right = -2;
                stack.height = '100%';
                iconEl.margin = {right: -8};
                break;
            case 'bottom':
                stack.bottom = -12;
                stack.left = '50%';
                stack.style.transform = 'translateX(-50%)'
                stack.height = 'auto';
                iconEl.classList.add('n-resize');
                stack.visible = false;
                break;
            case 'bottomLeft':
                stack.bottom = -8;
                stack.left = 0;
                stack.height = 'auto';
                iconEl.margin = {left: -8};
                iconEl.classList.add('ne-resize');
                stack.visible = false;
                break;
            case 'bottomRight':
                stack.bottom = -8;
                stack.right = 0;
                stack.height = 'auto';
                iconEl.margin = {right: -8};
                iconEl.classList.add('nw-resize');
                stack.visible = false;
                break;
        }
        stack.appendChild(iconEl);
        stack.classList.add(position);
        this.contentStack.appendChild(stack);
        return stack;
    }

    async fetchModule(data: IPageElement) {
        if (this._readonly) return;
        try {
            const module: any = await application.createElement(data?.module?.path || '');
            if (!module) throw new Error('not found');
            await this.setModule(module, data?.module);
            if (this.isTexbox(data.module)) {
                this.dragStack.visible = true;
            } else if (this.isContentBlock()) {
                const allSingleContentBlockId = Object.keys(data.properties).filter(prop => prop.includes(SINGLE_CONTENT_BLOCK_ID))
                for (let singleContentBlockId of allSingleContentBlockId) {
                    const singleContentBlock = this.parentElement.querySelector(`#${singleContentBlockId}`) as any
                    singleContentBlock.fetchModule(data.properties[singleContentBlockId])
                }
                this.dragStack.visible = false;
            } else {
                this.dragStack.visible = false;
            }
            this.contentStack.classList.add('move');
            this.renderResizeStack(data);
        } catch(error) {
            console.log('fetch module error: ', error);
            commandHistory.undo();
        }
    }

    private async setModule(module: Module, data: IPageBlockData) {
        this._component = module;
        this._component.id = `component-${this.elementId}`;
        this._component.rootParent = this.closest('ide-row');
        this._component.parent = this.contentStack;
        const builderTarget = this._component?.getConfigurators ? this._component.getConfigurators().find((conf: any) => conf.target === 'Builders') : null;
        if (builderTarget?.setRootParent) builderTarget.setRootParent(this.closest('ide-row'));
        if (builderTarget?.setElementId) builderTarget.setElementId(this.elementId);
        this.contentStack.append(this._component);
        if (builderTarget?.setRootDir) builderTarget.setRootDir(getRootDir());
        if (this._component.ready) await this._component.ready();
        this._component.maxWidth = '100%';
        this._component.maxHeight = '100%';
        // this._component.overflow = 'hidden';
        this._component.style.display = 'block';
        this.backdropStack.visible = data?.shownBackdrop;
        this._component.addEventListener('click', (event: Event) => {
            if (data?.disableClicked)
                event.stopImmediatePropagation();
            event.preventDefault()
            this.showToolList();
        })
        this.showToolList()
    }

    private showToolList() {
        this.toolList = this.getActions() || [];
        this.checkToolbar();
        this.showToolbars();
    }

    async setData(properties: any, module?: IPageBlockData) {
        // update data from pageblock
        if (!this._component) return;
        this.updateComponent(module ? undefined : properties);
        if (this.isContentBlock()) {
            const isInitialization = Object.keys(properties)[0].includes(SINGLE_CONTENT_BLOCK_ID)
            const isContentBlockProps = Object.keys(properties).includes('numberOfBlocks')

            if (isInitialization) {
                pageObject.setElement(this.rowId, this.data.id, { properties, module });
            } else {
                if (isContentBlockProps) {
                    pageObject.setElement(this.rowId, this.data.id, { properties: {...this.data.properties, ...properties }, module });
                } else {
                    const element = this.data.properties[this._currentSingleContentBlockId]
                    if (element) element.properties = properties
                    pageObject.setElement(this.rowId, this.data.id, { properties: {...this.data.properties, [this._currentSingleContentBlockId]: element}, module });
                }
            }
        } else {
            this.data && pageObject.setElement(this.rowId, this.data.id, { properties, module });
        }
    }

    async setTag(tag: any, init?: boolean) {
        if (!this._component) return;
        // if (tag.width === '100%') tag.width = Number(this.width);
        if (tag.height === '100%') tag.height = Number(this.height);
        if (this._component?.getConfigurators) {
            this.updateComponent();
            const builderTarget = this._component.getConfigurators().find((conf: any) => conf.target === 'Builders');
            if (builderTarget?.setTag) {
                await builderTarget.setTag(init ? {...tag, width: '100%'} : {...tag});
            }
        }
        if (this.data && !init)
            pageObject.setElement(this.rowId, this.data.id, { tag });
    }

    async setProperties(data: any) {
        if (!this._component || !this._component?.getConfigurators) return;
        const builderTarget = this._component.getConfigurators().find((conf: any) => conf.target === 'Builders');
        if (builderTarget?.setData) {
            await builderTarget.setData(data);
        }
        if (builderTarget?.setRootDir) builderTarget.setRootDir(getRootDir());
    }

    setTheme(value: ThemeType) {
        if (this.module && value !== this.module.theme)
            this.module.theme = value;
    }

    private checkToolbar() {
        const isShowing = this.toolsStack.visible;
        const pageRows= document.querySelectorAll('ide-row');
        if (pageRows) {
            for (const row of pageRows) {
                const toolbarElms = row.querySelectorAll('ide-toolbar');
                if (toolbarElms) toolbarElms.forEach((toolbarElm: IDEToolbar) => toolbarElm.hideToolbars());
                row.classList.remove('active');
            }
        }
        isShowing && this.showToolbars();
    }

    // private renderError(errors: ValidationError[]) {
    //     this.pnlFormMsg.clearInnerHTML();
    //     errors.forEach(error => {
    //         this.pnlFormMsg.appendChild(
    //             <i-label
    //                 caption={`${error.property} ${error.message}`}
    //                 font={{color: Theme.colors.error.main, size: '0.75rem'}}
    //             ></i-label>
    //         );
    //     })
    // }

    _handleClick(event: MouseEvent): boolean {
        if (this._readonly) return super._handleClick(event, true);
        this.checkToolbar();
        return super._handleClick(event, true);
    }

    clearComponent() {
        if (this._component) {
            this._component.clearInnerHTML();
            this.contentStack.removeChild(this._component);
            this._component = null;
        }
    }

    updateComponent(data?: any) {
        if (!this._component?.closest('ide-row')) {
            const componentId = this._component.id;
            const rootParent = this._component.rootParent;
            if (componentId && rootParent) {
                this._component = rootParent.querySelector(`#${componentId}`) ?? this._component;
                if (data) {
                    this.setProperties(data);
                }
            }
        } else if (this._component?.getConfigurators && data) {
            const builderTarget = this._component.getConfigurators().find((conf: any) => conf.target === 'Builders');
            if (JSON.stringify(builderTarget?.getData()) !== JSON.stringify(data)) {
                this.setProperties(data);
            }
        }
    }

    private replaceComponent(value: IPageElement) {
        this._currentReplaceData = value;
        const replaceCmd = new ReplaceElementCommand(this);
        commandHistory.execute(replaceCmd);
        this.pnlForm.visible = false;
        this.mdActions.visible = false;
    }

    private initEventListener() {
        let self = this;

        this.contentStack.addEventListener('mouseover', function (event) {
            let pageRow = (self.closest('ide-row') as PageRow)
            let sectionSelected: boolean = pageRow.selectedElement? true : false;
            let compositeSection: boolean = (self.closest('ide-section') as PageSection).data &&
                (self.closest('ide-section') as PageSection).data?.elements?.length;

            if (!compositeSection || sectionSelected) {
                // add section border
                this.classList.add('hover-border');
            }
        })

        this.contentStack.addEventListener('mouseleave', function (event) {

            let pageRow = (self.closest('ide-row') as PageRow)
            let sectionSelected: boolean = pageRow.selectedElement? true : false;
            let compositeSection: boolean = (self.closest('ide-section') as PageSection).data &&
                (self.closest('ide-section') as PageSection).data?.elements?.length;

            if (!compositeSection || sectionSelected) {
                // remove section border
                this.classList.remove('hover-border');
            }
        })
    }

    private initEventBus() {
        this.events.push(
            application.EventBus.register(this, EVENT.ON_UPDATE_TOOLBAR, () => this.updateToolbar())
        )
        this.events.push(
            application.EventBus.register(this, EVENT.ON_SET_ACTION_BLOCK,  (data: {id: string; element: IPageElement, elementId:string}) => {
                const {id, element, elementId} = data;
                if (elementId && elementId === this.elementId) {
                    this.setData({...this.data.properties, [id]: element})
                    this._currentSingleContentBlockId = id;
                }
            })
        )
        this.events.push(
            application.EventBus.register(this, EVENT.ON_UPDATE_PAGE_BG, async (data: {color: string}) => {
                await this.updateUI(data);
            })
        )
        application.EventBus.register(this, EVENT.ON_CLOSE_BUILDER, () => {
            this.unRegisterEvents();
        })
    }

    async updateUI(data: {color: string}) {
        if (this._component?.getConfigurators) {
            const builderTarget = this._component.getConfigurators().find((conf: any) => conf.target === 'Builders');
            if (builderTarget?.setTag) {
                const oldTag = builderTarget?.getTag ? await builderTarget.getTag() : {};
                await builderTarget.setTag({...oldTag, background: data?.color || ''}, true);
            }
        }
    }

    onShow(options?: any): void {
        this.initEventBus();
    }

    onHide(): void {
        this.unRegisterEvents();
    }

    private unRegisterEvents() {
        for (let event of this.events) {
            event.unregister();
        }
        this.events = [];
    }

    init() {
        super.init();
        this.readonly = this.getAttribute('readonly', true, false);
        this.initEventBus();
        this.initEventListener();
    }

    render() {
        return (
            <i-vstack id="mainWrapper" width="auto" maxWidth="100%" maxHeight="100%" position="relative">
                <i-panel
                    id="toolsStack"
                    border={{ radius: 4 }}
                    background={{ color: '#fff' }}
                    class="ide-toolbar"
                    visible={false}
                >
                    <i-hstack id="toolbar" gap="0.5rem"></i-hstack>
                </i-panel>
                <i-panel
                    id="contentStack"
                    height="100%"
                    position='relative'
                    maxWidth="100%"
                    maxHeight="100%"
                    class="ide-component"
                    onClick={this.showToolbars.bind(this)}
                >
                    <i-vstack
                        id="dragStack"
                        verticalAlignment="center"
                        position="absolute"
                        left="50%" top="0px"
                        width="auto" height="auto"
                        class="dragger"
                    >
                        <i-grid-layout
                            verticalAlignment="center"
                            autoFillInHoles={true}
                            columnsPerRow={4}
                            gap={{column: '2px', row: '2px'}}
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
                        id="backdropStack"
                        width="100%" height="100%"
                        position="absolute"
                        top="0px" left="0px" zIndex={15}
                        visible={false}
                        onClick={this.showToolList.bind(this)}
                    ></i-vstack>
                </i-panel>

                <i-panel
                    position="absolute"
                    width="90%"
                    height="8px"
                    left="5%"
                    bottom="-8px"
                    zIndex={999}
                    border={{radius: '4px'}}
                    visible={false}
                    class="bottom-block"
                ></i-panel>
                
                <i-panel
                    position="absolute"
                    width="90%"
                    height="8px"
                    left="5%"
                    top="-8px"
                    zIndex={999}
                    border={{radius: '4px'}}
                    visible={false}
                    class="top-block"
                ></i-panel>

                <i-modal
                    id='mdActions'
                    title='Update Settings'
                    closeIcon={{ name: 'times' }}
                    minWidth={400}
                    maxWidth='900px'
                    closeOnBackdropClick={false}
                    onOpen={this.onShowModal.bind(this)}
                    onClose={this.onCloseModal.bind(this)}
                    class="setting-modal"
                >
                    <i-panel padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}>
                        <i-vstack
                            id="pnlFormMsg"
                            padding={{left: '1.5rem', right: '1.5rem', top: '1rem'}}
                            gap="0.5rem"
                            visible={false}
                        ></i-vstack>
                        <i-panel id="pnlForm" />
                        <i-form id="form" />
                    </i-panel>
                </i-modal>
            </i-vstack>
        );
    }
}
