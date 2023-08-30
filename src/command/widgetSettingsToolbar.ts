import { ICommand, IWidgetSettings } from './interface';
import { IDEToolbar } from '../common';
import { PageRow, PageSection } from '../page';
import { Panel } from '@ijstech/components';
import { pageObject } from '../store/index';

export class WidgetSettingsToolbarCommand implements ICommand {
    private toolbar: any;
    private data: IWidgetSettings;
    private pageRow: PageRow;
    private pageRowId: string;
    private section: PageSection;
    private oldData: IWidgetSettings;

    constructor(toolbar: IDEToolbar, dataInput: IWidgetSettings) {
        this.toolbar = toolbar;
        this.data = dataInput;
        this.pageRow = this.toolbar.closest('ide-row') as PageRow;
        this.pageRowId = this.toolbar.rowId;
        this.section = this.toolbar.closest('ide-section') as PageSection;
        const currentTag = pageObject.getElement(this.pageRowId, this.toolbar.elementId)?.tag || {}
        this.oldData = JSON.parse(JSON.stringify(currentTag))
    }

    execute(): void {
        const { pt, pb, pl, pr, maxWidth, align, link } = this.data;
        const contentStack: Panel = this.section.querySelector('#contentStack') as Panel;
        if (contentStack) contentStack.padding = { top: pt, bottom: pb, left: pl, right: pr };
        const newTag: IWidgetSettings = { pt, pb, pl, pr, maxWidth, align, link };
        const currentTag = pageObject.getElement(this.pageRowId, this.toolbar.elementId)?.tag || {}
        this.toolbar.setTag({...currentTag, ...newTag});
    }

    undo(): void {
        const { pt, pb, pl, pr } = this.oldData;
        const contentStack: Panel = this.section.querySelector('#contentStack') as Panel;
        if (contentStack) contentStack.padding = { top: pt, bottom: pb, left: pl, right: pr };
        this.toolbar.setTag({...this.oldData});
    }

    redo(): void {}
}
