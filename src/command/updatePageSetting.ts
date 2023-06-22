import { Control } from "@ijstech/components";
import { getBackgroundColor, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageConfig } from '../interface/index';

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
    const { backgroundColor = getBackgroundColor(), margin = {x: 60, y: 8}, maxWidth = 1280 } = config;
    this.element.background = {color: backgroundColor};
    this.element.style.setProperty('--builder-bg', backgroundColor);
    this.element.maxWidth = maxWidth;
    const { x, y } = margin;
    this.element.margin = {top: y, bottom: y, left: x, right: x};
    pageObject.config = {backgroundColor, margin, maxWidth};
  }

  execute(): void {
    this.updateConfig(this.settings);
  }

  undo(): void {
    this.updateConfig(this.oldSettings);
  }

  redo(): void {}
}
