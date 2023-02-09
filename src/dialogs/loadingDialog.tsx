import {
    Module,
    customElements,
    Modal,
    Label,
    ControlElement
} from '@ijstech/components';

import { assignAttr } from '../utility/index';
import './loadingDialog.css';

export interface LoadingDialogElement extends ControlElement {
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-loading-dialog']: LoadingDialogElement;
        }
    }
}

@customElements('scpage-loading-dialog')
export class LoadingDialog extends Module {

    private lbMessage: Label;
    private mdLoading: Modal;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        assignAttr(this);
    }

    async init() {
        super.init();
    }

    show() {
        this.mdLoading.visible = true;
    }

    hide() {
        this.mdLoading.visible = false;
    }

    updateMessage(message: string) {
        this.lbMessage.caption = message;
    }

    render() {
        return (
            <i-modal id={'mdLoading'} showBackdrop={true} closeOnBackdropClick={false} maxWidth={350} height={300}>
                <i-panel class={'message-box'}>
                    <i-hstack justifyContent={'center'} alignItems={'center'}>
                        <i-panel class={'spinner'}></i-panel>
                    </i-hstack>
                    <i-label id={'lbMessage'} caption={'Loading...'} margin={{top: 5}}></i-label>
                </i-panel>
            </i-modal>
        );
    }
}
