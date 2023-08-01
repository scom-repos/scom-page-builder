import {
    ControlElement,
    customElements,
    Module,
    VStack,
    Styles,
    IconName,
    Modal,
    application,
    Control,
    Menu,
    TreeView,
    TreeNode
} from '@ijstech/components';
import { getCategories, getPageBlocks, setDragData, pageObject } from '../store/index';
import { EVENT } from '../const/index';
import { ICategory, IPageBlockData, IPageConfig, IPageSection, IPageElement, IMenuItem } from '../interface/index';
import { menuBtnStyle, menuCardStyle, menuStyle } from './pageMenu.css';
import { UpdatePageSettingsCommand, commandHistory, UpdateRowCommand, MoveElementCommand } from '../command/index';
import { PageSettingsDialog } from '../dialogs/index';
import assets from '../assets';
import { layouts } from '../utility/layouts.json'
import { generateUUID } from '../utility/index';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-page-builder-menu']: ControlElement;
        }
    }
}

@customElements('i-scom-page-builder-menu')
export class PageMenu extends Module {

    private pnlMenu: VStack;
    private pnlMenuWrapper: VStack;
    private items: IMenuItem[];
    private draggingSectionId: string;

    init() {
        super.init();
        this.initEventBus();
        this.initEventListener();
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_MENU, async (sections: IPageSection[]) => this.renderMenu(sections));
    }

    initEventListener() {
        this.addEventListener('dragstart', (event) => {
            const eventTarget = event.target as HTMLElement;
            if (!eventTarget) return;
            this.draggingSectionId = eventTarget.getAttribute('rowId');
        });

        this.addEventListener('dragend', (event) => {
            // remove all active drop line
            this.reorderSection(this.draggingSectionId, this.getActiveDropLineIdx());
            this.setActiveDropLine(-1);
            this.draggingSectionId = undefined;
        });

        this.addEventListener('dragover', (event) => {
            this.showDropBox(event.clientX, event.clientY);
        });

        this.addEventListener('drop', (event) => {

        });
    }

    private getActiveDropLineIdx(): number {
        const dropLines = document.querySelectorAll('[id^="menuDropLine"]');
        for (let i = 0; i < dropLines.length; i++) {
            if (dropLines[i].classList.contains('active-drop-line')) {
                return i;
            }
        }
        return -1;
    }

    private getCurrCardIdx(): number {
        const menuCards = this.pnlMenu.querySelectorAll('#menuCard');
        for (let i = 0; i < menuCards.length; i++) {
            if (menuCards[i].getAttribute("rowId") == this.draggingSectionId) {
                return i;
            }
        }
        return -1;
    }

    private showDropBox(clientX: number, clientY: number) {
        const menuRect = this.pnlMenu.getBoundingClientRect();
        if (clientX < menuRect.left || clientX > menuRect.right) return;
        const menuCards = this.pnlMenu.querySelectorAll('#menuCard');
        for (let i = 0; i < menuCards.length; i++) {
            const menuCardRect = menuCards[i].getBoundingClientRect();
            if (clientY >= menuCardRect.top && clientY <= menuCardRect.bottom) {
                const middleLine = menuCardRect.top + menuCardRect.height / 2;
                // decide show top/bottom box
                this.setActiveDropLine((clientY < middleLine) ? i : i + 1);
                return;
            }
        }
    }

    private reorderSection(currentRowId: string, newPosition: number) {
        const menuCards = this.pnlMenu.querySelectorAll('#menuCard');
        const enteredRowId = menuCards[newPosition].getAttribute('rowId');

        const currentRow = document.getElementById(`row-${currentRowId}`);
        const enteredRow = document.getElementById(`row-${enteredRowId}`);
        const pnlRows = document.getElementById('pnlRows');
        const moveRowCmd = new MoveElementCommand(
            currentRow,
            enteredRow,
            pnlRows,
            pageObject.sections
        );
        moveRowCmd && commandHistory.execute(moveRowCmd);
    }

    private setActiveDropLine(idx: number) {
        const dropLines = document.querySelectorAll('[id^="menuDropLine"]');
        for (const dropLine of dropLines) {
            dropLine.classList.remove('active-drop-line');
            dropLine.classList.remove('inactive-drop-line');
            if (dropLine.id == `menuDropLine-${idx}`) {
                dropLine.classList.add('active-drop-line');
            } else {
                dropLine.classList.add('inactive-drop-line');
            }
        }
    }

    renderMenu(sections: IPageSection[]) {
        this.pnlMenu.clearInnerHTML();
        this.items = sections.map((section: IPageSection) => {
            return {
                caption: this.getTitle(section),
                rowId: section.id.replace("row-", "")
            };
        })

        // set the titles here
        const dropLine = (<i-panel id={`menuDropLine-0`} width={'100%'} height={'5px'}></i-panel>);
        this.pnlMenu.appendChild(dropLine);
        for (let i = 0; i < this.items.length; i++) {
            const menuCard = (
                <i-vstack
                    id="menuCard"
                    class={menuCardStyle}
                    verticalAlignment="center"
                    width="100%"
                    background={{ color: '#f9f6f3' }}
                    border={{ width: 1, style: 'solid', color: '#ebe5e5', radius: 5 }}
                    tooltip={{ content: '✊ Drag to insert', placement: 'right' }}
                    overflow="hidden"
                    onClick={() => this.goToSection(this.items[i].rowId)}
                >
                    <i-label
                        caption={this.items[i].caption}
                        font={{ size: '0.813rem', color: '#3b3838', weight: 600 }}
                        padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        maxHeight={34}
                        overflow={"hidden"}
                    ></i-label>
                </i-vstack>
            );
            menuCard.setAttribute('draggable', 'true');
            menuCard.setAttribute('rowId', this.items[i].rowId);
            this.pnlMenu.appendChild(menuCard);

            const dropLine = (<i-panel id={`menuDropLine-${i + 1}`} width={'100%'} height={'5px'}></i-panel>);
            this.pnlMenu.appendChild(dropLine);
        }
    }

    private goToSection(rowId: string) {
        document.getElementById(`row-${rowId}`).scrollIntoView();
        application.EventBus.dispatch(EVENT.ON_SHOW_SECTION, rowId);
    }

    private getTitle(data: IPageSection): string {
        return this.getTitleFn(data.elements[0]);
    }

    private getTitleFn(data: IPageElement): string {
        if (data && data.elements) {
            return this.getTitleFn(data.elements[0]);
        } else if (data && data.module) {
            // TODO: get the title here
            return data.module.name;
        } else {
            return "Untitled";
        }
    }

    private toggleMenu() {
        this.pnlMenuWrapper.visible = !this.pnlMenuWrapper.visible;
    }

    render() {
        return (
            <i-hstack position='fixed' top="0px" left="0px" height={0} width={0} verticalAlignment="center" horizontalAlignment='center'>
                <i-vstack id="iconWrapper" position='absolute' top="0px" left="0px"
                    gap={"0.5rem"}
                    class={menuBtnStyle}>
                    <i-icon width={22} height={22} name={"hamburger"}
                        fill={Theme.colors.primary.main}
                        onClick={this.toggleMenu}
                        tooltip={{ content: "Menu", placement: 'right' }}></i-icon>
                    <i-vstack id="pnlMenuWrapper" width={320} visible={false}>
                        <i-vstack id='pnlMenu' class={menuStyle}></i-vstack>
                    </i-vstack>
                </i-vstack>
            </i-hstack>
        )
    }
}