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
    Input
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

    get toolList() {
        return this._toolList;
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

    showToolbars() {
        this.toolsStack.visible = true;
        this.contentStack.classList.add('active');
    }

    hideToolbars() {
        this.toolsStack.visible = false;
        this.contentStack.classList.remove('active');
    }

    initEventListener() {
        document.addEventListener('click', async (e) => {
            e.stopPropagation();
            const toolbar = (e.target as HTMLElement)?.closest('ide-toolbar');
            if (!toolbar || toolbar && !toolbar.isEqualNode(this)) {
                this.hideToolbars();
            }
        });
    }

    init() {
        super.init();
        this.contentStack.resizer = true;
        this.initEventListener();
    }

    render() {
        return (
            <i-panel>
                <i-vstack position="relative">
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
                        minWidth={200}
                        class="ide-component"
                        onClick={() => this.showToolbars()}
                    ></i-panel>
                </i-vstack>
            </i-panel>
        );
    }
}
