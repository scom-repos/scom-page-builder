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
    GridLayout
} from '@ijstech/components';
import './toolbar.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-toolbar']: PageRowsElement;
        }
    }
}

export interface PageRowsElement extends ControlElement {
    readonly?: boolean;
}

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-toolbar')
export class IDEToolbar extends Module {
    private _toolList: any[] = [];

    private contentStack: Panel;
    private toolsStack: Panel;
    private toolbar: HStack;
    private wrapperStack: Panel;

    get toolList() {
        return this._toolList || [];
    }
    set toolList(value: any[]) {
        this._toolList = value;
        this.renderToolbars();
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
        if (component instanceof Input)
            component.onFocus = this.showToolbars.bind(this);
        component.onClick = this.showToolbars.bind(this);
        this.contentStack.appendChild(component);
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

    private renderResizeStack() {
        // this.wrapperStack.appendChild();
    }

    init() {
        super.init();
        this.initEventListener();
        this.renderResizeStack();
    }

    render() {
        return (
            <i-panel id="mainWrapper"  width="100%" maxHeight="100%">
                <i-panel
                    id="toolsStack"
                    visible={false}
                    border={{ radius: 4 }}
                    background={{ color: '#fff' }}
                    class="ide-toolbar"
                >
                    <i-hstack id="toolbar" gap="0.5rem"></i-hstack>
                </i-panel>
                <i-hstack id="wrapperStack" width="100%" height="auto">
                    <i-vstack
                        verticalAlignment="center"
                        resizer={true} dock="left" top={0} zIndex={20}
                        minWidth="8px" height="100%"
                        class="left"
                    >
                        <i-icon
                            name="circle"
                            fill={Theme.colors.primary.main}
                            height={16} width={16}
                            margin={{left: '-7px'}}
                            class="resize-icon left-resize"
                        ></i-icon>
                    </i-vstack>
                    <i-panel
                        id="contentStack"
                        width="100%" height="100%"
                        class="ide-component"
                        onClick={this.showToolbars.bind(this)}
                    ></i-panel>
                    <i-vstack
                        verticalAlignment="center"
                        resizer={true} dock="right" top={0} zIndex={20}
                        minWidth="8px" height="100%"
                        class="right"
                    >
                        <i-icon
                            name="circle"
                            fill={Theme.colors.primary.main}
                            height={16} width={16}
                            margin={{right: '-7px'}}
                            class="resize-icon right-resize"
                        ></i-icon>
                    </i-vstack>
                </i-hstack>
            </i-panel>
        );
    }
}
