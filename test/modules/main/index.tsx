import { application, Container, customModule, Module, Panel } from "@ijstech/components";

@customModule
export class MainModule extends Module {
  private pnlMain: Panel;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  init() {
    super.init();
    this.loadPageBuilderModule();
  }

  async loadPageBuilderModule() {
    let module = await application.newModule("libs/@scom/scom-page-builder/index.js");
    if (module) {
      this.pnlMain.append(module);
      if (this.options.data) {
        (module as any).setData(this.options.data);
      }
    }
  }

  render() {
    return (
      <i-vstack height="inherit">
        <i-panel id="pnlMain" stack={{ grow: "1" }}></i-panel>
      </i-vstack>
    )
  }
}