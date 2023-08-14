import { application } from "@ijstech/components";
import { EVENT } from "../const/index";
import { pageObject } from "../store/index";
import { ICommand } from "./interface";

export class WidgetSettingsToolbarCommand implements ICommand {
  private element: any;

  constructor(element: any) {
    this.element = element;
  }

  execute(): void { }

  undo(): void { }

  redo(): void { }
}
