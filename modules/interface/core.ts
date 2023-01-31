import { MatchFunction } from '@page/utility';
import { Styles } from '@ijstech/components';

export interface IMenu{
    caption: string;
    url: string;
    module: string;
    params?: any;
    env?: string;
    networks?: number[];
    isToExternal?: boolean;
    img?: string;
    isDisabled?: boolean;
    menus?: IMenu[];
    regex?: MatchFunction;
};
export interface ISCConfig{
    env: string;
    moduleDir?: string;
    modules: {[name: string]: {path: string, dependencies: string[]}};
    dependencies?: {[name: string]: string};
    menus: IMenu[];
    routes: IRoute[];
    networks?: INetwork[] | "*";
    copyrightInfo: string;
    version?: string;
    wallet?: string[];
    themes?: ITheme;
    breakpoints?: IBreakpoints;
};
export interface INetwork {
    name?: string,
    chainId: number,
    img?: string,
    rpc?: string,
    symbol?: string,
    env?: string,
    explorerName?: string,
    explorerTxUrl?: string,
    explorerAddressUrl?: string,
    isDisabled?: boolean,
};
export interface IRoute {
    url: string;
    module: string;
    default?: boolean;
    regex?: MatchFunction;
}
export interface ITheme {
    default: string;
    dark?: Styles.Theme.ITheme;
    light?: Styles.Theme.ITheme;
}
export interface IBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
}

