import { IPageBlockData } from "./pageBlock";

export interface IPageData {
    header: IPageHeader;
	sections: IPageSection[];
	footer: IPageFooter;
    config?: IPageConfig;
}

export interface IPageConfig {
    backgroundColor?: string;
    maxWidth?: number|string;
    margin?: {
        x?: number|string;
        y?: number|string;
    };
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
}