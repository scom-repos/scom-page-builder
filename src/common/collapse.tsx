import { Container, ControlElement, customElements, Icon, Label, Module, Panel } from "@ijstech/components";
import { collapseStyle } from "./collapse.css";

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
      this.pnlContent.classList.add('--expanded');
    } else {
      this.iconCollapse.classList.remove('--rotate');
      this.pnlContent.classList.remove('--expanded');
    }
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
    this.expanded = this.getAttribute('expanded', true, false);
  }

  onCollapse() {
    this.expanded = !this.expanded;
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
            <i-panel>
              <i-label id="lblTitle" font={{ bold: true }}></i-label>
            </i-panel>
            <i-icon id="iconCollapse" class="collapsible-icon" width={16} height={16} name="angle-down"></i-icon>
          </i-hstack>
          <i-panel id="pnlContent" class="collapsible-content"></i-panel>
        </i-vstack>
      </i-vstack>
    )
  }
}