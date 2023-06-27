import { Control, application } from "@ijstech/components";
import { getDefaultPageConfig, getMargin, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageConfig } from '../interface/index';
import { EVENT } from "../const/index";

export class UpdatePageSettingsCommand implements ICommand {
  private element: any;
  private settings: IPageConfig
  private oldSettings: IPageConfig;

  constructor(element: Control, settings: IPageConfig) {
    this.element = element;
    this.settings = settings;
    this.oldSettings = {...(pageObject.config || {})};
  }

  private updateConfig(config: IPageConfig) {
    config = config || {};
    const { backgroundColor, margin, maxWidth } = {...getDefaultPageConfig(), ...config};
    const element = this.element.closest('i-scom-page-builder') || this.element;
    element.style.setProperty('--builder-bg', backgroundColor);
    application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {color: backgroundColor});
    this.element.maxWidth = maxWidth ?? '100%';
    this.element.margin = getMargin(margin);
    pageObject.config = {backgroundColor, margin, maxWidth};
    application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_CONFIG, { backgroundColor, margin, maxWidth });
  }

  execute(): void {
    this.updateConfig(this.settings);
  }

  undo(): void {
    this.updateConfig(this.oldSettings);
  }

  redo(): void {}
}
