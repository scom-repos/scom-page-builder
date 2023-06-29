import {
    Styles,
    Module,
    customElements,
    ControlElement,
    Modal,
    Form,
    IDataSchema
} from '@ijstech/components';
import './rowSettingsDialog.css';
const Theme = Styles.Theme.ThemeVars;

import { assignAttr } from '../utility/index';
import { getDefaultPageConfig, getPageConfig, pageObject } from '../store/index';
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
        let jsonSchema: IDataSchema = {
            type: 'object',
            // required: ['columnLayout'],
            properties: {
                //   "columnLayout": {
                //     type: 'string',
                //     enum: [
                //         IColumnLayoutType.FIXED,
                //         IColumnLayoutType.AUTOMATIC
                //     ],
                //     default: IColumnLayoutType.FIXED
                //   },        
                //   "columnsNumber": {
                //     type: 'number'
                //   },
                //   "maxColumnsPerRow": {
                //     type: 'number'
                //   },
                //   "columnMinWidth": {
                //     type: 'number'
                //   },
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
                },
                align: {
                    type: 'string',
                    enum: [
                        'left',
                        'center',
                        'right'
                    ]
                }
            }
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
                    const config = await this.formElm.getFormData();
                    if (this.onSave) await this.onSave(config);
                    this.dialog.visible = false;
                }
            }
        };
        return { jsonSchema, formOptions };
    }

    private renderForm() {
        const { jsonSchema, formOptions } = this.getSchema();
        this.formElm.jsonSchema = jsonSchema;
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
                maxWidth={500}
                title="Section Settings"
                class="custom-modal"
            >
                <i-panel padding={{top: '1rem', bottom: '1rem', left: '1rem', right: '1rem'}}>
                    <i-form id="formElm"></i-form>
                </i-panel>
            </i-modal>
        )
    }
}
