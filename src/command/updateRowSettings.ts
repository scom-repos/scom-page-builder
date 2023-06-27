import { Control, application } from "@ijstech/components";
import { getMargin, pageObject } from "../store/index";
import { ICommand } from "./interface";
import { IPageSectionConfig } from '../interface/index';
import { EVENT } from "../const/index";

export class UpdateRowSettingsCommand implements ICommand {
  private element: any;
  private settings: IPageSectionConfig
  private oldSettings: any;

  constructor(element: Control, settings: IPageSectionConfig) {
    this.element = element;
    this.settings = {...settings};
    const id = this.element.id.replace('row-', '');
    const data = pageObject.getRowConfig(id) || {};
    this.oldSettings = {...data};
  }

  private updateConfig(config: IPageSectionConfig) {
    const id = this.element.id.replace('row-', '');
    const { backgroundColor, margin } = config;
    this.element.background = {color: backgroundColor || ''};
    application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE_BG, {color: backgroundColor || ''});
    const marginStyle = getMargin(margin);
    pageObject.updateSection(id, { config: {...config, margin: {x: marginStyle.left , y: marginStyle.top}}});
    this.element.setData(pageObject.getRow(id));
  }

  execute(): void {
    this.updateConfig(this.settings);
  }

  undo(): void {
    this.updateConfig(this.oldSettings);
  }

  redo(): void {}
}
