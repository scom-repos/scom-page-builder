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
import { getCategories, getPageBlocks, pageObject, setDragData } from '../store/index';
import { EVENT } from '../const/index';
import { ICategory, IPageBlockData, IPageConfig } from '../interface/index';
import { categoryButtonStyle, categoryPanelStyle, widgetModalStyle, widgetStyle } from './pageSidebar.css';
import { UpdatePageSettingsCommand, commandHistory } from '../command/index';
import { PageSettingsDialog } from '../dialogs/index';
import assets from '../assets';
import { layouts } from '../utility/layouts.json'
import { generateUUID } from '../utility/index';
import { PageMenu } from './pageMenu';

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
    private mdPageSettings: PageSettingsDialog;

    private get pageBlocks(): IPageBlockData[] {
        return getPageBlocks();
    }

    init() {
        super.init();
        this.openWidgetModal = this.openWidgetModal.bind(this);
        this.renderToolbar();
        this.renderWidgetCategories();
    }

    renderToolbar() {
        this.toolbars.clearInnerHTML();
        const iconList: any[] = [
            {
                name: 'bars',
                tooltip: { content: 'Page menu', placement: 'left' },
                onClick: (target: Control) => {
                    this.openMenuModal(target.parent);
                }
            },
            {
                name: 'cog',
                tooltip: { content: 'Page settings', placement: 'left' },
                onClick: () => {
                    this.mdPageSettings.show();
                }
            },
            {
                name: 'undo',
                tooltip: { content: 'Undo last action', placement: 'left' },
                onClick: () => commandHistory.undo()
            },
            {
                name: 'redo',
                tooltip: { content: 'Redo last action', placement: 'left' },
                onClick: () => commandHistory.redo()
            }
        ];
        this.toolbars.clearInnerHTML();
        iconList.forEach((icon) => {
            this.toolbars.appendChild(
                <i-panel>
                    <i-hstack
                        class={categoryButtonStyle}
                        width={40}
                        height={40}
                        padding={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        horizontalAlignment='center'
                        verticalAlignment='center'
                        tooltip={icon.tooltip}
                        onClick={icon.onClick}
                        overflow="hidden"
                    >
                        <i-icon width={16} height={16} name={icon.name as IconName} fill={Theme.colors.primary.main}></i-icon>
                    </i-hstack>
                </i-panel>
            );
        })
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

    convertCamelCaseToString(input: string) {
        const wordsArray = input.split(/(?=[A-Z])/);
        const capitalizedStrings = wordsArray.map((str, idx) => {
            if (typeof str !== 'string' || str.length === 0) {
                return str;
            }
            if (idx)
                return str.charAt(0).toLowerCase() + str.slice(1);
            else 
                return str.charAt(0).toUpperCase() + str.slice(1);
        });
        return capitalizedStrings.join(' ');
    }

    createMenu() {
        this.pnlWidgets.clearInnerHTML();
        const menu = (<i-scom-page-builder-menu></i-scom-page-builder-menu>) as PageMenu;
        this.pnlWidgets.appendChild(menu);
        application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
    }

    renderWidgets(category: ICategory) {
        this.pnlWidgets.clearInnerHTML();
        if (category.id === 'layouts') {
            // loop subCategory
            for (const key in layouts) {
                if (Object.prototype.hasOwnProperty.call(layouts, key)) {
                    const subCategoryLbl = (
                        <i-label caption={this.convertCamelCaseToString(key)} margin={{ top: '0.5rem' }} font={{ color: '#3b3838', weight: 600 }} class="prevent-select"></i-label>
                    )
                    this.pnlWidgets.appendChild(subCategoryLbl);
                    // loop layout
                    for (const key1 in layouts[key]) {
                        if (Object.prototype.hasOwnProperty.call(layouts[key], key1)) {
                            const moduleCard = (
                                <i-grid-layout
                                    id="sectionStack"
                                    class={widgetStyle}
                                    verticalAlignment="center"
                                    width="100%"
                                    background={{ color: '#f9f6f3' }}
                                    border={{ width: 1, style: 'solid', color: '#ebe5e5', radius: 5 }}
                                    tooltip={{ content: '✊ Drag to insert', placement: 'top' }}
                                    templateColumns={["80px", "1fr"]}
                                    overflow="hidden"
                                >
                                    <i-image url={this.getLayoutIcon(key1) || assets.icons.logo} padding={{ top: 8, bottom: 8, left: 8, right: 8 }}></i-image>
                                    <i-label
                                        caption={this.convertCamelCaseToString(key1)}
                                        font={{ size: '0.813rem', color: '#3b3838', weight: 600 }}
                                        padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        maxHeight={34}
                                        overflow={"hidden"}
                                    ></i-label>
                                </i-grid-layout>
                            );
                            moduleCard.setAttribute('draggable', 'true');
                            moduleCard.setAttribute('layout', key1);
                            moduleCard.setAttribute('layoutCat', key);
                            this.pnlWidgets.appendChild(moduleCard);
                        }
                    }
                }
            }
        } else {
            this.pnlWidgets.appendChild(<i-label caption={category.title} font={{ color: '#3b3838', weight: 600 }} class="prevent-select"></i-label>);
            let components = this.pageBlocks.filter(p => p.category === category.id);
            let matchedModules = components;
            for (const module of matchedModules) {
                const lblDesc = module.description ? (
                    <i-label caption={module.description} font={{ size: '0.813rem', color: '#8b8585' }}></i-label>
                ) : [];
                const moduleCard = (
                    <i-grid-layout
                        class={widgetStyle}
                        verticalAlignment="center"
                        width="100%"
                        background={{ color: '#f9f6f3' }}
                        border={{ width: 1, style: 'solid', color: '#ebe5e5', radius: 5 }}
                        tooltip={{ content: '✊ Drag to insert', placement: 'top' }}
                        templateColumns={["56px", "1fr"]}
                        overflow="hidden"
                    >
                        <i-image url={module.imgUrl || assets.icons.logo} padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        ></i-image>
                        <i-vstack gap="0.25rem" padding={{ top: 8, bottom: 8, left: 8, right: 8 }} overflow="hidden">
                            <i-label
                                caption={module.name}
                                font={{ size: '0.813rem', color: '#3b3838', weight: 600 }}
                            ></i-label>
                            {lblDesc}
                        </i-vstack>
                    </i-grid-layout>
                );
                this.pnlWidgets.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
    }

    getLayoutIcon(layoutName: string): string {
        return assets.img.layout[layoutName];
    }

    openWidgetModal(target: Control, category: ICategory) {
        this.mdWidget.width = '320px'
        this.pnlWidgets.addEventListener('dragstart', this.pnlWidgetsDragStartEvent);
        this.mdWidget.parent = target;
        this.renderWidgets(category);
        this.mdWidget.visible = true;
    }

    openMenuModal(target: Control) {
        this.mdWidget.width = 'auto'
        this.pnlWidgets.removeEventListener("dragstart", this.pnlWidgetsDragStartEvent)
        this.mdWidget.parent = target;
        this.createMenu();
        this.mdWidget.visible = true;
    }

    private initDrag(module: Control, data: IPageBlockData) {
        module.setAttribute('draggable', 'true');
        module.setAttribute('data-name', data.name);
    }

    getDefaultElements(layoutCat: string, layout: string) {
        const defaultLayout = (layouts[layoutCat] && layouts[layoutCat][layout]) ?
            layouts[layoutCat][layout] :
            layouts.oneWidget.emptySection ;

        return this.setUUID(defaultLayout);
    }

    setUUID(data: any) {
        const clonedData = JSON.parse(JSON.stringify(data));
        for (let i=0; i<clonedData.length; i++) {
            clonedData[i] = this.setUUIDFn(clonedData[i])
        }
        return clonedData;
    }

    setUUIDFn(data: any) {
        const clonedData = JSON.parse(JSON.stringify(data));
        clonedData.id = generateUUID();
        if (clonedData.elements) {
            for (let i=0; i<clonedData.elements.length; i++) {
                clonedData.elements[i] = this.setUUIDFn(clonedData.elements[i])
            }
        }
        return clonedData;
    }

    private pnlWidgetsDragStartEvent = (event: DragEvent) => {
        event.stopPropagation();
        const eventTarget = event.target as Control;
        if (eventTarget.nodeName === 'IMG' || (eventTarget?.closest && !eventTarget.closest('.' + widgetStyle)))
            event.preventDefault();
        if (eventTarget.id === 'sectionStack') {
            const layout = eventTarget.getAttribute("layout")
            const layoutCat = eventTarget.getAttribute("layoutCat")
            const elements = this.getDefaultElements(layoutCat, layout);
            setDragData({ module: { name: 'sectionStack', path: '' }, elements: elements });
            eventTarget.classList.add('is-dragging');
            this.mdWidget.visible = false;
        }
        else if (eventTarget?.dataset?.name) {
            const currentName = eventTarget.dataset.name;
            const module = this.pageBlocks.find(block => block.name === currentName);
            if (module) {
                application.EventBus.dispatch(EVENT.ON_SET_DRAG_ELEMENT, eventTarget);
                setDragData({ module });
                eventTarget.classList.add('is-dragging');
            }
            this.mdWidget.visible = false;
        } else {
            event.preventDefault();
        }
    }

    private onSavePageSettings(data: IPageConfig) {
        const containerEl = this.parentElement?.querySelector('.pnl-editor-wrapper') as Control;
        if (!containerEl) return;
        const updateCmd = new UpdatePageSettingsCommand(containerEl, { ...data });
        commandHistory.execute(updateCmd);
    }

    render() {
        return (
            <i-hstack position='fixed' top='50%' right={24} height={0} width={0} verticalAlignment='center'>
                <i-vstack position='absolute' right="0px" zIndex={100}>
                    <i-vstack id='toolbars' class={categoryPanelStyle} gap="0.25rem" margin={{ bottom: '1rem' }}></i-vstack>
                    <i-vstack id='pnlWidgetCategory' class={categoryPanelStyle} gap="0.25rem"></i-vstack>
                </i-vstack>
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
                <ide-page-settings-dialog
                    id="mdPageSettings"
                    onSave={this.onSavePageSettings.bind(this)}
                ></ide-page-settings-dialog>
            </i-hstack>
        )
    }
}