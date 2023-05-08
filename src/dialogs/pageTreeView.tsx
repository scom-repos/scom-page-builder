import { customElements, Styles, ControlElement, Button, Control, Icon } from '@ijstech/components';

import './pageTreeView.css';

type activedChangeCallback = (target: PageTreeView, prevNode?: PageTreeNode, event?: Event) => void;
type changeCallback = (
    target: PageTreeView,
    node: PageTreeNode,
    oldValue: string,
    newValue: string
) => void;
type renderCallback = (target: PageTreeView, node: PageTreeNode) => void;
type mouseEnterCallback = (target: PageTreeView, node: PageTreeNode) => void;
type mouseLeaveCallback = (target: PageTreeView, node: PageTreeNode) => void;
type actionButtonCallback = (target: PageTreeView, actionButton: Button, event: Event) => void;
type lazyLoadCallback = (target: PageTreeView, node: PageTreeNode) => void;

export interface IPageTreeNode {
    caption?: string;
    collapsible?: boolean;
    visible?: boolean;
    expanded?: boolean;
    isLazyLoad?: boolean;
    active?: boolean;
    children?: IPageTreeNode[];
}

export interface PageTreeViewElement extends ControlElement {
    activeItem?: PageTreeNode;
    data?: IPageTreeNode[];
    editable?: boolean;
    onActiveChange?: activedChangeCallback;
    onChange?: changeCallback;
    onRenderNode?: renderCallback;
    onMouseEnterNode?: mouseEnterCallback;
    onMouseLeaveNode?: mouseLeaveCallback;
    onLazyLoad?: lazyLoadCallback;
    onActionButtonClick?: actionButtonCallback;
}

export interface PageTreeNodeElement extends ControlElement {
    caption?: string;
    collapsible?: boolean;
    expanded?: boolean;
    isLazyLoad?: boolean;
    active?: boolean;
}
const beforeExpandEvent = new Event('beforeExpand');

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-tree-view']: PageTreeViewElement;
            ['scpage-tree-node']: PageTreeNodeElement;
        }
    }
}

@customElements('scpage-tree-view')
export class PageTreeView extends Control {
    private _activeItem: PageTreeNode | undefined;
    private _editable: boolean;
    private _items: PageTreeNode[] = [];

    public onRenderNode: renderCallback;
    public onActiveChange: activedChangeCallback;
    public onChange: changeCallback;
    public onMouseEnterNode: mouseEnterCallback;
    public onMouseLeaveNode: mouseLeaveCallback;
    public onLazyLoad: lazyLoadCallback;
    public onActionButtonClick: actionButtonCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            editable: false,
        });
    }

    get activeItem(): PageTreeNode | undefined {
        return this._activeItem;
    }
    set activeItem(value: PageTreeNode | undefined) {
        this._activeItem = value;
        const treeNodes = Array.from(this.querySelectorAll('scpage-tree-node')) as PageTreeNode[];
        treeNodes.forEach((treeNode) => (treeNode.active = false));
        if (value) value.active = true;
    }

    get data(): IPageTreeNode[] {
        return this._items.map((node) => node.data);
    }
    set data(value: IPageTreeNode[]) {
        this.clear();
        this.renderTree(value);
    }

    get items(): PageTreeNode[] {
        return this._items || [];
    }

    get editable(): boolean {
        return this._editable;
    }
    set editable(value: boolean) {
        this._editable = value;
    }

    add(parentNode?: PageTreeNode | null, caption?: string, visible?: boolean): PageTreeNode {
        const childData: IPageTreeNode = { caption, visible, children: [] };
        const childNode = new PageTreeNode(this, { ...childData });
        childNode.visible = visible;
        this.initNode(childNode);

        childNode.editable = this.editable;
        if (this.onRenderNode) this.onRenderNode(this, childNode);

        if (parentNode) {
            parentNode.appendNode(childNode);
            const parentContent = parentNode.querySelector(
                '.scpage-tree-node-content'
            ) as HTMLElement;
            const childContent = childNode.querySelector(
                '.scpage-tree-node-content'
            ) as HTMLElement;
            if (parentContent && childContent) {
                const parentLeft = parentContent.style.paddingLeft || 0;
                childContent.style.paddingLeft = `calc(${parentLeft} + 1em)`;
            }
        } else {
            this.appendChild(childNode);
        }

        return childNode;
    }

    delete(node: PageTreeNode) {
        // Real-time data
        node.remove();
    }

    clear(): void {
        this.clearInnerHTML();
        this._items = [];
    }

    _setActiveItem(node: PageTreeNode, event?: Event) {
        const prevNode = this.activeItem;
        this.activeItem = node;
        if (event && typeof this.onActiveChange === 'function') {
            this.onActiveChange(this, prevNode, event);
        }
    }

    private handleMouseEnter(node: PageTreeNode) {
        const fn = this.onMouseEnterNode;
        if (fn && typeof fn === 'function') fn(this, node);
    }

    private handleMouseLeave(node: PageTreeNode) {
        const fn = this.onMouseLeaveNode;
        if (fn && typeof fn === 'function') fn(this, node);
    }

    private handleLazyLoad(node: PageTreeNode) {
        const fn = this.onLazyLoad;
        if (fn && typeof fn === 'function') fn(this, node);
    }

    private initNode(node: PageTreeNode) {
        this.registerEvents(node);
    }

    private registerEvents(node: PageTreeNode) {
        node.addEventListener('mouseenter', () => this.handleMouseEnter(node));
        node.addEventListener('mouseleave', () => this.handleMouseLeave(node));
        node.addEventListener('beforeExpand', (event) => this.handleLazyLoad(node));
        this.onRenderNode && this.onRenderNode(this, node);
    }

    private renderTreeNode(
        node: IPageTreeNode,
        parent: PageTreeView | undefined,
        paths: { name: string }[] = [],
        level: number
    ) {
        const treeNode = new PageTreeNode(parent, node);
        treeNode.editable = this.editable;
        this.initNode(treeNode);
        const treeContent = treeNode.querySelector('.scpage-tree-node-content') as HTMLElement;
        treeContent && (treeContent.style.paddingLeft = `${level}em`);

        const name = node.caption || '';
        if (node.children) {
            paths.push({ name });
            // treeNode.filePath = { paths: [...paths] }

            if (!node.isLazyLoad) {
                for (const child of node.children) {
                    const childWrapper = treeNode.querySelector('.scpage-tree-node-children');
                    if (childWrapper) {
                        const childNode = this.renderTreeNode(child, parent, paths, level + 1);
                        childWrapper && childWrapper.appendChild(childNode);
                    }
                }
            }
        } else {
            // treeNode.filePath = { paths: [...paths, { name }] }
        }

        return treeNode;
    }

    private renderTree(value: IPageTreeNode[]) {
        if (!value || !value.length) return;

        for (const node of value) {
            let treeNode = this.renderTreeNode(node, this, [], 0);
            this.appendChild(treeNode);
            const activedNodes = treeNode.querySelectorAll('.active');
            if (activedNodes.length) {
                const activedNode = activedNodes[activedNodes.length - 1] as PageTreeNode;
                treeNode.expanded = true;
                const treeNodes = Array.from(
                    treeNode.querySelectorAll('scpage-tree-node.has-children')
                );
                treeNodes.forEach((treeNode) => {
                    if (treeNode.contains(activedNode)) (treeNode as PageTreeNode).expanded = true;
                });
                this.activeItem = activedNode;
            }
            this._items.push(treeNode);
        }
    }

    protected init() {
        if (!this.initialized) {
            super.init();
            this.classList.add('pages-tree');
            if (this.options?.onRenderNode) this.onRenderNode = this.options.onRenderNode;

            this.editable = this.getAttribute('editable', true, false);
            this.data = this.getAttribute('data', true);
            const activeAttr = this.getAttribute('activeItem', true);
            activeAttr && (this.activeItem = activeAttr);
        }
    }

    static async create(options?: PageTreeViewElement, parent?: Control) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}

@customElements('scpage-tree-node')
export class PageTreeNode extends Control {
    private _caption: string;
    private _collapsible: boolean;
    private _expanded: boolean;
    private _active: boolean;
    private _isLazyLoad: boolean;
    private _editable: boolean = false;
    private _visibleItem: boolean = true;
    private _data: IPageTreeNode;

    private _expandElm: HTMLElement;
    private _wrapperElm: HTMLElement;
    private _leftWrapperElm: HTMLElement;
    private _rightWrapperElm: HTMLElement;
    private _captionElm: HTMLElement;
    private _childNodeElm: HTMLElement;

    constructor(parent?: Control, options?: any) {
        super(parent, options);
        options && (this.data = options);
        this.handleEdit = this.handleEdit.bind(this);
    }

    get data() {
        return this._data;
    }
    set data(value: IPageTreeNode) {
        this._data = value;
    }

    get caption(): string {
        return this._caption;
    }
    set caption(value: string) {
        this._caption = value;
        if (this._captionElm) this._captionElm.innerHTML = value;
    }

    get collapsible(): boolean {
        return this._collapsible;
    }
    set collapsible(value: any) {
        if (typeof value === 'boolean') {
            this._collapsible = value;
        } else {
            this._collapsible = true;
        }
    }

    get expanded(): boolean {
        return this._expanded;
    }
    set expanded(value: any) {
        if (typeof value === 'boolean') {
            this._expanded = value;
            if (this._expanded) this.classList.add('tree-collapsed');
            else this.classList.remove('tree-collapsed');
        } else {
            this._expanded = false;
            this.classList.remove('tree-collapsed');
        }
    }

    get active(): boolean {
        return this._active;
    }
    set active(value: any) {
        if (typeof value === 'boolean') {
            this._active = value;
            this.active ? this.classList.add('active') : this.classList.remove('active');
        } else {
            this._active = false;
            this.classList.remove('active');
        }
    }

    get isLazyLoad(): boolean {
        return this._isLazyLoad;
    }
    set isLazyLoad(value: boolean) {
        this._isLazyLoad = value;
    }

    get editable(): boolean {
        return this._editable;
    }
    set editable(value: boolean) {
        this._editable = value;
    }

    get visible(): boolean {
        return this._visibleItem;
    }
    set visible(value: boolean) {
        this._visibleItem = value;
    }

    get rootParent() {
        return this.closest('scpage-tree-view') as PageTreeView;
    }

    // Trigger when node caption is changed
    private handleChange(target: PageTreeNode, oldValue: string, newValue: string) {
        const fn = this.rootParent.onChange;
        if (fn && typeof fn === 'function') fn(this.rootParent, target, oldValue, newValue);
    }

    private renderEditMode() {
        const captionInput = this.createElement('input') as HTMLInputElement;
        captionInput.value = this.caption;
        captionInput.classList.add('text-input');
        this._captionElm.innerHTML = '';
        this._captionElm.appendChild(captionInput);
        captionInput.focus();
        this.click();

        let isUpdating = false;
        const updateCaption = () => {
            const newValue = captionInput.value;
            if (newValue !== this.caption) this.handleChange(this, this.caption, newValue);
            this.caption = newValue;
        };

        captionInput.addEventListener('blur', (event: Event) => {
            event.preventDefault();
            if (isUpdating) return;
            updateCaption();
        });
        captionInput.addEventListener('keyup', (event: KeyboardEvent) => {
            event.preventDefault();
            if (event.key === 'Enter' || event.keyCode === 13) {
                isUpdating = true;
                updateCaption();
                isUpdating = false;
            }
        });
    }

    private handleEdit(event: Event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.renderEditMode();
    }

    edit() {
        this.editable = true;
        this.renderEditMode();
    }

    appendNode(childNode: PageTreeNode) {
        if (!this._childNodeElm) this.initChildNodeElm();
        this._childNodeElm.appendChild(childNode);
        if (!this.data.children) this.data.children = [];
        this.data.children.push(childNode.data);
    }

    private initChildNodeElm() {
        this.classList.add('has-children');
        this._expandElm = this.createElement('button', this);
        this._expandElm.textContent = '-';
        this._expandElm.classList.add('expander');
        this._expandElm.onclick = () => {
            if (this.collapsible && this._expandElm) {
                this._expanded = !this._expanded;
                if (this._expanded) this.classList.add('tree-collapsed');
                else this.classList.remove('tree-collapsed');
            }
        };

        this._childNodeElm = this.createElement('div', this);
        this._childNodeElm.classList.add('scpage-tree-node-children');
    }

    _handleClick(event: MouseEvent): boolean {
        const target = event.target as HTMLElement;

        const parent = this._parent || target.closest('scpage-tree-view');
        if (parent instanceof PageTreeView) {
            parent._setActiveItem(this, event);
            if (parent.onClick) parent.onClick(parent, event);
        }

        if (this.isLazyLoad) {
            this.dispatchEvent(beforeExpandEvent);
        }
        return super._handleClick(event, true);
    }

    _handleDblClick(event: MouseEvent): boolean {
        const target = event.target as HTMLElement;
        const parent = this._parent || target.closest('scpage-tree-view');
        if (this.editable) {
            this.handleEdit(event);
        } else if (parent instanceof PageTreeView) {
            if (parent.onDblClick) parent.onDblClick(parent, event);
        }
        return super._handleClick(event, true);
    }

    _handleContextMenu(event: MouseEvent): boolean {
        const target = event.target as HTMLElement;
        const parent = this._parent || target.closest('scpage-tree-view');
        if (parent instanceof PageTreeView)
            if (parent.onContextMenu) parent.onContextMenu(parent, event);
        return super._handleClick(event, true);
    }

    protected init() {
        if (!this._captionElm) {
            this.classList.add('scpage-tree-node');
            this.data = this.options;
            let caption = this.getAttribute('caption', true, '');
            let collapsible = this.getAttribute('collapsible', true);
            let expanded = this.getAttribute('expanded', true);
            let visible = this.getAttribute('visible', true, true);
            let active = this.getAttribute('active', true, false);
            let isLazyLoad = this.getAttribute('isLazyLoad', true, false);

            this.collapsible = collapsible;
            this.expanded = expanded;
            this.visible = visible;
            this.active = active;
            this.isLazyLoad = isLazyLoad;

            this._wrapperElm = this.createElement('div', this);
            this._wrapperElm.classList.add('scpage-tree-node-content');
            this._leftWrapperElm = this.createElement('div', this._wrapperElm);
            this._leftWrapperElm.classList.add('left-container');
            this._rightWrapperElm = this.createElement('div', this._wrapperElm);
            this._rightWrapperElm.classList.add('right-container');

            const listIcon = new Icon(this, {
                name: 'list',
            });
            listIcon.classList.add('symbol-type');
            this._leftWrapperElm.appendChild(listIcon);

            this._captionElm = this.createElement('label', this._leftWrapperElm);
            this._captionElm.classList.add('menu-item-title');
            this.caption = caption;

            if (this.data?.children?.length) this.initChildNodeElm();
        }
        super.init();
    }

    static async create(options?: PageTreeNodeElement, parent?: Control) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}
