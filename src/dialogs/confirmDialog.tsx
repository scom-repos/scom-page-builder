import {
    customElements,
    Module,
    Modal,
    ControlElement,
    Label,
    Container,
    Button,
    Styles
} from '@ijstech/components';
import {assignAttr} from '../utility/index';

export interface ConfirmDialogElement extends ControlElement {
    message: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    onCancel?: () => Promise<void>;
    onConfirm?: () => Promise<void>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["scpage-confirm-dialog"]: ConfirmDialogElement;
        }
    }
};

@customElements('scpage-confirm-dialog')
export class ConfirmDialog extends Module {
    message: string;
    cancelButtonText: string;
    confirmButtonText: string;
    showCancelButton: boolean;
    showConfirmButton: boolean;
    onCancel: () => Promise<void>;
    onConfirm: () => Promise<void>;

    private dialog: Modal;
    private lbMessage: Label;
    private btnCancel: Button;
    private btnConfirm: Button;

    constructor(parent?: Container, options?: any) {
        super(parent, options)
    }

    async init() {
        super.init();
        assignAttr(this);
        if(this.message)
            this.lbMessage.caption = this.message;
        if(this.cancelButtonText)
            this.btnCancel.caption = this.cancelButtonText;
        if(this.confirmButtonText)
            this.btnConfirm.caption = this.confirmButtonText;
    }

    async confirm() {
        if(this.onConfirm)
            await this.onConfirm();
        this.dialog.visible = false;
    }

    async cancel() {
        if(this.onCancel)
            await this.onCancel();
        this.dialog.visible = false;
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    render() {
        return (
            <i-modal id={"dialog"} showBackdrop={true} maxWidth={"400px"} popupPlacement={"center"}>
                <i-panel padding={{top: 20, bottom: 20, left: 20, right: 20}}>
                    <i-label id={"lbMessage"} caption={"Confirm?"}></i-label>
                </i-panel>
                <i-hstack justifyContent={"end"} alignItems={"center"} padding={{top: 5, bottom: 5}}>
                    <i-button id={"btnCancel"} caption={"No"} onClick={this.cancel} background={{color: Styles.Theme.ThemeVars.colors.success.main}}></i-button>
                    <i-button id={"btnConfirm"} caption={"Yes"} onClick={this.confirm} margin={{left: 5}}></i-button>
                </i-hstack>
            </i-modal>
        )
    }
}
