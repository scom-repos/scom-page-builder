export interface IDataSchema {
    type: 'integer' | 'number' | 'boolean' | 'string' | 'object';
    format?: 'date' | 'datetime' | 'color' | 'tab';
    enum?: string[];
    oneOf?: { const: string, title: string }[];
    required?: string[];
    properties?: {
        [key: string]: IDataSchema
    };
}

export interface IUISchema {
    type: 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';
    elements?: IUISchema[];
    label?: string | boolean;
    scope?: string;
    rule?: {
        effect?: 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';
        condition?: {
            scope: string;
            schema: {
                [key: string]: any;
            }
        }
    };
    options?: {
        format?: 'radio';
        readonly?: boolean;
        autocomplete?: boolean;
    };
}
