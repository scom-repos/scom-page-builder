import {
    Module,
    customElements,
    Control,
    Panel,
    Image,
    ControlElement,
    Styles,
    VStack,
    Button,
    Input,
    HStack
} from '@ijstech/components';
import './pageSection.css';
import { IComponent, ISectionData } from '@page/interface';
import { EVENT } from '@page/const';
import { RowSettingsDialog } from '@page/dialogs';
import { IDEToolbar } from '@page/common';

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

const Theme = Styles.Theme.ThemeVars;

@customElements('ide-section')
export class PageSection extends Module {
    private _data: ISectionData = { data: null, component: null, visibleOn: '', invisibleOn: ''};
    private pnlLoading: VStack;
    private pnlMain: Panel;
    private currentComponent: any = null;
    private pageSectionWrapper: Panel;
    private _readonly: boolean;
    private _size: {
        width?: string;
        height?: string;
    }

    get size() {
        return this._size || {};
    }

    set size(value: { width?: string; height?: string }) {
        this._size = value;
        this.updateContainerSize();
    }

    async init() {
        super.init();
        this._readonly = this.getAttribute('readonly', true, false);
        this._size = this.getAttribute('containerSize', true, {});
        this.updateContainerSize();
        this.initEventListener();
    }

    setActive() {
        const pageSections = document.querySelectorAll('ide-section');
        if(pageSections) {
            for(const pageSection of pageSections) {
                pageSection.classList.remove('active');
            }
        }
        this.classList.add('active');
    }

    initEventListener() {
        this.onClick = (target, event) => {
            this.setActive();
        }
    }

    updateContainerSize() {
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
        this.currentComponent = null;
        this._data = { toolList: [], component: null };
        this.pnlMain.clearInnerHTML();
    }

    get data() {
        if (!this._data.toolList?.length && !this._data.component) return null;
        return this._data;
    }

    get component() {
        return this.currentComponent;
    }

    private async createComponent(config: IComponent) {
        let control: Control;
        switch (config.type) {
            case 'Button':
                control = await Button.create(config.properties)
                const contentStack = this.currentComponent.querySelector('.ide-component');
                if (contentStack) {
                    contentStack.padding = {top: 5, left: 5, right: 5, bottom: 5};
                    contentStack.width = 'min-content';
                }
                break;
            case 'Input':
                control = await Input.create(config.properties)
                break;
            case 'Divider':
                control = await HStack.create(config.properties)
                break;
            case 'Image':
                control = await Image.create(config.properties)
                break;
        }
        return control;
    }

    async setData(value: ISectionData) {
        this._data = value;
        this.currentComponent = await IDEToolbar.create({
            padding: {left: '3rem', right: '3rem'},
            display: 'block'
        }) as IDEToolbar;
        this.currentComponent.toolList = value.toolList;
        const mainControl = await this.createComponent(value.component);
        if (mainControl)
            this.currentComponent.appendItem(mainControl);
        this.pnlMain.appendChild(this.currentComponent);
        if (value.height)
            this.height = value.height;
        if (value.width)
            this.width = value.width;
    }

    async render() {
        return (
            <i-panel id={'pnlPageSection'}>
                <i-panel id="pageSectionWrapper" width={'100%'} height="100%" padding={{top: '1.5rem', bottom: '1.5rem'}}>
                    <i-panel id="pnlMain"></i-panel>
                </i-panel>
                <i-panel
                    position={'absolute'}
                    top={0}
                    bottom={0}
                    left={0}
                    right={0}
                    width="100%" height="100%"
                    background={{color: '#ddd'}}
                    class={'drag-overlay'}
                ></i-panel>
            </i-panel>
        );
    }
}

export { RowSettingsDialog };
