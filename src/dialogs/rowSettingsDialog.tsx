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
        this.dialog.linkTo = this
        this.dialog.position = 'fixed'
        this.dialog.visible = false
        document.body.appendChild(this.dialog)
    }

    show(id: string) {
        this.rowId = id || '';
        this.reset();
        this.renderForm();
        this.dialog.visible = true;
    }

    private getSchema() {

        const jsonSchema: IDataSchema = {
            "type": "object",
            "properties": {
                "backdropImage": {
                    "title": "Backdrop image",
                    "type": "string",
                    "format": "data-url"
                },
                "customBackdrop": {
                    "title": "Custom backdrop",
                    "type": "boolean"
                },
                "backdropColor": {
                    "title": "Backdrop color",
                    "type": "string",
                    "format": "color"
                },
                "padding": {
                    "type": "object",
                    "properties": {
                        "bottom": {
                            "title": "Bottom",
                            "type": "number"
                        },
                        "left": {
                            "title": "Left",
                            "type": "number"
                        },
                        "right": {
                            "title": "Right",
                            "type": "number"
                        },
                        "top": {
                            "title": "Top",
                            "type": "number"
                        },
                    }
                },
                "fullWidth": {
                    "title": "Full width",
                    "type": "boolean"
                },
                "customBackgroundColor": {
                    "title": "Custom background color",
                    "type": "boolean"
                },
                "backgroundColor": {
                    "title": "Background color",
                    "type": "string",
                    "format": "color"
                },
                "customTextColor": {
                    "title": "Custom text color",
                    "type": "boolean"
                },
                "textColor": {
                    "title": "Text color",
                    "type": "string",
                    "format": "color"
                },
                "customTextSize": {
                    "title": "Custom text size",
                    "type": "boolean"
                },
                "textSize": {
                    "title": "Text size",
                    "type": "string",
                    "oneOf": [
                        { "const": "xs", "title": "Extra Small" },
                        { "const": "sm", "title": "Small" },
                        { "const": "md", "title": "Normal" },
                        { "const": "lg", "title": "Large" },
                        { "const": "xl", "title": "Extra Large" },
                    ]
                },
                "border": {
                    "title": "Show border",
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
                        }
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/customBackgroundColor"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/backgroundColor",
                            "rule": {
                                "effect": "ENABLE",
                                "condition": {
                                    "scope": "#/properties/customBackgroundColor",
                                    "schema": {
                                        "const": true
                                    }
                                }
                            }
                        },
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/customTextColor"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/textColor",
                            "rule": {
                                "effect": "ENABLE",
                                "condition": {
                                    "scope": "#/properties/customTextColor",
                                    "schema": {
                                        "const": true
                                    }
                                }
                            }
                        },
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/customTextSize"
                        },
                        {
                            "type": "Control",
                            "scope": "#/properties/textSize",
                            "rule": {
                                "effect": "ENABLE",
                                "condition": {
                                    "scope": "#/properties/customTextSize",
                                    "schema": {
                                        "const": true
                                    }
                                }
                            }
                        },
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Group",
                            "label": "Section border",
                            "elements": [
                                {
                                    "type": "HorizontalLayout",
                                    "elements": [
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/border"
                                        },
                                        {
                                            "type": "Control",
                                            "scope": "#/properties/borderColor",
                                            "rule": {
                                                "effect": "SHOW",
                                                "condition": {
                                                    "scope": "#/properties/border",
                                                    "schema": {
                                                        "const": true
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ],
                            "rule": {
                                "effect": "HIDE",
                                "condition": {
                                    "scope": "#/properties/fullWidth",
                                    "schema": {
                                        "const": true
                                    }
                                }
                            }
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
                                                    "scope": "#/properties/customBackdrop"
                                                },
                                            ]
                                        },
                                        {
                                            "type": "HorizontalLayout",
                                            "elements": [
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/backdropImage",
                                                    "rule": {
                                                        "effect": "ENABLE",
                                                        "condition": {
                                                            "scope": "#/properties/customBackdrop",
                                                            "schema": {
                                                                "const": true
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/backdropColor",
                                                    "rule": {
                                                        "effect": "ENABLE",
                                                        "condition": {
                                                            "scope": "#/properties/customBackdrop",
                                                            "schema": {
                                                                "const": true
                                                            }
                                                        }
                                                    }
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
                                                    "scope": "#/properties/padding/properties/top"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/padding/properties/bottom"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/padding/properties/left"
                                                },
                                                {
                                                    "type": "Control",
                                                    "scope": "#/properties/padding/properties/right"
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
        const { backgroundColor, sectionWidth, customBackgroundColor, customTextColor, textColor, customTextSize, textSize } = getPageConfig();
        const config = { align: 'left', sectionWidth, textColor, backgroundColor, customBackgroundColor, customTextColor, customTextSize, textSize, ...(this.data?.config || {}) };
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
