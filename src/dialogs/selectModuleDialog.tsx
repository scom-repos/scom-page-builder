import {
    customElements,
    Module,
    Modal,
    ControlElement,
    Label,
    Input,
    Container,
    Button,
    Styles,
    Panel,
    Control
} from '@ijstech/components';
import {assignAttr} from '../utility/index';
import {IPageBlockData, ModuleCard} from "./moduleCard";
import {ICategoryData, CategoryCard} from "./categoryCard";
import './selectModuleDialog.css';

const Theme = Styles.Theme.ThemeVars;

const GET_PAGE_BLOCK_URL = `https://data.scom.dev/api/v1/audit/auditedPageBlock?packageType=2`;
const GET_CATEGORIES_URL = `https://data.scom.dev/api/v1/master/getPackageCategory?packageStatus=1&packageType=2`;

export interface SelectModuleDialogElement extends ControlElement {
    onCancel?: () => Promise<void>;
    onSelectModule?: (selectedModule: IPageBlockData) => Promise<void>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["scpage-select-module-dialog"]: SelectModuleDialogElement;
        }
    }
}
;

const SHOW_DEV_PAGEBLOCK = true;

const markdownModule: any = {
    description: 'Markdown (dev)',
    localPath: 'modules/pageblocks/pageblock-markdown',
    name: "@PageBlock/markdown",
    local: true,
}

const itemCardModule: any = {
    description: 'Item Card (dev)',
    localPath: 'modules/pageblocks/pageblock-item-card',
    name: "@PageBlock/item-card",
    local: true,
}

const imageModule: any = {
    name: "@PageBlock/image",
    description: 'Image (Dev)',
    localPath: 'modules/pageblocks/pageblock-image',
    local: true
}

const featureModule: any = {
    name: "@PageBlock/feature",
    description: 'Feature (Dev)',
    localPath: 'modules/pageblocks/pageblock-feature',
    local: true
}

const bannerModule: any = {
    name: "@PageBlock/banner",
    description: 'Banner (Dev)',
    localPath: 'modules/pageblocks/pageblock-banner',
    local: true
}

const devModules = [
    // markdownModule,
    itemCardModule,
    // imageModule,
    featureModule,
    // bannerModule
];

//
// const buybackModule: IPageBlockData = {
//     category: [{
//         icon: 'bolt',
//         idx: '5',
//         name: 'Others'
//     }],
//     chainId: 43113,
//     description: 'Buyback (dev)',
//     localPath: 'modules/packages/pageblocks/pageblock-buyback/buyback/index.js',
//     imgUrl: '',
//     ipfscid: '',
//     name: "@PageBlock/Buyback (dev)",
//     packageId: 6,
//     projectId: 3,
//     local: true,
//     dependencies: {
//         "@openswap/sdk": "modules/packages/pageblocks/pageblock-buyback/sdks/sdk/index.js",
//         "@validapp/chainlink-sdk": "modules/packages/pageblocks/pageblock-buyback/sdks/chainlink-sdk/index.js",
//         "@openswap/oracle-adaptor-sdk": "modules/packages/pageblocks/pageblock-buyback/sdks/oracle-adaptor-sdk/index.js",
//         "@buyback/assets": "modules/packages/pageblocks/pageblock-buyback/assets/index.js",
//         "@buyback/global": "modules/packages/pageblocks/pageblock-buyback/global/index.js",
//         "@buyback/store": "modules/packages/pageblocks/pageblock-buyback/store/index.js",
//         "@buyback/queue-utils": "modules/packages/pageblocks/pageblock-buyback/queue-utils/index.js",
//         "@buyback/swap-utils": "modules/packages/pageblocks/pageblock-buyback/swap-utils/index.js"
//     }
// }

@customElements('scpage-select-module-dialog')
export class SelectModuleDialog extends Module {
    private dialog: Modal;
    private pnlModuleList: Panel;
    private pnlCategoryList: Panel;
    private btnConfirm: Button;
    private txtSearch: Input;
    private onSelectModule: (selectedModule: IPageBlockData) => Promise<void>;
    private onCancel: () => Promise<void>;

    private modules: any[] = [];

    private isLoading: boolean = false;

    constructor(parent?: Container, options?: any) {
        super(parent, options)
    }

    async init() {
        super.init();
        assignAttr(this);
        let modules = await this.getModules();
        modules = [...modules, ...devModules];
        this.modules = modules;
        // for (const module of modules) {
        //     const moduleCard = <scpage-module-card data={module}></scpage-module-card>;
        //     this.pnlModuleList.append(moduleCard);
        //     moduleCard.onClick = this.onModuleCardClick;
        // }
        await this.renderModuleList();
        const categories = await this.getCategories();
        let total = 0;
        categories.forEach(v => total += v.count);
        this.pnlCategoryList.append(<scpage-category-card data={{count: total, name: "All", icon: "list", idx: "-1"}} onClick={this.handleCategoryAllClick.bind(this)}></scpage-category-card>)
        for(const category of categories) {
            const categoryCard = <scpage-category-card data={category} onClick={this.handleCategoryClick.bind(this)  }></scpage-category-card>;
            this.pnlCategoryList.append(categoryCard);
        }
    }

    async handleCategoryAllClick(control: Control, event: Event) {
        this.pnlModuleList.clearInnerHTML();
        this.modules = [...await this.getModules(), ...devModules];
        const keyword = this.txtSearch.value;
        await this.renderModuleList(keyword)
        // for (const module of modules) {
        //     const moduleCard = <scpage-module-card data={module}></scpage-module-card>;
        //     this.pnlModuleList.append(moduleCard);
        //     moduleCard.onClick = this.onModuleCardClick;
        // }
    }

    async handleCategoryClick(control: Control, event: Event) {
        this.pnlModuleList.clearInnerHTML();
        this.modules = [...await this.getModules((control as CategoryCard).data.idx), ...devModules];
        const keyword = this.txtSearch.value;
        await this.renderModuleList(keyword)
        // for (const module of modules) {
        //     const moduleCard = <scpage-module-card data={module}></scpage-module-card>;
        //     this.pnlModuleList.append(moduleCard);
        //     moduleCard.onClick = this.onModuleCardClick;
        // }
    }

    async getModules(category?: string): Promise<IPageBlockData[]> {
        const request = new Request(`${GET_PAGE_BLOCK_URL}${category ? `&categories=${category}` : ''}`);
        const response = await fetch(request);
        let data = (await response.json() as IPageBlockData[]);
        if(SHOW_DEV_PAGEBLOCK) {
            const devPageblocks : IPageBlockData[] = await this.getDevPageBlocks();
            data = [...data, ...devPageblocks];
        }
        return data;
    }

    async getDevPageBlocks(): Promise<IPageBlockData[]> {
        return [];
    }

    async getCategories() {
        const request = new Request(GET_CATEGORIES_URL);
        const response = await fetch(request);
        const data = (await response.json() as ICategoryData[]);
        return data;
    }

    show() {
        this.dialog.visible = true;
    }

    async cancel() {
        this.dialog.visible = false;
        if (this.onCancel)
            await this.onCancel();
        this.clearActive();
    }

    async confirm() {
        if(this.isLoading) return;
        this.isLoading = true;
        this.btnConfirm.icon.name = 'spinner';
        this.btnConfirm.icon.spin = true;
        const moduleCard = this.querySelector('scpage-module-card.active');
        if (moduleCard) {
            if (this.onSelectModule)
                await this.onSelectModule((moduleCard as ModuleCard).data);
            this.dialog.visible = false;
        }
        this.clearActive();
        this.btnConfirm.icon.name = 'check';
        this.btnConfirm.icon.spin = false;
        this.isLoading = false;
    }

    clearActive() {
        const moduleCards = this.querySelectorAll('scpage-module-card');
        for (const moduleCard of moduleCards) {
            moduleCard.classList.remove('active');
        }
    }

    onModuleCardClick(control: Control) {
        const moduleCards = document.querySelectorAll('scpage-module-card');
        for (const moduleCard of moduleCards) {
            moduleCard.classList.remove('active');
        }
        control.classList.add('active');
    }

    handleOnSearchChange(control: Input) {
        const keyword = control.value;
        setTimeout(async () => {
            await this.renderModuleList(keyword)
        }, 300);
    }

    async renderModuleList(keyword?: string) {
        this.pnlModuleList.clearInnerHTML()
        if(!this.modules)
            this.modules = await this.getModules();
        let matchedModules = this.modules;
        if(keyword) {
            matchedModules = this.modules.filter((v) => {
                return v.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || v.description.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
            });
        }
        for (const module of matchedModules) {
            const moduleCard = <scpage-module-card data={module}></scpage-module-card>;
            this.pnlModuleList.append(moduleCard);
            moduleCard.onClick = this.onModuleCardClick;
        }
    }

    render() {
        return (
            <i-modal
                id={'dialog'}
                showBackdrop={true}
                background={{color: Theme.background.modal}}
                maxWidth={1500}
                width={'70%'}
                position={'fixed'}
                popupPlacement={'center'}
                border={{radius: "1rem"}}
                visible={false}>
                <i-panel>
                    <i-hstack height={50} border={{bottom: {width: 1, style: 'solid', color: "#CCC"}}} justifyContent={'space-between'} alignItems={'center'} padding={{left: 20, right: 20, top: 5, bottom: 5}}>
                        <i-label caption={"Select module"}></i-label>
                        <i-icon name={'times'} width={Theme.typography.fontSize} height={Theme.typography.fontSize} onClick={this.cancel.bind(this)} class={'pointer'}></i-icon>
                    </i-hstack>
                    <i-hstack maxHeight={'800px'} height={800}>
                        <i-panel id={"pnlCategoryList"} width={"20%"}
                                 border={{right: {width: 1, style: "solid", color: "#AAA"}}}
                                 padding={{top: 10, bottom: 10, left: 10, right: 10}} overflow={{y: "auto"}}>
                        </i-panel>
                        <i-panel width={"80%"} padding={{top: 20, bottom: 20, left: 20, right: 20}}>
                            <i-panel border={{bottom: {width: 1, style: 'solid', color: Theme.divider}}} padding={{ bottom: 10}} margin={{bottom: 10}}>
                                <i-input placeholder={'Search'} id={'txtSearch'} width={'100%'} height={30}
                                         icon={{name: "search"}}
                                         onChanged={this.handleOnSearchChange.bind(this)}></i-input>
                            </i-panel>
                            <i-panel
                                id={'pnlModuleList'}
                                height={727}
                                overflow={{y: 'auto'}}
                                padding={{top: 20, bottom: 20, left: 1, right: 10}}></i-panel>
                        </i-panel>
                    </i-hstack>
                </i-panel>
                <i-hstack
                    border={{top: {width: 1, style: "solid", color: "#CCCCCC"}}}
                    width={"100%"}
                    justifyContent={'end'}
                    alignItems={'center'}
                    height={50}
                    padding={{top: 5, bottom: 5, right: 20, left: 20}}>
                    <i-button
                        id={'btnClose'}
                        caption={'Close'}
                        class={"btn btn-secondary"}
                        onClick={this.cancel}
                        icon={{name: 'times', fill: Theme.colors.success.contrastText}}
                    ></i-button>
                    <i-button
                        id={'btnConfirm'}
                        caption={'Confirm'}
                        class={"btn btn-success"}
                        onClick={this.confirm}
                        icon={{name: 'check', fill: Theme.colors.success.contrastText}}
                    ></i-button>
                </i-hstack>
            </i-modal>
        )
    }
}

export {ModuleCard, CategoryCard}
