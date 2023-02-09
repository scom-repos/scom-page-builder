import {
    Module,
    customElements,
    Modal,
    ControlElement,
    Switch,
    Panel,
    Control,
    Checkbox,
    Tabs,
    Label,
    ComboBox,
    moment,
    Upload
} from '@ijstech/components';
import { assignAttr } from '../utility/index';
import './configDialog.css';
import { IDataSchema, IUISchema, IUISchemaRules, IUISchemaValidationType } from '../interface/index';

export interface ConfigDialogElement extends ControlElement {
    title?: string;
    onConfirm?: (data: any) => void;
}

export interface ValidationElement {
    scope: string;
    validateType: IUISchemaValidationType;
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
    private pnlConfigSidebar: Panel;
    private dialog: Modal;
    private validationControlList: ValidationElement[] = [];
    private _dataSchema: IDataSchema;
    private _uiSchema: IUISchema;
    private _flatRules: { elm: Control, rule: IUISchemaRules }[] = [];
    private _tabs: Tabs;
    private onConfirm: (data: any) => void;

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
        const validation = this.validateForm();
        if (validation == true) {
            console.log("validation pass")
            const data = this.getFormData();
            this.onConfirm(data);
        } else {
            console.log("validation fail")
        }
    }

    // add the scopes to validationControlList if it needs to validate
    checkIfValidationNeed(uiSchema: IUISchema): void {
        if (!uiSchema) return null;
        const { elements, type, scope, label, options, rule } = uiSchema;

        if (type == "Control" && options && options.validationType) {
            let item = {
                scope: scope,
                validateType: options.validationType
            } as ValidationElement
            this.validationControlList.push(item)
        }

        if (elements) {
            elements.forEach((value) => {
                if (value.type == "Control" && value.options && value.options.validationType) {
                    let item = {
                        scope: value.scope,
                        validateType: value.options.validationType
                    } as ValidationElement
                    this.validationControlList.push(item)
                }
                if (value.rule != null) {
                    let ruleScope = document.getElementById(value.rule.condition.scope) as Checkbox
                    if (ruleScope.checked == true) {
                        // rule is toggle on
                        value.elements.forEach((e) => {
                            this.checkIfValidationNeed(e);
                        })
                    } else {
                        // rule is toggle off
                    }
                } else {
                    if (value.elements) {
                        value.elements.forEach((e) => {
                            this.checkIfValidationNeed(e);
                        })
                    }
                }
            })
        }
    }

    // validate the value of scope under the corresponding validation type
    validateForm(): boolean {
        let validationFailList: ValidationElement[] = []

        this.validationControlList = [];
        this.checkIfValidationNeed(this._uiSchema);

        this.validationControlList.forEach((value) => {
            // get the value of input
            let elmValue = (document.getElementById(value.scope) as HTMLInputElement).value

            switch (value.validateType) {
                case 'check-null': {
                    if (elmValue == null || elmValue == "" || elmValue == undefined) {
                        validationFailList.push(value)
                    } else if (typeof elmValue == "string") {
                        let trimmedValue = elmValue
                        trimmedValue = trimmedValue.replace(/\s/g, "")
                        if (trimmedValue == "" || trimmedValue == null) {
                            validationFailList.push(value)
                        }
                    }
                    break;
                }
            }
        })

        this.showValidationFailMsg(validationFailList);

        console.log("validationFailList", validationFailList);
        return validationFailList.length == 0 ? true : false;
    }

    // display the fail msg if validation failed
    showValidationFailMsg(validationFailList: ValidationElement[]) {
        this.validationControlList.forEach((value) => {
            const elmLabelId = value.scope + "/_label"
            const elmErrorLabelId = value.scope + "/_error_label"
            let elmLabel = document.getElementById(elmLabelId) as Label
            let elmErrorLabel = document.getElementById(elmErrorLabelId) as Label

            // display or remove error msg
            if (validationFailList.includes(value)) {
                switch (value.validateType) {
                    case 'check-null': {
                        if (elmLabel)
                            elmLabel.style.color = "var(--colors-error-dark)"
                        if (elmErrorLabel) {
                            elmErrorLabel.caption = "* is a required property"
                            elmErrorLabel.visible = true
                        }
                        break;
                    }
                }
            } else {
                if (elmLabel)
                    elmLabel.style.color = "var(--text-primary)"
                if (elmErrorLabel) {
                    elmErrorLabel.caption = ""
                    elmErrorLabel.visible = false
                }
            }
        })
    }

    getFormData() {
        if (!this._dataSchema) return;
        const data = this.getData(this._dataSchema, '#')
        return data;
    }

    render() {
        return (
            <i-modal
                id={'dialog'}
                class={'config'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                maxWidth={'1460px'}
                popupPlacement={'center'}
            >
                <i-panel class={'config-header'}>
                    <i-label class={'title'} caption={this.title} />
                    <i-icon class={'close'} name={'times'} onClick={this.hide.bind(this)} />
                </i-panel>
                <i-grid-layout templateColumns={['228px', '1fr']}>
                    <i-panel id={'pnlConfigSidebar'} class={'config-sidebar'} />
                    <i-panel>
                        <i-panel class={'config-body root-custom--scollbar'} id={'pnlConfigBody'} />
                        <i-panel class={'config-footer'}>
                            <i-button
                                class={'btn btn-secondary'}
                                caption={'Cancel'}
                                onClick={this.hide.bind(this)}
                            />
                            <i-button
                                class={'btn btn-primary'}
                                caption={'Confirm'}
                                margin={{ left: 5 }}
                                onClick={this.confirm.bind(this)}
                            />
                        </i-panel>
                    </i-panel>
                </i-grid-layout>
            </i-modal>
        );
    }

    private clear() {
        this.pnlConfigBody.clearInnerHTML();
        this.pnlConfigSidebar.clearInnerHTML();
    }

    private renderForm() {
        if (!this._dataSchema || !this._uiSchema) return;
        this.clear();
        this.pnlConfigBody.append(this.createUI(this._uiSchema));
        this.setupRules();
        if (this._tabs) {
            const navs = document.querySelectorAll('.config-nav');
            if (navs && navs.length > 0) {
                for (let nav of navs) {
                    if (nav['visible'] && nav['onClick'])
                        nav['onClick'](nav);
                }
            }
        }
    }

    private getData(object: IDataSchema, name: string) {
        if (!object) return null;
        const type = object.type?.toLowerCase();
        if (!type || (type !== 'object' && !this[name])) {
            return null;
        }
        switch (type) {
            case 'object':
                let data = {};
                const properties = object.properties;
                for (const propertyName in properties) {
                    data[propertyName] = this.getData(properties[propertyName], `${name}/properties/${propertyName}`);
                }
                return data;
            case 'number':
            case 'integer':
                return this[name].value;
            case 'boolean':
                return this[name].checked;
            case 'string':
                if (object.enum || object.oneOf) {
                    if (this[name].tagName === 'I-COMBO-BOX') {
                        return this[name].value?.value;
                    }
                    return this[name].selectedValue;
                }
                return this[name].value;
            default:
                return null;
        }
    }

    private setupRules() {
        let scopes: { [key: string]: any[] } = {};
        for (const item of this._flatRules) {
            const { rule } = item;
            if (rule && rule.condition && rule.condition.scope && rule.condition.schema) {
                if (!scopes[rule.condition.scope]) {
                    scopes[rule.condition.scope] = [];
                }
                scopes[rule.condition.scope].push(item);
            }
        }
        for (const keyScope of Object.keys(scopes)) {
            const control: Control = (document.getElementById(keyScope) as Control);
            if (control) {
                const items = scopes[keyScope];
                const toggleValidate = () => {
                    for (const item of items) {
                        const { rule, elm } = item;
                        const isCombobox = control.tagName === 'I-COMBO-BOX';
                        const _value: any = isCombobox ? (control as any).value?.value : (control as Checkbox | Switch).checked;
                        if (rule.effect === 'HIDE' || rule.effect === 'SHOW') {
                            if (_value === rule.condition.schema.const || (isCombobox && (_value === '' || _value === undefined || _value === null))) {
                                elm.visible = rule.effect === 'SHOW';
                            } else {
                                elm.visible = !(rule.effect === 'SHOW');
                            }
                        } else if (rule.effect == 'ENABLE' || rule.effect == 'DISABLE') {
                            if (_value === rule.condition.schema.const || (isCombobox && (_value === '' || _value === undefined || _value === null))) {
                                elm.enabled = rule.effect === 'ENABLE';
                            } else {
                                elm.enabled = !(rule.effect === 'ENABLE');
                            }
                        }
                    }
                };
                if (['I-COMBO-BOX', 'I-CHECKBOX', 'I-SWITCH'].includes(control.tagName)) {
                    (control as Checkbox | Switch | ComboBox).onChanged = (target: Control, event: Event) => {
                        toggleValidate();
                    };
                    toggleValidate();
                }
            }
        }
    }

    private createUI(uiSchema: IUISchema, carryData?: any) {
        if (!uiSchema) return null;
        const { title, elements, type, scope, label, options, rule } = uiSchema;
        let elm: any;
        if (type === 'VerticalLayout') {
            const _elm = (
                <i-vstack justifyContent={'center'} alignItems={'center'}>
                    {elements.map(v => this.createUI(v))}
                </i-vstack>);
            if (title) {
                elm = (
                    <i-vstack alignItems={'start'} class="wrapper-box">
                        <i-label caption={title} class="wrapper-box--header" />
                        <i-panel class="wrapper-box--content">
                            {_elm}
                        </i-panel>
                    </i-vstack>);
            } else {
                elm = _elm;
            }
            if (rule) this._flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'HorizontalLayout') {
            const _elm = (<i-grid-layout width={'100%'} gap={{ column: 16 }}
                templateColumns={this.generateTemplateColumnsByNumber(elements.length)}>{elements.map(v => this.createUI(v))}</i-grid-layout>);
            if (title) {
                elm = (
                    <i-vstack alignItems={'start'} class="wrapper-box">
                        <i-label caption={title} class="wrapper-box--header" />
                        <i-panel class="wrapper-box--content">
                            {_elm}
                        </i-panel>
                    </i-vstack>);
            } else {
                elm = _elm;
            }
            if (rule) this._flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'Group') {
            const elm = (<i-panel class={'box'} width={'100%'}>
            </i-panel>);
            if (label !== false && !!label) {
                elm.append(<i-panel class={'box-header'}>
                    <i-label caption={label as string} />
                </i-panel>);
            }
            const boxContent = <i-panel class={'box-content'}>{elements.map(v => this.createUI(v))}</i-panel>;
            elm.append(boxContent);
            if (rule) this._flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'Categorization') {
            const elm: Tabs = <i-tabs></i-tabs>;
            for (let i = 0; i < elements.length; i++) {
                // elm.append(this.createUI(element));
                const element = elements[i];
                this.createUI(element, { tabs: elm, index: i });
            }
            if (rule) this._flatRules.push({ elm, rule });
            this._tabs = elm;
            return elm;
        } else if (type === 'Category') {
            let caption;
            if (label !== false) {
                caption = label;
            }
            if (carryData && carryData.tabs && carryData.index != undefined) {
                const children = <i-panel />;
                for (const element of elements) {
                    children.append(this.createUI(element));
                }
                carryData.tabs.add({ caption, children });
                const pnlConfigNav = <i-panel class={'config-nav'} onClick={(target: Control) => {
                    const navs = this.pnlConfigSidebar.querySelectorAll('.config-nav');
                    if (navs) {
                        for (const nav of navs) {
                            nav.classList.remove('active');
                        }
                    }
                    target.classList.add('active');
                    this._tabs.activeTabIndex = carryData.index;
                }}>
                    <i-label caption={caption} />
                </i-panel>;
                this.pnlConfigSidebar.append(pnlConfigNav);
                if (rule) this._flatRules.push({ elm: pnlConfigNav, rule });
            }
            // return elm;
        } else if (type === 'Control' && scope) {
            // console.log("scope :", scope)
            // if (required && required == true)
            //     this.validationControlList.push(scope)

            const [key, dataSchema] = this.getDataSchemaByScope(scope);
            const stub = <i-panel class={'form-group'}>
            </i-panel>;
            let caption, labelElm, descriptionElm;
            let formControlElm = <i-panel class={'form-control'} maxWidth={options?.maxWidth} maxHeight={options?.maxHeight} />;
            let hideLabel = false;
            if (label !== false) {
                caption = label as string;
                if (!caption)
                    caption = this.convertFieldNameToLabel(key);
                // labelElm = <i-label class={'form-label'} caption={caption} />;
            }
            if (dataSchema.type === 'string') {
                if (dataSchema.format === 'image') {
                    const onFileChanged = async (source: Upload, fileList: File[]) => {
                        inputImg.value = fileList.length ? (await source.toBase64(fileList[0])).toString() : '';
                    }
                    const inputImg = <i-input
                        id={scope}
                        visible={false}
                        inputType={'text'}
                        value={dataSchema.default || ''}
                    />
                    const uploader: Upload = <i-upload
                        onChanged={onFileChanged.bind(this)}
                        onRemoved={onFileChanged.bind(this)}
                    />
                    if(dataSchema.default) {
                        uploader.preview(dataSchema.default as string);
                        uploader.fileList = [new File([], '')];
                    }
                    formControlElm.append(<i-panel>
                        { inputImg }
                        { uploader }
                    </i-panel>);
                }
                // Date / Time / Datetime picker
                else if (dataSchema.format === 'date' || (options && options.format === 'date')) {
                    const datePicker = <i-datepicker
                        id={scope}
                        value={dataSchema.default ? moment(dataSchema.default as number | string) : undefined}
                        type={'date'}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />;
                    formControlElm.append(datePicker);
                } else if (dataSchema.format === 'time' || (options && options.format === 'time')) {
                    const timePicker = <i-datepicker
                        id={scope}
                        value={dataSchema.default ? moment(dataSchema.default as number | string) : undefined}
                        type={'time'}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />;
                    formControlElm.append(timePicker);
                } else if (dataSchema.format === 'date-time' || (options && options.format === 'date-time')) {
                    const dateTimePicker = <i-datepicker
                        id={scope}
                        value={dataSchema.default ? moment(dataSchema.default as number | string) : undefined}
                        type={'dateTime'}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />;
                    formControlElm.append(dateTimePicker);
                } else if (options && options.color) {
                    const colorPicker = <i-input
                        id={scope}
                        value={dataSchema.default}
                        inputType={'color'}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />;
                    formControlElm.append(colorPicker);
                } else {
                    if (dataSchema.enum && dataSchema.enum.length > 0) {
                        if (options && options.format === 'radio') {
                            // Radio button
                            const items: { caption: string, value: string, tooltip: string }[] = [];
                            let defaultData = null;
                            for (const item of dataSchema.enum) {
                                if (dataSchema.default && item === dataSchema.default) {
                                    defaultData = item;
                                }
                                items.push({ caption: item, value: item, tooltip: item });
                            }
                            const radioGroupElm = <i-radio-group
                                id={scope}
                                selectedValue={defaultData}
                                radioItems={items}
                                maxWidth={options?.maxWidth}
                                maxHeight={options?.maxHeight}
                            />;
                            formControlElm.append(radioGroupElm);
                        } else {
                            const items = [];
                            let defaultData = null;
                            for (const item of dataSchema.enum) {
                                if (dataSchema.default && item === dataSchema.default) {
                                    defaultData = { label: item, value: item };
                                }
                                items.push({ label: item, value: item });
                            }
                            const comboBoxElm = <i-combo-box
                                id={scope}
                                items={items}
                                selectedItem={defaultData}
                                maxWidth={options?.maxWidth}
                                maxHeight={options?.maxHeight}
                                icon={{ name: 'caret-down' }}
                            />;
                            formControlElm.append(comboBoxElm);
                        }
                    } else if (dataSchema.oneOf && dataSchema.oneOf.length >= 0) {
                        if (options && options.format === 'radio') {
                            // Radio button
                            const items: { caption: string, value: string, tooltip: string }[] = [];
                            for (const item of dataSchema.oneOf) {
                                items.push({ caption: item.title, value: item.const, tooltip: item.title });
                            }
                            const radioGroupElm = <i-radio-group
                                id={scope}
                                radioItems={items}
                                maxWidth={options?.maxWidth}
                                maxHeight={options?.maxHeight}
                            />;
                            formControlElm.append(radioGroupElm);
                        } else {
                            const items = [];
                            let defaultData = null;
                            for (const item of dataSchema.oneOf) {
                                if (dataSchema.default && item.const === dataSchema.default) {
                                    defaultData = { label: item.title, value: item.const };
                                }
                                items.push({ label: item.title, value: item.const });
                            }
                            const comboBoxElm = <i-combo-box
                                id={scope}
                                items={items}
                                selectedItem={defaultData}
                                maxWidth={options?.maxWidth}
                                maxHeight={options?.maxHeight}
                                icon={{ name: 'caret-down' }}
                            />;
                            formControlElm.append(comboBoxElm);
                        }
                    } else {
                        const input = <i-input
                            id={scope}
                            value={dataSchema.default || ''}
                            inputType={'text'}
                            maxWidth={options?.maxWidth}
                            maxHeight={options?.maxHeight}
                        />;
                        formControlElm.append(input);
                    }
                }
            } else if (dataSchema.type === 'number') {
                if (options && options.slider) {
                    formControlElm.append(<i-input
                        id={scope}
                        inputType={'range'}
                        min={dataSchema.minimum || 0}
                        max={dataSchema.maximum}
                        value={dataSchema.default || dataSchema.minimum || 0}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                        tooltipVisible={true}
                    />);
                } else {
                    formControlElm.append(<i-input
                        id={scope}
                        value={dataSchema.default || ''}
                        inputType={'number'}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />);
                }
            } else if (dataSchema.type === 'integer') {
                if (options && options.slider) {
                    formControlElm.append(<i-input
                        id={scope} inputType={'range'}
                        min={dataSchema.minimum || 0}
                        max={dataSchema.maximum}
                        value={dataSchema.default || dataSchema.minimum || 0}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                        tooltipVisible={true}
                    />);
                } else {
                    formControlElm.append(<i-input
                        id={scope}
                        inputType={'number'}
                        value={dataSchema.default || ''}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />);
                }
            } else if (dataSchema.type === 'boolean') {
                hideLabel = true;
                if (options && options.toggle) {
                    formControlElm.append(
                        <i-grid-layout templateColumns={['48px', '1fr']} gap={{ column: '10px' }}>
                            <i-switch id={scope} checked={!!dataSchema.default as boolean} maxWidth={options?.maxWidth} maxHeight={options?.maxHeight} />
                            <i-label caption={caption} />
                        </i-grid-layout>);
                } else {
                    formControlElm.append(<i-checkbox
                        id={scope}
                        caption={caption}
                        checked={!!dataSchema.default as boolean}
                        maxWidth={options?.maxWidth}
                        maxHeight={options?.maxHeight}
                    />);
                }
            }
            if (dataSchema.description) {
                descriptionElm = <i-label id={scope + "/_description"} class={'form-description'} caption={dataSchema.description} />;
            }

            if (!hideLabel && caption)
                stub.append(<i-hstack verticalAlignment={'center'} horizontalAlignment={'start'} gap={10}>
                    <i-label id={scope + "/_label"} class={'form-label-no-error'} caption={caption} />
                    <i-label id={scope + "/_error_label"} class={'form-label-error'} font={{ color: 'var(--colors-error-dark)' }} visible={false} />
                </i-hstack>)
            if (formControlElm)
                stub.append(formControlElm);
            if (descriptionElm)
                stub.append(descriptionElm);
            if (title) {
                elm = (
                    <i-vstack alignItems={'start'} class="wrapper-box">
                        <i-label caption={title} class="wrapper-box--header" />
                        <i-panel class="wrapper-box--content">
                            {stub}
                        </i-panel>
                    </i-vstack>);
            } else {
                elm = stub;
            }
            if (rule) this._flatRules.push({ elm, rule });
            return elm;
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
