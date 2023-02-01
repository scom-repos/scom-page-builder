import { Control, Module, Panel } from '@ijstech/components';
import { commandHistory, MoveElementCommand } from '@page/utility';

export class ContainerDragger<T extends Module> {
    private target: T;
    private stack: Control;
    private pnlOverlay: Panel;
    private dragger: Control;
    private currentPosition: {
        top: string | number;
        left: string | number;
        height: string | number;
        width: string | number;
        x: number;
        y: number;
    };
    private dataList: any[];
    private isDragging: boolean;

    constructor(target: T, stack: Control, dragger?: Control, dataList?: any[]) {
        this.target = target;
        this.stack = stack;
        this.dataList = dataList || [];
        this.dragger = dragger || this.target.querySelector('#dragStack') as Control;
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.initDragEvent();
    }

    private initDragEvent() {
        if (!this.dragger) return;
        this.target.classList.add('dropzone');
        if (!(this.target as any).readonly) {
            this.dragger.addEventListener('mousedown', this.mouseDownHandler, false);
            const rows = Array.from(this.stack.children);
            rows.forEach(row => {
                row.classList.add("dropzone");
            })
        }
        else
            this.dragger.removeEventListener('mousedown', this.mouseDownHandler, false);
        this.dragger.ondragstart = function() { return false };
        if (!this.pnlOverlay) {
            this.pnlOverlay = new Panel(undefined, {
                position: 'fixed',
                zIndex: -1,
                visible: false,
                opacity: 0.4,
                background: {color: '#ddd'}
            });
            this.pnlOverlay.classList.add('drag-overlay');
        }
        this.stack.parent && this.stack.parent.appendChild(this.pnlOverlay);
    }

    private mouseDownHandler(event: MouseEvent) {
        event.stopPropagation();
        if (this.target && !this.isDragging) {
            this.isDragging = true;
            const data = this.target.getBoundingClientRect();
            this.currentPosition = data;
            this.pnlOverlay.width = this.currentPosition.width;
            this.pnlOverlay.height = this.currentPosition.height;
            this.pnlOverlay.zIndex = '1';
            this.pnlOverlay.left = this.currentPosition.left;
            this.pnlOverlay.top = this.currentPosition.top;
            document.addEventListener('mousemove', this.mouseMoveHandler);
            document.addEventListener('mouseup', this.mouseUpHandler);
            document.body.click();
        }
    }

    private mouseUpHandler(event: MouseEvent) {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        this.resetTarget();
        const target = event.target as HTMLElement;
        const dropElm = target.closest('.dropzone') as Control;
        const rows = Array.from(document.querySelectorAll('.is-dragenter'));
        rows.forEach(row => {
            row.classList.remove("is-dragenter");
        })
        if (!dropElm || !this.stack.contains(dropElm)) {
            event.preventDefault();
            this.pnlOverlay.visible = false;
            this.pnlOverlay.zIndex = '-1';
            this.isDragging = false;
            return;
        }
        if (!this.target) {
            event.preventDefault();
            this.pnlOverlay.visible = false;
            this.pnlOverlay.zIndex = '-1';
            this.isDragging = false;
            return;
        }
        if (dropElm && !this.target.isSameNode(dropElm)) {
            const moveRowCmd = new MoveElementCommand(this.target, dropElm, this.stack, this.dataList);
            commandHistory.execute(moveRowCmd);
        }
        this.isDragging = false;
    }

    private resetTarget() {
        if (!this.target) return;
        this.target.style.transform = 'none';
        this.target.classList.remove('dragging');
        this.pnlOverlay.visible = false;
        this.pnlOverlay.zIndex = '-1';
        if ((this.target as any).onMoveDown) (this.target as any).onMoveDown();
    }

    private updateTarget(x: number, y: number) {
        this.target.classList.add('dragging');
        const elementWidth = (Number(this.currentPosition.width) / 2);
        const newX = elementWidth < 0 ? x + elementWidth : x - elementWidth;
        const newY = y - (Number(this.currentPosition.height) / 2);
        this.target.style.transform = `scale(0.5) translate(${newX}px, ${newY}px)`;
        if ((this.target as any).onMoveUp) (this.target as any).onMoveUp();
    }

    private mouseMoveHandler(event: MouseEvent) {
        let x = event.clientX;
        let y = event.clientY;
        const target = event.target as HTMLElement;
        const dropZone = target.closest('.dropzone');
        const rows = Array.from(document.querySelectorAll('.is-dragenter'));
        rows.forEach(row => {
            row.classList.remove("is-dragenter");
        })
        if (dropZone && !dropZone.isEqualNode(this.target))
            dropZone.classList.add('is-dragenter')
        this.pnlOverlay.visible = true;
        this.pnlOverlay.zIndex = '1';
        this.updateTarget(x - this.currentPosition.x, y - this.currentPosition.y);
    }
}

