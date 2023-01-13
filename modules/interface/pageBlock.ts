export interface IPageBlockData {
    name: string;
    description: string;
    ipfscid?: string;
    imgUrl?: string;
    category?: {
        icon: string;
        idx: string;
        name: string;
    }[];
    chainId?: number;
    packageId?: number;
    projectId?: number;
    local?: boolean;
    localPath?: string;
    dependencies?: any;
}

export interface IDevPageBlockData {

}

export interface IConfigSchema {
    type: 'integer' | 'number' | 'boolean' | 'object';
    format?: 'date' | 'datetime' | 'color';
    required?: string[];
    properties?: {
        [key: string]: IConfigSchema
    };
}

