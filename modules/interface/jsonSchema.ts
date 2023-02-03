// Data schema

export interface IDataSchema {
    type: 'integer' | 'number' | 'boolean' | 'string' | 'object';
    format?: 'date' | 'time' | 'date-time' | 'image';
    enum?: string[];
    oneOf?: { const: string, title: string }[];
    required?: string[];
    properties?: {
        [key: string]: IDataSchema
    };
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    default?: string | number | boolean;
    description?: string;
}

// UI Schema

export type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';

export type IUISchemaRulesEffect = 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';

export type IUISchemaValidationType = 'check-null';

export interface IUISchemaRulesCondition {
    scope: string;
    schema: {
        [key: string]: any;
    }
}

export interface IUISchemaRules {
    effect?: IUISchemaRulesEffect;
    condition?: IUISchemaRulesCondition
}

export interface IUISchemaOptions {
    detail?: 'DEFAULT' | 'GENERATED' | 'REGISTERED' | IUISchema;
    showSortButtons?: boolean;
    elementLabelProp?: string;
    format?: 'date' | 'time' | 'date-time' | 'radio';
    maxWidth?: string;
    maxHeight?: string;
    slider?: boolean;
    multi?: boolean;
    color?: boolean;
    restrict?: boolean;
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    toggle?: boolean;
    readonly?: boolean;
    autocomplete?: boolean;
    variant?: 'stepper';
    // required?: boolean;
    validationType?: IUISchemaValidationType;
}


export interface IUISchema {
    title?: string;
    type: IUISchemaType;
    elements?: IUISchema[];
    label?: string | boolean;
    scope?: string;
    rule?: IUISchemaRules;
    options?: IUISchemaOptions;
}

