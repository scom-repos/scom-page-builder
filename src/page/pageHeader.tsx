import {
    Module,
    customElements,
    ControlElement,
    Image,
    HStack,
    Control
  } from '@ijstech/components';
import { UpdatePageSettingsCommand, commandHistory } from '../command/index';
import { currentTheme  } from '../theme/index';
import './pageHeader.css';
import { PageSettingsDialog } from '../dialogs/index';
import { IPageConfig } from '../interface/index';
  
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        ['ide-header']: PageHeaderElement;
      }
    }
  }
  
  const Theme = currentTheme;
    
  export interface PageHeaderElement extends ControlElement {}
  
  @customElements('ide-header')
  export class PageHeader extends Module {
    private iconList: any[] = [];
    private toolbars: HStack;
    private mdPageSettings: PageSettingsDialog;
    // private publishDropdown: Panel;
  
    private imgLogo: Image;
    private _logo: string;
  
    constructor(parent?: any) {
      super(parent);
      this.initEventBus();
    }
  
    initEventBus() {}
  
    set logo(data: string) {
      this._logo = data;
      this.imgLogo.url = data;
    }
  
    get logo(): string {
      return this._logo;
    }
  
    hideLogo(hide?: boolean) {
      this.imgLogo.visible = !hide;
    }

    private onSavePageSettings(data: IPageConfig) {
      const containerEl = this.parentElement?.querySelector('.pnl-editor-wrapper') as Control;
      if (!containerEl) return;
      const updateCmd = new UpdatePageSettingsCommand(containerEl, {...data});
      commandHistory.execute(updateCmd);
    }
  
    private renderIconList() {
      this.toolbars.clearInnerHTML();
      this.iconList.forEach((icon) => {
        this.toolbars.appendChild(
          <i-button
            padding={{left: '12px', right: '12px', top: '12px', bottom: '12px'}}
            width={48} height={48}
            border={{radius: '50%'}}
            caption={`<i-icon name="${icon.name}" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`}
            background={{color: 'transparent'}}
            tooltip={icon.tooltip}
            class="toolbar"
            onClick={icon.onClick}
          ></i-button>
        );
      })
    }
  
    private renderDropdown() {
      // this.publishDropdown.clearInnerHTML();
      // const modalElm = (
      //   <i-modal
      //     maxWidth='200px'
      //     minWidth='200px'
      //     showBackdrop={false}
      //     height='auto'
      //     popupPlacement='bottomRight'
      //   >
      //     <i-vstack gap="0.5rem">
      //       <i-button
      //         caption="Publish settings"
      //         width='100%'
      //         height='auto'
      //         background={{color: 'transparent'}}
      //         border={{width: '0px'}}
      //         padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
      //       ></i-button>
      //     </i-vstack>
      //   </i-modal>
      // )
      // this.publishDropdown.append(
      //   <i-button
      //     caption="Publish"
      //     padding={{ top: 10, bottom: 10, left: '1rem', right: '1rem' }}
      //     background={{color: Theme.colors.primary.main}}
      //     font={{color: Theme.colors.primary.contrastText, weight: 600}}
      //     rightIcon={{name: 'caret-down', width: 14, height: 14, fill: Theme.colors.primary.contrastText}}
      //     onClick={() => modalElm.visible = !modalElm.visible}
      //   ></i-button>,
      //   modalElm
      // )
    }
  
    async init() {
      super.init();
      this.iconList = [
        {
          name: 'cog',
          tooltip: {content: 'Page settings', placement: 'bottom'},
          onClick: () => {
            this.mdPageSettings.show();
          }
        },
        {
          name: 'undo',
          tooltip: {content: 'Undo last action', placement: 'bottom'},
          onClick: () => commandHistory.undo()
        },
        {
          name: 'redo',
          tooltip: {content: 'Redo last action', placement: 'bottom'},
          onClick: () => commandHistory.redo()
        },
        // {
        //   name: 'tablet',
        //   tooltip: {content: 'Preview', placement: 'bottom'},
        //   onClick: () => {}
        // },
        // {
        //   name: 'link',
        //   tooltip: {content: 'Can`t copy link for unpublish site', placement: 'bottom'},
        //   onClick: () => {}
        // },
        // {
        //   name: 'user-plus',
        //   tooltip: {content: 'Share with others', placement: 'bottom'},
        //   onClick: () => {}
        // },
        // {
        //   name: 'cog',
        //   tooltip: {content: 'Settings', placement: 'bottom'},
        //   onClick: () => {}
        // },
        // {
        //   name: 'ellipsis-v',
        //   tooltip: {content: 'More', placement: 'bottom'},
        //   onClick: () => {}
        // }
      ];
      this.renderIconList();
      this.renderDropdown();
    }
  
    render() {
      return (
        <i-hstack
          horizontalAlignment='end'
          verticalAlignment={'center'}
          padding={{ left: '1rem', right: '1rem', top: '0.3rem', bottom: '0.3rem' }}
          class={'ide-header'}
        >
          <i-panel width={200}>
            <i-image id={'imgLogo'} height={40} width={'auto'}></i-image>
          </i-panel>
          <i-hstack class="page-menu-bar" gap="1rem" verticalAlignment="center">
            <i-hstack id="toolbars" gap="1rem" verticalAlignment="center"></i-hstack>
            {/* <i-panel id="publishDropdown" position='relative'></i-panel> */}
          </i-hstack>
          <ide-page-settings-dialog
            id="mdPageSettings"
            onSave={this.onSavePageSettings.bind(this)}
          ></ide-page-settings-dialog>
        </i-hstack>
      );
    }
  }
  