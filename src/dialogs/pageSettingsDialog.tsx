import {
    Styles,
    Module,
    customElements,
    ControlElement,
    Modal,
    Form,
    IDataSchema,
} from '@ijstech/components';
import './pageSettingsDialog.css';
const Theme = Styles.Theme.ThemeVars;

import { assignAttr } from '../utility/index';
import { IPageConfig } from '../interface/index';
import { getBackgroundColor, pageObject } from '../store/index';

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

    private defaultData: IPageConfig;
    private onSave: (data: IPageConfig) => void;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    init() {
        super.init();
        this.defaultData = {
            backgroundColor: getBackgroundColor(),
            maxWidth: 1280,
            margin: {x: 60, y: 8}
        }
    }

    show() {
        this.reset();
        this.renderForm();
        this.settingsDialog.visible = true;
    }

    private getSchema() {
        const jsonSchema: IDataSchema = {
            type: 'object',
            properties: {
                backgroundColor: {
                    type: 'string',
                    format: 'color'
                },
                maxWidth: {
                    type: 'number',
                    title: 'Maximum width'
                },
                margin: {
                    type: 'object',
                    properties: {
                        x: {
                            type: 'string'
                        },
                        y: {
                            type: 'string'
                        }
                    }
                }
            },
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
                    this.settingsDialog.visible = false;
                    const config = await this.formElm.getFormData();
                    if (this.onSave) await this.onSave(config);
                },
            },
        };
        return { jsonSchema, formOptions };
    }

    private renderForm() {
        const { jsonSchema, formOptions } = this.getSchema();
        this.formElm.jsonSchema = jsonSchema;
        this.formElm.formOptions = formOptions;
        this.formElm.renderForm();
        const config = pageObject.config || {};
        this.formElm.setFormData({ ...this.defaultData, ...config });
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
                maxWidth={500}
                title="Page Settings"
                class="custom-modal"
            >
                <i-panel padding={{ top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }}>
                    <i-form id="formElm"></i-form>
                </i-panel>
            </i-modal>
        );
    }
}
