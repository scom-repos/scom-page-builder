import {
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Switch,
    Input,
    VStack,
    Control
} from '@ijstech/components';
import { assignAttr } from '../utility/index';
import './rowSettingsDialog.css';
import { IRowSettings } from '../interface/index';

export interface RowSettingsDialogElement extends ControlElement {
    onSave: (config: IRowSettings) => Promise<void>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-row-settings-dialog']: RowSettingsDialogElement;
        }
    }
}

@customElements('scpage-row-settings-dialog')
export class RowSettingsDialog extends Module {
    private dialog: Modal;
    private ipWidth: Input;
    private ipHeight: Input;
    private ipColumns: Input;
    private txtRowBackgroundColor: Input;
    private txtRowBackgroundImageURL: Input;
    private vstackColumnsWidth: VStack;
    private columnsWidth: string[] = [];
    private vstackColumnsSize: VStack;
    private columnsSize: { width?: string, height?: string }[] = [];
    private onSave: (config: IRowSettings) => Promise<void>;

    constructor(parent?: any) {
        super(parent);
        assignAttr(this);
    }

    async init() {
        super.init();
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    setConfig(config: IRowSettings) {
        const { width, height, columns, columnsSettings } = config;
        this.ipWidth.value = width;
        this.ipHeight.value = height;
        this.ipColumns.value = columns;
        this.updateColumnsSettings(columns, columnsSettings);
    }

    getConfig(): IRowSettings {
        const width = this.ipWidth.value;
        const height = this.ipHeight.value;
        const columns = parseInt(this.ipColumns.value);
        const columnsSettings = this.getColumnsSettings();
        const backgroundColor = this.txtRowBackgroundColor.value;
        const backgroundImageUrl = this.txtRowBackgroundImageURL.value;
        return {
            width,
            height,
            columns,
            columnsSettings,
            backgroundColor,
            backgroundImageUrl
        };
    }

    getColumnsSettings() {
        let settings = [];
        this.columnsWidth.forEach((value, idx) => {
            const size = this.columnsSize[idx] || {}
            settings.push({
                width: value,
                size,
            })
        });
        return settings;
    }

    onColumnsChanged() {
        const length = parseInt(this.ipColumns.value);
        if (isNaN(length)) return;
        this.updateColumnsSettings(length);
    }

    onColumnWidthChanged(src: Control, idx: number) {
        this.columnsWidth[idx] = (src as Input).value;
    }

    onColumnSizeChanged(src: Control, idx: number, key: string) {
        this.columnsSize[idx][key] = (src as Input).value;
    }

    updateColumnsSettings(length: number, columnsSettings?: any) {
        let arrWidth = [];
        let arrSize = [];
        let arrNodeWidth = [];
        let arrNodeSize = [];
        let colSettings = columnsSettings || {};
        for (let i = 0; i < length; i++) {
            const setting = colSettings[i] || {};
            arrWidth.push(setting.width);
            arrSize.push(setting.size || {});
            arrNodeWidth.push(<i-hstack width="100%" horizontalAlignment="space-between">
                <i-label caption={`Column ${i + 1}`}></i-label>
                <i-input value={setting.width || ''} onChanged={(src) => this.onColumnWidthChanged(src, i)} margin={{ top: 0 }}></i-input>
            </i-hstack>)
            arrNodeSize.push(<i-vstack gap={8} border={{ top: { width: 1, style: i ? 'solid' : 'none', color: '#dfe5eb' } }} padding={{ top: i ? 4 : 0 }} margin={{ top: i ? 4 : 0 }}>
                <i-label caption={`Column ${i + 1}`}></i-label>
                <i-hstack width="100%" padding={{ left: 8 }} horizontalAlignment="space-between">
                    <i-label caption="Width"></i-label>
                    <i-input value={setting.size?.width || ''} onChanged={(src) => this.onColumnSizeChanged(src, i, 'width')} margin={{ top: 0 }}></i-input>
                </i-hstack>
                <i-hstack width="100%" padding={{ left: 8 }} horizontalAlignment="space-between">
                    <i-label caption="Height"></i-label>
                    <i-input value={setting.size?.height || ''} onChanged={(src) => this.onColumnSizeChanged(src, i, 'height')} margin={{ top: 0 }}></i-input>
                </i-hstack>
            </i-vstack>)
        }
        this.columnsWidth = arrWidth;
        this.columnsSize = arrSize;
        this.vstackColumnsWidth.clearInnerHTML();
        this.vstackColumnsWidth.append(...arrNodeWidth);
        this.vstackColumnsSize.clearInnerHTML();
        this.vstackColumnsSize.append(...arrNodeSize);
    }

    async confirm() {
        const config = this.getConfig();
        if (this.onSave) await this.onSave(config);
        this.dialog.visible = false;
    }

    cancel() {
        this.dialog.visible = false;
    }

    render() {
        return (
            <i-modal
                id={'dialog'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                maxWidth={'1460px'}
                height={'600px'}
                popupPlacement={'center'}>
                <i-panel class="settings-header">
                    <i-label caption="Row Settings" class="settings-header-title"></i-label>
                    <i-button
                        icon={{ name: 'times' }}
                        class="settings-close"
                        onClick={this.hide}></i-button>
                </i-panel>

                <i-hstack class="settings-body">
                    <i-vstack class="right-side-area">
                        <i-vstack class="page-body-container">
                            <i-panel class="page-area">
                                <i-panel class="area-heading">
                                    <i-label caption="Size Settings"></i-label>
                                </i-panel>

                                <i-vstack class="area-content">
                                    <i-hstack class="area-config">
                                        <i-label caption="Width"></i-label>
                                        <i-input id={'ipWidth'} margin={{ top: 0 }}></i-input>
                                    </i-hstack>
                                    <i-hstack class="area-config">
                                        <i-label caption="Height"></i-label>
                                        <i-input id={'ipHeight'} margin={{ top: 0 }}></i-input>
                                    </i-hstack>
                                </i-vstack>
                            </i-panel>

                            <i-panel class="page-area">
                                <i-panel class="area-heading">
                                    <i-label caption="Column Settings"></i-label>
                                </i-panel>

                                <i-vstack class="area-content">
                                    <i-hstack class="area-config">
                                        <i-label caption="Number of Columns"></i-label>
                                        <i-input id={'ipColumns'} margin={{ top: 0 }} onChanged={this.onColumnsChanged}></i-input>
                                    </i-hstack>
                                    <i-vstack gap={4}>
                                        <i-label caption="Width Settings"></i-label>
                                        <i-vstack id="vstackColumnsWidth" gap={8} border={{ width: 1, style: 'solid', radius: 8, color: '#dfe5eb' }} padding={{ top: 8, bottom: 8, left: 16, right: 16 }}></i-vstack>
                                    </i-vstack>
                                    <i-vstack gap={4}>
                                        <i-label caption="Container Size Settings"></i-label>
                                        <i-vstack id="vstackColumnsSize" gap={8} border={{ width: 1, style: 'solid', radius: 8, color: '#dfe5eb' }} padding={{ top: 8, bottom: 8, left: 16, right: 16 }}></i-vstack>
                                    </i-vstack>
                                </i-vstack>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Background'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'}>
                                        <i-label class={'form-label'} caption={'Background color'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-input inputType={'color'} id={'txtRowBackgroundColor'}></i-input>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'}>
                                        <i-label class={'form-label'} caption={'Background image URL'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-input inputType={'text'} id={'txtRowBackgroundImageURL'}></i-input>
                                        </i-panel>
                                    </i-panel>
                                </i-panel>
                            </i-panel>

                            <i-hstack
                                justifyContent={'end'}
                                alignItems={'center'}
                                padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                <i-button
                                    caption={'Cancel'}
                                    margin={{ right: 5 }}
                                    onClick={this.cancel}></i-button>
                                <i-button caption={'Confirm'} onClick={this.confirm}></i-button>
                            </i-hstack>
                        </i-vstack>
                    </i-vstack>
                </i-hstack>
            </i-modal>
        );
    }
}
