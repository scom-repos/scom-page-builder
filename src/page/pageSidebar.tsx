import {
    ControlElement,
    customElements,
    Module,
    VStack,
    Styles,
    IconName,
    Modal,
    application,
    Control
} from '@ijstech/components';
import { getCategories, getPageBlocks, setDragData } from '../store/index';
import { EVENT } from '../const/index';
import { ICategory, IPageBlockData } from '../interface/index';
import { categoryButtonStyle, categoryPanelStyle, widgetModalStyle, widgetStyle } from './pageSidebar.css';
import assets from '../assets';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-page-builder-sidebar']: ControlElement;
        }
    }
}

@customElements('i-scom-page-builder-sidebar')
export class PageSidebar extends Module {
    private toolbars: VStack;
    private pnlWidgetCategory: VStack;
    private mdWidget: Modal;
    private pnlWidgets: VStack;

    private get pageBlocks(): IPageBlockData[] {
        return getPageBlocks();
    }

    init() {
        super.init();
        this.initEventListeners();
        this.openWidgetModal = this.openWidgetModal.bind(this);
        this.renderWidgetCategories();
    }

    renderWidgetCategories() {
        const categories = [
            {
                id: 'layouts',
                title: 'Layouts',
                icon: 'columns'
            },
            ...getCategories()
        ]
        this.pnlWidgetCategory.clearInnerHTML();
        categories.forEach(c => {
            this.pnlWidgetCategory.appendChild(
                <i-panel>
                    <i-hstack
                        class={categoryButtonStyle}
                        width={40}
                        height={40}
                        padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        horizontalAlignment='center'
                        verticalAlignment='center'
                        tooltip={{ content: c.title, placement: 'left' }}
                        onClick={(target) => this.openWidgetModal(target.parent, c)}
                    >
                        <i-icon width={16} height={16} name={c.icon as IconName} fill={Theme.colors.primary.main}></i-icon>
                    </i-hstack>
                </i-panel>
            )
            if (c.id === 'layouts') {
                this.pnlWidgetCategory.appendChild(<i-panel border={{ bottom: { width: 1, color: Theme.divider, style: 'solid' } }}></i-panel>)
            }
        })
    }

    renderWidgets(category: ICategory) {
        this.pnlWidgets.clearInnerHTML();
        this.pnlWidgets.appendChild(<i-label caption={category.title} font={{ color: Theme.text.secondary, weight: 600 }}></i-label>);
        if (category.id === 'layouts') {
            const moduleCard = (
                <i-vstack
                    id="sectionStack"
                    class={widgetStyle}
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    width="100%"
                    background={{ color: Theme.action.hover }}
                    border={{ radius: 5 }}
                    gap="0.5rem"
                >
                    <i-image url={assets.icons.logo} width={24} height={24} display="block"></i-image>
                    <i-label caption="Section" font={{ size: '0.813rem' }} maxHeight={34} overflow={"hidden"} opacity={0.7}></i-label>
                </i-vstack>
            );
            this.pnlWidgets.appendChild(moduleCard);
            moduleCard.setAttribute('draggable', 'true');
        } else {
            let components = this.pageBlocks.filter(p => p.category === category.id);
            let matchedModules = components;
            for (const module of matchedModules) {
                const moduleCard = (
                    <i-vstack
                        class={widgetStyle}
                        verticalAlignment="center"
                        horizontalAlignment="center"
                        width="100%"
                        gap="0.5rem"
                        overflow={'hidden'}
                        background={{ color: Theme.action.hover }}
                        border={{ radius: 5 }}
                    >
                        <i-image
                            url={module.imgUrl || assets.icons.logo}
                            width={24}
                            height={24}
                            display="block"
                        ></i-image>
                        <i-label
                            caption={module.name}
                            font={{ size: '0.813rem' }} opacity={0.7}
                            maxHeight={34} overflow={"hidden"}
                        ></i-label>
                    </i-vstack>
                );
                this.pnlWidgets.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
    }

    openWidgetModal(target: Control, category: ICategory) {
        this.mdWidget.parent = target;
        this.renderWidgets(category);
        this.mdWidget.visible = true;
    }

    private initDrag(module: Control, data: IPageBlockData) {
        module.setAttribute('draggable', 'true');
        module.setAttribute('data-name', data.name);
    }

    private initEventListeners() {
        const self = this;
        this.pnlWidgets.addEventListener('dragstart', function (event) {
            event.stopPropagation();
            const eventTarget = event.target as Control;
            if (eventTarget.nodeName === 'IMG' || (eventTarget?.closest && !eventTarget.closest('.' + widgetStyle)))
                event.preventDefault();
            if (eventTarget.id === 'sectionStack') {
                setDragData({ module: { name: 'sectionStack', path: '' } });
                eventTarget.classList.add('is-dragging');
                self.mdWidget.visible = false;
            }
            else if (eventTarget?.dataset?.name) {
                const currentName = eventTarget.dataset.name;
                const module = self.pageBlocks.find(block => block.name === currentName);
                if (module) {
                    application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, eventTarget);
                    setDragData({ module });
                    eventTarget.classList.add('is-dragging');
                }
                self.mdWidget.visible = false;
            } else {
                event.preventDefault();
            }
        })
    }

    render() {
        return (
            <i-hstack position='fixed' top='50%' right={24} height={0} width={0} verticalAlignment='center'>
                <i-vstack id='toolbars' class={categoryPanelStyle} gap="0.25rem"></i-vstack>
                <i-vstack id='pnlWidgetCategory' class={categoryPanelStyle} gap="0.25rem"></i-vstack>
                <i-modal
                    id='mdWidget'
                    class={widgetModalStyle}
                    height='auto'
                    width={320}
                    maxHeight='80vh'
                    showBackdrop={false}
                    popupPlacement='left'
                >
                    <i-vstack id='pnlWidgets' gap="0.5rem"></i-vstack>
                </i-modal>
            </i-hstack>
        )
    }
}