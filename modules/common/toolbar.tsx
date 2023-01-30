import {
    Module,
    customElements,
    Panel,
    ControlElement,
    Styles,
    HStack,
    IMenuItem,
    Menu,
    Control,
    Button,
    Input,
    Image
} from '@ijstech/components';
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
    private _component: any;

    private _mouseDownHandler: any;
    private _mouseUpHandler: any;
    private _mouseMoveHandler: any;

    constructor(parent?: any) {
        super(parent);
        this._mouseDownHandler = this.handleMouseDown.bind(this);
        this._mouseUpHandler = this.handleMouseUp.bind(this);
        this._mouseMoveHandler = this.handleMouseMove.bind(this);
    }

    private handleMouseDown(e: MouseEvent) {
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
        switch (this._currentPosition) {
            case 'left':
                this._component.style.width = (this._origWidth - offsetX) + 'px';
                break;
            case 'right':
                this._component.style.width = (this._origWidth + offsetX) + 'px';
                break;
            case 'bottom':
                this._component.style.height = (this._origHeight - offsetY) + 'px';
                break;
            case 'bottomLeft':
                this._component.style.width = (this._origWidth - offsetX) + 'px';
                this._component.style.height = (this._origHeight - offsetY) + 'px';
                this.contentStack.style.left = `${Number(this._mouseDownPos.x) - offsetX}`;
                break;
            case 'bottomRight':
                this._component.style.width = (this._origWidth + offsetX) + 'px';
                this._component.style.height = (this._origHeight - offsetY) + 'px';
                this.contentStack.style.left = `${Number(this._mouseDownPos.x) - offsetX}`;
                this.contentStack.style.top = `${Number(this._mouseDownPos.y) - offsetY}`;
                break;
        }
        this.contentStack.refresh();
    };
    private handleMouseUp(e: MouseEvent) {
        document.removeEventListener('mousemove', this._mouseMoveHandler);
        document.removeEventListener('mouseup', this._mouseUpHandler);
        const target = e.target as HTMLElement;
        const resizer = target.closest('.resize-stack');
        if (resizer) {
            resizer.classList.remove('resizing');
            this._currentResizer = null;
            this._currentPosition = 'left';
        }
    };

    get toolList() {
        return this._toolList || [];
    }
    set toolList(value: any[]) {
        this._toolList = value;
        this.renderToolbars();
    }

    get readonly() {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = value;
    }

    private async createMenu(items: IMenuItem[]) {
        let menu = await Menu.create({
            data: items,
            mode: 'vertical',
            visible: true
        });
        return menu;
    }

    appendItem(component: Control) {
        if (!this.contentStack) this.contentStack = new Panel();
        this.contentStack.clearInnerHTML();
        component.parent = this.contentStack;
        if (!this.readonly) {
            if (component instanceof Input)
                component.onFocus = this.showToolbars.bind(this);
            component.onClick = this.showToolbars.bind(this);
        }

        if (component instanceof Button || component instanceof Image) {
            this.contentStack.padding = {top: 5, left: 5, right: 5, bottom: 5};
            this.contentStack.width = 'fit-content';
            this.contentStack.classList.add('move');
        } else {
            this.contentStack.width = '100%';
        }
        component.maxWidth = '100%';
        component.maxHeight = '100%';
        this._component = component;
        this.contentStack.appendChild(component);
        this.contentStack.refresh();
        if (!this.readonly) this.renderResizeStack(component instanceof Image);
    }

    private async renderToolbars() {
        this.toolbar.clearInnerHTML();
        for (let i = 0; i < this.toolList.length; i++) {
            const tool = this.toolList[i];
            let elm: Control;
            if (Array.isArray(tool)) {
                const menu = await this.createMenu(tool);
                const modal = (
                    <i-modal
                        showBackdrop={false}
                        minWidth={200}
                        popupPlacement='bottom'
                        zIndex={100}
                    >
                        {menu}
                    </i-modal>
                );
                elm =  (
                    <i-panel>
                        <i-button
                            padding={{ left: '1rem', right: '1rem' }}
                            height={52}
                            caption={tool[0].title}
                            background={{color: 'transparent'}}
                            rightIcon={{name: 'caret-down', fill: Theme.text.primary, width: 20, height: 20}}
                            onClick={() => modal.visible = !modal.visible}
                        ></i-button>
                        { modal }
                    </i-panel>
                );
            } else {
                elm = await Button.create({
                    padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                    width: 48,
                    height: 48,
                    border: {radius: '50%'},
                    background: {color: 'transparent'},
                    ...tool
                });
                elm.classList.add('toolbar');
            }
            this.toolbar.appendChild(elm);
        }
    }

    private showToolbars() {
        if (this.toolList.length) {
            this.toolsStack.visible = true;
            this.contentStack.classList.add('active');
            this.classList.add('active');
        }
    }

    private hideToolbars() {
        this.toolsStack.visible = false;
        this.contentStack.classList.remove('active');
        this.classList.remove('active');
    }

    private initEventListener() {
        document.addEventListener('click', async (e) => {
            e.stopPropagation();
            const currentToolbar = (e.target as HTMLElement)?.closest('ide-toolbar');
            if (currentToolbar) {
                const toolbars = document.querySelectorAll('ide-toolbar');
                for (const toolbar of toolbars) {
                    (toolbar as IDEToolbar).hideToolbars();
                }
                const parentSection = currentToolbar.closest('ide-section');
                if (parentSection) parentSection.classList.remove('active');
                (currentToolbar as IDEToolbar).showToolbars();
            } else {
                this.hideToolbars();
            }
        });
    }

    private renderResizeStack(value: boolean) {
        this._eResizer = this.renderResizer('left');
        this._wResizer = this.renderResizer('right');
        this._nResizer = this.renderResizer('bottom');
        this._neResizer = this.renderResizer('bottomLeft');
        this._nwResizer = this.renderResizer('bottomRight');
        if (this._nResizer) this._nResizer.visible = value;
        if (this._neResizer) this._neResizer.visible = value;
        if (this._nwResizer) this._nwResizer.visible = value;
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
                iconEl.margin = {left: -7};
                break;
            case 'right':
                stack.top = 0;
                stack.right = 0;
                stack.height = '100%';
                iconEl.margin = {right: -7};
                break;
            case 'bottom':
                stack.bottom = -7;
                stack.left = '50%';
                stack.style.transform = 'translateX(-50%)'
                stack.height = 'auto';
                iconEl.classList.add('n-resize');
                stack.visible = false;
                break;
            case 'bottomLeft':
                stack.bottom = -7;
                stack.left = 0;
                stack.height = 'auto';
                iconEl.margin = {left: -7};
                iconEl.classList.add('ne-resize');
                stack.visible = false;
                break;
            case 'bottomRight':
                stack.bottom = -7;
                stack.right = 0;
                stack.height = 'auto';
                iconEl.margin = {right: -7};
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

    init() {
        super.init();
        this.readonly = this.getAttribute('readonly', true, false);
        if (!this.readonly)  this.initEventListener();
    }

    render() {
        return (
            <i-vstack id="mainWrapper" width="auto" maxWidth="100%" maxHeight="100%">
                <i-panel
                    id="toolsStack"
                    visible={false}
                    border={{ radius: 4 }}
                    background={{ color: '#fff' }}
                    class="ide-toolbar"
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
                ></i-panel>
            </i-vstack>
        );
    }
}
