import { IPageBlockData } from './pageBlock';

export type ISiteType = "secure-page" | "secure-book";

export interface ISiteData {
    config?: IConfigData;
    pages: IPageData[];
}

export interface IPageData {
    cid?: string;
    title?: string;
    name: string;
    path: string;
    url: string;
    visible: boolean;
    rows: IRowData[];
}

export interface IRowData {
    config: IRowSettings;
    sections: ISectionData[];
}

export interface ISectionData {
    module: IPageBlockData | null;
    data: any;
    tag: any;
    visibleOn?: string;
    invisibleOn?: string;
    width?: string;
    height?: string;
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
}

type StyleValues = "-moz-initial" | "inherit" | "initial" | "revert" | "unset";
export interface IContainerSettings {
    width?: string;
    maxWidth?: string;
    textAlign?: StyleValues | "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start";
    overflow?: StyleValues | "-moz-hidden-unscrollable" | "auto" | "clip" | "hidden" | "scroll" | "visible" | (string & {});
}

export interface IConfigData {
    type: ISiteType;
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
