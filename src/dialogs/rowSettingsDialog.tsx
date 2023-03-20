import {
    Module,
    customElements,
    Modal,
    ControlElement,
    Input,
    Styles
} from '@ijstech/components';
import { assignAttr } from '../utility/index';
import './rowSettingsDialog.css';
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

export interface RowSettingsDialogElement extends ControlElement {
    onSave: () => Promise<void>;
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
    private txtRowBackgroundColor: Input;
    private onSave: (config: string) => Promise<void>;

    constructor(parent?: any) {
        super(parent);
        assignAttr(this);
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    setConfig(config: string) {
        this.txtRowBackgroundColor.value = config;
    }

    getConfig() {
        const backgroundColor = this.txtRowBackgroundColor.value;
        return backgroundColor;
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
                minWidth={400}
                maxWidth={500}
                title="Section Colors"
                closeOnBackdropClick={false}
                closeIcon={{ name: 'times' }}
                class="setting-modal"
            >
               <i-vstack padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}>
                    <i-vstack class={'form-group'} margin={{bottom: '2rem'}} gap="0.5rem">
                        <i-label class={'form-label'} caption={'Background color'}></i-label>
                        <i-panel class={'form-control'}>
                            <i-input inputType={'color'} id={'txtRowBackgroundColor'}></i-input>
                        </i-panel>
                    </i-vstack>

                    <i-hstack
                        justifyContent={'end'}
                        alignItems={'center'}
                        gap="0.5rem"
                    >
                        <i-button
                            caption={'Cancel'}
                            background={{color: Theme.colors.primary.main}}
                            font={{color: Theme.colors.primary.contrastText}}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                            onClick={this.cancel}></i-button>
                        <i-button
                            caption={'Confirm'}
                            background={{color: Theme.colors.primary.main}}
                            font={{color: Theme.colors.primary.contrastText}}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                            onClick={this.confirm}
                        ></i-button>
                    </i-hstack>
                </i-vstack>
            </i-modal>
        );
    }
}
