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
import { setPageBlocks } from '../store/index';
import { EVENT } from '../const/index';
import { ElementType, ELEMENT_NAME, IPageBlockData } from '../interface/index';
import { Collapse } from '../common/index';
import './pageSidebar.css';
import assets from '../assets';

const Theme = Styles.Theme.ThemeVars;
const GET_PAGE_BLOCK_URL = `https://data.scom.dev/api/v1/audit/auditedPageBlock?packageType=2`;
// const GET_CATEGORIES_URL = `https://data.scom.dev/api/v1/master/getPackageCategory?packageStatus=1&packageType=2`;
const SHOW_DEV_PAGEBLOCK = true; // For showing dev modules

// interface ICategoryData {
//     name: string;
//     idx: string;
//     icon: string;
//     count: number;
// }

const imageModule: any = {
    description: 'Image (dev)',
    localPath: 'modules/pageblocks/scom-image',
    name: '@PageBlock/Scom Image',
    imgUrl: assets.icons.logo,
    local: true,
};

const dappModule: any = {
    description: 'Dapp ',
    localPath: 'modules/pageblocks/scom-dapp-container',
    name: '@PageBlock/Dapp Container',
    imgUrl: assets.icons.logo,
    local: true,
};

const nftModule: any = {
    description: 'Nft (dev)',
    localPath: 'modules/pageblocks/scom-nft-minter',
    name: '@PageBlock/NFT Minter',
    imgUrl: assets.icons.logo,
    local: true,
};

const gemModule: any = {
    description: 'Gem (dev)',
    localPath: 'modules/pageblocks/scom-gem-token',
    name: '@PageBlock/Gem Token',
    imgUrl: assets.icons.logo,
    local: true,
};

const randomizerModule: any = {
    description: 'Randomizer (dev)',
    localPath: 'modules/pageblocks/scom-randomizer',
    name: '@PageBlock/Randomizer',
    imgUrl: assets.icons.logo,
    local: true,
};

const textboxModule: any = {
    description: 'Textbox (dev)',
    localPath: 'modules/pageblocks/scom-markdown-editor',
    name: '@PageBlock/Markdown Editor',
    imgUrl: assets.icons.logo,
    local: true,
};

const carouselModule: any = {
    description: 'Carousel (dev)',
    localPath: 'modules/pageblocks/scom-carousel',
    name: ELEMENT_NAME.CAROUSEL,
    imgUrl: assets.icons.logo,
    local: true,
};

const videoModule: any = {
    description: 'Video',
    localPath: 'modules/pageblocks/scom-video',
    name: ELEMENT_NAME.VIDEO,
    imgUrl: assets.icons.logo,
    local: true,
};

const mapModule: any = {
    description: 'Map',
    localPath: 'modules/pageblocks/scom-map',
    name: ELEMENT_NAME.MAP,
    imgUrl: assets.icons.logo,
    local: true,
};

const bannerModule: any = {
    description: 'Banner',
    localPath: 'modules/pageblocks/scom-banner',
    name: ELEMENT_NAME.BANNER,
    imgUrl: assets.icons.logo,
    local: true
}

const blogModule: any = {
    description: 'Blog',
    localPath: 'modules/pageblocks/scom-blog',
    name: ELEMENT_NAME.BLOG,
    imgUrl: assets.icons.logo,
    local: true
}

const firstDevModules = [
    textboxModule,
    imageModule,
    carouselModule,
    bannerModule,
    blogModule
];

const devModules = [
    ...firstDevModules,
    dappModule,
    nftModule,
    gemModule,
    videoModule,
    randomizerModule,
    mapModule
];

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
    private blockStack: GridLayout;
    private componentsStack: VStack;

    private firstStack: GridLayout;
    private _contentBlocks: IContentBlock[] = [];
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
        this.pageBlocks = await this.getModules('5');
        setPageBlocks(this.pageBlocks);
        this.renderFirstStack();
        // this.renderBlockStack();
        this.renderComponentList();
    }

    private onToggleBlock(source: Control) {
        this.blockStack.visible = !this.blockStack.visible;
        const icon = source.querySelector('i-icon') as Icon;
        icon && (icon.name = this.blockStack.visible ? 'angle-up' : 'angle-down');
    }

    private onAddComponent(module: IPageBlockData, type: ElementType) {
        application.EventBus.dispatch(EVENT.ON_ADD_ELEMENT, { type, module });
    }

    private async getModules(category?: string): Promise<IPageBlockData[]> {
        let data = [];
        if (SHOW_DEV_PAGEBLOCK) {
            const devPageblocks: IPageBlockData[] = await this.getDevPageBlocks();
            data = [...devPageblocks];
        } else {
            const request = new Request(
                `${GET_PAGE_BLOCK_URL}${category ? `&categories=${category}` : ''}`
            );
            const response = await fetch(request);
            data = (await response.json()) as IPageBlockData[];
        }
        return data;
    }

    private async getDevPageBlocks(): Promise<IPageBlockData[]> {
        return [...devModules]; // []; // Mikey Test: [...firstDevModules];
    }

    private async renderFirstStack() {
        this.firstStack.clearInnerHTML();
        let components = [];
        try {
            const filterdModules = this.pageBlocks.filter((v) => {
                return (
                    v.name === '@PageBlock/Scom Image' ||
                    v.name === '@PageBlock/Markdown Editor' ||
                    v.name === ELEMENT_NAME.CAROUSEL ||
                    v.name === ELEMENT_NAME.BANNER ||
                    v.name === ELEMENT_NAME.BLOG
                );
            });
            for (let module of filterdModules) {
                if (module.name === '@PageBlock/Scom Image') module.name = ELEMENT_NAME.IMAGE;
                else if (module.name === '@PageBlock/Markdown Editor')
                    module.name = ELEMENT_NAME.TEXTBOX;
                // else if (module.name === 'Carousel (dev)') module.name = 'Carousel (dev)';
                components.push(module);
            }
        } catch {
            components = [...firstDevModules];
        }
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
                            url={module.imgUrl}
                            width={24}
                            height={24}
                            display="block"
                        ></i-image>
                    </i-panel>
                    <i-label caption={module.name}></i-label>
                </i-vstack>
            );
            this.firstStack.append(moduleCard);
        }
    }

    // private renderBlockStack() {
    //     this._contentBlocks = [
    //         {
    //             image: 'img/blocks/block1.svg',
    //             columns: 2,
    //         },
    //         {
    //             image: 'img/blocks/block2.svg',
    //             columns: 2,
    //         },
    //         {
    //             image: 'img/blocks/block3.svg',
    //             columns: 2,
    //         },
    //         {
    //             image: 'img/blocks/block4.svg',
    //             columns: 3,
    //         },
    //     ];
    //     this.blockStack.clearInnerHTML();
    //     this._contentBlocks.forEach((block) => {
    //         let config = { width: '100%', columns: block.columns };
    //         let sectionData: any = {};
    //         sectionData.toolList = [
    //             textStyles,
    //             {
    //                 caption: `<i-icon name="bold" width=${20} height=${20} fill="${
    //                     Theme.text.primary
    //                 }"></i-icon>`,
    //                 onClick: () => {},
    //             },
    //             {
    //                 caption: `<i-icon name="italic" width=${20} height=${20} fill="${
    //                     Theme.text.primary
    //                 }"></i-icon>`,
    //                 onClick: () => {},
    //             },
    //             {
    //                 caption: `<i-icon name="trash" width=${20} height=${20} fill="${
    //                     Theme.text.primary
    //                 }"></i-icon>`,
    //                 onClick: async () => {},
    //             },
    //         ];
    //         sectionData.component = {
    //             type: 'Input',
    //             properties: {
    //                 minHeight: '2.5rem',
    //                 width: '100%',
    //                 minWidth: 200,
    //             },
    //         };
    //         this.blockStack.appendChild(
    //             <i-vstack
    //                 class="block-image pointer"
    //                 verticalAlignment="center"
    //                 horizontalAlignment="center"
    //                 // onClick={() => this.onAddRow({ config, elements: [sectionData, sectionData] })}
    //             >
    //                 <i-image
    //                     width="auto"
    //                     height="100%"
    //                     url={assets.fullPath(block.image)}
    //                 ></i-image>
    //             </i-vstack>
    //         );
    //     });
    // }

    private async renderComponentList(keyword?: string) {
        this.componentsStack.clearInnerHTML();
        let components = [];
        const filterdModules = this.pageBlocks.filter((v) => {
            return [
                '@PageBlock/NFT Minter',
                '@PageBlock/Gem Token',
                '@PageBlock/Randomizer',
                ELEMENT_NAME.VIDEO,
                ELEMENT_NAME.MAP
            ].includes(v.name);
        });
        for (let module of filterdModules) {
            if (module.name === '@PageBlock/NFT Minter') module.name = ELEMENT_NAME.NFT;
            else if (module.name === '@PageBlock/Gem Token') module.name = ELEMENT_NAME.GEM_TOKEN;
            else if (module.name === '@PageBlock/Randomizer') module.name = ELEMENT_NAME.RANDOMIZER;
            components.push(module);
        }
        let matchedModules = components;
        if (keyword) {
            matchedModules = components.filter((v) => {
                return (
                    v.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                    v.description.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
                );
            });
        }
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
                            url={module.imgUrl}
                            width={24}
                            height={24}
                            display="block"
                        ></i-image>
                    </i-panel>
                    <i-label caption={module.name} font={{ weight: 600 }}></i-label>
                </i-hstack>
            );
            this.componentsStack.append(moduleCard);
        }
    }

    render() {
        return (
            <i-panel class="navigator" height={'100%'} maxWidth="100%">
                {/* <i-tabs class="insert-tabs">
                    <i-tab caption="Components" background={{ color: 'transparent' }} font={{ name: Theme.typography.fontFamily }}>
                        <i-panel height="100%" overflow={{ y: 'hidden' }}>
                            <i-grid-layout
                                id="firstStack"
                                templateColumns={['repeat(2, 1fr)']}
                                margin={{ top: 6 }}
                            ></i-grid-layout>
                            <i-vstack
                                visible={false}
                                border={{
                                    bottom: { width: 1, style: 'solid', color: Theme.divider },
                                    top: { width: 1, style: 'solid', color: Theme.divider },
                                }}
                            >
                                <i-hstack
                                    horizontalAlignment="space-between"
                                    verticalAlignment="center"
                                    padding={{ top: 8, bottom: 8, left: '1.5rem', right: 0 }}
                                    class="pointer"
                                    onClick={(source) => this.onToggleBlock(source)}
                                >
                                    <i-label
                                        caption="Content blocks"
                                        font={{
                                            weight: 600,
                                            size: '0.75rem',
                                            transform: 'uppercase',
                                        }}
                                    ></i-label>
                                    <i-icon
                                        name="angle-down"
                                        fill={Theme.text.primary}
                                        width={24}
                                        height={24}
                                    ></i-icon>
                                </i-hstack>
                                <i-grid-layout
                                    id="blockStack"
                                    templateColumns={['repeat(2, 1fr)']}
                                    gap={{ column: 12, row: 12 }}
                                    border={{
                                        bottom: { width: 1, style: 'solid', color: Theme.divider },
                                    }}
                                    padding={{ left: '8px', right: '8px', bottom: '1rem' }}
                                ></i-grid-layout>
                            </i-vstack>
                            <i-vstack
                                id="componentsStack"
                                padding={{ top: '8px', bottom: '8px' }}
                            ></i-vstack>
                        </i-panel>
                    </i-tab>
                </i-tabs> */}
                <i-scom-page-builder-collapse title="Components" border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-grid-layout
                        id="firstStack"
                        templateColumns={['repeat(2, 1fr)']}
                        margin={{ top: 6 }}
                    ></i-grid-layout>
                </i-scom-page-builder-collapse>
                <i-scom-page-builder-collapse title="Micro DApps" border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }} expanded={true}>
                    <i-vstack
                        id="componentsStack"
                        padding={{ top: '8px', bottom: '8px' }}
                    ></i-vstack>
                </i-scom-page-builder-collapse>
            </i-panel>
        );
    }
}
