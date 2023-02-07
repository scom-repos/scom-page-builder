import {
    Module,
    customElements,
    ControlElement,
    Styles,
    Panel,
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
    private pnlEditOverlay: Panel;
    private pnlOverlay: Panel;

    private _image: string;
	private _elements: IPageElement[];
    private _readonly: boolean = false;

    @observable()
    private showAddStack: boolean = true;

    constructor(parent?: any) {
        super(parent);
        this.initEventBus();
        this.getData = this.getData.bind(this);
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_SECTIONS, async () => {
            // TODO: update data
            if (!this.pnlFooterMain.hasChildNodes()) {
                this.showAddStack = true;
                this.pnlFooter.background = {color: '#fff', image: ''};
                this.pnlEditOverlay.visible = false;
            }
        })
    }

    get data(): IPageFooter {
        return {
            image: this._image,
            elements: this._elements
        };
    }
    set data(value: IPageFooter) {
        this._image = value.image || '';
        this._elements = value.elements || [];
        this.updateFooter();
    }

    async getData() {
        let elements = [];
        if (this._elements) {
            const row = this.pnlFooterMain.querySelector('ide-row') as PageRow;
            if (row) elements = (await row.getData())?.elements || [];
        }
        return {...this.data, elements};
    }

    private async updateFooter() {
        this.showAddStack = this._elements.length === 0;
        this.pnlEditOverlay.visible = !this.showAddStack;
        if (this.pnlEditOverlay.visible)
            this.pnlEditOverlay.classList.add('flex');
        else
            this.pnlEditOverlay.classList.remove('flex');
        this.pnlFooter.background = {image: this._image};
        this.pnlFooterMain.clearInnerHTML();
        const pageRow = (<ide-row maxWidth="100%" maxHeight="100%"></ide-row>) as PageRow;
        const rowData = {
            id: generateUUID(),
            row: -1,
            elements: this._elements
        }
        await pageRow.setData(rowData);
        pageRow.parent = this.pnlFooterMain;
        this.pnlFooterMain.append(pageRow);
        application.EventBus.dispatch(EVENT.ON_UPDATE_FOOTER);
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
                    description: 'Textbox (dev)',
                    localPath: 'modules/pageblocks/pageblock-markdown-editor',
                    name: "Textbox",
                    local: true
                },
                properties: {}
            }]
        }
    }

    private updateOverlay(value: boolean) {
        this.pnlEditOverlay.visible = value;
        if (this.pnlEditOverlay.visible)
            this.pnlEditOverlay.classList.add('flex');
        else
            this.pnlEditOverlay.classList.remove('flex');
        this.pnlOverlay.visible = !this.pnlEditOverlay.visible;
        this.pnlOverlay.height = this.pnlOverlay.visible ? document.body.offsetHeight : 0;
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
            <i-vstack
                id="pnlFooter"
                width="100%" height="100%"
                maxWidth="100%" maxHeight="100%"
            >
                <i-panel
                    id="pnlOverlay"
                    width="100%" height="100%"
                    background={{color: 'rgba(0,0,0,.6)'}}
                    zIndex={29}
                    visible={false}
                    onClick={() => this.updateOverlay(true)}
                ></i-panel>
                <i-hstack
                    id="pnlEditOverlay"
                    width="100%" height="100%"
                    dock='fill'
                    background={{color: 'rgba(0,0,0,.6)'}}
                    zIndex={29}
                    class="edit-stack"
                    visible={false}
                    verticalAlignment="center" horizontalAlignment="center"
                >
                     <i-button
                        class="btn-add"
                        icon={{ name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }}
                        font={{ color: 'rgba(0,0,0,.54)' }}
                        background={{ color: Theme.colors.secondary.light }}
                        padding={{ top: 10, left: 6, right: 6, bottom: 10 }}
                        border={{ radius: 2 }}
                        caption="Edit Footer"
                        onClick={() => this.updateOverlay(false)}
                    ></i-button>
                </i-hstack>
                <i-hstack
                    verticalAlignment="end"
                    horizontalAlignment="center"
                    width="100%" height="auto"
                    display='inline-block'
                    position="absolute" bottom="0px"
                    margin={{bottom: -10}}
                    class="edit-stack"
                    visible={this.showAddStack}
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
