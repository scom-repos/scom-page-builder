import {
    Module,
    customElements,
    Panel,
    ControlElement
} from '@ijstech/components';
import './pageSection.css';
import { IPageElement } from '../interface/index';
import { RowSettingsDialog } from '../dialogs/index';
import { IDEToolbar } from '../common/index';
import { isEmpty } from '../utility/index';
import { pageObject } from '../store/index';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['ide-section']: PageSectionElement;
        }
    }
}

export interface PageSectionElement extends ControlElement {
    readonly?: boolean;
    containerSize?: {
        width?: string;
        height?: string;
    }
}

@customElements('ide-section')
export class PageSection extends Module {
    private pnlMain: Panel;

    private _readonly: boolean;
    private rowId: string = '';

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
    }

    get readonly() {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = value;
    }

    get data() {
        return pageObject.getElement(this.rowId, this.id);
    }

    init() {
        super.init();
        this.readonly = this.getAttribute('readonly', true, false);
    }

    clear() {
        this.pnlMain.clearInnerHTML();
    }

    private async createToolbar(value: IPageElement) {
        const toolbar = <ide-toolbar readonly={this._readonly}></ide-toolbar> as IDEToolbar;
        toolbar.id = `elm-${value.id}`;
        toolbar.rowId = this.rowId;
        toolbar.elementId = value.id;
        toolbar.parent = this.pnlMain;
        this.pnlMain.appendChild(toolbar);
        await toolbar.fetchModule(value);
        if (!isEmpty(value.properties)) toolbar.setProperties(value.properties);
        value.tag && toolbar.setTag(value.tag);
    }

    async setData(rowId: string, value: IPageElement) {
        this.id = value.id;
        this.rowId = rowId;
        if (value.type === 'primitive') {
            await this.createToolbar(value);
        } else if (value?.elements?.length) {
            for (let element of value.elements) {
                await this.createToolbar(element);
            }
        }
    }

    render() {
        return (
            <i-panel id={'pnlPageSection'} maxWidth="100%" maxHeight="100%" height="100%">
                <i-panel
                    id="pageSectionWrapper"
                    width="100%" height="100%"
                    maxWidth="100%" maxHeight="100%"
                    padding={{top: '1.5rem', bottom: '1.5rem'}}
                >
                    <i-panel id="pnlMain" maxWidth="100%" maxHeight="100%"></i-panel>
                </i-panel>
                <i-panel
                    position="absolute"
                    width={15}
                    height="100%"
                    top="0px" right="-18px"
                    zIndex={999}
                    visible={false}
                    class="back-block"
                ></i-panel>
            </i-panel>
        );
    }
}

export { RowSettingsDialog };
