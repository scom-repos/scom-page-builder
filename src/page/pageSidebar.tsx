import {
    Module,
    customElements,
    ControlElement,
    Styles,
    GridLayout,
    Control,
    VStack,
    application,
    Panel,
} from '@ijstech/components';
import { getCategories, getPageBlocks, setDragData } from '../store/index';
import { EVENT } from '../const/index';
import { ElementType, IPageBlockData } from '../interface/index';
// import { Collapse } from '../common/index';
import './pageSidebar.css';
import assets from '../assets';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-sidebar']: PageSidebarElement;
        }
    }
}

export interface PageSidebarElement extends ControlElement {
}

@customElements('ide-sidebar')
export class PageSidebar extends Module {
    private microdappsStack: GridLayout;
    private projectmicrodappsStack: GridLayout;
    private chartsStack: GridLayout;
    private componentsStack: GridLayout;
    private sectionStack: VStack;
    private pnlLayouts: Panel;
    private pnlEmbeddables: Panel;

    private get pageBlocks(): IPageBlockData[] {
        return getPageBlocks();
    }

    constructor(parent?: any) {
        super(parent);
    }

    init() {
        super.init();
        this.renderUI();
        this.initEventListeners();
        this.initEventBus();
    }

    async renderUI() {
        const categories = getCategories();
        this.pnlLayouts.clearInnerHTML();
        this.pnlLayouts.appendChild(
            <i-vstack padding={{top: '1rem', bottom: '0.5rem', left: '1rem', right: '1rem'}} border={{ bottom: { width: 1, style: 'solid', color: 'var(--builder-divider)' } }}>
                <i-vstack
                    id="sectionStack"
                    class="text-center pointer builder-item"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    height="68px" width="100%"
                    background={{color: Theme.action.hover}}
                    gap="0.5rem"
                >
                    <i-image url={assets.icons.logo} width={24} height={24} display="block"></i-image>
                    <i-label caption="Section" font={{size: '0.813rem'}} maxHeight={34} overflow={"hidden"} opacity={0.7}></i-label>
                </i-vstack>
            </i-vstack>
        )
        this.pnlEmbeddables.clearInnerHTML();
        for (let i = 0; i < categories.length; i++) {
            const stack = categories[i];
            this.pnlEmbeddables.appendChild(
                <i-scom-page-builder-collapse
                    title={stack.title}
                    border={{
                        bottom: {
                            width: 1,
                            style: i === categories.length - 1 ? 'none' : 'solid',
                            color: 'var(--builder-divider)'
                        }
                    }}
                    expanded={true}
                >
                    <i-grid-layout
                        id={`${stack.id.replace('-', '')}Stack`}
                        templateColumns={['repeat(2, 1fr)']}
                        gap={{column: '0.5rem', row: '0.75rem'}}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                    ></i-grid-layout>
                </i-scom-page-builder-collapse>
            )
            this.renderList(this[`${stack.id.replace('-', '')}Stack`], stack.id);
        }
        this.sectionStack.setAttribute('draggable', 'true');
    }

    private async renderList(parent: Control, category: string) {
        parent.clearInnerHTML();
        let components = this.pageBlocks.filter(p => p.category === category);
        let matchedModules = components;
        for (const module of matchedModules) {
            const moduleCard = (
                <i-vstack
                    class="text-center pointer builder-item"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    gap="0.5rem"
                    overflow={'hidden'}
                    background={{color: Theme.action.hover}}
                    border={{radius: 5}}
                >
                    <i-image
                        url={module.imgUrl || assets.icons.logo}
                        width={24}
                        height={24}
                        display="block"
                    ></i-image>
                    <i-label
                        caption={module.name}
                        font={{size: '0.813rem'}} opacity={0.7}
                        maxHeight={34} overflow={"hidden"}
                    ></i-label>
                </i-vstack>
            );
            parent.append(moduleCard);
            this.initDrag(moduleCard, module);
        }
    }

    private initDrag(module: Control, data: IPageBlockData) {
        module.setAttribute('draggable', 'true');
        module.setAttribute('data-type', ElementType.PRIMITIVE);
        module.setAttribute('data-name', data.name);
    }

    private initEventListeners() {
        const self = this;
        this.addEventListener('dragstart', function (event) {
            event.stopPropagation();
            const eventTarget = event.target as Control;
            if (eventTarget.nodeName === 'IMG' || (eventTarget?.closest && !eventTarget.closest('.builder-item')))
                event.preventDefault();
            if (eventTarget.id === 'sectionStack') {
                setDragData({ module: {name: 'sectionStack', path: ''}, type: ElementType.PRIMITIVE });
                eventTarget.classList.add('is-dragging');
            }
            else if (eventTarget?.dataset?.name) {
                const currentName = eventTarget.dataset.name;
                const type = eventTarget.dataset.type as ElementType;
                const module = self.pageBlocks.find(block => block.name === currentName);
                if (module && type) {
                    application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, eventTarget);
                    setDragData({ module, type });
                    eventTarget.classList.add('is-dragging');
                }
            } else {
                event.preventDefault();
            }
        })
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SIDEBAR, (category: string) => {
            const categoryStack = category && this[`${category.replace('-', '')}Stack`];
            if (categoryStack)
                this.renderList(this[`${category.replace('-', '')}Stack`], category);
        })
    }

    render() {
        return (
            <i-panel class="navigator" height={'100%'} maxWidth="100%">
                <i-vstack padding={{top: '1rem', bottom: '0.5rem'}}>
                    <i-label
                        caption="Layouts"
                        font={{size: '1rem', weight: 600}}
                        maxHeight={34} overflow={"hidden"}
                        margin={{left: '0.5rem', bottom: '0.5rem'}}
                    ></i-label>
                    <i-panel id="pnlLayouts"></i-panel>
                </i-vstack>
                <i-vstack padding={{top: '1rem', bottom: '0.5rem'}}>
                    <i-label
                        caption="Embeddables"
                        font={{size: '1rem', weight: 600}}
                        maxHeight={34} overflow={"hidden"}
                        margin={{left: '0.5rem', bottom: '0.5rem'}}
                    ></i-label>
                    <i-panel id="pnlEmbeddables"></i-panel>
                </i-vstack>
            </i-panel>
        );
    }
}
