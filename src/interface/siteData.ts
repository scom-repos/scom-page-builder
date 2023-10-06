import { IPageBlockData } from "./pageBlock";

export interface IPageData {
    header: IPageHeader;
	sections: IPageSection[];
	footer: IPageFooter;
    config?: IPageConfig;
}

export interface IPageConfig {
    customBackground?: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    backdropColor?: string;
    customTextColor?: boolean;
    textColor?: string;
    customTextSize?: boolean;
    textSize?: string;
    backdropImage?: string;
    sectionWidth?: number|string;
    plr?: number;
    ptb?: number;
    margin?: {
        x?: number|string;
        y?: number|string;
    };
    customWidgetsBackground?: boolean;
    widgetsBackground?: string;
    customWidgetsColor?: boolean;
    widgetsColor?: string;
}

export enum HeaderType {
    'COVER' = 'cover',
    'LARGE' = 'largeBanner',
    'NORMAL' = 'banner',
    'TITLE' = 'titleOnly'
};
export interface IPageHeader {
	headerType: HeaderType;
	image: string;
	elements: IPageElement[];
    config?: IPageSectionConfig;
}

export interface IPageSection {
	id: string; // uuid
	row: number;
	elements: IPageElement[];
    name?: string;
    config?: IPageSectionConfig;
}

export interface IPageFooter {
	image: string;
	elements: IPageElement[];
    config?: IPageSectionConfig;
}

// export enum ElementType {
//     PRIMITIVE = 'primitive',
//     COMPOSITE = 'composite'
// }

export interface IPageElement {
    id: string; // uuid
	column: number;
	columnSpan: number;
	// type: ElementType,
    tag?: any;
    properties: any;
	module?: IPageBlockData; // follow the standard defined in secure page, if type === 'primitive'
	elements?: IPageElement[]; // type === 'composite'

    visibleOn?: string;
    invisibleOn?: string;
}

export enum IColumnLayoutType {
    FIXED = 'Fixed',
    AUTOMATIC = 'Automatic'
}

export type AlignType = 'left' | 'center' | 'right';

export interface IPageSectionConfig extends IPageConfig {
    align?: AlignType;
    image?: string;
    border?: boolean;
    borderColor?: string;
    fullWidth?: boolean;
    padding?: {
        top?: number|string;
        bottom?: number|string;
        left?: number|string;
        right?: number|string;
    },
    customBackdrop?: boolean;
    backdropColor?: string;
    backdropImage?: string;
}

// export interface IRowSettings {
//     config?: IPageSectionConfig;
// }

export interface IOnFetchComponentsOptions {
    category?: string;
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
}
export interface IOnFetchComponentsResult {
    items?: IPageBlockData[];
    total?: number
}

export interface ICategory {
    id: string;
    title: string;
    icon: string;
}

export interface IMenuItem {
    rowId: string,
    caption: string
}

