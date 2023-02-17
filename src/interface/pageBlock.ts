import { IDataSchema } from "@ijstech/components";

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
	userInputDataSchema: IDataSchema
}

export interface IPageBlock {
	getActions: () => IPageBlockAction[];
	getData: () => any;
	setData: (data: any) => Promise<void>;
	getTag: () => any;
	setTag: (tag: any) => Promise<void>;	
}

export interface IGetModuleOptions {
    ipfscid?: string;
    localPath?: string;
}
