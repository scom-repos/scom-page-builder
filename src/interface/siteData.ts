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
}

export interface IPageSection {
	id: string; // uuid
	row: number;
	image?: string;
    backgroundColor?: string;
	elements: IPageElement[];
    config?: IConfigData;
}

export interface IPageFooter {
	image: string;
	elements: IPageElement[];
}

export enum ElementType {
    PRIMITIVE = 'primitive',
    COMPOSITE = 'composite'
}

export interface IPageElement {
    id: string; // uuid
	column: number;
	columnSpan: number;
	type: ElementType,
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

export interface IConfigData {
    columnLayout?: IColumnLayoutType;
    columnsNumber?: number;
    maxColumnsPerRow?: number;
    columnMinWidth?: number|string;
}


