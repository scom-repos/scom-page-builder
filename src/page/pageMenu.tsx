import {
    ControlElement,
    customElements,
    Module,
    VStack,
    Styles,
    application,
    Control,
    Input,
    Label,
    Icon,
    HStack
} from '@ijstech/components';
import { pageObject } from '../store/index';
import { EVENT } from '../const/index';
import { IPageSection, IPageElement } from '../interface/index';
import { menuBtnStyle, menuCardStyle, menuStyle } from './pageMenu.css';
import { commandHistory, MoveElementCommand } from '../command/index';

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
    private draggingSectionId: string;
    private isEditing: boolean = false;
    private focusRowId: string;

    private noDataTxt = "No section";

    init() {
        super.init();
        this.initEventBus();
        this.initEventListener();
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_MENU, async () => this.renderMenu());
        application.EventBus.register(this, EVENT.ON_SELECT_SECTION, async (rowId: string) => this.setfocusCard(rowId));
    }

    private initEventListener() {
        this.addEventListener('dragstart', (event) => {
            const eventTarget = event.target as HTMLElement;
            if (!eventTarget || this.isEditing) {
                event.preventDefault();
                return;
            }
            this.draggingSectionId = eventTarget.getAttribute('rowId');
        });

        this.addEventListener('dragend', (event) => {
            // remove all active drop line
            if (!this.draggingSectionId) {
                event.preventDefault();
                return;
            }
            const activeLineIdx = this.getActiveDropLineIdx();
            if (activeLineIdx != -1)
                this.reorderSection(this.draggingSectionId, activeLineIdx);

            this.setfocusCard(this.focusRowId);
            this.setActiveDropLine(-1);
            this.draggingSectionId = undefined;
        });

        this.addEventListener('dragover', (event) => {
            event.preventDefault();
            if (!this.draggingSectionId) {
                event.preventDefault();
                return;
            }
            this.showDropBox(event.clientX, event.clientY);
        });

        this.addEventListener('drop', (event) => {
            if (!this.draggingSectionId) {
                event.preventDefault();
                return;
            }
        });
    }

    private initMenuCardEventListener(card: Control) {
        card.addEventListener('mouseenter', (event) => {
            if (this.isEditing) return;
            this.toggleRenameBtn(card.getAttribute('rowId'), true);
        });
        card.addEventListener('mouseleave', (event) => {
            if (this.isEditing) return;
            this.toggleRenameBtn(card.getAttribute('rowId'), false);
        });
    }

    private setfocusCard(rowId: string) {
        this.focusRowId = rowId;
        const menuCards = this.pnlMenu.querySelectorAll('#menuCard');
        for (let i = 0; i < menuCards.length; i++) {
            const cardDot = menuCards[i].querySelector('#cardDot');
            const cardTitle = menuCards[i].querySelector('#cardTitle');
            cardDot.classList.remove("focused-card");
            cardTitle.classList.remove("focused-card");
            if (menuCards[i].getAttribute('rowId') == rowId) {
                cardDot.classList.add("focused-card");
                cardTitle.classList.add("focused-card");
            }
        }
    }

    private getActiveDropLineIdx(): number {
        const dropLines = document.querySelectorAll('[id^="menuDropLine"]');
        for (let i = 0; i < dropLines.length; i++) {
            if (dropLines[i].classList.contains('active-drop-line')) {
                return (i >= dropLines.length - 1) ? i - 1 : i;
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

    private renderMenu() {
        this.pnlMenu.clearInnerHTML();
        const sections = pageObject.getNonNullSections();
        const items = sections.map((section: IPageSection) => {
            return {
                caption: this.getTitle(section),
                rowId: section.id.replace("row-", "")
            };
        })
        if (!items.length) {
            const txt = (
                <i-hstack
                    verticalAlignment="center"
                    horizontalAlignment='start'
                    width="100%"
                    overflow="hidden"
                >
                    <i-label
                        caption={this.noDataTxt}
                        font={{ size: '16px', color: '#3b3838', weight: 530 }}
                        padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        maxHeight={34}
                        overflow={"hidden"}
                    ></i-label>
                </i-hstack>);
            this.pnlMenu.appendChild(txt);
            return;
        }

        const activeElm = document.querySelector('ide-toolbar.active') || document.querySelector('ide-row.active');
        const activeSectionId = activeElm?.closest('ide-row')?.id.replace('row-', "");

        // set the titles here
        const dropLine = (<i-panel id={`menuDropLine-0`} width={'100%'} height={'5px'}></i-panel>);
        this.pnlMenu.appendChild(dropLine);
        for (let i = 0; i < items.length; i++) {
            const isActive = activeSectionId == items[i].rowId;
            const menuCard = (
                <i-hstack
                    id="menuCard"
                    class={menuCardStyle}
                    verticalAlignment="center"
                    horizontalAlignment='space-between'
                    width="100%"
                    border={{ radius: 5 }}
                    overflow="hidden"
                    onClick={() => this.goToSection(items[i].rowId)}
                >
                    <i-hstack verticalAlignment="center" horizontalAlignment='start'>
                        <i-label
                            id="cardDot"
                            caption={"•"}
                            font={{ size: '16px', color: '#3b3838', weight: 530 }}
                            padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            maxHeight={34}
                            overflow={"hidden"}
                            class={isActive ? "focused-card" : ""}
                        ></i-label>
                        <i-label
                            id="cardTitle"
                            caption={items[i].caption}
                            font={{ size: '16px', color: '#3b3838', weight: 530 }}
                            padding={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            maxHeight={34}
                            class={isActive ? "focused-card" : ""}
                            overflow={"hidden"}
                        ></i-label>
                        <i-input
                            id="cardInput"
                            visible={false}
                            width='90%'
                            height='40px'
                            padding={{ left: '0.5rem', top: '0.5rem', bottom: '0.5rem', right: '0.5rem' }}
                        ></i-input>
                    </i-hstack>
                    <i-icon
                        id="cardRenameBtn"
                        name='pen'
                        fill={'var(--colors-primary-main)'}
                        width={28} height={28}
                        padding={{ top: 7, bottom: 7, left: 7, right: 7 }}
                        margin={{ right: 4 }}
                        class="pointer iconButton"
                        visible={false}
                        tooltip={{ content: "Rename", placement: "top" }}
                        onClick={() => this.onClickRenameBtn(items[i].rowId)}
                    ></i-icon>
                    <i-hstack id="editBtnStack" verticalAlignment="center" visible={false}>
                        <i-icon
                            name='times'
                            width={28} height={28}
                            fill={'var(--colors-primary-main)'}
                            padding={{ top: 7, bottom: 7, left: 7, right: 7 }}
                            margin={{ right: 4 }}
                            class="pointer iconButton"
                            tooltip={{ content: "Cancel", placement: "top" }}
                            onClick={() => this.onClickCancelBtn(items[i].rowId)}
                        ></i-icon>
                        <i-icon
                            name="check"
                            width={28} height={28}
                            fill={'var(--colors-primary-main)'}
                            padding={{ top: 7, bottom: 7, left: 7, right: 7 }}
                            margin={{ right: 4 }}
                            class="pointer iconButton"
                            tooltip={{ content: "Confirm", placement: "top" }}
                            onClick={() => this.onClickConfirmBtn(items[i].rowId)}
                        ></i-icon>
                    </i-hstack>
                </i-hstack>
            );
            menuCard.setAttribute('draggable', 'true');
            menuCard.setAttribute('rowId', items[i].rowId);
            this.pnlMenu.appendChild(menuCard);
            this.initMenuCardEventListener(menuCard);

            const dropLine = (<i-panel id={`menuDropLine-${i + 1}`} width={'100%'} height={'5px'}></i-panel>);
            this.pnlMenu.appendChild(dropLine);
        }
    }

    private setCardTitle(rowId: string) {
        const currCard = this.pnlMenu.querySelector(`[rowId="${rowId}"]`) as HTMLElement;
        const cardInput = currCard.querySelector('#cardInput') as Input;
        const caption = cardInput.value;

        // change data
        const sectionIdx = pageObject.sections.findIndex(section => section.id == rowId);
        pageObject.sections[sectionIdx].name = caption;

        // change UI on-the-fly
        const cardTitle = currCard.querySelector('#cardTitle');
        (cardTitle as Label).caption = caption;
    }

    private onClickRenameBtn(rowId: string) {
        this.toggleEditor(rowId, true);
    }

    private onClickConfirmBtn(rowId: string) {
        this.setCardTitle(rowId);
        this.toggleEditor(rowId, false);
    }

    private onClickCancelBtn(rowId: string) {
        this.toggleEditor(rowId, false);
    }

    private toggleRenameBtn(rowId: string, toggle: boolean) {
        const currCard = this.pnlMenu.querySelector(`[rowId="${rowId}"]`) as HTMLElement;
        const cardRenameBtn = currCard.querySelector('#cardRenameBtn');
        (cardRenameBtn as Icon).visible = toggle;
    }

    private toggleEditor(rowId: string, toggle: boolean) {
        this.isEditing = toggle;

        const currCard = this.pnlMenu.querySelector(`[rowId="${rowId}"]`) as HTMLElement;
        const cardTitle = currCard.querySelector('#cardTitle');
        const cardInput = currCard.querySelector('#cardInput');
        const cardRenameBtn = currCard.querySelector('#cardRenameBtn');

        (cardInput as Input).value = (cardTitle as Label).caption;
        (cardTitle as Label).visible = !toggle;
        (cardInput as Input).visible = toggle;
        (cardRenameBtn as Icon).visible = !toggle;
        const editBtnStack = currCard.querySelector('#editBtnStack') as HStack;
        editBtnStack.visible = toggle;
    }

    private goToSection(rowId: string) {
        document.getElementById(`row-${rowId}`).scrollIntoView();
        application.EventBus.dispatch(EVENT.ON_SHOW_SECTION, rowId);
    }

    private getTitle(data: IPageSection): string {
        return data.name ? data.name : (data.elements.length > 1) ? "Untitled section" : this.getTitleFn(data.elements[0]);
    }

    private getTitleFn(data: IPageElement): string {
        if (data && data.elements) {
            return this.getTitleFn(data.elements[0]);
        } else if (data && data.module) {
            // TODO: get the precise title here
            return "Untitled " + data.module.name.toLowerCase();
        } else {
            return "Untitled section";
        }
    }

    render() {
        return (
            <i-vstack id="menuWrapper" gap={"0.5rem"}
                class={menuBtnStyle} zIndex={150}>
                <i-hstack gap={'1rem'} verticalAlignment='center'>
                    <i-label caption={"Page menu"} font={{ color: 'var(--colors-primary-main)', weight: 750, size: '18px' }} class="prevent-select"></i-label>
                </i-hstack>
                <i-vstack id="pnlMenuWrapper" width={320}>
                    <i-vstack id='pnlMenu' class={menuStyle}></i-vstack>
                </i-vstack>
            </i-vstack>
        )
    }
}
