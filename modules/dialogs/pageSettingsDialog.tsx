import {
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Panel,
    TreeView,
    TreeNode,
    Button,
    Icon,
} from '@ijstech/components';
import { EVENT } from '@page/const';
import { assignAttr } from '@page/utility';
import './pageSettingsDialog.css';
import { ISiteData, IPageData } from '@page/interface';
import { PageTreeNode, PageTreeView } from './pageTreeView';

export interface PageSettingsDialogElement extends ControlElement {
    onAddPage: (nodeData: IPageData) => void;
    onUpdatePage: (nodeData: IPageData) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-settings-dialog']: PageSettingsDialogElement;
        }
    }
}

interface IViewData {
    treeData: any[];
    actionRender?: any;
}

let self = null;
let dragSrcEl = null;
let eventTarget = null;
let dragTo = null;
@customElements('scpage-settings-dialog')
export class PageSettingsDialog extends Module {
    private pageTreeView: PageTreeView;
    public treeView: TreeView;
    private _data: IViewData;
    private _treeData: IPageData[] = [];

    private dialog: Modal;
    private pnlPageList: Panel;
    private eyeIcon: Button;
    private onAddPage: (nodeData: IPageData) => void;
    private onUpdatePage: (nodeData: IPageData) => void;

    constructor(parent?: any, options?: any) {
        super(parent, options);
        this.initEventBus();
        assignAttr(this);
    }

    get data(): IViewData {
        return this._data;
    }
    set data(value: IViewData) {
        this._data = value;
        this.updateState();
    }

    get treeData() {
        return this._treeData;
    }
    set treeData(value: IPageData[]) {
        this._treeData = value;
        this.renderUI();
    }

    updateState() {
        this.treeData = this.data.treeData;
    }

    async init() {
        super.init();
        self = this;
        const { treeData } = this.attrs;
        if (treeData) this.treeData = treeData;

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.querySelector('#pageTreeView')) {
                this.pageTreeView.activeItem = undefined;
            }
        });

        this.initDragDrop();
    }

    initDragDrop() {
        this.pageTreeView.addEventListener('dragover', function(e) {
            e.preventDefault();
        }, false);

        this.pageTreeView.addEventListener('drop', function(e) {
            e.preventDefault();
            if (dragTo === 'top') {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                this.insertBefore(dragSrcEl, eventTarget);
                self.updateListPage();
            } else if (dragTo === 'bottom') {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                this.insertBefore(dragSrcEl, eventTarget.nextSibling);
                self.updateListPage();
            }
            dragSrcEl = null;
            dragTo = null;
            eventTarget = null;
        }, false);
    }

    handleDragStart(e) {
        if (dragSrcEl) return;
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        if (this !== dragSrcEl && !dragSrcEl.contains(this)) {
            const enter = self.pageTreeView.querySelector('.drag-enter');
            if (enter && !this.contains(enter)) {
                self.removePosition();
                enter.classList.remove('drag-enter');
                this.classList.add('drag-enter');
                eventTarget = this;
                dragTo = 'enter';
            } else if (!enter) {
                self.removePosition();
                this.classList.add('drag-enter');
                eventTarget = this;
                dragTo = 'enter';
            }
        } else if (this === dragSrcEl) {
            self.removePosition();
        }
    }

    handleDragLeave(e) {
        if (dragSrcEl === this) return;
        const rect = this.getBoundingClientRect();
        const mgBlock = 12;
        if (e.clientY - mgBlock < rect.top || e.clientY + mgBlock >= rect.bottom || this.contains(dragSrcEl)) {
            this.classList.remove('drag-enter');
            if (!this.contains(dragSrcEl)) {
                self.removePosition();
            }
            const enter = self.pageTreeView.querySelector('.drag-enter');
            if (enter) return;
            if (e.clientY + mgBlock > rect.bottom) {
                self.removePosition();
                eventTarget = this;
                dragTo = 'bottom';
                this.classList.add('drag-to-bottom');
            } else if (e.clientY - mgBlock < rect.top) {
                self.removePosition();
                eventTarget = this;
                dragTo = 'top';
                this.classList.add('drag-to-top');
            }
        }
    }

    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (dragSrcEl != this && !dragSrcEl.contains(this)) {
            if (this.classList.contains('drag-enter')) {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                this.appendChild(dragSrcEl);
            } else if (dragTo === 'top') {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                eventTarget.parentNode.insertBefore(dragSrcEl, eventTarget);
            } else if (dragTo === 'bottom') {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                eventTarget.parentNode.insertBefore(dragSrcEl, eventTarget.nextSibling);
            } else {
                return;
            }
            self.updateListPage();
        }
        return false;
    }

    handleDragEnd(e) {
        dragSrcEl = null;
        eventTarget = null;
        dragTo = null;
        const enter = self.pageTreeView.querySelector('.drag-enter');
        if (enter) {
            enter.classList.remove('drag-enter');
        }
        self.removePosition();
    }

    removePosition() {
        const top = self.pageTreeView.querySelector('.drag-to-top');
        if (top) {
            top.classList.remove('drag-to-top');
        }
        const bottom = self.pageTreeView.querySelector('.drag-to-bottom');
        if (bottom) {
            bottom.classList.remove('drag-to-bottom');
        }
    }

    addDnDHandlers(elem: any) {
        elem.draggable = true;
        elem.addEventListener('dragstart', self.handleDragStart, false);
        elem.addEventListener('dragenter', self.handleDragEnter, false)
        elem.addEventListener('dragover', self.handleDragOver, false);
        elem.addEventListener('dragleave', self.handleDragLeave, false);
        elem.addEventListener('drop', self.handleDrop, false);
        elem.addEventListener('dragend', self.handleDragEnd, false);
        const _childNodes = elem.querySelectorAll('scpage-tree-node');
        _childNodes.forEach((elm) => {
            self.addDnDHandlers(elm);
        })
    }

    updateListPage() {
        let listPage: PageTreeNode[] = [];
        self.pageTreeView.childNodes.forEach((item: PageTreeNode) => {
            item.tag = {
                ...item.tag,
                path: item.tag.url
            }
            listPage.push(item.tag);
            listPage.push(...self.getPageTreeNode(item, item.tag.url))
        });
        application.EventBus.dispatch(EVENT.ON_UPDATE_PAGE, { page: {}, pages: listPage });
    }

    getPageTreeNode(pageTree: PageTreeNode, parentPath: string) {
        const _childNodes = pageTree.querySelectorAll('scpage-tree-node');
        let arr = [];
        for (const node of _childNodes) {
            if (node.parentNode === pageTree || node.parentNode?.parentNode === pageTree) {
                const tag = (node as PageTreeNode).tag;
                const path = parentPath ? `${parentPath}/${tag.url}` : tag.url;
                arr.push({
                    ...tag,
                    path,
                });
                arr.push(...this.getPageTreeNode(node as PageTreeNode, path))
            }
        }
        return arr;
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_LOAD, (siteData: ISiteData) => {
            const viewData = {
                treeData: siteData.pages,
                actionRender: null,
            };
            this.data = viewData;
            // this.renderPageList(siteData.pages);
        });

        application.EventBus.register(
            this,
            EVENT.ON_PAGE_LIST_UPDATE,
            async (data: { pages: IPageData[]; visibilityOnly?: boolean }) => {
                // console.log('updateList: ', data);
                if (data && !data.visibilityOnly) {
                    const viewData = {
                        treeData: data.pages,
                        actionRender: null,
                    };
                    this.data = viewData;
                    // this.renderPageList(data.pages);
                }
            }
        );
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    onActiveChange(parent: PageTreeView, prevNode?: PageTreeNode) {
        // const node = parent.activeItem?.tag;
        // this.onUpdatePage(node);
    }

    addPage() {
        const node = this.pageTreeView ? this.pageTreeView.activeItem?.tag : null;
        this.onAddPage(node);
    }

    deletePage(nodeData: IPageData) {
        this.pageTreeView.activeItem = undefined;
        application.EventBus.dispatch(EVENT.ON_DELETE_PAGE, nodeData);
    }

    toggleVisible(node: PageTreeNode) {
        node.visible = !node.visible;
        node.tag.visible = !node.tag.visible;

        this.onRenderNode(this.pageTreeView, node);
        application.EventBus.dispatch(EVENT.ON_TOGGLE_PAGE_VISIBILITY, node.tag);
    }

    onRenderNode(parent: PageTreeView, node: PageTreeNode) {
        const customPanel = (
            <i-panel class="tools">
                <i-button
                    id={'eyeIcon'}
                    icon={{ name: node.visible ? 'eye' : 'eye-slash' }}
                    class="symbol-eye"
                    onClick={() => this.toggleVisible(node)}
                ></i-button>
                <i-button
                    icon={{ name: 'trash' }}
                    class="symbol-dots"
                    onClick={() => this.deletePage(node.tag)}
                ></i-button>
                <i-button
                    icon={{ name: 'ellipsis-h' }}
                    class="symbol-dots"
                    onClick={() => this.onUpdatePage(node.tag)}
                ></i-button>
            </i-panel>
        );
        node.classList.add('hover-wrap');
        const treeContent = node.querySelector(
            '#pageTreeView .scpage-tree-node-content .right-container'
        );
        const tools = treeContent?.querySelector('.tools');
        if (customPanel && treeContent) {
            if (tools) {
                tools.remove();
            }
            treeContent.appendChild(customPanel);
        }
    }

    async renderUI() {
        this.pageTreeView.clear();
        let fileNodes: { [idx: string]: PageTreeNode } = {};
        let self = this;
        async function addFileNode(nodeData: IPageData) {
            const name = nodeData.name;
            let idx: string = '';
            let items = nodeData.path.split('/');
            let node: PageTreeNode | null = null;
            for (let i = 0; i < items.length; i++) {
                if (items[i]) {
                    idx = idx + '/' + items[i];
                    if (!fileNodes[idx]) {
                        node = await self.pageTreeView.add(node, name, nodeData.visible);
                        fileNodes[idx] = node;
                        node.tag = nodeData;
                    } else {
                        node = fileNodes[idx];
                    }
                }
            }
        }

        for (let nodeData of this.treeData) {
            await addFileNode(nodeData);
        }
        [].forEach.call(this.pageTreeView.childNodes, this.addDnDHandlers);
    }

    // renderPageList(pageList: IPageData[]) {
    //     this.pnlPageList.clearInnerHTML();
    //     for (const [index, page] of pageList.entries()) {
    //         this.pnlPageList.append(
    //             <i-panel
    //                 tag={page}
    //                 class="page-tree-node"
    //                 onClick={() => this.onUpdatePage(index, page)}>
    //                 <i-label caption={page.name}></i-label>
    //             </i-panel>
    //         );
    //     }
    // }

    render() {
        return (
            <i-modal
                id={'dialog'}
                showBackdrop={false}
                closeOnBackdropClick={false}
                maxWidth={'484px'}
            >
                <i-panel class="settings-header">
                    <i-label caption="Site Pages" class="settings-header-title"></i-label>
                    <i-button
                        icon={{ name: 'times' }}
                        class="settings-close"
                        onClick={this.hide}
                    ></i-button>
                </i-panel>
                <i-hstack class="settings-body">
                    <i-vstack class="settings-sidebar">
                        <i-panel>
                            <i-button caption="Site Menu"></i-button>
                        </i-panel>
                    </i-vstack>
                    <i-vstack class="right-side-area">
                        <i-hstack class="page-header-container">
                            <i-label caption="Site Menu"></i-label>
                            <i-button
                                caption="Add"
                                icon={{ name: 'plus' }}
                                onClick={this.addPage}
                            ></i-button>
                        </i-hstack>
                        <i-vstack class="page-tree-container">
                            <i-panel class="page-area">
                                {/* <i-panel id={'pnlPageList'}></i-panel> */}
                                <scpage-tree-view
                                    id={'pageTreeView'}
                                    onRenderNode={this.onRenderNode}
                                    onActiveChange={this.onActiveChange}
                                ></scpage-tree-view>

                                {/* <i-tree-view
                                    id="treeView"
                                    class="page-list"
                                    onRenderNode={this.onRenderNode}
                                    onActiveChange={this.onActiveChange}
                                ></i-tree-view> */}
                            </i-panel>
                        </i-vstack>
                    </i-vstack>
                </i-hstack>
            </i-modal>
        );
    }
}

export { PageTreeView };
