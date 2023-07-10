import {
    Module,
    customElements,
    Panel,
    ControlElement,
    Container
} from '@ijstech/components';
import './pageSection.css';
import { IPageElement } from '../interface/index';
import { IDEToolbar } from '../common/index';
import { isEmpty } from '../utility/index';
import { getTheme, pageObject } from '../store/index';

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
    private pageElementMap: WeakMap<any, IPageElement> = new WeakMap();
    private observerOptions = {
        root: null,
        rootMargin: "0px"
    };
    private observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageElement = this.pageElementMap.get(entry.target);
                if (!pageElement) return;
                this.pageElementMap.delete(entry.target);
                if (!isEmpty(pageElement.properties)) (entry.target as any).setProperties(pageElement.properties);
                pageElement.tag && (entry.target as any).setTag(pageElement.tag, true);
                (entry.target as any).setTheme(getTheme());
                observer.unobserve(entry.target);
            }
        });
    }, this.observerOptions);

    private _readonly: boolean;
    private rowId: string = '';

    constructor(parent?: Container, options?: any) {
        super(parent, options);
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
        this.pageElementMap.set(toolbar, value);
        this.observer.observe(toolbar);
    }

    private async clearData() {
        const children = this.pnlMain.querySelectorAll('ide-toolbar');
        if (children?.length) {
            children.forEach((item: IDEToolbar) => {
                item.remove();
                item.onHide();
            });
        }
    }

    async setData(rowId: string, value: IPageElement) {
        this.clearData();
        this.id = value.id;
        this.rowId = rowId;
        if (value?.elements?.length) {
            for (let element of value.elements) {
                await this.createToolbar(element);
            }
        } else {
            await this.createToolbar(value);
        }
    }

    onHide() {
        const children = this.pnlMain.querySelectorAll('ide-toolbar');
        if (children?.length) {
            children.forEach((item: IDEToolbar) => {
                item.onHide();
            });
        }
    }

    render() {
        return (
            <i-panel id={'pnlPageSection'} maxWidth="100%" maxHeight="100%" height="100%">
                <i-panel
                    position="absolute"
                    width={8}
                    height="90%"
                    top="5%" left="-8px"
                    zIndex={999}
                    border={{radius: '4px'}}
                    visible={false}
                    class="front-block"
                ></i-panel>
                <i-panel
                    id="pageSectionWrapper"
                    width="100%" height="100%"
                    maxWidth="100%" maxHeight="100%"
                    padding={{top: '1.5rem', bottom: '1.5rem'}}
                >
                    <i-panel id="pnlMain" maxWidth="100%" maxHeight="100%" class="section-border"></i-panel>
                </i-panel>
                <i-panel
                    position="absolute"
                    width={8}
                    height="90%"
                    top="5%" right="-8px"
                    zIndex={999}
                    border={{radius: '4px'}}
                    visible={false}
                    class="back-block"
                ></i-panel>
            </i-panel>
        );
    }
}
