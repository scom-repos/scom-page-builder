import { IDataSchema, IUISchema } from "@ijstech/components";

export interface IPageBlockData {
    name: string;
    path: string;
    category?: string;
    imgUrl?: string;
    description?: string;
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
    customControls?: any;
    customUI?: any;
    customMaxWidth?: string | number;
    isReplacement?: boolean;
}

export interface IPageBlock {
	getActions: (category?: string) => IPageBlockAction[];
	getData: () => any;
	setData: (data: any) => Promise<void>;
	getTag: () => any;
	setTag: (tag: any) => Promise<void>;	
}

