import {
    Module,
    customElements,
    Panel,
    ControlElement,
    VStack
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
    private pnlLoading: VStack;
    private pnlMain: Panel;
    private pageSectionWrapper: Panel;
    private pnlBack: Panel;
    // private _dragger: ContainerDragger<PageSection>;

    private _readonly: boolean;
    private _size: {
        width?: string;
        height?: string;
    }
    private currentToolbar: IDEToolbar;
    private toolbarList: IDEToolbar[];
    private rowId: string = '';

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
        // this.getData = this.getData.bind(this);
    }

    // get size() {
    //     return this._size || {};
    // }
    // set size(value: { width?: string; height?: string }) {
    //     this._size = value;
    //     this.updateContainerSize();
    // }

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
        // const parent = this.parentElement.querySelector('#pnlElements') as Control;
        // if (!this.readonly && parent)
        //     this._dragger = new ContainerDragger(this, parent, this);
        // this._size = this.getAttribute('containerSize', true, {});
        // this.updateContainerSize();
        this.initEventListener();
    }

    private setActive() {
        const pageRows= document.querySelectorAll('ide-row');
        if (pageRows) {
            for (const row of pageRows) {
                row.classList.remove('active');
            }
        }
        const row = this.closest('ide-row');
        row && row.classList.add('active');
    }

    private initEventListener() {
        this.onClick = (target, event) => this.setActive();
    }

    // private updateContainerSize() {
    //     const sizeWidth = this.size.width || 'none';
    //     const sizeHeight = this.size.height || 'none';
    //     if (this.pageSectionWrapper) {
    //         this.pageSectionWrapper.maxWidth = sizeWidth;
    //         this.pageSectionWrapper.maxHeight = sizeHeight;
    //         this.pageSectionWrapper.margin = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' };
    //     }
    //     if (this.pnlLoading) {
    //         this.pnlLoading.maxWidth = sizeWidth;
    //         this.pnlLoading.maxHeight = sizeHeight;
    //     }
    //     if (this.pnlMain) {
    //         this.pnlMain.maxWidth = sizeWidth;
    //         this.pnlMain.maxHeight = sizeHeight;
    //     }
    // }

    clear() {
        this.currentToolbar = null;
        this.toolbarList = null;
        this.pnlMain.clearInnerHTML();
    }

    private async createToolbar(value: IPageElement) {
        let toolbar = await IDEToolbar.create({}) as IDEToolbar;
        toolbar.readonly = this._readonly;
        toolbar.rowId = this.rowId;
        toolbar.elementId = value.id;
        await toolbar.fetchModule(value);
        return toolbar;
    }

    // TODO
    async setData(rowId: string, value: IPageElement) {
        this.id = value.id;
        this.rowId = rowId;
        if (value.type === 'primitive') {
            if (this.currentToolbar) {
                this.currentToolbar.setProperties(value.properties);
                value.tag && this.currentToolbar.setTag(value.tag);
            } else {
                this.currentToolbar = await this.createToolbar(value);
                this.currentToolbar.parent = this.pnlMain;
                this.pnlMain.appendChild(this.currentToolbar);
                if (!isEmpty(value.properties))
                    this.currentToolbar.setProperties(value.properties);
                value.tag && this.currentToolbar.setTag(value.tag);
            }
        } else if (value.elements?.length) {
            if (this.toolbarList.length) {
                for (let i = 0; i < value.elements.length; i++) {
                    const element = value.elements[i];
                    const toolbar = this.toolbarList[i];
                    if (toolbar) {
                        toolbar.setProperties(element.properties);
                        element.tag && toolbar.setTag(element.tag);
                    }
                }
            } else {
                const stack = <i-vstack></i-vstack>
                for (let i = 0; i < value.elements.length; i++) {
                    const element = value.elements[i];
                    const toolbar = await this.createToolbar(element);
                    if (!isEmpty(element.properties))
                        toolbar.setProperties(element.properties);
                    element.tag && toolbar.setTag(element.tag);
                    toolbar.parent = stack;
                    stack.appendChild(toolbar);
                    this.toolbarList.push(toolbar);
                }
                stack.parent = this.pnlMain;
                this.pnlMain.appendChild(stack);
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
                    id="pnlBack"
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
