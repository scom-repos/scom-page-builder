import { IPageBlockData } from "./pageBlock";

export interface IPageData {
    cid?: string;
    title?: string;
    name: string;
    path: string;
    url: string;
    visible: boolean;

    header: IPageHeader;
	sections: IPageSection[];
	footer: IPageFooter;
}

export type HeaderType = 'cover' | 'largeBanner' | 'banner' | 'titleOnly';
export interface IPageHeader {
	headerType: HeaderType;
	image: string;
	elements: IPageElement[];
}

export interface IPageSection {
	id: string; // uuid
	row: number;
	image?: string;
    backgroundColor?: string;
	elements: IPageElement[];
}

export interface IPageFooter {
	image: string;
	elements: IPageElement[];
}

export type ElementType = 'primitive' | 'composite';

export interface IPageElement {
    id: string; // uuid
	column: number;
	columnSpan: number;
	type: 'primitive' | 'composite',
    properties: any;
	module?: IPageBlockData; // follow the standard defined in secure page, if type === 'primitive'
	elements?: IPageElement[]; // type === 'composite'

    visibleOn?: string;
    invisibleOn?: string;
}

export interface IRowSettings {
    height?: string;
    width?: string;
    columns?: number;
    columnsSettings?: {
        width?: string;
        size?: {
            width?: string;
            height?: string;
        }
    }[];
    backgroundColor?: string;
    backgroundImageUrl?: string;
    isCloned?: boolean | true;
    isChanged?: boolean | true;
    isDeleted?: boolean | true;
}

type StyleValues = "-moz-initial" | "inherit" | "initial" | "revert" | "unset";

export interface IContainerSettings {
    width?: string;
    maxWidth?: string;
    textAlign?: StyleValues | "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    overflow?: StyleValues | "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible" | (string & {});
}

export interface IConfigData {
    header: {
        showHeader: boolean;
        showWalletAuthentication: boolean;
        showLogo: boolean;
        headerBackgroundColor: string;
        logo: string;
    };
    body: {
      boxedLayout: boolean;
      boxedWidth: string;
      containerLayout: boolean;
      containerSettings: IContainerSettings;
      showPagination: boolean;
    };
    footer: {
        showFooter: boolean;
        stickyFooter: boolean;
        copyrightText: string;
    };
    menu: {
        showTopMenu: boolean;
        showSideMenu: boolean;
        fontColor: string;
    }
    url: {
        urlSuffix: string;
    };
}

export interface IAddPageArgs {
    name: string;
    url: string;
}

export interface IUpdatePageArgs {
    pageId: number;
}


