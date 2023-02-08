import {
    Module,
    customElements,
    Control,
    Panel,
    ControlElement,
    VStack
} from '@ijstech/components';
import './pageSection.css';
import { IPageElement } from '@page/interface';
import { RowSettingsDialog } from '@page/dialogs';
import { ContainerDragger, IDEToolbar } from '@page/common';
import { isEmpty } from '@page/utility';

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
    private _dragger: ContainerDragger<PageSection>;

    private _data: IPageElement = {
        column: 0,
        columnSpan: 0,
        type: 'primitive',
        properties: undefined,
        id: ''
    };
    private _readonly: boolean;
    private _size: {
        width?: string;
        height?: string;
    }
    private currentToolbar: IDEToolbar;
    private toolbarList: IDEToolbar[];

    constructor(parent?: any) {
        super(parent);
        this.setData = this.setData.bind(this);
        this.getData = this.getData.bind(this);
    }

    get size() {
        return this._size || {};
    }
    set size(value: { width?: string; height?: string }) {
        this._size = value;
        this.updateContainerSize();
    }

    get readonly() {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = value;
    }

    init() {
        super.init();
        this.readonly = this.getAttribute('readonly', true, false);
        const parent = this.parentElement.querySelector('#pnlElements') as Control;
        if (!this.readonly && parent)
            this._dragger = new ContainerDragger(this, parent, this);
        this._size = this.getAttribute('containerSize', true, {});
        this.updateContainerSize();
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

    private updateContainerSize() {
        const sizeWidth = this.size.width || 'none';
        const sizeHeight = this.size.height || 'none';
        if (this.pageSectionWrapper) {
            this.pageSectionWrapper.maxWidth = sizeWidth;
            this.pageSectionWrapper.maxHeight = sizeHeight;
            this.pageSectionWrapper.margin = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' };
        }
        if (this.pnlLoading) {
            this.pnlLoading.maxWidth = sizeWidth;
            this.pnlLoading.maxHeight = sizeHeight;
        }
        if (this.pnlMain) {
            this.pnlMain.maxWidth = sizeWidth;
            this.pnlMain.maxHeight = sizeHeight;
        }
    }

    clear() {
        this.currentToolbar = null;
        this.toolbarList = null;
        this._data = {
            id: '',
            column: 0,
            columnSpan: 0,
            type: 'primitive',
            properties: undefined
        };
        this.pnlMain.clearInnerHTML();
    }

    private async createToolbar(value: IPageElement) {
        let toolbar = await IDEToolbar.create({}) as IDEToolbar;
        toolbar.readonly = this._readonly;
        toolbar.data = value;
        await toolbar.fetchModule();
        return toolbar;
    }

    // TODO
    async setData(value: IPageElement) {
        // column: number;
        // columnSpan: number;

        this._data = value;
        this.id = value.id;
        if (value.type === 'primitive') {
            if (this.currentToolbar) {
                this.currentToolbar.setData(value.properties);
                this.currentToolbar.setTag(value.properties);
            } else {
                this.currentToolbar = await this.createToolbar(value);
                this.currentToolbar.parent = this.pnlMain;
                this.pnlMain.appendChild(this.currentToolbar);
                if (!isEmpty(value.properties)) {
                    this.currentToolbar.setData(value.properties);
                    this.currentToolbar.setTag(value.properties);
                }

            }
        } else if (value.elements?.length) {
            if (this.toolbarList.length) {
                for (let i = 0; i < value.elements.length; i++) {
                    const element = value.elements[i];
                    const toolbar = this.toolbarList[i];
                    if (toolbar) {
                        toolbar.setData(element.properties);
                        toolbar.setTag(element.properties);
                    }
                }
            } else {
                const stack = <i-vstack></i-vstack>
                for (let i = 0; i < value.elements.length; i++) {
                    const element = value.elements[i];
                    const toolbar = await this.createToolbar(element);
                    if (!isEmpty(element.properties)) {
                        toolbar.setData(element.properties);
                        toolbar.setTag(element.properties);
                    }
                    toolbar.parent = stack;
                    stack.appendChild(toolbar);
                    this.toolbarList.push(toolbar);
                }
                stack.parent = this.pnlMain;
                this.pnlMain.appendChild(stack);
            }
        }
    }

    async getData(): Promise<IPageElement> {
        if (this._data?.type === 'primitive') {
            let properties = null;
            if (this.currentToolbar)
                properties = await this.currentToolbar.getData();
            this._data.properties = properties;
        } else {
            if (this.toolbarList.length) {
                for (let i = 0; i < this._data.elements.length; i++) {
                    const toolbar = this.toolbarList[i];
                    if (toolbar) {
                        const properties = await toolbar.getData();
                        this._data.elements[i].properties = properties;
                    }
                }
            }
        }
        return this._data;
    }

    render() {
        return (
            <i-panel id={'pnlPageSection'} maxWidth="100%" maxHeight="100%">
                <i-panel
                    id="pageSectionWrapper"
                    width={'100%'} height="100%"
                    maxWidth="100%" maxHeight="100%"
                    padding={{top: '1.5rem', bottom: '1.5rem'}}
                >
                    <i-panel id="pnlMain"></i-panel>
                </i-panel>
            </i-panel>
        );
    }
}

export { RowSettingsDialog };
