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

export interface ICommand {
    execute(): void;
    undo(): void;
    redo(): void;
}

export interface IPageBlockAction {
	name: string;
	icon: string;
	command: (builder: any, userInputData: any) => ICommand;
	userInputDataSchema: IConfigSchema; // follow the standard defined in the components repo
}

export interface IPageBlock {
	getActions: () => IPageBlockAction[];
	getData: () => any;
	setData: (data: any) => Promise<void>;
	getTag: () => any;
	setTag: (tag: any) => Promise<void>;	
}

export interface IConfigSchema {
    type: 'integer' | 'number' | 'boolean' | 'object';
    format?: 'date' | 'datetime' | 'color';
    required?: string[];
    properties?: {
        [key: string]: IConfigSchema
    };
}

export interface IGetModuleOptions {
    ipfscid?: string;
    localPath?: string;
}