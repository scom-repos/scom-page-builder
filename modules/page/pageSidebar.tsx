import {
    Module,
    customElements,
    ControlElement,
    TreeView,
    TreeNode,
    Styles,
    GridLayout,
    Control,
    Icon,
    VStack
} from '@ijstech/components';
import assets from '@page/assets';
const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-sidebar']: PageSidebarElement;
        }
    }
}

import './pageSidebar.css';

export interface PageSidebarElement extends ControlElement {}

@customElements('ide-sidebar')
export class PageSidebar extends Module {
    public tvMenu: TreeView;
    private blockStack: GridLayout;
    private componentsStack: VStack;


    private _contentBlocks: any[] = [];
    private _components: any[] = [];

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    initEventBus() {}

    init() {
        super.init();
        this.renderUI();
    }

    private renderBlockStack() {
        this._contentBlocks = [
            {
                image: 'img/blocks/block1.svg' 
            },
            {
                image: 'img/blocks/block2.svg' 
            },
            {
                image: 'img/blocks/block3.svg' 
            },
            {
                image: 'img/blocks/block4.svg' 
            }
        ]
        this.blockStack.clearInnerHTML();
        this._contentBlocks.forEach(block => {
            this.blockStack.appendChild(
                <i-vstack class="block-image pointer" verticalAlignment="center" horizontalAlignment="center">
                    <i-image width="auto" height="100%" url={assets.fullPath(block.image)}></i-image>
                </i-vstack>
            )
        })
    }

    private renderComponentsStack() {
        this._components = [
            {
                name: 'Collapsible group'
            },
            {
                name: 'Table of contents'
            },
            {
                name: 'Image carousel'
            },
            {
                name: 'Button'
            },
            {
                name: 'Divider'
            }
        ]
        this.componentsStack.clearInnerHTML();
        this._components.forEach(component => {
            this.componentsStack.appendChild(
                <i-hstack
                    height={48}
                    verticalAlignment="center"
                    gap="1rem"
                    padding={{left: '1rem', right: '1rem'}}
                    class="pointer"
                >
                    <i-panel>
                        <i-icon name="circle" width={24} height={24}></i-icon>
                    </i-panel>
                    <i-label caption={component.name} font={{weight: 600}}></i-label>
                </i-hstack>
            )
        })
    }

    private renderUI() {
        this.renderBlockStack();
        this.renderComponentsStack();
    }

    private onToggleBlock(source: Control) {
        this.blockStack.visible = !this.blockStack.visible;
        const icon = source.querySelector('i-icon') as Icon;
        icon && (icon.name = this.blockStack.visible ? 'angle-up' : 'angle-down');
    }

    render() {
        return (
            <i-panel class="navigator" height={'100%'} maxWidth="100%">
                <i-tabs 
                    class="insert-tabs"
                >
                    <i-tab
                        caption='Insert'
                        font={{weight: '600', color: Theme.text.primary, size: '1rem'}}
                        background={{color: 'transparent'}}
                    >
                        <i-panel height="100%" overflow={{y: 'hidden'}}>
                            <i-grid-layout templateColumns={['repeat(2, 1fr)']} templateRows={['repeat(2, 5rem)']} margin={{top: 6}}>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="text-width" width={24} height={24}></i-icon>
                                    <i-label caption='Text box'></i-label>
                                </i-vstack>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="image" width={24} height={24}></i-icon>
                                    <i-label caption='Image'></i-label>
                                </i-vstack>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="code" width={24} height={24}></i-icon>
                                    <i-label caption='Embed'></i-label>
                                </i-vstack>
                                <i-vstack class="text-center pointer" verticalAlignment="center" horizontalAlignment='center' minWidth={88} gap="0.5rem">
                                    <i-icon name="hdd" width={24} height={24}></i-icon>
                                    <i-label caption='Drive'></i-label>
                                </i-vstack>
                            </i-grid-layout>
                            <i-vstack
                                border={{bottom: { width: 1, style: 'solid', color: Theme.divider}, top: { width: 1, style: 'solid', color: Theme.divider}}}
                            >
                                <i-hstack
                                    horizontalAlignment="space-between"
                                    verticalAlignment="center"
                                    padding={{left: '1rem'}}
                                    margin={{top: 8, bottom: 8, left: 8, right: 0}}
                                    class="pointer"
                                    onClick={(source) => this.onToggleBlock(source)}
                                >
                                    <i-label caption="Content blocks" font={{weight: 600, size: '0.75rem', transform: 'uppercase'}}></i-label>
                                    <i-icon name="angle-down" fill={Theme.text.primary} width={24} height={24}></i-icon>
                                </i-hstack>
                                <i-grid-layout
                                    id="blockStack"
                                    templateColumns={['repeat(2, 1fr)']}
                                    gap={{column: 12, row: 12}}
                                    border={{bottom: { width: 1, style: 'solid', color: Theme.divider}}}
                                    padding={{left: '8px', right: '8px', bottom: '1rem'}}
                                ></i-grid-layout>
                            </i-vstack>
                            <i-vstack
                                id="componentsStack"
                                padding={{top: '8px', bottom: '8px'}}
                            ></i-vstack>
                        </i-panel>
                    </i-tab>
                    <i-tab caption='Pages'>
                        <i-panel>
                            <i-label caption='Pages'></i-label>
                        </i-panel>
                    </i-tab>
                </i-tabs>
            </i-panel>
        );
    }
}
