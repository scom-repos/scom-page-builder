import {
    Styles,
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Switch,
    Upload,
    Input,
    Panel,
    Button
} from '@ijstech/components';
import { assignAttr } from '@page/utility';
import './configDialog.css';
import { IDataSchema, IUISchema } from '@page/interface';

const Theme = Styles.Theme.ThemeVars;

export interface ConfigDialogElement extends ControlElement {
    title?: string;
    onConfirm?: (data: any) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-config-dialog']: ConfigDialogElement;
        }
    }
}

@customElements('scpage-config-dialog')
export class ConfigDialog extends Module {
    private pnlConfigBody: Panel;
    private dialog: Modal;
    private _dataSchema: IDataSchema;
    private _uiSchema: IUISchema;

    constructor(parent?: any) {
        super(parent);
        assignAttr(this);
    }

    async init() {
        super.init();
    }

    setSchema(dataSchema: IDataSchema, uiSchema: IUISchema) {
        this._dataSchema = dataSchema;
        this._uiSchema = uiSchema;
        this.renderForm();
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    confirm() {
        const data = this.getFormData();
    }

    getFormData() {

    }

    render() {
        return (
            <i-modal
                id={'dialog'} class={'config'}
                showBackdrop={true} closeOnBackdropClick={false}
                maxWidth={'1460px'} popupPlacement={'center'}>
                <i-panel class={'config-header'}>
                    <i-label class={'title'} caption={this.title}></i-label>
                    <i-icon class={'close'} name={'times'} onClick={this.hide.bind(this)}></i-icon>
                </i-panel>
                <i-grid-layout templateColumns={['228px', '1fr']}>
                    <i-panel class={'config-sidebar'}></i-panel>
                    <i-panel>
                        <i-panel class={'config-body'} id={'pnlConfigBody'}></i-panel>
                        <i-panel class={'config-footer'}>
                            <i-button class={'btn btn-secondary'} caption={'Cancel'} onClick={this.hide.bind(this)}></i-button>
                            <i-button class={'btn btn-primary'} caption={"Confirm"} margin={{left: 5}} onClick={this.confirm.bind(this)}></i-button>
                        </i-panel>
                    </i-panel>
                </i-grid-layout>
            </i-modal>
        );
    }

    private renderForm() {
        if (!this._dataSchema || !this._uiSchema) return;
        this.pnlConfigBody.clearInnerHTML();
        this.pnlConfigBody.append(this.createUI(this._uiSchema));
    }

    private createUI(uiSchema: IUISchema) {
        if (!uiSchema) return null;
        const { elements, type, scope, label, options, rule } = uiSchema;
        if (type === 'VerticalLayout') {
            const elm = (<i-vstack justifyContent={'center'}
                                   alignItems={'center'}>{elements.map(v => this.createUI(v))}</i-vstack>);
            return elm;
        } else if (type === 'HorizontalLayout') {
            const elm = (<i-grid-layout width={'100%'} gap={{ column: 16 }}
                                        templateColumns={this.generateTemplateColumnsByNumber(elements.length)}>{elements.map(v => this.createUI(v))}</i-grid-layout>);
            return elm;
        } else if (type === 'Group') {
            const elm = (<i-panel class={'box'} width={'100%'}>
            </i-panel>);
            if(label !== false && !!label) {
                elm.append(<i-panel class={'box-header'}><i-label caption={label as string}></i-label></i-panel>);
            }
            const boxContent = <i-panel class={'box-content'}>{elements.map(v => this.createUI(v))}</i-panel>
            elm.append(boxContent);
            return elm;
        } else if (type === 'Categorization') {

        } else if (type === 'Category') {

        } else if (type === 'Control' && scope) {
            const [key, dataSchema] = this.getDataSchemaByScope(scope);
            const dataType = dataSchema.type;
            const dataFormat = dataSchema.format;
            const dataEnum = dataSchema.enum;
            const dataOneOf = dataSchema.oneOf;
            const stub = <i-panel class={'form-group'}>
            </i-panel>;
            if (label !== false) {
                let caption = label as string;
                if (!caption)
                    caption = this.convertFieldNameToLabel(key);
                const labelElm = <i-label class={'form-label'} caption={caption}></i-label>;
                stub.append(labelElm);
            }
            if (dataType === 'string') {
                const formControlElm = <i-panel class={'form-control'}></i-panel>;
                if (dataFormat === 'date') {
                    const datePicker = <i-datepicker id={scope}></i-datepicker>;
                    formControlElm.append(datePicker);
                } else if (dataFormat === 'datetime') {
                    const dateTimePicker = <i-datepicker id={scope} dateTimeFormat={'YYYY-MM-DD HH:mm:ss'}></i-datepicker>
                    formControlElm.append(dateTimePicker);
                } else if (dataFormat === 'color') {
                    const colorPicker = <i-input id={scope} inputType={'color'}></i-input>
                    formControlElm.append(colorPicker)
                } else {
                    if(dataEnum && dataEnum.length > 0) {
                        const items = [];
                        for (const item of dataEnum) {
                            items.push({ label: item, value: item });
                        }
                        const comboBoxElm = <i-combo-box items={items} icon={{ name: 'caret-down' }} id={scope}></i-combo-box>;
                        formControlElm.append(comboBoxElm);
                    }
                    else if(dataOneOf && dataOneOf.length >= 0) {
                        const items = [];
                        for (const item of dataOneOf) {
                            items.push({ label: item.title, value: item.const });
                        }
                        const comboBoxElm = <i-combo-box items={items} icon={{ name: 'caret-down' }} id={scope}></i-combo-box>;
                        formControlElm.append(comboBoxElm);
                    }
                    else {
                        const input = <i-input inputType={'text'}></i-input>
                        formControlElm.append(input)
                    }
                }
                stub.append(formControlElm);
            } else if (dataType === 'number') {
                stub.append(<i-panel class={'form-control'}>
                    <i-input inputType={'number'}></i-input>
                </i-panel>);
            } else if (dataType === 'integer') {
                stub.append(<i-panel class={'form-control'}>
                    <i-input inputType={'number'}></i-input>
                </i-panel>);
            } else if (dataType === 'boolean') {
                stub.append(<i-panel class={'form-control'}>
                    <i-checkbox caption={"Test"}></i-checkbox>
                </i-panel>);
            }
            return stub;
        } else
            return null;
    }

    private generateTemplateColumnsByNumber(count: number) {
        let columns = [];
        for (let i = 0; i < count; i++) columns.push('1fr');
        return columns;
    }

    private getDataSchemaByScope(scope: string): [key: string, dataSchema: IDataSchema] {
        const segments = scope.split('/');
        let obj: IDataSchema;
        for (const segment of segments) {
            if (segment === '#')
                obj = this._dataSchema;
            else
                obj = obj[segment];
        }
        return [segments[segments.length - 1], obj];
    }

    private convertFieldNameToLabel(name: string) {
        let label = '';
        for (let i = 0; i < name.length; i++) {
            let char = name[i];
            if (i == 0) {
                label += char.toUpperCase();
                continue;
            }
            if (char == char.toUpperCase())
                label += ` ${char}`;
            else
                label += char;
        }
        return label;
    }
}
