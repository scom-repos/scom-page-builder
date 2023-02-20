import {
    Module,
    customElements,
    Panel,
    ControlElement,
    Styles,
    HStack,
    Button,
    renderUI,
    Modal,
    IRenderUIOptions
} from '@ijstech/components';
import { IPageBlockAction, IPageElement, ValidationError } from '../interface/index';
import { pageObject } from '../store/index';
import { commandHistory, getModule, isEmpty, RemoveToolbarCommand, ResizeElementCommand } from '../utility/index';
import './toolbar.css';

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
const Theme = Styles.Theme.ThemeVars;

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

    private _rowId: string;
    private _elementId: string;

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
        this.fetchModule = this.fetchModule.bind(this);
    }

    get data() {
        return pageObject.getElement(this.rowId, this.elementId);
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

    private async renderToolbars() {
        this.toolbar.clearInnerHTML();
        for (let i = 0; i < this.toolList.length; i++) {
            const tool = this.toolList[i];
            let elm = await Button.create({
                padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                width: 48,
                height: 48,
                border: {radius: '50%'},
                background: {color: 'transparent'},
                visible: tool.visible ? tool.visible() : true,
                caption: `<i-icon name="${tool.icon}" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                onClick: () => {
                    this.currentAction = tool;
                    if (isEmpty(tool.userInputDataSchema)) {
                        const commandIns = this.currentAction.command(this, null);
                        commandHistory.execute(commandIns);
                    } else {
                        this.mdActions.visible = true;
                    }
                    this.hideToolbars();
                }
            });
            elm.classList.add('toolbar');
            this.toolbar.appendChild(elm);
        }
        const removeBtn = await Button.create({
            padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
            width: 48,
            height: 48,
            border: {radius: '50%'},
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

    private renderToolbarAction(action: IPageBlockAction) {
        this.pnlForm.clearInnerHTML();
        const data = this.data.properties;
        if (data.height === 'auto') data.height = this.offsetHeight;
        if (data.width === 'auto') data.width = this.offsetWidth;
        const options: IRenderUIOptions = {
            columnWidth: '100%',
            columnsPerRow: 1,
            confirmButtonBackgroundColor: Theme.colors.primary.main,
            confirmButtonFontColor: Theme.colors.primary.contrastText
        }
        // console.log('schema: ', action.userInputDataSchema)
        // console.log('data: ', data)
        // renderUI(this.pnlForm, action.userInputDataSchema, this.onSave.bind(this), data, options);
        let properties;
        //FIXME: used temporarily for container type
        if (data.content && data.content.properties) {
            properties = data.content.properties;
        }
        else {
            properties = data;
        }
        let tag = data?.content?.tag || this.data.tag || {};
        renderUI(this.pnlForm, action.userInputDataSchema, this.onSave.bind(this), {...properties, ...tag}, options);
    }

    private onSave(result: boolean, data: any) {
        if (result) {
            const commandIns = this.currentAction.command(this, data);
            commandHistory.execute(commandIns);
            this.mdActions.visible = false;
        } else if (data?.errors) {
            this.pnlFormMsg.visible = true;
            this.renderError(data.errors || []);
        }
    }

    private isTexbox() {
        return this.data.module.name === 'Textbox';
    }

    showToolbars() {
        if (this.toolList.length)
            this.toolsStack.visible = true;
        this.contentStack && this.contentStack.classList.add('active');
        this.classList.add('active');
        // if (this.isTexbox() && this._component.edit) {
        //     this._component.edit();
        //     this.isEditing = true;
        // }
    }

    hideToolbars() {
        this.toolsStack.visible = false;
        this.contentStack && this.contentStack.classList.remove('active');
        this.classList.remove('active');
        // if (this.isTexbox() && this._component.confirm && this.isEditing) {
        //     this._component.confirm();
        //     this.isEditing = false;
        // }
    }

    private renderResizeStack(data: IPageElement) {
        this._eResizer = this.renderResizer('left');
        this._wResizer = this.renderResizer('right');
        this._nResizer = this.renderResizer('bottom');
        this._neResizer = this.renderResizer('bottomLeft');
        this._nwResizer = this.renderResizer('bottomRight');
        const isImage = data?.module?.name === 'Image';
        if (this._nResizer) this._nResizer.visible = isImage;
        if (this._neResizer) this._neResizer.visible = isImage;
        if (this._nwResizer) this._nwResizer.visible = isImage;
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
                stack.left = 0;
                stack.height = '100%';
                iconEl.margin = {left: -8};
                break;
            case 'right':
                stack.top = 0;
                stack.right = 0;
                stack.height = '100%';
                iconEl.margin = {right: -8};
                break;
            case 'bottom':
                stack.bottom = -10;
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
        const ipfscid = data.module?.ipfscid || '';
        const localPath = data.module?.localPath || '';
        try {
            const module = await getModule({ipfscid, localPath});
            if (module) {
                await module.init();
                module.parent = this.contentStack;
                this.contentStack.append(module);
                this._component = module;
                this._component.maxWidth = '100%';
                this._component.maxHeight = '100%';
                this._component.overflow = 'hidden';
                this._component.style.display = 'block';
                this._component.onClick = () => {
                    this.toolList = this._component.getActions ? this._component.getActions() : [];
                    this.checkToolbar();
                    this.showToolbars();
                }
                if (this.isTexbox()) {
                    this.dragStack.visible = true;
                    this.contentStack.classList.remove('move');
                } else {
                    this.dragStack.visible = false;
                    this.contentStack.classList.add('move');
                }
                this.renderResizeStack(data);
            }
        } catch(error) {
            console.log('fetch module error: ', error)
        }
    }

    async setData(properties: any) {
        // update data from pageblock
        if (!this._component) return;
        pageObject.setElement(this.rowId, this.data.id, { properties });
    }

    async setTag(tag: any) {
        if (!this._component) return;
        await this._component.setTag(tag);
        if (this.data?.properties?.content) {
            const properties = this.data.properties;
            properties.content.tag = tag;
            pageObject.setElement(this.rowId, this.data.id, { properties });
        }
        else
            pageObject.setElement(this.rowId, this.data.id, { tag });
    }

    async setProperties(data: any) {
        if (!this._component) return;
        if (data.width === '100%') data.width = Number(this.width);
        await this._component.setData(data);
    }

    private checkToolbar() {
        const isShowing = this.toolsStack.visible;
        const pageRows= document.querySelectorAll('ide-row');
        if (pageRows) {
            for (const row of pageRows) {
                const toolbarElm = row.querySelector('ide-toolbar') as IDEToolbar;
                if (toolbarElm)
                    toolbarElm.hideToolbars();
                row.classList.remove('active');
            }
        }
        isShowing && this.showToolbars();
    }

    private renderError(errors: ValidationError[]) {
        this.pnlFormMsg.clearInnerHTML();
        errors.forEach(error => {
            this.pnlFormMsg.appendChild(
                <i-label
                    caption={`${error.property} ${error.message}`}
                    font={{color: Theme.colors.error.main, size: '0.75rem'}}
                ></i-label>
            );
        })
    }

    _handleClick(event: Event): boolean {
        if (this._readonly) return super._handleClick(event, true);
        this.checkToolbar();
        return super._handleClick(event, true);
    }

    init() {
        super.init();
        this.readonly = this.getAttribute('readonly', true, false);
    }

    render() {
        return (
            <i-vstack id="mainWrapper" width="auto" maxWidth="100%" maxHeight="100%">
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
                </i-panel>
                <i-modal
                    id='mdActions'
                    title='Update Settings'
                    closeIcon={{ name: 'times' }}
                    minWidth={400}
                    maxWidth={500}
                    closeOnBackdropClick={false}
                    onOpen={this.onShowModal.bind(this)}
                    onClose={this.onCloseModal.bind(this)}
                    class="setting-modal"
                >
                    <i-panel>
                        <i-vstack
                            id="pnlFormMsg"
                            padding={{left: '1.5rem', right: '1.5rem', top: '1rem'}}
                            gap="0.5rem"
                            visible={false}
                        ></i-vstack>
                        <i-panel
                            id="pnlForm"
                            padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
                        ></i-panel>
                    </i-panel>
                </i-modal>
            </i-vstack>
        );
    }
}
