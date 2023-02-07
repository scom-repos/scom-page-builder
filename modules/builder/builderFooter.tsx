import {
    Module,
    customElements,
    ControlElement,
    Styles,
    Panel,
    Button,
    observable,
    application
} from '@ijstech/components';
import { EVENT } from '@page/const';
import { IPageElement, IPageFooter } from '@page/interface';
import { PageRow } from '@page/page';
import { generateUUID } from '@page/utility';
import './builderFooter.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['builder-footer']: FooterElement;
        }
    }
}

const Theme = Styles.Theme.ThemeVars;

export interface FooterElement extends ControlElement {
    readonly?: boolean;
}

@customElements('builder-footer')
export class BuilderFooter extends Module {
    private pnlFooter: Panel;
    private pnlFooterMain: Panel;

    private _image: string;
	private _elements: IPageElement[];
    private _data: IPageFooter;
    private _readonly: boolean = false;

    @observable()
    private showEdit: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            // TODO: update data
            if (!this.pnlFooterMain.hasChildNodes()) {
                this.showEdit = true;
                this.pnlFooter.background = {color: '#fff', image: ''};
            }
        })
    }

    get data() {
        return this._data;
    }
    set data(value: IPageFooter) {
        this._data = value;
        this.updateFooter();
    }

    private async updateFooter() {
        this._image = this.data.image || '';
        this._elements = this.data.elements || [];
        this.showEdit = this._elements.length === 0;
        this.pnlFooter.background = {image: this._image};
        this.pnlFooterMain.clearInnerHTML();
        const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
        let rowData = {
            id: generateUUID(),
            row: -1,
            elements: this._elements
        }
        await pageRow.setData(rowData);
        pageRow.parent = this.pnlFooterMain;
        this.pnlFooterMain.append(pageRow);
    }

    private addFooter() {
        this.data = {
            image: '',
            elements: [{
                id: generateUUID(),
                column: 1,
                columnSpan: 4,
                type: 'primitive',
                module: {
                    name: "Image",
                    description: 'Image (dev)',
                    localPath: 'modules/pageblocks/scom-image', // for testing
                    local: true
                },
                properties: {}
            }]
        }
    }

    init() {
        this._readonly = this.getAttribute('readonly', true, false);
        super.init();
        this.position = 'absolute',
        this.width = '100%';
        this.display = 'block';
        this.bottom = '0px';
        this.minHeight = 180;
    }

    render() {
        return (
            <i-vstack id="pnlFooter" width="100%" height="100%" max-maxWidth="100%" maxHeight="100%">
                <i-hstack
                    id="pnlEdit"
                    verticalAlignment="end"
                    horizontalAlignment="center"
                    width="100%" height="auto"
                    display='inline-block'
                    position="absolute" bottom="0px"
                    margin={{bottom: -10}}
                    class="edit-stack"
                    visible={this.showEdit}
                >
                    <i-panel>
                        <i-button
                            id="btnAddFooter"
                            class="btn-add"
                            icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                            font={{ color: 'rgba(0,0,0,.54)' }}
                            background={{ color: Theme.colors.secondary.light }}
                            padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                            border={{ radius: 2 }}
                            caption="Add Footer"
                            onClick={() => this.addFooter()}
                        ></i-button>
                    </i-panel>
                </i-hstack>
                <i-panel id="pnlFooterMain" max-maxWidth="100%" maxHeight="100%"></i-panel>
            </i-vstack>
        )
    }
}
