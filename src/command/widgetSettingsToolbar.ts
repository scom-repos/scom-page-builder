import { ICommand } from './interface';
import { IDEToolbar } from '../common';
import { PageRow, PageSection } from '../page';

export class WidgetSettingsToolbarCommand implements ICommand {
    private toolbar: any;
    private builderTarget: any;
    private data: any;
    private pageRow: PageRow;
    private pageRowId: string;
    private section: PageSection;
    private sectionId: string;

    constructor(toolbar: IDEToolbar, dataInput: any) {
        this.toolbar = toolbar;
        this.data = dataInput;
        this.pageRow = this.toolbar.closest('ide-row') as PageRow;
        this.pageRowId = this.toolbar.rowId;
        this.section = this.toolbar.closest('ide-section') as PageSection;
        this.sectionId = this.section.id;
    }

    execute(): void {
        const { pt, pb, pl, pr } = this.data;
        this.section.padding = { top: pt, bottom: pb, left: pl, right: pr };
        const newTag = { pt, pb, pl, pr }
        this.toolbar.setTag(newTag);
    }

    undo(): void {}

    redo(): void {}
}
