import {
    Module,
    customElements,
    ControlElement,
    Styles,
    GridLayout,
    Control,
    Icon,
    VStack,
    application,
} from '@ijstech/components';
import { getRootDir, setPageBlocks } from '../store/index';
import { EVENT } from '../const/index';
import { ElementType, ELEMENT_NAME, IPageBlockData } from '../interface/index';
import { Collapse } from '../common/index';
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
    onSelectModule?: (selectedModule: IPageBlockData) => Promise<void>;
}
interface IContentBlock {
    image: string;
    columns: number;
}

@customElements('ide-sidebar')
export class PageSidebar extends Module {
    private microDAppsStack: VStack;
    private chartsStack: VStack;
    private componentsStack: GridLayout;
    private onSelectModule: (selectedModule: IPageBlockData) => Promise<void>;
    private pageBlocks: IPageBlockData[];

    constructor(parent?: any) {
        super(parent);
    }

    init() {
        this.onSelectModule = this.getAttribute('onSelectModule', true);
        super.init();
        this.renderUI();
    }

    private async renderUI() {
        this.pageBlocks = await this.getPageBlocks();
        setPageBlocks(this.pageBlocks);
        this.renderComponentList();
        this.renderMircoDAppList();
        this.renderChartList();
    }

    async getPageBlocks() {
        let rootDir = getRootDir();
        let path = rootDir ? rootDir + "/scconfig.json" : "scconfig.json";
        let content = await application.getContent(path);
        let pageBlocks: IPageBlockData[] = [];
        try {
          let scconfig = JSON.parse(content);
          let components = scconfig?.components || {};
          for (let key in components) {
            pageBlocks.push(components[key]);
          }
        } catch (err) {}
        return pageBlocks;
    }

    private onAddComponent(module: IPageBlockData, type: ElementType) {
        application.EventBus.dispatch(EVENT.ON_ADD_ELEMENT, { type, module });
    }

    private async renderComponentList() {
        this.componentsStack.clearInnerHTML();
        let components = this.pageBlocks.filter(p => p.category === 'components');
        let matchedModules = components;
        for (const module of matchedModules) {
            const moduleCard = (
                <i-vstack
                    class="text-center pointer"
                    verticalAlignment="center"
                    horizontalAlignment="center"
                    minWidth={88}
                    height="5rem"
                    gap="0.5rem"
                    onClick={() => this.onAddComponent(module, ElementType.PRIMITIVE)}
                >
                    <i-panel>
                        <i-image
                            url={module.imgUrl || assets.icons.logo}
                            width={24}
                            height={24}
                            display="block"
                        ></i-image>
                    </i-panel>
                    <i-label caption={module.name}></i-label>
                </i-vstack>
            );
            this.componentsStack.append(moduleCard);
        }
    }

    private async renderMircoDAppList() {
        this.microDAppsStack.clearInnerHTML();
        let components = this.pageBlocks.filter(p => p.category === 'micro-dapps');
        let matchedModules = components;
        for (const module of matchedModules) {
            const moduleCard = (
                <i-hstack
                    height={48}
                    verticalAlignment="center"
                    gap="1rem"
                    padding={{ left: '1rem', right: '1rem' }}
                    class="pointer"
                    onClick={() => this.onAddComponent(module, ElementType.PRIMITIVE)}
                >
                    <i-panel>
                        <i-image
                            url={module.imgUrl || assets.icons.logo}
                            width={24}
                            height={24}
                            display="block"
                        ></i-image>
                    </i-panel>
                    <i-label caption={module.name} font={{ weight: 600 }}></i-label>
                </i-hstack>
            );
            this.microDAppsStack.append(moduleCard);
        }
    }

    private async renderChartList() {
        this.chartsStack.clearInnerHTML();
        let components = this.pageBlocks.filter(p => p.category === 'charts');
        let matchedModules = components;
        for (const module of matchedModules) {
            const moduleCard = (
                <i-hstack
                    height={48}
                    verticalAlignment="center"
                    gap="1rem"
                    padding={{ left: '1rem', right: '1rem' }}
                    class="pointer"
                    onClick={() => this.onAddComponent(module, ElementType.PRIMITIVE)}
                >
                    <i-panel>
                        <i-image
                            url={module.imgUrl || assets.icons.logo}
                            width={24}
                            height={24}
                            display="block"
                        />
                    </i-panel>
                    <i-label caption={module.name} font={{ weight: 600 }} />
                </i-hstack>
            );
            this.chartsStack.append(moduleCard);
        }
    }

    render() {
        return (
            <i-panel class="navigator" height={'100%'} maxWidth="100%">
                <i-scom-page-builder-collapse title="Components" border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-grid-layout
                        id="componentsStack"
                        templateColumns={['repeat(2, 1fr)']}
                        margin={{ top: 6 }}
                    ></i-grid-layout>
                </i-scom-page-builder-collapse>
                <i-scom-page-builder-collapse title="Micro DApps" border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-vstack
                        id="microDAppsStack"
                        padding={{ top: '8px', bottom: '8px' }}
                    ></i-vstack>
                </i-scom-page-builder-collapse>
                <i-scom-page-builder-collapse title="Charts" border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-vstack
                        id="chartsStack"
                        padding={{ top: '8px', bottom: '8px' }}
                    />
                </i-scom-page-builder-collapse>
            </i-panel>
        );
    }
}
