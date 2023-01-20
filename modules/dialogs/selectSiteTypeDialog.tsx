import {
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Switch,
    Input,
    VStack,
    Control,
    GridLayout,
    Styles, Panel
} from '@ijstech/components';
import { assignAttr } from '@page/utility';
import './selectSiteTypeDialog.css';
import { IConfigData, IRowSettings, ISiteType } from '@page/interface';

export interface RowSettingsDialogElement extends ControlElement {
    onSave: (siteType: ISiteType) => void;

}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-select-site-type-dialog']: RowSettingsDialogElement;
        }
    }
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scpage-select-site-type-dialog')
export class SelectSiteTypeDialog extends Module {
    private dialog: Modal;
    private pnlSecurePage: Panel;
    private pnlSecureBook: Panel;
    private onSave: (siteType: ISiteType) => void;
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

    selectSecurePage(target: Control) {
        if(this.onSave)
            this.onSave('secure-page');
        this.hide();
    }

    selectSecureBook(target: Control) {
        if(this.onSave)
            this.onSave('secure-book');
        this.hide();
    }

    render() {
        return (
            <i-modal
                id={'dialog'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                maxWidth={'600px'}
                popupPlacement={'center'}
                class={'config'}>
                <i-panel class={'config-header'}>
                    <i-label caption='Website type' class={'title'}></i-label>
                    <i-icon name={'times'} onClick={this.hide.bind(this)} class={'close'}></i-icon>
                </i-panel>
                <i-panel class='config-body' padding={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <i-grid-layout class={'selections'} templateColumns={['1fr', '1fr']} gap={{column: '20px'}}>
                        <i-panel id={'pnlSecurePage'} class={'selection'} onClick={this.selectSecurePage.bind(this)}>
                                <i-icon name={'file'} height={30}></i-icon>
                                <i-label caption={'Secure Page'}></i-label>
                        </i-panel>
                        <i-panel id={'pnlSecureBook'} class={'selection'} onClick={this.selectSecureBook.bind(this)}>
                                <i-icon name={'book'} height={30}></i-icon>
                                <i-label caption={'Secure Book'}></i-label>
                        </i-panel>
                    </i-grid-layout>
                </i-panel>
            </i-modal>
        );
    }
}
