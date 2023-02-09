import {
    Module,
    customElements,
    ControlElement,
    Panel,
    Input,
    Modal,
    Datepicker,
    Checkbox,
    ComboBox,
    Upload
} from '@ijstech/components';

import { assignAttr } from '../utility/index';

export interface PageBlockSettingsDialogElement extends ControlElement {
    onSave: (data: any) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-pageblock-settings-dialog']: PageBlockSettingsDialogElement;
        }
    }
}

@customElements('scpage-pageblock-settings-dialog')
export class PageBlockSettingsDialog extends Module {
    private dialog: Modal;
    private pnlConfig: Panel;
    private pnlEvents: Panel;
    private txtVisibleOn: Input;
    private txtInvisibleOn: Input;
    private form: {
        [key: string]: {
            control: any;
            type: 'input' | 'checkbox' | 'combobox' | 'datepicker' | 'colorpicker' | 'uploader';
            required: boolean;
        }
    } = {};
    private schema: any;
    private onSave: (data: any) => void;
    private configData: any;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    async init() {
        super.init();
    }

    show(data: {schema: any, configData: any, events: any[], visibleOn: string, invisibleOn: string}) {
        if(!data) return;
        const {schema, configData, events, visibleOn, invisibleOn} = data;
        this.reset();
        this.schema = schema;
        this.configData = configData;
        const form = this.renderForm(schema, '', '', this.configData);
        if (form)
            this.pnlConfig.append(form);
        if(events) {
            for (const event of events) {
                const box = <i-panel class={'box'}>
                    <i-panel class={'box-header'}>
                        <i-label caption={event.name}></i-label>
                        <i-label caption={event.description} class={'ml-20'} font={{size: '14px'}}></i-label>
                    </i-panel>
                </i-panel>
                this.pnlEvents.append(box);
            }
        }
        this.txtVisibleOn.value = visibleOn;
        this.txtInvisibleOn.value = invisibleOn;
        this.dialog.visible = true;
    }

    close() {
        this.dialog.visible = false;
    }

    async handleSaveClick() {
        const data = await this.getFormData(this.schema, '');
        if (this.onSave)
            await this.onSave({
                visibleOn: this.txtVisibleOn.value,
                invisibleOn: this.txtInvisibleOn.value,
                configData: data
            });
        this.close();
    }

    async getFormData(object: any, name: string) {
        switch (object.type?.toLowerCase()) {
            case 'object':
                let data = {};
                const properties = object.properties;
                for (const propertyName in properties) {
                    data[propertyName] = await this.getFormData(properties[propertyName], `${name}/${propertyName}`);
                }
                return data;
            case 'string':
            case 'number':
            case 'integer':
            case 'boolean':
                switch (this.form[name].type) {
                    case 'input':
                    case 'datepicker':
                    case 'colorpicker':
                        return this.form[name].control.value;
                    case 'combobox':
                        return this.form[name].control.value?.value;
                    case 'checkbox':
                        return this.form[name].control.checked;
                    case 'uploader':
                        if(this.form[name].control.fileList && this.form[name].control.fileList.length > 0)
                            return await this.form[name].control.toBase64(this.form[name].control.fileList[0]);
                        else
                            return '';
                }
            default:
                return null;
        }
        return null;
    }

    reset() {
        this.schema = undefined;
        this.configData = undefined;
        this.form = {};
        this.pnlConfig.clearInnerHTML();
    }

    renderForm(object: any, name: string, nameBuilder: string = "", data?: any, required?: string[], ) {
        if (!object) return null;
        const labelName = this.convertFieldNameToLabel(name);
        switch (object.type?.toLowerCase()) {
            case 'object':
                const req = object.required;
                const properties = object.properties;
                const box = <i-panel class={'box'}></i-panel>;
                if (name) {
                    box.append(<i-panel class={'box-header'}>
                        <i-label caption={this.convertFieldNameToLabel(name)}></i-label>
                    </i-panel>);
                }
                const form = <i-panel class={'box-content'}></i-panel>;
                for (const propertyName in properties) {
                    let subLevelData = data;
                    if(data && name)
                        subLevelData = data[name];
                    const control = this.renderForm(properties[propertyName], propertyName, `${nameBuilder}/${propertyName}`, subLevelData, req);
                    form.append(control);
                }
                box.append(form);
                return box;
            case 'string':
                switch (object.format?.toLowerCase()) {
                    case 'date':
                        const datePicker: Datepicker = <i-datepicker></i-datepicker>;
                        if (data)
                            datePicker.value = data[name];
                        this.form[nameBuilder] = {
                            control: datePicker,
                            type: 'datepicker',
                            required: required && required.indexOf(name) >= 0
                        };
                        return <i-panel class={'form-group'}>
                            <i-label class={'form-label'} caption={labelName}></i-label>
                            <i-panel class={'form-control'}>
                                {datePicker}
                            </i-panel>
                        </i-panel>;
                    case 'datetime':
                        const dateTimePicker = <i-datepicker dateTimeFormat={'YYYY-MM-DD HH:mm:ss'}></i-datepicker>;
                        if (data)
                            dateTimePicker.value = data[name];
                        this.form[nameBuilder] = {
                            control: dateTimePicker,
                            type: 'datepicker',
                            required: required && required.indexOf(name) >= 0
                        };
                        return <i-panel class={'form-group'}>
                            <i-label class={'form-label'} caption={labelName}></i-label>
                            <i-panel class={'form-control'}>
                                {dateTimePicker}
                            </i-panel>
                        </i-panel>;
                    case 'color':
                        const colorPicker = <i-input inputType={'color'}></i-input>;
                        if (data)
                            colorPicker.value = data[name];
                        this.form[nameBuilder] = {
                            control: colorPicker,
                            type: 'colorpicker',
                            required: required && required.indexOf(name) >= 0
                        };
                        return <i-panel class={'form-group'}>
                            <i-label class={'form-label'} caption={labelName}></i-label>
                            <i-panel class={'form-control'}>
                                {colorPicker}
                            </i-panel>
                        </i-panel>;
                    // case 'image':
                    //     const uploader: Upload = <i-upload></i-upload>
                    //     if(data) {
                    //         uploader.preview(data[name]);
                    //     }
                    //     this.form[name] = {
                    //         control: uploader,
                    //         type: 'uploader',
                    //         required: required && required.indexOf(name) >= 0
                    //     }
                    default:
                        if (object.enum && object.enum.length > 0) {
                            const items = [];
                            for (const item of object.enum) {
                                items.push({ label: item, value: item });
                            }
                            // Drop down list
                            const comboBox = <i-combo-box items={items} icon={{ name: 'caret-down' }}></i-combo-box>;
                            if (data)
                                comboBox.value = data[name];
                            this.form[nameBuilder] = {
                                control: comboBox,
                                type: 'combobox',
                                required: required && required.indexOf(name) >= 0
                            };
                            return <i-panel class={'form-group'}>
                                <i-label class={'form-label'} caption={labelName}></i-label>
                                <i-panel class={'form-control'}>
                                    {comboBox}
                                </i-panel>
                            </i-panel>;
                        } else {
                            const input = <i-input inputType={'text'}></i-input>;
                            if (data)
                                input.value = data[name];
                            this.form[nameBuilder] = {
                                control: input,
                                type: 'input',
                                required: required && required.indexOf(name) >= 0
                            };
                            // const { minLength, maxLength } = object.minLength;
                            // if(minLength) {
                            // }
                            // if(maxLength) {
                            // }
                            return <i-panel class={'form-group'}>
                                <i-label class={'form-label'} caption={labelName}></i-label>
                                <i-panel class={'form-control'}>
                                    {input}
                                </i-panel>
                            </i-panel>;

                        }
                }
            case 'number':
                var { minimum, maximum } = object;
                if (minimum != undefined && maximum != undefined) {
                    const input: Input = <i-input inputType={'range'} min={minimum} max={maximum}
                                                  tooltipVisible={true}></i-input>;
                    if (data)
                        input.value = data[name];
                    this.form[nameBuilder] = {
                        control: input,
                        type: 'input',
                        required: required && required.indexOf(name) >= 0
                    };
                    return <i-panel class={'form-group'}>
                        <i-label class={'form-label'} caption={labelName}></i-label>
                        <i-panel class={'form-control'}>
                            {input}
                        </i-panel>
                    </i-panel>;
                } else {
                    const input: Input = <i-input inputType={'number'}></i-input>;
                    if (data)
                        input.value = data[name];
                    this.form[nameBuilder] = {
                        control: input,
                        type: 'input',
                        required: required && required.indexOf(name) >= 0
                    };
                    return <i-panel class={'form-group'}>
                        <i-label class={'form-label'} caption={labelName}></i-label>
                        <i-panel class={'form-control'}>
                            {input}
                        </i-panel>
                    </i-panel>;
                }
            case 'integer':
                var { minimum, maximum } = object;
                if (minimum != undefined && maximum != undefined) {
                    var input: Input = <i-input inputType={'range'} min={minimum} max={maximum} value={minimum} tooltipVisible={true}></i-input>;
                    if (data)
                        input.value = data[name];
                    this.form[nameBuilder] = {
                        control: input,
                        type: 'input',
                        required: required && required.indexOf(name) >= 0
                    };
                    return <i-panel class={'form-group'}>
                        <i-label class={'form-label'} caption={labelName}></i-label>
                        <i-panel class={'form-control'}>
                            {input}
                        </i-panel>
                    </i-panel>;
                } else {
                    var input: Input = <i-input inputType={'number'}></i-input>;
                    if (data)
                        input.value = data[name];
                    this.form[nameBuilder] = {
                        control: input,
                        type: 'input',
                        required: required && required.indexOf(name) >= 0
                    };
                    return <i-panel class={'form-group'}>
                        <i-label class={'form-label'} caption={labelName}></i-label>
                        <i-panel class={'form-control'}>
                            {input}
                        </i-panel>
                    </i-panel>;
                }
            case 'boolean':
                var checkbox: Checkbox = <i-checkbox></i-checkbox>;
                if (data)
                    checkbox.checked = data[name];
                this.form[nameBuilder] = {
                    control: checkbox,
                    type: 'checkbox',
                    required: required && required.indexOf(name) >= 0
                };
                return <i-panel class={'form-group'}>
                    <i-label class={'form-label'} caption={labelName}></i-label>
                    <i-panel class={'form-control'}>
                        {checkbox}
                    </i-panel>
                </i-panel>;
            default:
                return null;
        }
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

    async render() {
        return <i-modal id={'dialog'}
                        showBackdrop={true}
                        closeOnBackdropClick={false}
                        closeIcon={{ name: 'times' }}
                        visible={false}
                        maxWidth={'1460px'}>
            <i-tabs>
                <i-tab caption={"Config"}>
                    <i-panel id={'pnlConfig'}></i-panel>
                </i-tab>
                <i-tab caption={"Global Events"}>
                    <i-panel class={'box'}>
                        <i-panel id={'pnlEvents'} class={'box-content'}></i-panel>
                    </i-panel>
                </i-tab>
                <i-tab caption={"Visible on"}>
                    <i-panel class={'box'}>
                        <i-panel class={'box-content'}>
                            <i-panel class={'form-group'}>
                                <i-label class={'form-label'} caption={"Visible on"}></i-label>
                                <i-panel class={'form-control'}>
                                    <i-input inputType={'text'} id={"txtVisibleOn"}></i-input>
                                </i-panel>
                            </i-panel>
                            <i-panel class={'form-group'}>
                                <i-label class={'form-label'} caption={"Invisible on"}></i-label>
                                <i-panel class={'form-control'}>
                                    <i-input inputType={'text'} id={"txtInvisibleOn"}></i-input>
                                </i-panel>
                            </i-panel>
                        </i-panel>
                    </i-panel>
                </i-tab>
            </i-tabs>

            <i-panel>
                <i-button class={'btn btn-secondary'} caption={'Cancel'} onClick={this.close.bind(this)}></i-button>
                <i-button class={'btn btn-primary'} caption={'Save'}
                          onClick={this.handleSaveClick.bind(this)}></i-button>
            </i-panel>
        </i-modal>;
    }
}
