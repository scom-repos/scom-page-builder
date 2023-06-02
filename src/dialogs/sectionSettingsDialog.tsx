import {
    Styles,
    Module,
    customElements,
    ControlElement,
    Modal,
    Form,
    IDataSchema
} from '@ijstech/components';
import './sectionSettingsDialog.css';
const Theme = Styles.Theme.ThemeVars;

import { assignAttr } from '../utility/index';
import { IColumnLayoutType, IRowSettings } from '../interface/index';
import { pageObject } from '../store/index';

export interface SectionSettingsDialogElement extends ControlElement {
    onSave: (data: any) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-section-settings-dialog']: SectionSettingsDialogElement;
        }
    }
}

@customElements('ide-section-settings-dialog')
export class SectionSettingsDialog extends Module {
    private dialog: Modal;
    private formElm: Form;
    private onSave: (data: IRowSettings) => void;
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

    private renderForm() {
        const jsonSchema: IDataSchema = {
            type: 'object',
            required: ['columnLayout'],
            properties: {
              "columnLayout": {
                type: 'string',
                enum: [
                    IColumnLayoutType.FIXED,
                    IColumnLayoutType.AUTOMATIC
                ],
                default: IColumnLayoutType.FIXED
              },              
              "columnsNumber": {
                type: 'number'
              },
              "maxColumnsPerRow": {
                type: 'number'
              },
              "columnMinWidth": {
                type: 'number'
              }
            }
        };
        const options = {
            columnWidth: '100%',
            columnsPerRow: 1,
            confirmButtonOptions: {
                caption: 'Confirm',
                backgroundColor: Theme.colors.primary.main,
                fontColor: Theme.colors.primary.contrastText,
                hide: false,
                onClick: async () => {
                    const config = await this.formElm.getFormData();
                    if (this.onSave) await this.onSave({ config });
                    this.dialog.visible = false;
                }
            }
        };
        this.formElm.jsonSchema = jsonSchema;
        this.formElm.formOptions = options;
        this.formElm.renderForm();
        const config = this.data?.config ? {...this.data.config} : {};
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
