import { application, Container, ControlElement, customElements, Icon, Label, Module, Panel, Styles } from "@ijstech/components";
import { collapseStyle } from "./collapse.css";
import { EVENT } from "../const/index";
import { getCategories } from "../store/index";
import { PAGE_SIZE } from "../interface/index";
const Theme = Styles.Theme.ThemeVars;

export interface CollapseElement extends ControlElement {
  title?: string;
  item?: Container;
  expanded?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-page-builder-collapse']: CollapseElement;
    }
  }
}

@customElements('i-scom-page-builder-collapse')
export class Collapse extends Module {
  private lblTitle: Label;
  private iconCollapse: Icon;
  private pnlContent: Panel;

  private _expanded: boolean;
  private requestID: number;
  private _speed: number = 250;
  
  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  get title(): string {
    return this.lblTitle.caption;
  }

  set title(value: string) {
    this.lblTitle.caption = value || "";
  }

  get item(): Container {
    return this.pnlContent.children[0] as Container;
  }
  
  set item(target: Container) {
    if (target && target instanceof Container) {
      this.pnlContent.clearInnerHTML();
      this.pnlContent.append(target);
    }
  }

  get expanded(): boolean {
    return this._expanded;
  }

  set expanded(value: boolean) {
    this._expanded = value;
    if (this._expanded) {
      this.iconCollapse.classList.add('--rotate');
    } else {
      this.iconCollapse.classList.remove('--rotate');
    }
    this.handleCollapse();
  }
  
  init() {
    this.classList.add(collapseStyle);
    super.init();
    this.style.display = "block";
    this.title = this.getAttribute('title', true);
    if (this.children.length > 1) {
      this.pnlContent.append(this.children[0]);
    }
    this.item = this.getAttribute('item', true);
    const expanded = this.getAttribute('expanded', true, false);
    this._expanded = expanded;
    if (!expanded) {
      this.pnlContent.classList.add("--hidden");
    } else {
      this.iconCollapse.classList.add('--rotate');
    }
  }

  private handleCollapse() {
    const isExpanded = this._expanded;
    const startTime = performance.now();
    if (this.requestID) cancelAnimationFrame(this.requestID);
    this.pnlContent.style.height = this.pnlContent.scrollHeight + "px";
    this.pnlContent.classList.add("--collapsing");
    this.pnlContent.classList.remove("--hidden");
    const animate = (time: DOMHighResTimeStamp) => {
      const runtime = time - startTime;
      const relativeProgress = runtime / this._speed;
      const progress = Math.min(relativeProgress, 1);
      if (progress < 1) {
        this.pnlContent.style.opacity = isExpanded ? "1" : "0";
        this.pnlContent.style.height = isExpanded ? this.pnlContent.scrollHeight + "px" : "0px";
        this.requestID = requestAnimationFrame(animate);
      }
      if (progress === 1) {
        this.pnlContent.classList.remove("--collapsing");
        this.pnlContent.style.opacity = "";
        this.pnlContent.style.height = "";
        if (!isExpanded) {
          this.pnlContent.classList.add("--hidden");
        }
      }
    };
    this.requestID = requestAnimationFrame(animate);
  }

  onCollapse() {
    this.expanded = !this.expanded;
  }

  onShowSearch() {
    const category = getCategories().find(item => item.title === this.title)?.id || '';
    application.EventBus.dispatch(EVENT.ON_FETCH_COMPONENTS, { category, pageNumber: 1, pageSize: PAGE_SIZE });
    application.EventBus.dispatch(EVENT.ON_TOGGLE_SEARCH_MODAL, true);
  }

  render() {
    return (
      <i-vstack gap="1rem">
        <i-vstack width="100%">
          <i-hstack
            class="collapsible-toggle"
            verticalAlignment="center"
            horizontalAlignment="space-between"
            padding={{ top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }}
            gap="0.5rem"
            onClick={this.onCollapse}
          >
            <i-hstack gap={5} verticalAlignment="center">
              <i-label id="lblTitle" font={{ bold: true }}></i-label>
              <i-icon
                name="search" fill={Theme.text.primary}
                width={16} height={16}
                class="pointer"
                onClick={() => this.onShowSearch()}
              ></i-icon>
            </i-hstack>
            <i-icon id="iconCollapse" class="collapsible-icon" width={16} height={16} name="angle-down"></i-icon>
          </i-hstack>
          <i-panel id="pnlContent" class="collapsible-content"></i-panel>
        </i-vstack>
      </i-vstack>
    )
  }
}