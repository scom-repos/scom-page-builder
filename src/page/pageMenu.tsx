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
import { menuBtnStyle, widgetModalStyle } from './pageMenu.css';
import { UpdatePageSettingsCommand, commandHistory } from '../command/index';
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

    private pnlMenu: TreeView;
    private pnlMenuWrapper: VStack;
    private items: IMenuItem[];

    init() {
        super.init();
        this.initEventBus() 
    }

    private initEventBus() {
        application.EventBus.register(this, EVENT.ON_UPDATE_MENU, async (sections: IPageSection[]) => this.renderMenu(sections));
    }

    renderMenu(sections: IPageSection[]) {
        // const editor = this.closest('i-scom-page-builder') as any;
        // const sections = editor.getData()?.sections;
        // console.log("updateMenu", JSON.parse(JSON.stringify(sections)));
        this.items = sections.map((section: IPageSection) => {
            return { 
                caption: this.getTitle(section),
                rowId: section.id.replace("row-", "")
            };
        })
        const titles = this.items.map((item: IMenuItem)=> {
            return { caption: item.caption };
        })
        this.pnlMenu.data = titles;
    }

    getTitle(data: IPageSection): string{
        return this.getTitleFn(data.elements[0]);
    }

    getTitleFn(data: IPageElement): string {
        if (data.elements) {
            return this.getTitleFn(data.elements[0]);
        } else if (data.module) {
            return data.module.name;
        } else {
            return "Untitled";
        }
    }

    toggleMenu() {
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
                        <i-tree-view id="pnlMenu"></i-tree-view>
                    </i-vstack>
                </i-vstack>
            </i-hstack>
        )
    }
}