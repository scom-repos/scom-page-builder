import {
    Styles,
    Module,
    customElements,
    ControlElement,
    Modal,
    Form,
    IDataSchema,
    IUISchema,
} from '@ijstech/components';
import './pageSettingsDialog.css';
const Theme = Styles.Theme.ThemeVars;

import { assignAttr } from '../utility/index';
import { IPageConfig } from '../interface/index';
import { getPageConfig } from '../store/index';

export interface PageSettingsDialogElement extends ControlElement {
    onSave: (data: IPageConfig) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-page-settings-dialog']: PageSettingsDialogElement;
        }
    }
}

@customElements('ide-page-settings-dialog')
export class PageSettingsDialog extends Module {
    private settingsDialog: Modal;
    private formElm: Form;

    private onSave: (data: IPageConfig) => void;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    init() {
        super.init();
    }

    show() {
        this.reset();
        this.renderForm();
        this.settingsDialog.visible = true;
    }

    private getSchema() {
        // const jsonSchema: IDataSchema = {
        //     type: 'object',
        //     properties: {
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
        //         }
        //     },
        // };
        const jsonSchema: IDataSchema = {
            "type": "object",
            "properties": {
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
                        {"title": "Extra Small", "const": "xs"},
                        {"title": "Small", "const": "sm"},
                        {"title": "Normal", "const": "md"},
                        {"title": "Large", "const": "lg"},
                        {"title": "Extra Large", "const": "xl"}
                    ]
                },
                "backgroundImage": {
                    "title": "Background image",
                    "type": "string",
                    "format": "data-cid"
                },
                "ptb": {
                    "title": "Section padding top / bottom (px)",
                    "type": "number"
                },
                "plr": {
                    "title": "Section padding left / right (px)",
                    "type": "number"
                },
                "sectionWidth": {
                    "title": "Section width (px)",
                    "type": "number"
                },
                "scrollToTop": {
                    "title": "Show scroll to top button",
                    "type": "boolean"
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
                            "scope": "#/properties/backgroundImage"
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
                        }
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
                        }
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
                        }
                    ]
                },
                {
                    "type": "Group",
                    "label": "Section settings",
                    "elements": [
                        {
                            "type": "HorizontalLayout",
                            "elements": [
                                {
                                    "type": "Control",
                                    "scope": "#/properties/ptb"
                                },
                                {
                                    "type": "Control",
                                    "scope": "#/properties/plr"
                                },
                                {
                                    "type": "Control",
                                    "scope": "#/properties/sectionWidth"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "HorizontalLayout",
                    "elements": [
                        {
                            "type": "Control",
                            "scope": "#/properties/scrollToTop"
                        }
                    ]
                }
            ]
        }


        const formOptions = {
            columnWidth: '100%',
            columnsPerRow: 1,
            confirmButtonOptions: {
                caption: 'Confirm',
                backgroundColor: Theme.colors.primary.main,
                fontColor: Theme.colors.primary.contrastText,
                hide: false,
                onClick: async () => {
                    this.settingsDialog.visible = false;
                    const config = await this.formElm.getFormData();
                    if (this.onSave) await this.onSave(config);
                },
            },
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
        const config = getPageConfig();
        this.formElm.setFormData({ ...getPageConfig() });
    }

    close() {
        this.settingsDialog.visible = false;
    }

    reset() {
        this.formElm.clearFormData();
    }

    render() {
        return (
            <i-modal
                id={'settingsDialog'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                closeIcon={{ name: 'times' }}
                visible={false}
                minWidth={400}
                maxWidth={800}
                width={800}
                title="Page Settings"
                class="custom-modal"
            >
                <i-panel padding={{ top: '1rem', bottom: '1rem', left: '1.5rem', right: '1.5rem' }}>
                    <i-form id="formElm"></i-form>
                </i-panel>
            </i-modal>
        );
    }
}
