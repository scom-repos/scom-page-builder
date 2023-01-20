import {
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Input,
    Button,
} from '@ijstech/components';
import { IPageData } from '@page/interface';
import { EVENT } from '@page/const';
import { assignAttr } from '@page/utility';
import './addPageDialog.css';

export interface AddPageDialogElement extends ControlElement {}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-add-page-dialog']: AddPageDialogElement;
        }
    }
}

@customElements('scpage-add-page-dialog')
export class AddPageDialog extends Module {
    private dialog: Modal;
    private titleInput: Input;
    private nameInput: Input;
    private urlInput: Input;
    private btnDone: Button;
    private _parentNodeData: IPageData | null = null;
    private _defaultData: IPageData | null = null;

    constructor(parent?: any) {
        super(parent);
        assignAttr(this);
        this.addPage = this.addPage.bind(this);
    }

    async init() {
        super.init();
    }

    get parentNodeData() {
        return this._parentNodeData;
    }

    set parentNodeData(value: IPageData | null) {
        this._parentNodeData = value;
    }

    get defaultData() {
        return this._defaultData;
    }

    set defaultData(value: IPageData | null) {
        this._defaultData = value;
        this.nameInput.value = value?.name;
        this.urlInput.value = value?.url;
        this.titleInput.value = value?.title;
        this.onInputChanged();
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.parentNodeData = null;
        this.defaultData = null;
        this.dialog.visible = false;
    }

    onInputChanged() {
        this.btnDone.enabled = !!this.nameInput.value && !!this.urlInput.value;
    }

    onDone() {
        if (this.defaultData) {
            this.updatePage();
        } else {
            this.addPage();
        }
    }

    addPage() {
        const pageData: IPageData = {
            title: this.titleInput.value,
            name: this.nameInput.value,
            url: this.urlInput.value,
            path: !!this.parentNodeData
                ? `${this.parentNodeData.path}/${this.urlInput.value}`
                : `${this.urlInput.value}`,
            visible: true,
            rows: [],
        };
        application.EventBus.dispatch(EVENT.ON_ADD_PAGE, pageData);
        this.hide();
    }

    updatePage() {
        if (this.defaultData) {
            const pathArr = this.defaultData.path.split('/');
            pathArr[pathArr.length - 1] = this.urlInput.value;

            const pageData = {
                title: this.titleInput.value,
                name: this.nameInput.value,
                url: this.urlInput.value,
                path: this.defaultData.path,
            };
            const updatedData = Object.assign(this.defaultData, pageData);

            application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE, { page: updatedData });
            this.defaultData = null;
            this.hide();
        }
    }

    render() {
        return (
            <i-modal id={'dialog'} showBackdrop={true} closeOnBackdropClick={false} width={'560px'}>
                <i-panel class="settings-header">
                    <i-label caption="Page Settings" class="settings-header-title" />
                    <i-button
                        icon={{ name: 'times' }}
                        class="settings-close"
                        onClick={this.hide}
                    ></i-button>
                </i-panel>

                <i-vstack class="settings-body">
                    <i-vstack class="right-side-area">
                        <i-hstack class="page-header-container">
                            <i-label caption="What's this menu's title (on your sidebar menu)?" />
                        </i-hstack>

                        <i-vstack class="page-tree-container">
                            <i-panel class="page-area">
                                <i-input
                                    id={'titleInput'}
                                    placeholder="New title"
                                    width={'100%'}
                                    height={'34px'}
                                />
                            </i-panel>
                        </i-vstack>
                    </i-vstack>

                    <i-vstack class="right-side-area">
                        <i-hstack gap={4} verticalAlignment="center" class="page-header-container">
                            <i-label caption="What's this page's name (on your menu)?" />
                            <i-label caption="*" font={{ color: 'red' }} />
                        </i-hstack>

                        <i-vstack class="page-tree-container">
                            <i-panel class="page-area">
                                <i-input
                                    id={'nameInput'}
                                    placeholder="New page"
                                    width={'100%'}
                                    height={'34px'}
                                    onChanged={this.onInputChanged}
                                />
                            </i-panel>
                        </i-vstack>
                    </i-vstack>

                    <i-vstack class="right-side-area">
                        <i-hstack gap={4} verticalAlignment="center" class="page-header-container">
                            <i-label caption="What's the web address (URL)?" />
                            <i-label caption="*" font={{ color: 'red' }} />
                        </i-hstack>

                        <i-vstack class="page-tree-container">
                            <i-panel class="page-area">
                                <i-input
                                    id={'urlInput'}
                                    placeholder="Page URL"
                                    width={'100%'}
                                    height={'34px'}
                                    onChanged={this.onInputChanged}
                                />
                            </i-panel>
                        </i-vstack>
                    </i-vstack>
                </i-vstack>

                <i-panel class="settings-footer">
                    <i-button
                        caption={'Cancel'}
                        class="settings-cancel"
                        onClick={this.hide}
                    ></i-button>
                    <i-button
                        id={'btnDone'}
                        enabled={false}
                        caption={'Done'}
                        class="settings-done"
                        onClick={this.onDone}
                    ></i-button>
                </i-panel>
            </i-modal>
        );
    }
}
