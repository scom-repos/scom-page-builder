import {
    Module,
    customElements,
    Panel,
    ControlElement,
    Styles,
    HStack,
    Button,
    application,
    renderUI,
    Modal
} from '@ijstech/components';
import { EVENT } from '../const/index';
import { IPageBlockAction } from '../interface/index';
import { pageObject } from '../store/index';
import { commandHistory, getModule, ResizeElementCommand } from '../utility/index';
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
    private _isResizing: boolean = false;
    private _origWidth: number;
    private _origHeight: number;
    private _mouseDownPos: any;
    private currentAction: IPageBlockAction = null;

    private contentStack: Panel;
    private toolsStack: Panel;
    private toolbar: HStack;
    private _eResizer: Panel;
    private _wResizer: Panel;
    private _nResizer: Panel;
    private _neResizer: Panel;
    private _nwResizer: Panel;
    private _currentResizer: Panel;
    private _currentPosition: IPosition;
    private _component: any = null;
    private dragStack: Panel;
    private pnlForm: Panel;
    private mdActions: Modal;

    private _mouseDownHandler: any;
    private _mouseUpHandler: any;
    private _mouseMoveHandler: any;

    data: any;
    private _rowId: string;

    constructor(parent?: any) {
        super(parent);
        this._mouseDownHandler = this.handleMouseDown.bind(this);
        this._mouseUpHandler = this.handleMouseUp.bind(this);
        this._mouseMoveHandler = this.handleMouseMove.bind(this);
        this.setData = this.setData.bind(this);
        this.getData = this.getData.bind(this);
    }

    private handleMouseDown(e: MouseEvent) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const resizer = target.closest('.resize-stack') as Panel;
        this._origHeight = this._component.offsetHeight;
        this._origWidth = this._component.offsetWidth;
        if (resizer) {
            resizer.classList.add('resizing');
            this._mouseDownPos = {
                x: e.clientX,
                y: e.clientY
            };
            this._currentResizer = resizer;
            this._currentPosition = resizer.getAttribute('direction') as IPosition;
            document.addEventListener('mousemove', this._mouseMoveHandler);
            document.addEventListener('mouseup', this._mouseUpHandler);
        }
    };

    private handleMouseMove(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        let offsetX = e.clientX - this._mouseDownPos.x;
        let offsetY = e.clientY - this._mouseDownPos.y;
        let newWidth = '';
        let newHeight = '';
        switch (this._currentPosition) {
            case 'left':
                newWidth = (this._origWidth - offsetX) + 'px';
                break;
            case 'right':
                newWidth = (this._origWidth + offsetX) + 'px';
                break;
            case 'bottom':
                newHeight = (this._origHeight + offsetY) + 'px';
                break;
            case 'bottomLeft':
                newWidth = (this._origWidth - offsetX) + 'px';
                newHeight = (this._origHeight + offsetY) + 'px';
                this.contentStack.style.left = `${Number(this._mouseDownPos.x) - offsetX}`;
                this.contentStack.style.top = `${Number(this._mouseDownPos.y) - offsetY}`;
                break;
            case 'bottomRight':
                newWidth = (this._origWidth + offsetX) + 'px';
                newHeight = (this._origHeight + offsetY) + 'px';
                this.contentStack.style.left = `${Number(this._mouseDownPos.x) - offsetX}`;
                this.contentStack.style.top = `${Number(this._mouseDownPos.y) - offsetY}`;
                break;
        }
        this.contentStack.width = 'fit-content';
        this._component.width = newWidth;
        this._component.height = newHeight;
        this.contentStack.refresh();
    };

    private handleMouseUp(e: MouseEvent) {
        e.stopPropagation();
        document.removeEventListener('mousemove', this._mouseMoveHandler);
        document.removeEventListener('mouseup', this._mouseUpHandler);
        const target = e.target as HTMLElement;
        const resizer = target.closest('.resize-stack');
        resizer && resizer.classList.remove('resizing');
        this._currentResizer = null;
        this._currentPosition = 'left';
        // TODO: check resize other component
        const resizeCmd = new ResizeElementCommand(this._component, this._origWidth, this._origHeight);
        commandHistory.execute(resizeCmd);
        application.EventBus.dispatch(EVENT.ON_RESIZE, { newWidth: Number(this._component.width), oldWidth: this._origWidth });
    };

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
                caption: `<i-icon name="${tool.icon}" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                onClick: () => {
                    console.log('button click: ', tool.name);
                    this.currentAction = tool;
                    this.mdActions.visible = true;
                    this.hideToolbars();
                }
            });
            elm.classList.add('toolbar');
            this.toolbar.appendChild(elm);
        }
    }

    private onShowModal() {
        this.renderToolbarAction(this.currentAction);
    }

    private async renderToolbarAction(action: IPageBlockAction) {
        this.pnlForm.clearInnerHTML();
        const data = await this.getData();
        renderUI(this.pnlForm, action.userInputDataSchema, this.onSave.bind(this), data);
    }

    private onSave(result: boolean, data: any) {
        let trimedData = data.split(',').join(',\n');
        trimedData = trimedData.split('{').join('{\n').split('}').join('\n}');
        console.log(`result: ${result},\ndata: ${trimedData}`);
        if (result) {
            const commandIns = this.currentAction.command(this, JSON.parse(trimedData));
            commandHistory.execute(commandIns);
            this.mdActions.visible = false;
        } else {
            if (data === 'action canceled')
                this.mdActions.visible = false;
        }
    }

    showToolbars() {
        if (this.toolList.length)
            this.toolsStack.visible = true;
        this.contentStack && this.contentStack.classList.add('active');
        this.classList.add('active');
    }

    hideToolbars() {
        this.toolsStack.visible = false;
        this.contentStack && this.contentStack.classList.remove('active');
        this.classList.remove('active');
    }

    private renderResizeStack() {
        this._eResizer = this.renderResizer('left');
        this._wResizer = this.renderResizer('right');
        this._nResizer = this.renderResizer('bottom');
        this._neResizer = this.renderResizer('bottomLeft');
        this._nwResizer = this.renderResizer('bottomRight');
        const isImage = this.data.module?.name === 'Image';
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
        stack.setAttribute('direction', position);
        stack.addEventListener('mousedown', this._mouseDownHandler);
        this.contentStack.appendChild(stack);
        return stack;
    }

    async fetchModule() {
        if (this._readonly) return;
        const ipfscid = this.data.module?.ipfscid || '';
        const localPath = this.data.module?.localPath || '';
        const module = await getModule({ipfscid, localPath});
        if (module) {
            module.parent = this.contentStack;
            this.contentStack.append(module);
            this._component = module;
            this._component.maxWidth = '100%';
            this._component.maxHeight = '100%';
            this._component.overflow = 'hidden';
            this._component.style.display = 'block';
            this._component.onClick = () => {
                this.checkToolbar();
                this.showToolbars();
            }
            if (this.data.module?.name === 'Text box') {
                this.dragStack.visible = true;
                this.contentStack.classList.remove('move');
            } else {
                this.dragStack.visible = false;
                this.contentStack.classList.add('move');
            }
            this.renderResizeStack();
            this.toolList = this._component.getActions ? this._component.getActions() : [];
        }
    }

    async setData(data: any) {
        if (this._component) {
            if (data.width) this._component.width = data.width;
            if (data.height) this._component.height = data.height;
            await this._component.setTag(data);
            await this._component.setData(data);
            pageObject.setElement(this.rowId, this.data.id, this._component.data);

        } 
    }

    async getData() {
        return this._component ? await this._component.getData() : null;
    }

    private checkToolbar() {
        const isShowing = this.toolsStack.visible;
        const toolbars = document.querySelectorAll('ide-toolbar');
        for (const toolbar of toolbars) {
            (toolbar as IDEToolbar).hideToolbars();
        }
        isShowing && this.showToolbars();
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
                    class="setting-modal"
                >
                    <i-panel
                        id="pnlForm"
                        padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
                    ></i-panel>
                </i-modal>
            </i-vstack>
        );
    }
}
