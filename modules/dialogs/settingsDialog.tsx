import {
    Module,
    customElements,
    Modal,
    ControlElement,
    application,
    Switch,
    Upload,
    Input,
    Panel,
    Styles,
    Button
} from '@ijstech/components';
import { assignAttr } from '@page/utility';
import './settingsDialog.css';
import { IConfigData, ISiteData } from '@page/interface';
import { DEFAULT_BOXED_LAYOUT_WIDTH, EVENT } from '@page/const';

const Theme = Styles.Theme.ThemeVars;

export interface SettingsDialogElement extends ControlElement {
    onSave: (config: IConfigData) => Promise<void>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-site-settings-dialog']: SettingsDialogElement;
        }
    }
}

const textAlignValues = ["none", "center", "left", "right", "start", "end", "justify", "inherit", "initial", "revert", "unset", "match-parent", "-moz-initial"];
const overflowValues = ["none", "auto", "clip", "hidden", "scroll", "visible", "inherit", "initial", "revert", "unset", "match-parent", "-moz-initial"];

@customElements('scpage-site-settings-dialog')
export class SettingsDialog extends Module {
    private dialog: Modal;
    private switchShowHeader: Switch;
    private switchBoxedLayout: Switch;
    private pnlInputBoxed: Panel;
    private inputBoxedWidth: Input;
    private switchContainerLayout: Switch;
    private pnlInputContainer: Panel;
    private inputContainerWidth: Input;
    private inputContainerMaxWidth: Input;
    private btnContainerTextAlign: Button;
    private modalContainerTextAlign: Modal;
    private containerTextAlign?: string;
    private btnContainerOverflow: Button;
    private modalContainerOverflow: Modal;
    private containerOverflow?: string;
    private switchShowPagination: Switch;
    private switchShowLogo: Switch;
    private switchShowTopMenu: Switch;
    private switchShowSideMenu: Switch;
    private switchShowWalletAuthentication: Switch;
    private switchStickyFooter: Switch;
    private switchShowFooter: Switch;
    private uploadLogo: Upload;
    private txtHeaderBackgroundColor: Input;
    private txtMenuFontColor: Input;
    private txCopyright: Input;
    private btnWebsiteType: Button;
    private modalWebsiteType: Modal;

    private gpBoxedLayout: Panel;
    private gpContainerLayout: Panel;
    private gpHeaderVisible: Panel;
    private gpShowWalletAuthentication: Panel;
    private gpLogoVisible: Panel;
    private gpLogo: Panel;
    private gpHeaderBackgroundColor: Panel;
    private gpPaginationVisible: Panel;
    private gpFooterVisible: Panel;
    private gpStickyFooter: Panel;
    private gpCopyright: Panel;
    private gpTopMenuVisible: Panel;
    private gpSideMenuVisible: Panel;
    private gpMenuFontColor: Panel;

    private onSave: (config: IConfigData) => Promise<void>;
    private logo: string = '';

    constructor(parent?: any) {
        super(parent);
        assignAttr(this);

    }

    async init() {
        super.init();
        this.initEventBus();
    }

    initEventBus() {
        application.EventBus.register(this, EVENT.ON_CONFIG_CHANGE, (configData: IConfigData) => {
            this.setConfig(configData);
        })
    }

    show() {
        this.dialog.visible = true;
    }

    hide() {
        this.dialog.visible = false;
    }

    setConfig(config: IConfigData) {
        console.log('setConfig', config)
        if (!config) {
            this.inputBoxedWidth.value = DEFAULT_BOXED_LAYOUT_WIDTH;
            return;
        };
        switch(config.type) {
            case 'secure-page':
                this.btnWebsiteType.caption = "Secure Page";
                this.onSiteTypeChanged("Secure Page")
                break;
            case 'secure-book':
                this.btnWebsiteType.caption = "Secure Book";
                this.onSiteTypeChanged("Secure Book")
                break;
        }
        this.switchShowHeader.checked = config.header?.showHeader || false;
        this.switchBoxedLayout.checked = config.body?.boxedLayout || false;
        this.inputBoxedWidth.value = config.body?.boxedWidth || DEFAULT_BOXED_LAYOUT_WIDTH;
        this.txtMenuFontColor.value = config.menu?.fontColor || '';
        this.txtHeaderBackgroundColor.value = config.header?.headerBackgroundColor || '';
        const containerSettings = config.body?.containerSettings;
        if (containerSettings) {
            const { width, maxWidth, overflow, textAlign } = containerSettings;
            this.inputContainerWidth.value = width || '';
            this.inputContainerMaxWidth.value = maxWidth || '';
            this.btnContainerTextAlign.caption = textAlign || 'none';
            this.containerTextAlign = textAlign || undefined;
            this.btnContainerOverflow.caption = overflow || 'none';
            this.containerOverflow = overflow || undefined;
        }
        this.switchContainerLayout.checked = config.body?.containerLayout || false;
        this.onBoxedChanged();
        this.onContainerChanged();
        this.switchShowPagination.checked = config.body?.showPagination || false;
        this.switchShowLogo.checked = config.header?.showLogo || false;
        this.uploadLogo.clear();
        if (config.header.logo) {
            this.logo = config.header.logo;
            this.uploadLogo.preview(config.header.logo);
            this.uploadLogo.fileList = [new File([], '')];
        }
        this.switchShowTopMenu.checked = config.menu?.showTopMenu || false;
        this.switchShowWalletAuthentication.checked = config.header?.showWalletAuthentication || false;
        this.switchShowFooter.checked = config.footer?.showFooter || false;
        this.txCopyright.value = config.footer?.copyrightText || '';
        this.switchStickyFooter.checked = config.footer?.stickyFooter || false;
        this.switchShowSideMenu.checked = config.menu?.showSideMenu || false;

    }

    async getConfig(): Promise<IConfigData> {
        let type;
        if(this.btnWebsiteType.caption == 'Secure Page')
            type = 'secure-page';
        else if (this.btnWebsiteType.caption == 'Secure Book')
            type = 'secure-book';
        else type = null;
        const showHeader = this.switchShowHeader.checked;
        const boxedLayout = this.switchBoxedLayout.checked;
        const boxedWidth = this.inputBoxedWidth.value || DEFAULT_BOXED_LAYOUT_WIDTH;
        const containerLayout = this.switchContainerLayout.checked;
        const containerSettings = {
            width: this.inputContainerWidth.value || undefined,
            maxWidth: this.inputContainerMaxWidth.value || undefined,
            overflow: this.containerOverflow || undefined as any,
            textAlign: this.containerTextAlign || undefined as any,
        }

        const headerBackgroundColor = this.txtHeaderBackgroundColor.value;
        const showPagination = this.switchShowPagination.checked;
        const showWalletAuthentication = this.switchShowWalletAuthentication.checked;
        const showLogo = this.switchShowLogo.checked;
        const logo = this.logo;
        const showTopMenu = this.switchShowTopMenu.checked;
        const showSideMenu = this.switchShowSideMenu.checked;
        const fontColor = this.txtMenuFontColor.value;
        const showFooter = this.switchShowFooter.checked;
        const stickyFooter = this.switchStickyFooter.checked;
        const copyrightText = this.txCopyright.value;
        const urlSuffix = '';

        return {
            type,
            header: {
                showHeader,
                showWalletAuthentication,
                showLogo,
                logo,
                headerBackgroundColor
            },
            body: {
                boxedLayout,
                boxedWidth,
                containerLayout,
                containerSettings,
                showPagination
            },
            footer: {
                showFooter,
                stickyFooter,
                copyrightText
            },
            menu: {
                showTopMenu,
                showSideMenu,
                fontColor
            },
            url: {
                urlSuffix
            }
        };
    }

    async confirm() {
        const config = await this.getConfig();
        application.EventBus.dispatch(EVENT.ON_CONFIG_SAVE, config);
        if (this.onSave) await this.onSave(config);
        this.dialog.visible = false;
    }

    async onFileChanged(source: Upload, fileList: File[]) {
        this.logo = fileList.length ? (await this.uploadLogo.toBase64(fileList[0])).toString() : '';
    }

    onBoxedChanged() {
        this.pnlInputBoxed.visible = this.switchBoxedLayout.checked;
    }

    onContainerChanged() {
        this.pnlInputContainer.visible = this.switchContainerLayout.checked;
    }

    onTextAlignChanged(value: string) {
        this.btnContainerTextAlign.caption = value;
        this.containerTextAlign = value === "none" ? undefined : value;
        this.modalContainerTextAlign.visible = false;
    }

    showModalContainerTextAlign() {
        this.modalContainerTextAlign.visible = !this.modalContainerTextAlign.visible;
    }

    onOverflowChanged(value: string) {
        this.btnContainerOverflow.caption = value;
        this.containerOverflow = value === "none" ? undefined : value;
        this.modalContainerOverflow.visible = false;
    }

    onSiteTypeChanged(value: string) {
        this.btnWebsiteType.caption = value;
        this.modalWebsiteType.visible = false;

        const sp = value == 'Secure Page';
        const sb = value == 'Secure Book';

        this.gpHeaderVisible.visible = sp;
        this.gpShowWalletAuthentication.visible = sp;
        this.gpPaginationVisible.visible = sb;
        this.gpFooterVisible.visible = sp;
        this.gpStickyFooter.visible = sp;
        this.gpCopyright.visible = sp;
        this.gpTopMenuVisible.visible = sp;
        this.gpSideMenuVisible.visible = sp;

        if(sb) {
            this.switchShowHeader.checked = true;
        }

    }

    showModalWebsiteType() {
        this.modalWebsiteType.visible = !this.modalWebsiteType.visible;
    }

    showModalContainerOverflow() {
        this.modalContainerOverflow.visible = !this.modalContainerOverflow.visible;
    }

    render() {
        return (
            <i-modal
                id={'dialog'}
                showBackdrop={true}
                closeOnBackdropClick={false}
                maxWidth={'1460px'}
                popupPlacement={'center'}>
                <i-panel class='settings-header'>
                    <i-label caption='Website Settings' class='settings-header-title'></i-label>
                    <i-button
                        icon={{ name: 'times' }}
                        class='settings-close'
                        onClick={this.hide}></i-button>
                </i-panel>

                <i-hstack class='settings-body'>
                    <i-vstack class='settings-sidebar'>
                        <i-panel class='wadoz'>
                            <i-panel class='space'></i-panel>
                            {/*<i-button caption='Home'></i-button>*/}
                            {/*<i-panel class='divider'></i-panel>*/}
                            <i-button caption='Settings'></i-button>
                        </i-panel>
                    </i-vstack>

                    <i-vstack class='right-side-area'>
                        <i-vstack class='page-header-container'>
                            <i-hstack class='breadcrumb' visible={false}>
                                <i-button
                                    caption='Settings'
                                    rightIcon={{ name: 'chevron-right' }}></i-button>
                                <i-label caption='Website Settings'></i-label>
                            </i-hstack>

                            <i-label
                                caption='Website Settings'
                                font={{ size: '36px', bold: true }}
                                lineHeight={'48px'}></i-label>
                        </i-vstack>

                        <i-vstack class='page-body-container'>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Website Type'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'}>
                                        <i-label class={'form-label'} caption={'Website type'}></i-label>
                                        <i-hstack width={150} position={'relative'} margin={{ left: 'auto' }} verticalAlignment={'center'} horizontalAlignment={'end'} gap={5} class={'form-control modal-selection'}>
                                            <i-button
                                                id={'btnWebsiteType'}
                                                caption={''}
                                                class={'btn btn-primary'}
                                                rightIcon={{ name: 'angle-down', fill: Theme.colors.primary.contrastText }}
                                                width={'calc(100% - 1px)'}
                                                onClick={this.showModalWebsiteType}
                                            ></i-button>
                                            <i-modal
                                                id={'modalWebsiteType'}
                                                showBackdrop={false}
                                                width={'100%'}
                                                height={'auto'}
                                                popupPlacement={'bottom'}
                                            >
                                                <i-vstack>
                                                    {
                                                        ["Secure Page", "Secure Book"].map((value) => {
                                                            return <i-button caption={value} minWidth={'auto'} onClick={() => this.onSiteTypeChanged(value)} />
                                                        })
                                                    }
                                                </i-vstack>
                                            </i-modal>
                                        </i-hstack>
                                    </i-panel>
                                </i-panel>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Page Layout'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'} id={'gpBoxedLayout'}>
                                        <i-label class={'form-label'} caption={'Boxed layout'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchBoxedLayout'} onChanged={this.onBoxedChanged}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel id={'pnlInputBoxed'} visible={false} class={'form-group container-input'}>
                                        <i-label class={'form-label'} caption={'Boxed width'}></i-label>
                                        <i-hstack verticalAlignment={'center'} horizontalAlignment={'end'} width={'100%'} gap={5} class={'form-control'}>
                                            <i-input width={100} height={30} id={'inputBoxedWidth'}></i-input>
                                        </i-hstack>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpContainerLayout'}>
                                        <i-label class={'form-label'} caption={'Container layout'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchContainerLayout'} onChanged={this.onContainerChanged}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel id={'pnlInputContainer'} class={'container-input'} visible={false}>
                                        <i-panel class={'form-group'}>
                                            <i-label class={'form-label'} caption={'Container settings'}></i-label>
                                        </i-panel>
                                        <i-panel class={'form-group'}>
                                            <i-label class={'form-label'} caption={'Width'}></i-label>
                                            <i-hstack verticalAlignment={'center'} horizontalAlignment={'end'} width={'100%'} gap={5} class={'form-control'}>
                                                <i-input width={100} height={30} id={'inputContainerWidth'}></i-input>
                                            </i-hstack>
                                        </i-panel>
                                        <i-panel class={'form-group'}>
                                            <i-label class={'form-label'} caption={'Max width'}></i-label>
                                            <i-hstack verticalAlignment={'center'} horizontalAlignment={'end'} width={'100%'} gap={5} class={'form-control'}>
                                                <i-input width={100} height={30} id={'inputContainerMaxWidth'}></i-input>
                                            </i-hstack>
                                        </i-panel>
                                        <i-panel class={'form-group'}>
                                            <i-label class={'form-label'} caption={'Text align'}></i-label>
                                            <i-hstack width={150} position={'relative'} margin={{ left: 'auto' }} verticalAlignment={'center'} horizontalAlignment={'end'} gap={5} class={'form-control modal-selection'}>
                                                <i-button
                                                    id={'btnContainerTextAlign'}
                                                    caption={'none'}
                                                    class={'btn btn-primary'}
                                                    rightIcon={{ name: "angle-down", fill: Theme.colors.primary.contrastText }}
                                                    width={'calc(100% - 1px)'}
                                                    onClick={this.showModalContainerTextAlign}
                                                ></i-button>
                                                <i-modal
                                                    id={'modalContainerTextAlign'}
                                                    showBackdrop={false}
                                                    width={'100%'}
                                                    height={'auto'}
                                                    popupPlacement={'bottom'}
                                                >
                                                    <i-vstack>
                                                        {
                                                            textAlignValues.map((value) => {
                                                                return <i-button caption={value} minWidth={'auto'} onClick={() => this.onTextAlignChanged(value)} />
                                                            })
                                                        }
                                                    </i-vstack>
                                                </i-modal>
                                            </i-hstack>
                                        </i-panel>
                                        <i-panel class={'form-group'}>
                                            <i-label class={'form-label'} caption={'Overflow'}></i-label>
                                            <i-hstack width={150} position={'relative'} margin={{ left: 'auto' }} verticalAlignment={'center'} horizontalAlignment={'end'} gap={5} class={'form-control modal-selection'}>
                                                <i-button
                                                    id={'btnContainerOverflow'}
                                                    caption={'none'}
                                                    class={'btn btn-primary'}
                                                    rightIcon={{ name: 'angle-down', fill: Theme.colors.primary.contrastText }}
                                                    width={'calc(100% - 1px)'}
                                                    onClick={this.showModalContainerOverflow}
                                                ></i-button>
                                                <i-modal
                                                    id={'modalContainerOverflow'}
                                                    showBackdrop={false}
                                                    width={'100%'}
                                                    height={'auto'}
                                                    popupPlacement={'bottom'}
                                                >
                                                    <i-vstack>
                                                        {
                                                            overflowValues.map((value) => {
                                                                return <i-button caption={value} minWidth={'auto'} onClick={() => this.onOverflowChanged(value)} />
                                                            })
                                                        }
                                                    </i-vstack>
                                                </i-modal>
                                            </i-hstack>
                                        </i-panel>
                                    </i-panel>
                                </i-panel>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Header Settings'}></i-label>
                                </i-panel>

                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'} id={'gpHeaderVisible'}>
                                        <i-label class={'form-label'} caption={'Header visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowHeader'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpShowWalletAuthentication'}>
                                        <i-label class={'form-label'} caption={'Show wallet authentication'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowWalletAuthentication'}></i-switch>
                                        </i-panel>
                                    </i-panel>

                                    <i-panel class={'divider'}></i-panel>

                                    <i-panel class={'form-group'} id={'gpLogoVisible'}>
                                        <i-label class={'form-label'} caption={'Logo visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowLogo'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpLogo'}>
                                        <i-label class={'form-label'} caption={'Logo'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-upload id={'uploadLogo'} onChanged={this.onFileChanged.bind(this)}
                                                      onRemoved={this.onFileChanged.bind(this)}></i-upload>
                                        </i-panel>
                                    </i-panel>

                                    <i-panel class={'divider'}></i-panel>

                                    <i-panel class={'form-group'} id={'gpHeaderBackgroundColor'}>
                                        <i-label class={'form-label'} caption={'Background Color'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-input inputType={'color'} id={'txtHeaderBackgroundColor'}></i-input>
                                        </i-panel>
                                    </i-panel>

                                </i-panel>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Body Settings'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'} id={'gpPaginationVisible'}>
                                        <i-label class={'form-label'} caption={'Pagination visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowPagination'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                </i-panel>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Footer Settings'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'} id={'gpFooterVisible'}>
                                        <i-label class={'form-label'} caption={'Footer visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowFooter'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpStickyFooter'}>
                                        <i-label class={'form-label'} caption={'Sticky footer?'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchStickyFooter'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpCopyright'}>
                                        <i-label class={'form-label'} caption={'Copyright'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-input id={'txCopyright'}></i-input>
                                        </i-panel>
                                    </i-panel>
                                </i-panel>
                            </i-panel>

                            <i-panel class={'box'}>
                                <i-panel class={'box-header'}>
                                    <i-label caption={'Menu Settings'}></i-label>
                                </i-panel>
                                <i-panel class={'box-content'}>
                                    <i-panel class={'form-group'} id={'gpTopMenuVisible'}>
                                        <i-label class={'form-label'} caption={'Top menu visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowTopMenu'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'form-group'} id={'gpSideMenuVisible'}>
                                        <i-label class={'form-label'} caption={'Side menu visible'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-switch id={'switchShowSideMenu'}></i-switch>
                                        </i-panel>
                                    </i-panel>
                                    <i-panel class={'divider'}></i-panel>
                                    <i-panel class={'form-group'} id={'gpMenuFontColor'}>
                                        <i-label class={'form-label'} caption={'Font color'}></i-label>
                                        <i-panel class={'form-control'}>
                                            <i-input inputType={'color'} id={'txtMenuFontColor'}></i-input>
                                        </i-panel>
                                    </i-panel>
                                </i-panel>

                            </i-panel>


                            <i-hstack
                                justifyContent={'end'}
                                alignItems={'center'}
                                padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                                <i-button
                                    caption={'Cancel'}
                                    class={'btn btn-primary'}
                                    margin={{ right: 5 }}
                                    onClick={this.hide}
                                ></i-button>
                                <i-button
                                    caption={'Confirm'}
                                    class={'btn btn-primary'}
                                    onClick={this.confirm}
                                ></i-button>
                            </i-hstack>
                        </i-vstack>
                    </i-vstack>
                </i-hstack>
            </i-modal>
        );
    }
}
