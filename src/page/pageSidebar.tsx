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
    private chartsStack: GridLayout;
    private componentsStack: GridLayout;
    private sectionStack: VStack;
    private pnlMainSidebar: Panel;

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
        this.pnlMainSidebar.clearInnerHTML();
        this.pnlMainSidebar.appendChild(
            <i-vstack padding={{top: '1rem', bottom: '0.5rem', left: '1rem', right: '1rem'}} border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }}>
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
        for (const stack of categories) {
            this.pnlMainSidebar.appendChild(
                <i-scom-page-builder-collapse title={stack.title} border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-grid-layout
                        id={`${stack.id.replace('-', '')}Stack`}
                        templateColumns={['repeat(2, 1fr)']}
                        gap={{column: '0.5rem', row: '0.75rem'}}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                    ></i-grid-layout>
                </i-scom-page-builder-collapse>
            )
        }
        this.renderList(this.componentsStack, 'components');
        this.renderList(this.microdappsStack, 'micro-dapps');
        this.renderList(this.chartsStack, 'charts');
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
        application.EventBus.register(this, EVENT.ON_UPDATE_SIDEBAR, this.renderUI)
    }

    render() {
        return (
            <i-panel id="pnlMainSidebar" class="navigator" height={'100%'} maxWidth="100%"></i-panel>
        );
    }
}
