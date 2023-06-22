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
import { IRowSettings } from '../interface/index';
import { getBackgroundColor, pageObject } from '../store/index';

export type ISettingType = 'color' | 'column';

export interface RowSettingsDialogElement extends ControlElement {
    type: ISettingType;
    onSave: (data: IRowSettings) => void;
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
    private onSave: (data: IRowSettings) => void;
    private rowId: string = '';
    private _type: ISettingType;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    get data(): any {
        return pageObject.getRow(this.rowId) || {};
    }

    get type(): ISettingType {
        return this._type;
    }
    set type(value: ISettingType) {
        this._type = value;
    }

    init() {
        super.init();
        this.type = this.getAttribute('type', true);
    }

    show(id: string) {
        this.rowId = id || '';
        this.reset();
        this.renderForm();
        this.dialog.visible = true;
    }

    private getSchema() {
        let jsonSchema: IDataSchema;
        if (this.type === 'color') {
            jsonSchema = {
                type: 'object',
                properties: {
                    "backgroundColor": {
                        type: 'string',
                        format: 'color'
                    }
                }
            }

        } else {
            jsonSchema = {
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
                  align: {
                    type: 'string',
                    enum: [
                      'left',
                      'center',
                      'right'
                    ]
                  }
                }
            };
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
                    const params = this.type === 'color' ? config : { config }
                    if (this.onSave) await this.onSave(params);
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
        const defaultColor = pageObject.config?.backgroundColor || getBackgroundColor();
        const config = this.type === 'column' ?
            this.data?.config || {
                // columnLayout: IColumnLayoutType.FIXED,
                // columnsNumber: 12,
                align: 'left'
            } : {backgroundColor: this.data?.backgroundColor || defaultColor}
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
