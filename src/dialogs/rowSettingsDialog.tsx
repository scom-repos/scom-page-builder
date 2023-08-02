import {
    Styles,
    Module,
    customElements,
    ControlElement,
    Modal,
    Form,
    IDataSchema,
    IUISchema
} from '@ijstech/components';
import './rowSettingsDialog.css';
const Theme = Styles.Theme.ThemeVars;

import { assignAttr } from '../utility/index';
import { getPageConfig, pageObject } from '../store/index';
import { IPageSectionConfig } from '../interface/index';

export interface RowSettingsDialogElement extends ControlElement {
    onSave: (data: IPageSectionConfig) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-row-settings-dialog']: RowSettingsDialogElement;
        }
    }
}

@customElements('ide-row-settings-dialog')
export class RowSettingsDialog extends Module {
    private dialog: Modal;
    private formElm: Form;
    private onSave: (data: IPageSectionConfig) => void;
    private rowId: string = '';

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    get data(): any {
        return pageObject.getRow(this.rowId) || {};
    }

    init() {
        super.init();
    }

    show(id: string) {
        this.rowId = id || '';
        this.reset();
        this.renderForm();
        this.dialog.visible = true;
    }

    private getSchema() {
        // let jsonSchema: IDataSchema = {
        //     type: 'object',
        //     // required: ['columnLayout'],
        //     properties: {
        //         //   "columnLayout": {
        //         //     type: 'string',
        //         //     enum: [
        //         //         IColumnLayoutType.FIXED,
        //         //         IColumnLayoutType.AUTOMATIC
        //         //     ],
        //         //     default: IColumnLayoutType.FIXED
        //         //   },
        //         //   "columnsNumber": {
        //         //     type: 'number'
        //         //   },
        //         //   "maxColumnsPerRow": {
        //         //     type: 'number'
        //         //   },
        //         //   "columnMinWidth": {
        //         //     type: 'number'
        //         //   },
        //         backgroundColor: {
        //             type: 'string',
        //             format: 'color'
        //         },
        //         maxWidth: {
        //             type: 'number',
        //             title: 'Maximum width'
        //         },
        //         margin: {
        //             type: 'object',
        //             properties: {
        //                 x: {
        //                     type: 'string'
        //                 },
        //                 y: {
        //                     type: 'string'
        //                 }
        //             }
        //         },
        //         align: {
        //             type: 'string',
        //             enum: [
        //                 'left',
        //                 'center',
        //                 'right'
        //             ]
        //         }
        //     }
        // }

        const jsonSchema: IDataSchema = {
            "type": "object",
            "properties": {
                "backdropImage": {
                    "title": "Backdrop image",
                    "type": "string",
                    "format": "data-url"
                },
                "backdropColor": {
                    "title": "Backdrop color",
                    "type": "string",
                    "format": "color"
                },
                "pt": {
                    "title": "Top",
                    "type": "number"
                },
                "pb": {
                    "title": "Bottom",
                    "type": "number"
                },
                "pl": {
                    "title": "Left",
                    "type": "number"
                },
                "pr": {
                    "title": "Right",
                    "type": "number"
                },
                "fullWidth": {
                    "title": "Full width",
                    "type": "boolean"
                },
                "backgroundColor": {
                    "title": "Background color",
                    "type": "string",
                    "format": "color"
                },
                "border": {
                    "title": "Border",
                    "type": "boolean"
                },
                "borderColor": {
                    "title": "Border color",
                    "type": "string",
                    "format": "color"
                }
            }
        };

        const jsonUISchema: IUISchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/fullWidth"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/border"
                        }
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/backgroundColor"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/borderColor"
                        }
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Group",
                            "label": "Backdrop",
                            "rule": {
                                "effect": "HIDE",
                                "condition": {
                                    "scope": "#/properties/fullWidth",
                                    "schema": {
                                        "const": true
                                    }
                                }
                            },
                            "elements": [
                                {
                                    "type": "VerticalLayout",
                                    "elements": [
                                        {
                                            "type": "HorizontalLayout",
                                            "elements": [
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/backdropImage"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/backdropColor"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Group",
                            "label": "Padding (px)",
                            "elements": [
                                {
                                    "type": "VerticalLayout",
                                    "elements": [
                                        {
                                            "type": "HorizontalLayout",
                                            "elements": [
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/pt"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/pb"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/pl"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/pr"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };


        const formOptions = {
            columnWidth: '100%',
            columnsPerRow: 1,
            confirmButtonOptions: {
                caption: 'Confirm',
                backgroundColor: Theme.colors.primary.main,
                fontColor: Theme.colors.primary.contrastText,
                hide: false,
                onClick: async () => {
                    const config = await this.formElm.getFormData();
                    if (this.onSave) await this.onSave(config);
                    this.dialog.visible = false;
                }
            }
        };

        // const jsonUISchema: IUISchema = {
        //     type: 'VerticalLayout',
        //     elements: [
        //         {
        //             type: 'HorizontalLayout',
        //             elements: [
        //                 {
        //                     type: 'Control',
        //                     label: 'Background Color',
        //                     scope: '#/properties/backgroundColor',
        //                     options: {
        //                         color: true
        //                     }
        //                 },
        //                 {
        //                     type: 'Control',
        //                     label: 'Maximum Width',
        //                     scope: '#/properties/maxWidth',
        //                 }
        //             ]
        //         },
        //         {
        //             "type": "Group",
        //             label: 'Margin',
        //             "elements": [
        //                 {
        //                     "type": "HorizontalLayout",
        //                     "elements": [
        //                         {
        //                             "type": "Control",
        //                             "scope": "#/properties/margin/properties/x"
        //                         },
        //                         {
        //                             "type": "Control",
        //                             "scope": "#/properties/margin/properties/y"
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             type: 'HorizontalLayout',
        //             elements: [
        //                 {
        //                     type: 'Control',
        //                     label: 'Align',
        //                     scope: '#/properties/align'
        //                 }
        //             ]
        //         }
        //     ]
        // };

        return { jsonSchema, formOptions, jsonUISchema };
    }

    private renderForm() {
        const { jsonSchema, formOptions, jsonUISchema } = this.getSchema();
        this.formElm.jsonSchema = jsonSchema;
        this.formElm.uiSchema = jsonUISchema;
        this.formElm.formOptions = formOptions;
        this.formElm.renderForm();
        const { backgroundColor, margin, maxWidth } = getPageConfig();
        const config = { align: 'left', margin, maxWidth, backgroundColor, ...(this.data?.config || {}) };
        this.formElm.setFormData({...config});
    }

    close() {
        this.dialog.visible = false;
    }

    reset() {
        this.formElm.clearFormData();
    }

    render() {
        return (
            <i-modal id={'dialog'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                closeIcon={{ name: 'times' }}
                visible={false}
                minWidth={400}
                maxWidth={800}
                     width={800}
                title="Section Settings"
                class="custom-modal">
                <i-panel padding={{top: '1rem', bottom: '1rem', left: '1.5rem', right: '1.5rem'}}>
                    <i-form id="formElm"></i-form>
                </i-panel>
            </i-modal>
        )
    }
}
