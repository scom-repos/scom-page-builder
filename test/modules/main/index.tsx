import { application, Container, customModule, Module, Panel } from "@ijstech/components";
import Editor from '@scom/scom-page-builder';

@customModule
export class MainModule extends Module {
  private pageBuilder: Editor;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  init() {
    super.init();
    if (this.options.data)
      this.pageBuilder.setData(this.options.data);
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-scom-page-builder id="pageBuilder"></i-scom-page-builder>
      </i-panel>
    )
  }
}