import {
    customModule,
    Container,
    Module,
    Panel,
    application,
    Styles
} from '@ijstech/components';
import { match, compile } from '@page/utility';
import { IMenu, IPageData, IRoute, ISCConfig } from '@page/interface';
import './index.css';
import './style.css';
import { updateNetworks, updateWallets } from '@page/wallet';
import { EVENT } from '@page/const';

@customModule
export class MainModule extends Module {
    private main: Panel;
    private _options: ISCConfig;
    private currentModule: Module;
    private currentMenu: any;
    private _data: IPageData;
    private _mode: string;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this._options = options;
        let defaultRoute: IRoute | undefined = this._options?.routes?.find(route => route.default);
        if (defaultRoute && !location.hash) {
            const toPath = compile(defaultRoute.url, { encode: encodeURIComponent });
            location.hash = toPath();
        } else
            this.handleHashChange(true);
    }

    async getData(): Promise<IPageData> {
        const getDataFn = (this.currentModule as any)?.getData;
        return getDataFn ? await getDataFn() : this._data;
    }
    
    async setData(data: IPageData) {
        this._data = data;
        const setDataFn = (this.currentModule as any)?.setData;
        if (setDataFn) await setDataFn(data);
    }

    async init() {
        super.init();
		updateNetworks(this.options);
		updateWallets(this.options);
    }

    connectedCallback(): void {
      super.connectedCallback();
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }
  
    disconnectCallback(): void {
      super.disconnectCallback();
      window.removeEventListener('hashchange', this.handleHashChange.bind(this));
    }

    hideCurrentModule() {
        if (this.currentModule) {
            this.currentModule.style.display = 'none';
            this.currentModule.onHide();
        }
    }

    async getModuleByPath(path: string): Promise<{
        module: Module,
        params?: any
    }> {
        let menu: IMenu | IRoute;
        let params: any;
        let list: Array<IMenu | IRoute> = [...this._options.routes || [], ...this._options.menus || []];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.url == path) {
                menu = item;
                break;
            } else {
                if (!item.regex)
                    item.regex = match(item.url, { decode: decodeURIComponent });

                let _match = item.regex(path);
                if (_match !== false) {
                    menu = item;
                    this.currentMenu = menu;
                    params = 'params' in menu ? Object.assign({ ...menu.params }, _match.params) : _match.params;
                    break;
                }
                ;
            }
            ;
        }
        ;
        if (menu) {
            let menuObj: any = menu;
            if (!menuObj.moduleObject) {
                menuObj.moduleObject = await application.loadModule(menu.module, this._options);
                if (menuObj.moduleObject) menuObj.moduleObject.onLoad();
            }
            return {
                module: menuObj.moduleObject,
                params: params
            };
        }
    };

    async handleHashChange(isUninitialized?: boolean) {
        let path = location.hash.split('?')[0];
        if (path.startsWith('#/'))
            path = path.substring(1);
        let module = await this.getModuleByPath(path);
        if (module?.module != this.currentModule)
            this.hideCurrentModule();
        this.currentModule = module?.module;
        if (module) {
            if (this.main.contains(module.module))
                module.module.style.display = 'initial';
            else
                this.main.append(module.module);
            if(module.module && module.module.onShow) {
                await module.module.onShow();
            }
        }
        if (!isUninitialized) {
            application.EventBus.dispatch(EVENT.ON_HASH_CHANGE);
        }
    }

    async render() {
        return (
            <i-panel id={'main'} width={'100%'} height={'100%'}></i-panel>
        );
    }
}
