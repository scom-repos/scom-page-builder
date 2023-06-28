import { IDataSchema, IUISchema } from "@ijstech/components";

export interface IPageBlockData {
    title: string;
    name: string;
    path?: string;
    category?: string;
    imgUrl?: string;
    disableClicked?: boolean;
    shownBackdrop?: boolean;
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
	userInputDataSchema: IDataSchema;
    userInputUISchema: IUISchema;
    customUI?: any;
    isReplacement?: boolean;
}

export interface IPageBlock {
	getActions: () => IPageBlockAction[];
	getData: () => any;
	setData: (data: any) => Promise<void>;
	getTag: () => any;
	setTag: (tag: any) => Promise<void>;	
}

