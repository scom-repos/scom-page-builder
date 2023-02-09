import {
    Module,
    customElements,
    Label,
    ControlElement,
    Styles,
    application
} from '@ijstech/components';
import assets from '../assets';
import './pageFooter.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-page-footer']: PageFooterElement;
        }
    }
}

export interface PageFooterElement extends ControlElement {

}

const Theme = Styles.Theme.ThemeVars;

@customElements('scpage-page-footer')
export class PageFooter extends Module {
    private _footer: string;
    private _sticky: boolean = false;
    private lbFooter: Label;

    constructor(parent?: any) {
        super(parent);
    }

    async init() {
        super.init();
    }

    get footer() {
        return this._footer;
    }

    set footer(value: string) {
        this._footer = value;
        this.lbFooter.caption = value;
    }

    get sticky() {
        return this._sticky;
    }

    set sticky(value: boolean) {
        this._sticky = value;
        this._sticky
        ? this.classList.add('sticky')
        : this.classList.remove('sticky');
    }

    render() {
        return (
            <i-hstack class={"footer"} justifyContent={"start"} alignItems={"center"} padding={{left: 20, right: 20, top: 10, bottom: 10}}>
                <i-image height={30} width={30} url={assets.icons.logo} margin={{right: 10}}></i-image>
                <i-panel>
                    {/*<i-label id={"lbFooter"} caption={"Secure DApp Block Powered by Secure Compute"} font={{color: Theme.text.primary}}></i-label>*/}
                    <i-label id={"lbFooter"} font={{color: Theme.text.primary}}></i-label>
                </i-panel>
                <i-panel>
                </i-panel>
            </i-hstack>
        );
    }
}

