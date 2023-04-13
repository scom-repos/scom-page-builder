/// <amd-module name="@scom/scom-page-builder/assets.ts" />
declare module "@scom/scom-page-builder/assets.ts" {
    function fullPath(path: string): string;
    const _default: {
        icons: {
            logo: string;
            logoMobile: string;
            validocs: string;
        };
        img: {
            network: {
                bsc: string;
                eth: string;
                amio: string;
                avax: string;
                ftm: string;
                polygon: string;
            };
            wallet: {
                metamask: string;
                trustwallet: string;
                binanceChainWallet: string;
                walletconnect: string;
            };
        };
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-page-builder/const/textbox.ts" />
declare module "@scom/scom-page-builder/const/textbox.ts" {
    export const textStyles: {
        title: string;
    }[];
}
/// <amd-module name="@scom/scom-page-builder/const/index.ts" />
declare module "@scom/scom-page-builder/const/index.ts" {
    export const EVENT: {
        ON_LOAD: string;
        ON_SAVE: string;
        ON_CONFIG_SAVE: string;
        ON_CONFIG_CHANGE: string;
        ON_PAGING_UPDATE: string;
        ON_SWITCH_PAGE: string;
        ON_TOGGLE_PAGE_VISIBILITY: string;
        ON_UPDATE_SECTIONS: string;
        ON_HASH_CHANGE: string;
        ON_PREVIEW: string;
        ON_ADD_ELEMENT: string;
        ON_CLONE: string;
        ON_RESIZE: string;
        ON_UPDATE_FOOTER: string;
    };
    export const DEFAULT_BOXED_LAYOUT_WIDTH = "1200px";
    export const DEFAULT_SCROLLBAR_WIDTH = 17;
    export const DEFAULT_SIDEBAR_MENU_WIDTH = 350;
    export const DEFAULT_FOOTER_HEIGHT = 50;
    export const IPFS_UPLOAD_END_POINT = "https://ipfs-gateway.scom.dev/api/1.0/sync/data";
    export const IPFS_GATEWAY_IJS = "https://ipfs.scom.dev/ipfs/";
    export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
    export * from "@scom/scom-page-builder/const/textbox.ts";
}
/// <amd-module name="@scom/scom-page-builder/store/index.ts" />
declare module "@scom/scom-page-builder/store/index.ts" {
    import { IPageHeader, IPageSection, IPageFooter, IPageElement, IPageBlockData } from "@scom/scom-page-builder/interface/index.ts";
    export class PageObject {
        private _header;
        private _sections;
        private _footer;
        set header(value: IPageHeader);
        get header(): IPageHeader;
        set sections(value: IPageSection[]);
        get sections(): IPageSection[];
        set footer(value: IPageFooter);
        get footer(): IPageFooter;
        addSection(value: IPageSection): void;
        removeSection(id: string): void;
        getSection(id: string): IPageSection;
        updateSection(id: string, data: any): void;
        getRow(rowId: string): IPageSection | IPageFooter;
        removeRow(id: string): void;
        addRow(data: any, id?: string): void;
        private findElement;
        getElement(sectionId: string, elementId: string): any;
        setElement(sectionId: string, elementId: string, value: any): void;
        private removeElementFn;
        removeElement(sectionId: string, elementId: string): void;
        addElement(sectionId: string, value: IPageElement, parentElmId?: string, elementIndex?: number): void;
    }
    export const pageObject: PageObject;
    export const state: {
        pageBlocks: any[];
        rootDir: string;
    };
    export const setPageBlocks: (value: IPageBlockData[]) => void;
    export const getPageBlocks: () => any[];
    export const getDappContainer: () => any;
    export const setRootDir: (value: string) => void;
    export const getRootDir: () => string;
}
/// <amd-module name="@scom/scom-page-builder/utility/pathToRegexp.ts" />
declare module "@scom/scom-page-builder/utility/pathToRegexp.ts" {
    export interface ParseOptions {
        /**
         * Set the default delimiter for repeat parameters. (default: `'/'`)
         */
        delimiter?: string;
        /**
         * List of characters to automatically consider prefixes when parsing.
         */
        prefixes?: string;
    }
    /**
     * Parse a string for the raw tokens.
     */
    export function parse(str: string, options?: ParseOptions): Token[];
    export interface TokensToFunctionOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * Function for encoding input strings for output.
         */
        encode?: (value: string, token: Key) => string;
        /**
         * When `false` the function can produce an invalid (unmatched) path. (default: `true`)
         */
        validate?: boolean;
    }
    /**
     * Compile a string to a template function for the path.
     */
    export function compile<P extends object = object>(str: string, options?: ParseOptions & TokensToFunctionOptions): PathFunction<P>;
    export type PathFunction<P extends object = object> = (data?: P) => string;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    export function tokensToFunction<P extends object = object>(tokens: Token[], options?: TokensToFunctionOptions): PathFunction<P>;
    export interface RegexpToFunctionOptions {
        /**
         * Function for decoding strings for params.
         */
        decode?: (value: string, token: Key) => string;
    }
    /**
     * A match result contains data about the path match.
     */
    export interface MatchResult<P extends object = object> {
        path: string;
        index: number;
        params: P;
    }
    /**
     * A match is either `false` (no match) or a match result.
     */
    export type Match<P extends object = object> = false | MatchResult<P>;
    /**
     * The match function takes a string and returns whether it matched the path.
     */
    export type MatchFunction<P extends object = object> = (path: string) => Match<P>;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    export function match<P extends object = object>(str: Path, options?: ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    export function regexpToFunction<P extends object = object>(re: RegExp, keys: Key[], options?: RegexpToFunctionOptions): MatchFunction<P>;
    /**
     * Metadata about a key.
     */
    export interface Key {
        name: string | number;
        prefix: string;
        suffix: string;
        pattern: string;
        modifier: string;
    }
    /**
     * A token is a string (nothing special) or key metadata (capture group).
     */
    export type Token = string | Key;
    export interface TokensToRegexpOptions {
        /**
         * When `true` the regexp will be case sensitive. (default: `false`)
         */
        sensitive?: boolean;
        /**
         * When `true` the regexp won't allow an optional trailing delimiter to match. (default: `false`)
         */
        strict?: boolean;
        /**
         * When `true` the regexp will match to the end of the string. (default: `true`)
         */
        end?: boolean;
        /**
         * When `true` the regexp will match from the beginning of the string. (default: `true`)
         */
        start?: boolean;
        /**
         * Sets the final character for non-ending optimistic matches. (default: `/`)
         */
        delimiter?: string;
        /**
         * List of characters that can also be "end" characters.
         */
        endsWith?: string;
        /**
         * Encode path tokens for use in the `RegExp`.
         */
        encode?: (value: string) => string;
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    export function tokensToRegexp(tokens: Token[], keys?: Key[], options?: TokensToRegexpOptions): RegExp;
    /**
     * Supported `path-to-regexp` input types.
     */
    export type Path = string | RegExp | Array<string | RegExp>;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    export function pathToRegexp(path: Path, keys?: Key[], options?: TokensToRegexpOptions & ParseOptions): RegExp;
}
/// <amd-module name="@scom/scom-page-builder/utility/index.ts" />
declare module "@scom/scom-page-builder/utility/index.ts" {
    import { match, MatchFunction, compile } from "@scom/scom-page-builder/utility/pathToRegexp.ts";
    const assignAttr: (module: any) => void;
    const uploadToIPFS: (data: any) => Promise<string>;
    const fetchFromIPFS: (cid: string) => Promise<any>;
    const formatNumber: (value: any, decimals?: number) => string;
    const formatNumberWithSeparators: (value: number, precision?: number) => string;
    const isCID: (cid: string) => boolean;
    const getCID: () => string;
    const getPagePath: (path?: string) => string;
    const updatePagePath: (pagePath: string) => void;
    const generateUUID: () => string;
    const isEmpty: (value: any) => boolean;
    const getEmbedElement: (path: string) => Promise<HTMLElement>;
    export { assignAttr, uploadToIPFS, fetchFromIPFS, match, MatchFunction, compile, formatNumber, formatNumberWithSeparators, isCID, getCID, getPagePath, updatePagePath, generateUUID, isEmpty, getEmbedElement };
}
/// <amd-module name="@scom/scom-page-builder/interface/core.ts" />
declare module "@scom/scom-page-builder/interface/core.ts" {
    import { MatchFunction } from "@scom/scom-page-builder/utility/index.ts";
    import { Styles } from '@ijstech/components';
    export interface IMenu {
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
    }
    export interface ISCConfig {
        env: string;
        moduleDir?: string;
        modules: {
            [name: string]: {
                path: string;
                dependencies: string[];
            };
        };
        dependencies?: {
            [name: string]: string;
        };
        menus: IMenu[];
        routes: IRoute[];
        networks?: INetwork[] | "*";
        copyrightInfo: string;
        version?: string;
        wallet?: string[];
        themes?: ITheme;
        breakpoints?: IBreakpoints;
    }
    export interface INetwork {
        name?: string;
        chainId: number;
        img?: string;
        rpc?: string;
        symbol?: string;
        env?: string;
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
        isDisabled?: boolean;
    }
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
}
/// <amd-module name="@scom/scom-page-builder/interface/pageBlock.ts" />
declare module "@scom/scom-page-builder/interface/pageBlock.ts" {
    import { IDataSchema, IUISchema } from "@ijstech/components";
    export interface IPageBlockData {
        name: string;
        path: string;
        category?: "components" | "micro-dapps";
        imgUrl?: string;
        disableClicked?: boolean;
        shownBackdrop?: boolean;
    }
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IPageBlockAction {
        name: string;
        icon: string;
        command: (builder: any, userInputData: any) => ICommand;
        userInputDataSchema: IDataSchema;
        userInputUISchema: IUISchema;
    }
    export interface IPageBlock {
        getActions: () => IPageBlockAction[];
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
    }
}
/// <amd-module name="@scom/scom-page-builder/interface/component.ts" />
declare module "@scom/scom-page-builder/interface/component.ts" {
    export interface IImage {
        url: string;
        altText: string;
        backgroundColor: string;
        height: number;
        width: number;
        link: string;
    }
}
/// <amd-module name="@scom/scom-page-builder/interface/siteData.ts" />
declare module "@scom/scom-page-builder/interface/siteData.ts" {
    import { IPageBlockData } from "@scom/scom-page-builder/interface/pageBlock.ts";
    export interface IPageData {
        cid?: string;
        title?: string;
        name: string;
        path: string;
        url: string;
        visible: boolean;
        header: IPageHeader;
        sections: IPageSection[];
        footer: IPageFooter;
    }
    export enum HeaderType {
        'COVER' = "cover",
        'LARGE' = "largeBanner",
        'NORMAL' = "banner",
        'TITLE' = "titleOnly"
    }
    export interface IPageHeader {
        headerType: HeaderType;
        image: string;
        elements: IPageElement[];
    }
    export interface IPageSection {
        id: string;
        row: number;
        image?: string;
        backgroundColor?: string;
        elements: IPageElement[];
    }
    export interface IPageFooter {
        image: string;
        elements: IPageElement[];
    }
    export enum ElementType {
        PRIMITIVE = "primitive",
        COMPOSITE = "composite"
    }
    export interface IPageElement {
        id: string;
        column: number;
        columnSpan: number;
        type: ElementType;
        tag?: any;
        properties: any;
        module?: IPageBlockData;
        elements?: IPageElement[];
        visibleOn?: string;
        invisibleOn?: string;
    }
}
/// <amd-module name="@scom/scom-page-builder/interface/jsonSchema.ts" />
declare module "@scom/scom-page-builder/interface/jsonSchema.ts" {
    export interface ValidationResult {
        valid: boolean;
        errors: ValidationError[];
    }
    export interface ValidationError {
        property: string;
        message: string;
    }
}
/// <amd-module name="@scom/scom-page-builder/interface/index.ts" />
declare module "@scom/scom-page-builder/interface/index.ts" {
    import { IMenu, INetwork, IRoute, ITheme, ISCConfig, IBreakpoints } from "@scom/scom-page-builder/interface/core.ts";
    export { IMenu, INetwork, IRoute, ITheme, ISCConfig, IBreakpoints };
    export * from "@scom/scom-page-builder/interface/pageBlock.ts";
    export * from "@scom/scom-page-builder/interface/component.ts";
    export * from "@scom/scom-page-builder/interface/siteData.ts";
    export * from "@scom/scom-page-builder/interface/jsonSchema.ts";
    export enum ELEMENT_NAME {
        TEXTBOX = "Text box",
        IMAGE = "Image",
        NFT = "NFT Minter Dapp",
        GEM_TOKEN = "Gem Token Dapp",
        RANDOMIZER = "Randomizer",
        VIDEO = "Video",
        CAROUSEL = "Carousel",
        MAP = "Map",
        BANNER = "Banner",
        BLOG = "Blog"
    }
}
/// <amd-module name="@scom/scom-page-builder/command/interface.ts" />
declare module "@scom/scom-page-builder/command/interface.ts" {
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IDataColumn {
        column: number;
        columnSpan: number;
    }
    export const MAX_COLUMN = 12;
    export const MIN_COLUMN = 2;
}
/// <amd-module name="@scom/scom-page-builder/command/add.ts" />
declare module "@scom/scom-page-builder/command/add.ts" {
    import { Control } from "@ijstech/components";
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class ElementCommand implements ICommand {
        private element;
        private parent;
        private data;
        private rowId;
        private isDeleted;
        constructor(element: Control, parent: HTMLElement, data: any, isDeleted?: boolean);
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/updateColor.ts" />
declare module "@scom/scom-page-builder/command/updateColor.ts" {
    import { Control } from "@ijstech/components";
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class UpdateColorCommand implements ICommand {
        private element;
        private color;
        private oldColor;
        constructor(element: Control, color: string);
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/history.ts" />
declare module "@scom/scom-page-builder/command/history.ts" {
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class CommandHistory {
        private commands;
        private currentCommandIndex;
        execute(command: ICommand): void;
        undo(): void;
        redo(): void;
    }
    export const commandHistory: CommandHistory;
}
/// <amd-module name="@scom/scom-page-builder/command/moveRow.ts" />
declare module "@scom/scom-page-builder/command/moveRow.ts" {
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class MoveElementCommand implements ICommand {
        private element;
        private dropElm;
        private parent;
        private dataList;
        private dragIndex;
        private dropIndex;
        constructor(element: HTMLElement, dropElm: HTMLElement, parent: HTMLElement, data?: any[]);
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/resize.ts" />
declare module "@scom/scom-page-builder/command/resize.ts" {
    import { Control } from "@ijstech/components";
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class ResizeElementCommand implements ICommand {
        private element;
        private toolbar;
        private initialWidth;
        private initialHeight;
        private finalWidth;
        private finalHeight;
        private oldDataColumn;
        private gapWidth;
        private gridColumnWidth;
        private finalLeft;
        constructor(element: Control, initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number);
        private getColumnData;
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/dragElement.ts" />
declare module "@scom/scom-page-builder/command/dragElement.ts" {
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class DragElementCommand implements ICommand {
        private element;
        private dropElm;
        private oldDataColumn;
        private oldDataRow;
        private data;
        private oldDataColumnMap;
        constructor(element: any, dropElm: HTMLElement);
        private updateColumnData;
        private resetColumnData;
        private getColumn;
        private getColumnSpan;
        private getNextColumn;
        private getPrevColumn;
        private getColumnData;
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/removeToolbar.ts" />
declare module "@scom/scom-page-builder/command/removeToolbar.ts" {
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    export class RemoveToolbarCommand implements ICommand {
        private element;
        private pageRow;
        private data;
        private rowId;
        private elementId;
        private sectionId;
        private elementIndex;
        constructor(element: any);
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/updateType.ts" />
declare module "@scom/scom-page-builder/command/updateType.ts" {
    import { ICommand } from "@scom/scom-page-builder/command/interface.ts";
    import { Control } from "@ijstech/components";
    export class UpdateTypeCommand implements ICommand {
        private element;
        private dropElm;
        private oldDataRow;
        private data;
        private oldDropData;
        constructor(element: any, dropElm: Control);
        private getElements;
        execute(): void;
        undo(): void;
        redo(): void;
    }
}
/// <amd-module name="@scom/scom-page-builder/command/index.ts" />
declare module "@scom/scom-page-builder/command/index.ts" {
    export { ElementCommand } from "@scom/scom-page-builder/command/add.ts";
    export { UpdateColorCommand } from "@scom/scom-page-builder/command/updateColor.ts";
    export { CommandHistory, commandHistory } from "@scom/scom-page-builder/command/history.ts";
    export { MoveElementCommand } from "@scom/scom-page-builder/command/moveRow.ts";
    export { ResizeElementCommand } from "@scom/scom-page-builder/command/resize.ts";
    export { DragElementCommand } from "@scom/scom-page-builder/command/dragElement.ts";
    export { RemoveToolbarCommand } from "@scom/scom-page-builder/command/removeToolbar.ts";
    export { UpdateTypeCommand } from "@scom/scom-page-builder/command/updateType.ts";
    export { ICommand, IDataColumn, MAX_COLUMN } from "@scom/scom-page-builder/command/interface.ts";
}
/// <amd-module name="@scom/scom-page-builder/theme/light.theme.ts" />
declare module "@scom/scom-page-builder/theme/light.theme.ts" {
    import { Styles } from '@ijstech/components';
    const Theme: Styles.Theme.ITheme;
    export default Theme;
}
/// <amd-module name="@scom/scom-page-builder/theme/dark.theme.ts" />
declare module "@scom/scom-page-builder/theme/dark.theme.ts" {
    import { Styles } from '@ijstech/components';
    const Theme: Styles.Theme.ITheme;
    export default Theme;
}
/// <amd-module name="@scom/scom-page-builder/theme/index.ts" />
declare module "@scom/scom-page-builder/theme/index.ts" {
    import { Styles } from '@ijstech/components';
    import LightTheme from "@scom/scom-page-builder/theme/light.theme.ts";
    import DarkTheme from "@scom/scom-page-builder/theme/dark.theme.ts";
    const currentTheme: Styles.Theme.ITheme;
    export { currentTheme, LightTheme, DarkTheme };
}
/// <amd-module name="@scom/scom-page-builder/page/pageHeader.css.ts" />
declare module "@scom/scom-page-builder/page/pageHeader.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/page/pageHeader.tsx" />
declare module "@scom/scom-page-builder/page/pageHeader.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/page/pageHeader.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-header']: PageHeaderElement;
            }
        }
    }
    export interface PageHeaderElement extends ControlElement {
    }
    export class PageHeader extends Module {
        private iconList;
        private toolbars;
        private imgLogo;
        private _logo;
        constructor(parent?: any);
        initEventBus(): void;
        set logo(data: string);
        get logo(): string;
        hideLogo(hide?: boolean): void;
        private renderIconList;
        private renderDropdown;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/page/pageSection.css.ts" />
declare module "@scom/scom-page-builder/page/pageSection.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/dialogs/confirmDialog.tsx" />
declare module "@scom/scom-page-builder/dialogs/confirmDialog.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    export interface ConfirmDialogElement extends ControlElement {
        message: string;
        cancelButtonText?: string;
        confirmButtonText?: string;
        showCancelButton?: boolean;
        showConfirmButton?: boolean;
        onCancel?: () => Promise<void>;
        onConfirm?: () => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["scpage-confirm-dialog"]: ConfirmDialogElement;
            }
        }
    }
    export class ConfirmDialog extends Module {
        message: string;
        cancelButtonText: string;
        confirmButtonText: string;
        showCancelButton: boolean;
        showConfirmButton: boolean;
        onCancel: () => Promise<void>;
        onConfirm: () => Promise<void>;
        private dialog;
        private lbMessage;
        private btnCancel;
        private btnConfirm;
        constructor(parent?: Container, options?: any);
        init(): Promise<void>;
        confirm(): Promise<void>;
        cancel(): Promise<void>;
        show(): void;
        hide(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/dialogs/loadingDialog.css.ts" />
declare module "@scom/scom-page-builder/dialogs/loadingDialog.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/dialogs/loadingDialog.tsx" />
declare module "@scom/scom-page-builder/dialogs/loadingDialog.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/dialogs/loadingDialog.css.ts";
    export interface LoadingDialogElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scpage-loading-dialog']: LoadingDialogElement;
            }
        }
    }
    export class LoadingDialog extends Module {
        private lbMessage;
        private mdLoading;
        constructor(parent?: any, options?: any);
        init(): Promise<void>;
        show(): void;
        hide(): void;
        updateMessage(message: string): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts" />
declare module "@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx" />
declare module "@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts";
    export interface RowSettingsDialogElement extends ControlElement {
        onSave: () => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-row-settings-dialog']: RowSettingsDialogElement;
            }
        }
    }
    export class RowSettingsDialog extends Module {
        private dialog;
        private txtRowBackgroundColor;
        private onSave;
        constructor(parent?: any);
        show(): void;
        hide(): void;
        setConfig(config: string): void;
        getConfig(): any;
        confirm(): Promise<void>;
        cancel(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/dialogs/pageBlockSettingsDialog.tsx" />
declare module "@scom/scom-page-builder/dialogs/pageBlockSettingsDialog.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    export interface PageBlockSettingsDialogElement extends ControlElement {
        onSave: (data: any) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scpage-pageblock-settings-dialog']: PageBlockSettingsDialogElement;
            }
        }
    }
    export class PageBlockSettingsDialog extends Module {
        private dialog;
        private pnlConfig;
        private pnlEvents;
        private txtVisibleOn;
        private txtInvisibleOn;
        private form;
        private schema;
        private onSave;
        private configData;
        constructor(parent?: any, options?: any);
        init(): Promise<void>;
        show(data: {
            schema: any;
            configData: any;
            events: any[];
            visibleOn: string;
            invisibleOn: string;
        }): void;
        close(): void;
        handleSaveClick(): Promise<void>;
        getFormData(object: any, name: string): Promise<any>;
        reset(): void;
        renderForm(object: any, name: string, nameBuilder?: string, data?: any, required?: string[]): any;
        private convertFieldNameToLabel;
        render(): Promise<any>;
    }
}
/// <amd-module name="@scom/scom-page-builder/dialogs/index.ts" />
declare module "@scom/scom-page-builder/dialogs/index.ts" {
    import { ConfirmDialog } from "@scom/scom-page-builder/dialogs/confirmDialog.tsx";
    import { LoadingDialog } from "@scom/scom-page-builder/dialogs/loadingDialog.tsx";
    import { RowSettingsDialog } from "@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx";
    import { PageBlockSettingsDialog } from "@scom/scom-page-builder/dialogs/pageBlockSettingsDialog.tsx";
    export { ConfirmDialog, LoadingDialog, RowSettingsDialog, PageBlockSettingsDialog };
}
/// <amd-module name="@scom/scom-page-builder/common/toolbar.css.ts" />
declare module "@scom/scom-page-builder/common/toolbar.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/common/toolbar.tsx" />
declare module "@scom/scom-page-builder/common/toolbar.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IPageElement } from "@scom/scom-page-builder/interface/index.ts";
    import "@scom/scom-page-builder/common/toolbar.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-toolbar']: ToolbarElement;
            }
        }
    }
    export interface ToolbarElement extends ControlElement {
        readonly?: boolean;
    }
    export class IDEToolbar extends Module {
        private _toolList;
        private _readonly;
        private currentAction;
        private contentStack;
        private toolsStack;
        private toolbar;
        private _eResizer;
        private _wResizer;
        private _nResizer;
        private _neResizer;
        private _nwResizer;
        private _component;
        private dragStack;
        private pnlForm;
        private pnlFormMsg;
        private mdActions;
        private backdropStack;
        private _rowId;
        private _elementId;
        constructor(parent?: any);
        get data(): any;
        get module(): any;
        get toolList(): any[];
        set toolList(value: any[]);
        get rowId(): string;
        set rowId(value: string);
        get elementId(): string;
        set elementId(value: string);
        get readonly(): boolean;
        set readonly(value: boolean);
        private renderToolbars;
        private onShowModal;
        private onCloseModal;
        private renderToolbarAction;
        private onSave;
        private isTexbox;
        showToolbars(): void;
        hideToolbars(): void;
        private renderResizeStack;
        private renderResizer;
        fetchModule(data: IPageElement): Promise<void>;
        private setModule;
        private showToolList;
        setData(properties: any): Promise<void>;
        setTag(tag: any): Promise<void>;
        setProperties(data: any): Promise<void>;
        private checkToolbar;
        _handleClick(event: Event): boolean;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/common/dragger.tsx" />
declare module "@scom/scom-page-builder/common/dragger.tsx" {
    import { Control, Module } from '@ijstech/components';
    export class ContainerDragger<T extends Module> {
        private target;
        private stack;
        private pnlOverlay;
        private dragger;
        private currentPosition;
        private dataList;
        private isDragging;
        constructor(target: T, stack: Control, dragger?: Control, dataList?: any[]);
        private initDragEvent;
        private mouseDownHandler;
        private mouseUpHandler;
        private resetTarget;
        private updateTarget;
        private mouseMoveHandler;
    }
}
/// <amd-module name="@scom/scom-page-builder/common/collapse.css.ts" />
declare module "@scom/scom-page-builder/common/collapse.css.ts" {
    export const collapseStyle: string;
}
/// <amd-module name="@scom/scom-page-builder/common/collapse.tsx" />
declare module "@scom/scom-page-builder/common/collapse.tsx" {
    import { Container, ControlElement, Module } from "@ijstech/components";
    export interface CollapseElement extends ControlElement {
        title?: string;
        item?: Container;
        expanded?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-page-builder-collapse']: CollapseElement;
            }
        }
    }
    export class Collapse extends Module {
        private lblTitle;
        private iconCollapse;
        private pnlContent;
        private _expanded;
        constructor(parent?: Container, options?: any);
        get title(): string;
        set title(value: string);
        get item(): Container;
        set item(target: Container);
        get expanded(): boolean;
        set expanded(value: boolean);
        init(): void;
        onCollapse(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/common/index.ts" />
declare module "@scom/scom-page-builder/common/index.ts" {
    import { IDEToolbar } from "@scom/scom-page-builder/common/toolbar.tsx";
    import { ContainerDragger } from "@scom/scom-page-builder/common/dragger.tsx";
    import { Collapse } from "@scom/scom-page-builder/common/collapse.tsx";
    export { IDEToolbar, ContainerDragger, Collapse, };
}
/// <amd-module name="@scom/scom-page-builder/page/pageSection.tsx" />
declare module "@scom/scom-page-builder/page/pageSection.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/page/pageSection.css.ts";
    import { IPageElement } from "@scom/scom-page-builder/interface/index.ts";
    import { RowSettingsDialog } from "@scom/scom-page-builder/dialogs/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-section']: PageSectionElement;
            }
        }
    }
    export interface PageSectionElement extends ControlElement {
        readonly?: boolean;
        containerSize?: {
            width?: string;
            height?: string;
        };
    }
    export class PageSection extends Module {
        private pnlMain;
        private _readonly;
        private rowId;
        constructor(parent?: any);
        get readonly(): boolean;
        set readonly(value: boolean);
        get data(): any;
        init(): void;
        clear(): void;
        private createToolbar;
        private clearData;
        setData(rowId: string, value: IPageElement): Promise<void>;
        render(): any;
    }
    export { RowSettingsDialog };
}
/// <amd-module name="@scom/scom-page-builder/page/pageFooter.css.ts" />
declare module "@scom/scom-page-builder/page/pageFooter.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/page/pageFooter.tsx" />
declare module "@scom/scom-page-builder/page/pageFooter.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/page/pageFooter.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scpage-page-footer']: PageFooterElement;
            }
        }
    }
    export interface PageFooterElement extends ControlElement {
    }
    export class PageFooter extends Module {
        private _footer;
        private _sticky;
        private lbFooter;
        constructor(parent?: any);
        init(): Promise<void>;
        get footer(): string;
        set footer(value: string);
        get sticky(): boolean;
        set sticky(value: boolean);
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/page/pageRow.css.ts" />
declare module "@scom/scom-page-builder/page/pageRow.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/page/pageRow.tsx" />
declare module "@scom/scom-page-builder/page/pageRow.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import "@scom/scom-page-builder/page/pageRow.css.ts";
    import { IPageSection } from "@scom/scom-page-builder/interface/index.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-row']: PageRowElement;
            }
        }
    }
    export interface PageRowElement extends ControlElement {
        readonly?: boolean;
    }
    export class PageRow extends Module {
        private actionsBar;
        private dragStack;
        private pnlRow;
        private mdRowSetting;
        private _readonly;
        private isResizing;
        private currentWidth;
        private currentHeight;
        private currentElement;
        private rowId;
        private rowData;
        private isCloned;
        private isChanged;
        constructor(parent?: any);
        get data(): any;
        init(): void;
        private createNewElement;
        private clearData;
        setData(rowData: IPageSection): Promise<void>;
        private onOpenRowSettingsDialog;
        private onSaveRowSettings;
        private onClone;
        onDeleteRow(): void;
        onMoveUp(): void;
        onMoveDown(): void;
        private renderFixedGrid;
        private initEventListeners;
        private setActive;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/page/pageRows.css.ts" />
declare module "@scom/scom-page-builder/page/pageRows.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/page/pageRows.tsx" />
declare module "@scom/scom-page-builder/page/pageRows.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IPageSection } from "@scom/scom-page-builder/interface/index.ts";
    import { PageSection } from "@scom/scom-page-builder/page/pageSection.tsx";
    import { PageRow } from "@scom/scom-page-builder/page/pageRow.tsx";
    import { PageFooter } from "@scom/scom-page-builder/page/pageFooter.tsx";
    import "@scom/scom-page-builder/page/pageRows.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-rows']: PageRowsElement;
            }
        }
    }
    export interface PageRowsElement extends ControlElement {
        readonly?: boolean;
        draggable?: boolean;
    }
    export class PageRows extends Module {
        private pnlRows;
        private pageFooter;
        private currentRow;
        private pnlRowOverlay;
        private currentPosition;
        private _readonly;
        private _draggable;
        private isDragging;
        constructor(parent?: any);
        initEventBus(): void;
        _handleClick(event: Event): boolean;
        init(): void;
        get draggable(): boolean;
        set draggable(value: boolean);
        private handleDrag;
        private initDragEvent;
        private mouseDownHandler;
        private mouseUpHandler;
        private resetCurrentRow;
        private updateCurrentRow;
        private onMoveHandler;
        getRows(): Promise<IPageSection[]>;
        setRows(rows: IPageSection[]): Promise<void>;
        renderRows(): Promise<void>;
        appendRow(rowData: IPageSection): Promise<PageRow>;
        onClone(data: {
            rowData: IPageSection;
            id: string;
        }): Promise<void>;
        clearRows(): void;
        set footerVisible(value: boolean);
        set footerSticky(value: boolean);
        set footerCopyright(value: string);
        render(): any;
    }
    export { PageSection, PageFooter };
}
/// <amd-module name="@scom/scom-page-builder/page/pageSidebar.css.ts" />
declare module "@scom/scom-page-builder/page/pageSidebar.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/page/pageSidebar.tsx" />
declare module "@scom/scom-page-builder/page/pageSidebar.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IPageBlockData } from "@scom/scom-page-builder/interface/index.ts";
    import "@scom/scom-page-builder/page/pageSidebar.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['ide-sidebar']: PageSidebarElement;
            }
        }
    }
    export interface PageSidebarElement extends ControlElement {
        onSelectModule?: (selectedModule: IPageBlockData) => Promise<void>;
    }
    export class PageSidebar extends Module {
        private microDAppsStack;
        private componentsStack;
        private onSelectModule;
        private pageBlocks;
        constructor(parent?: any);
        init(): void;
        private renderUI;
        getPageBlocks(): Promise<IPageBlockData[]>;
        private onAddComponent;
        private renderComponentList;
        private renderMircoDAppList;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/page/index.ts" />
declare module "@scom/scom-page-builder/page/index.ts" {
    import { PageHeader } from "@scom/scom-page-builder/page/pageHeader.tsx";
    import { PageSection } from "@scom/scom-page-builder/page/pageSection.tsx";
    import { PageFooter } from "@scom/scom-page-builder/page/pageFooter.tsx";
    import { PageRows } from "@scom/scom-page-builder/page/pageRows.tsx";
    import { PageRow } from "@scom/scom-page-builder/page/pageRow.tsx";
    import { PageSidebar } from "@scom/scom-page-builder/page/pageSidebar.tsx";
    export { PageHeader, PageSection, PageFooter, PageRows, PageRow, PageSidebar };
}
/// <amd-module name="@scom/scom-page-builder/builder/builderHeader.css.ts" />
declare module "@scom/scom-page-builder/builder/builderHeader.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/builder/builderHeader.tsx" />
declare module "@scom/scom-page-builder/builder/builderHeader.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IPageHeader } from "@scom/scom-page-builder/interface/index.ts";
    import "@scom/scom-page-builder/builder/builderHeader.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['builder-header']: HeaderElement;
            }
        }
    }
    export interface HeaderElement extends ControlElement {
        readonly?: boolean;
    }
    export class BuilderHeader extends Module {
        private pnlHeader;
        private pnlHeaderMain;
        private pnlTitle;
        private pnlConfig;
        private pnlHeaderType;
        private pnlHeaderTypeMain;
        private btnAddLogo;
        private pnlLogo;
        private mdUpload;
        private uploader;
        private nameInput;
        private btnChangeImg;
        private _readonly;
        private _isUpdatingBg;
        private showAddStack;
        constructor(parent?: any);
        initEventBus(): void;
        setData(value: IPageHeader): Promise<void>;
        private get _elements();
        private get _image();
        private get _headerType();
        private updateHeader;
        private addHeader;
        private onShowUpload;
        private onChangedBg;
        private onToggleType;
        private onUpdateImage;
        private onActiveType;
        private updateHeaderType;
        private renderHeaderType;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/builder/builderFooter.css.ts" />
declare module "@scom/scom-page-builder/builder/builderFooter.css.ts" { }
/// <amd-module name="@scom/scom-page-builder/builder/builderFooter.tsx" />
declare module "@scom/scom-page-builder/builder/builderFooter.tsx" {
    import { Module, ControlElement } from '@ijstech/components';
    import { IPageFooter } from "@scom/scom-page-builder/interface/index.ts";
    import "@scom/scom-page-builder/builder/builderFooter.css.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['builder-footer']: FooterElement;
            }
        }
    }
    export interface FooterElement extends ControlElement {
        readonly?: boolean;
    }
    export class BuilderFooter extends Module {
        private pnlFooter;
        private pnlFooterMain;
        private pnlEditOverlay;
        private pnlOverlay;
        private pnlConfig;
        private mdUpload;
        private uploader;
        private _readonly;
        private showAddStack;
        constructor(parent?: any);
        initEventBus(): void;
        setData(value: IPageFooter): Promise<void>;
        private get _elements();
        private get _image();
        private updateFooter;
        private addFooter;
        private updateOverlay;
        onChangedBg(): void;
        private onUpdateImage;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-page-builder/builder/index.ts" />
declare module "@scom/scom-page-builder/builder/index.ts" {
    export { BuilderHeader } from "@scom/scom-page-builder/builder/builderHeader.tsx";
    export { BuilderFooter } from "@scom/scom-page-builder/builder/builderFooter.tsx";
}
/// <amd-module name="@scom/scom-page-builder/index.css.ts" />
declare module "@scom/scom-page-builder/index.css.ts" { }
/// <amd-module name="@scom/scom-page-builder" />
declare module "@scom/scom-page-builder" {
    import { Container, ControlElement, Module } from '@ijstech/components';
    import { IPageData } from "@scom/scom-page-builder/interface/index.ts";
    import "@scom/scom-page-builder/index.css.ts";
    interface PageBuilderElement extends ControlElement {
        rootDir?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-page-builder']: PageBuilderElement;
            }
        }
    }
    export default class Editor extends Module {
        private pageRows;
        private builderFooter;
        private contentWrapper;
        constructor(parent?: Container, options?: any);
        init(): void;
        setRootDir(value: string): void;
        getData(): {
            sections: import("@scom/scom-page-builder/interface/siteData.ts").IPageSection[];
            footer: import("@scom/scom-page-builder/interface/siteData.ts").IPageFooter;
        };
        setData(value: IPageData): Promise<void>;
        initEventBus(): void;
        private onAddRow;
        private onUpdateWrapper;
        render(): any;
    }
}
