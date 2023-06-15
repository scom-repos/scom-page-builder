var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-page-builder/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_1.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        icons: {
            logo: fullPath('img/sc-logo.png'),
            logoMobile: fullPath('img/sc-logo-mobile.svg'),
            validocs: fullPath('img/validocs.svg')
        },
        img: {
            network: {
                bsc: fullPath('img/network/bsc.svg'),
                eth: fullPath('img/network/eth.svg'),
                amio: fullPath('img/network/amio.svg'),
                avax: fullPath('img/network/avax.svg'),
                ftm: fullPath('img/network/ftm.svg'),
                polygon: fullPath('img/network/polygon.svg'),
            },
            wallet: {
                metamask: fullPath('img/wallet/metamask.png'),
                trustwallet: fullPath('img/wallet/trustwallet.svg'),
                binanceChainWallet: fullPath('img/wallet/binance-chain-wallet.svg'),
                walletconnect: fullPath('img/wallet/walletconnect.svg')
            }
        },
        fullPath
    };
});
define("@scom/scom-page-builder/const/textbox.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textStyles = void 0;
    ///<amd-module name='@scom/scom-page-builder/const/textbox.ts'/> 
    exports.textStyles = [
        {
            title: 'Normal Text'
        },
        {
            title: 'Title'
        },
        {
            title: 'Heading'
        },
        {
            title: 'Subheading'
        },
        {
            title: 'Small Text'
        }
    ];
});
define("@scom/scom-page-builder/const/index.ts", ["require", "exports", "@scom/scom-page-builder/const/textbox.ts"], function (require, exports, textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IPFS_GATEWAY = exports.IPFS_GATEWAY_IJS = exports.IPFS_UPLOAD_END_POINT = exports.DEFAULT_FOOTER_HEIGHT = exports.DEFAULT_SIDEBAR_MENU_WIDTH = exports.DEFAULT_SCROLLBAR_WIDTH = exports.DEFAULT_BOXED_LAYOUT_WIDTH = exports.EVENT = void 0;
    ///<amd-module name='@scom/scom-page-builder/const/index.ts'/> 
    exports.EVENT = {
        ON_LOAD: 'ON_LOAD',
        ON_SAVE: 'ON_SAVE',
        ON_CONFIG_SAVE: 'ON_CONFIG_SAVE',
        ON_CONFIG_CHANGE: 'ON_CONFIG_CHANGE',
        ON_PAGING_UPDATE: 'ON_PAGING_UPDATE',
        ON_SWITCH_PAGE: 'ON_SWITCH_PAGE',
        ON_TOGGLE_PAGE_VISIBILITY: 'ON_TOGGLE_PAGE_VISIBILITY',
        ON_UPDATE_SECTIONS: 'ON_UPDATE_SECTIONS',
        ON_HASH_CHANGE: 'ON_HASH_CHANGE',
        ON_PREVIEW: 'ON_PREVIEW',
        ON_ADD_ELEMENT: 'ON_ADD_ELEMENT',
        ON_CLONE: 'ON_CLONE',
        ON_RESIZE: 'ON_RESIZE',
        ON_UPDATE_FOOTER: 'ON_UPDATE_FOOTER',
        // Content-Block
        ON_UPDATE_TOOLBAR: 'ON_UPDATE_TOOLBAR',
        ON_SET_ACTION_BLOCK: 'ON_SET_ACTION_BLOCK',
        ON_SET_DRAG_ELEMENT: 'ON_SET_DRAG_ELEMENT',
        ON_ADD_SECTION: 'ON_ADD_SECTION',
        ON_TOGGLE_SEARCH_MODAL: 'ON_TOGGLE_SEARCH_MODAL',
        ON_FETCH_COMPONENTS: 'ON_FETCH_COMPONENTS',
        ON_UPDATE_SIDEBAR: 'ON_UPDATE_SIDEBAR'
    };
    exports.DEFAULT_BOXED_LAYOUT_WIDTH = '1200px';
    exports.DEFAULT_SCROLLBAR_WIDTH = 17;
    exports.DEFAULT_SIDEBAR_MENU_WIDTH = 350;
    exports.DEFAULT_FOOTER_HEIGHT = 50;
    exports.IPFS_UPLOAD_END_POINT = 'https://ipfs-gateway.scom.dev/api/1.0/sync/data';
    exports.IPFS_GATEWAY_IJS = 'https://ipfs.scom.dev/ipfs/';
    exports.IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
    __exportStar(textbox_1, exports);
});
define("@scom/scom-page-builder/store/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCategories = exports.getCategories = exports.getSearchOptions = exports.setSearchOptions = exports.getSearchData = exports.setSearchData = exports.getDragData = exports.setDragData = exports.getRootDir = exports.setRootDir = exports.addPageBlock = exports.getPageBlocks = exports.setPageBlocks = exports.state = exports.pageObject = exports.PageObject = void 0;
    const MAX_COLUMN = 12;
    class PageObject {
        constructor() {
            this._header = {
                headerType: 'banner',
                image: "",
                elements: []
            };
            this._sections = []; // Map<string, IPageSection> = new Map();
            this._footer = {
                image: "",
                elements: []
            };
        }
        set header(value) {
            this._header = value;
        }
        get header() {
            return this._header;
        }
        set sections(value) {
            this._sections = value || [];
        }
        get sections() {
            return this._sections || [];
        }
        set footer(value) {
            this._footer = value;
        }
        get footer() {
            return this._footer;
        }
        addSection(value, index) {
            if (typeof index === 'number' && index >= 0)
                this._sections.splice(index, 0, value);
            else
                this._sections.push(value);
        }
        removeSection(id) {
            const sectionIndex = this._sections.findIndex(section => section.id === id);
            if (sectionIndex !== -1)
                this._sections.splice(sectionIndex, 1);
        }
        getSection(id) {
            return this._sections.find(section => section.id === id);
        }
        updateSection(id, data) {
            var _a;
            const section = this.getRow(id);
            if (section) {
                const { backgroundColor, config } = data;
                if (backgroundColor !== undefined)
                    section.backgroundColor = backgroundColor;
                if (config !== undefined) {
                    const oldColumnsNumber = this.getColumnsNumber(id);
                    const elements = ((_a = this.getRow(id)) === null || _a === void 0 ? void 0 : _a.elements) || [];
                    section.config = data.config;
                    const newColumnsNumber = this.getColumnsNumberFn(section);
                    if (oldColumnsNumber !== newColumnsNumber) {
                        for (let element of elements) {
                            const oldColumnSpan = element.columnSpan;
                            const oldColumn = element.column;
                            const newColumnSpan = Math.floor(newColumnsNumber / oldColumnsNumber * oldColumnSpan);
                            const newColumn = Math.ceil(newColumnsNumber / oldColumnsNumber * oldColumn);
                            this.setElement(id, element.id, { column: newColumn, columnSpan: newColumnSpan });
                        }
                    }
                }
            }
        }
        getRow(rowId) {
            if (rowId === 'header')
                return this.header;
            if (rowId === 'footer')
                return this.footer;
            return rowId ? this.getSection(rowId) : null;
        }
        removeRow(id) {
            if (id === 'header')
                this._header.elements = [];
            else if (id === 'footer')
                this._footer.elements = [];
            else
                this.removeSection(id);
        }
        addRow(data, id, index) {
            if (id === 'header')
                this.header = data;
            else if (id === 'footer')
                this.footer = data;
            else
                this.addSection(data, index);
        }
        findElement(elements, elementId) {
            if (!elements || !elements.length)
                return null;
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element && element.id === elementId) {
                    return element;
                }
                else if (element && element.type === 'composite') {
                    const elm = this.findElement(element.elements, elementId);
                    if (elm)
                        return elm;
                }
            }
            return null;
        }
        getElement(sectionId, elementId) {
            var _a, _b;
            if (sectionId === 'header') {
                const elements = ((_a = exports.pageObject.header) === null || _a === void 0 ? void 0 : _a.elements) || [];
                return elements[0] || null;
            }
            if (sectionId === 'footer') {
                const elements = ((_b = exports.pageObject.footer) === null || _b === void 0 ? void 0 : _b.elements) || [];
                return elements[0] || null;
            }
            const section = this.getSection(sectionId);
            if (!section)
                return null;
            const elm = this.findElement(section.elements, elementId);
            return elm;
        }
        setElement(sectionId, elementId, value) {
            var _a;
            let elm = this.getElement(sectionId, elementId);
            if (!elm)
                return;
            console.log('set elm', sectionId, elementId, value);
            if (value.properties !== undefined)
                elm.properties = value.properties;
            if (value.columnSpan !== undefined && value.columnSpan !== elm.columnSpan)
                elm.columnSpan = value.columnSpan;
            if (value.tag !== undefined)
                elm.tag = value.tag;
            if (value.type !== undefined && elm.type !== value.type) {
                if (value.dropId)
                    this.removeElement(sectionId, value.dropId);
                if (value.type === 'primitive') {
                    elm.type = value.type;
                    elm.module = ((_a = value.elements) === null || _a === void 0 ? void 0 : _a[0]) || {};
                    elm.elements = [];
                }
                else if (value.type === 'composite') {
                    const oldValue = JSON.parse(JSON.stringify(elm));
                    oldValue.id = generateUUID();
                    elm.elements = [oldValue];
                    elm.module = {};
                    elm.type = value.type;
                }
            }
            if (value.module !== undefined)
                elm.module = value.module;
            if (value.elements !== undefined)
                elm.elements = value.elements;
            if (value.column !== undefined && value.column !== elm.column) {
                elm.column = value.column;
                if (elm.type === 'primitive') {
                    const section = this.getRow(sectionId);
                    if (section === null || section === void 0 ? void 0 : section.elements)
                        section.elements = this.sortFn([...section.elements]);
                }
            }
        }
        sortFn(elements) {
            return [...elements].sort((a, b) => Number(a.column) - Number(b.column));
        }
        removeElementFn(elements, elementId) {
            if (!elements || !elements.length)
                return;
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element && element.id === elementId) {
                    elements.splice(i, 1);
                    break;
                }
                else if (element && element.type === 'composite') {
                    this.removeElementFn(element.elements, elementId);
                }
            }
        }
        removeElement(sectionId, elementId) {
            let elements = [];
            if (sectionId === 'header') {
                elements = this._header.elements;
            }
            else if (sectionId === 'footer') {
                elements = this._footer.elements;
            }
            else {
                const section = this.getSection(sectionId);
                elements = (section === null || section === void 0 ? void 0 : section.elements) || [];
            }
            this.removeElementFn(elements, elementId);
        }
        addElement(sectionId, value, parentElmId = '', elementIndex) {
            if (sectionId === 'header') {
                this._header.elements.push(value);
            }
            else if (sectionId === 'footer') {
                this._footer.elements.push(value);
            }
            else {
                const section = this.getSection(sectionId);
                if (!section)
                    return;
                if (!parentElmId || parentElmId === value.id) {
                    section.elements.push(value);
                    section.elements = this.sortFn([...section.elements]);
                }
                else {
                    const parentElement = section.elements.find(elm => elm.id === parentElmId);
                    if (parentElement) {
                        if (typeof elementIndex === 'number' && elementIndex !== -1)
                            parentElement.elements.splice(elementIndex, 0, value);
                        else
                            parentElement.elements.push(value);
                    }
                }
            }
        }
        getConfig(sectionId) {
            const section = this.getRow(sectionId);
            return (section === null || section === void 0 ? void 0 : section.config) || {};
        }
        getColumnsNumber(sectionId) {
            if (!sectionId)
                return MAX_COLUMN;
            const section = this.getRow(sectionId);
            return this.getColumnsNumberFn(section);
        }
        getColumnsNumberFn(section) {
            if (!section)
                return MAX_COLUMN;
            const { columnsNumber, columnLayout } = (section === null || section === void 0 ? void 0 : section.config) || {};
            return (columnLayout === 'Fixed' && columnsNumber) ? columnsNumber : MAX_COLUMN;
        }
    }
    exports.PageObject = PageObject;
    exports.pageObject = new PageObject();
    const defaultSearchOptions = {
        category: undefined,
        pageNumber: undefined,
        pageSize: undefined
    };
    exports.state = {
        pageBlocks: [],
        rootDir: '',
        dragData: null,
        searchData: {
            items: [],
            total: 0
        },
        searchOptions: defaultSearchOptions,
        categories: [
            {
                id: 'composables',
                title: 'Composables',
            },
            {
                id: 'micro-dapps',
                title: 'MicroDApps'
            },
            {
                id: 'charts',
                title: 'Charts'
            },
            {
                id: 'project-micro-dapps',
                title: 'Project MicroDApps'
            }
        ]
    };
    const setPageBlocks = (value) => {
        exports.state.pageBlocks = value || [];
    };
    exports.setPageBlocks = setPageBlocks;
    const getPageBlocks = () => {
        return exports.state.pageBlocks || [];
    };
    exports.getPageBlocks = getPageBlocks;
    const addPageBlock = (value) => {
        const hasPageblock = exports.state.pageBlocks.find(item => item.path === value.path);
        if (!hasPageblock)
            exports.state.pageBlocks.push(value);
    };
    exports.addPageBlock = addPageBlock;
    const setRootDir = (value) => {
        exports.state.rootDir = value || '';
    };
    exports.setRootDir = setRootDir;
    const getRootDir = () => {
        return exports.state.rootDir;
    };
    exports.getRootDir = getRootDir;
    const setDragData = (value) => {
        exports.state.dragData = value;
    };
    exports.setDragData = setDragData;
    const getDragData = () => {
        return exports.state.dragData || null;
    };
    exports.getDragData = getDragData;
    const setSearchData = (value) => {
        exports.state.searchData = value;
    };
    exports.setSearchData = setSearchData;
    const getSearchData = () => {
        return exports.state.searchData || {};
    };
    exports.getSearchData = getSearchData;
    const setSearchOptions = (value) => {
        exports.state.searchOptions = value || defaultSearchOptions;
    };
    exports.setSearchOptions = setSearchOptions;
    const getSearchOptions = () => {
        return exports.state.searchOptions || defaultSearchOptions;
    };
    exports.getSearchOptions = getSearchOptions;
    const getCategories = () => {
        return exports.state.categories || [];
    };
    exports.getCategories = getCategories;
    const setCategories = (value) => {
        exports.state.categories = value || [];
    };
    exports.setCategories = setCategories;
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
});
///<amd-module name='@scom/scom-page-builder/utility/pathToRegexp.ts'/> 
/*---------------------------------------------------------------------------------------------
  *  Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)
  *  Licensed under the MIT License.
  *  https://github.com/pillarjs/path-to-regexp/blob/1cbb9f3d9c3bff97298ec45b1bb2b0beb879babf/LICENSE
  *--------------------------------------------------------------------------------------------*/
define("@scom/scom-page-builder/utility/pathToRegexp.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pathToRegexp = exports.tokensToRegexp = exports.regexpToFunction = exports.match = exports.tokensToFunction = exports.compile = exports.parse = void 0;
    /**
     * Tokenize input string.
     */
    function lexer(str) {
        const tokens = [];
        let i = 0;
        while (i < str.length) {
            const char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                let name = "";
                let j = i + 1;
                while (j < str.length) {
                    const code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError(`Missing parameter name at ${i}`);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                let count = 1;
                let pattern = "";
                let j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError(`Pattern cannot start with "?" at ${j}`);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError(`Capturing groups are not allowed at ${j}`);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError(`Unbalanced pattern at ${i}`);
                if (!pattern)
                    throw new TypeError(`Missing pattern at ${i}`);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options = {}) {
        const tokens = lexer(str);
        const { prefixes = "./" } = options;
        const defaultPattern = `[^${escapeString(options.delimiter || "/#?")}]+?`;
        const result = [];
        let key = 0;
        let i = 0;
        let path = "";
        const tryConsume = (type) => {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        const mustConsume = (type) => {
            const value = tryConsume(type);
            if (value !== undefined)
                return value;
            const { type: nextType, index } = tokens[i];
            throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
        };
        const consumeText = () => {
            let result = "";
            let value;
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            const char = tryConsume("CHAR");
            const name = tryConsume("NAME");
            const pattern = tryConsume("PATTERN");
            if (name || pattern) {
                let prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            const value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            const open = tryConsume("OPEN");
            if (open) {
                const prefix = consumeText();
                const name = tryConsume("NAME") || "";
                const pattern = tryConsume("PATTERN") || "";
                const suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name || (pattern ? key++ : ""),
                    pattern: name && !pattern ? defaultPattern : pattern,
                    prefix,
                    suffix,
                    modifier: tryConsume("MODIFIER") || "",
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    exports.parse = parse;
    /**
     * Compile a string to a template function for the path.
     */
    function compile(str, options) {
        return tokensToFunction(parse(str, options), options);
    }
    exports.compile = compile;
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens, options = {}) {
        const reFlags = flags(options);
        const { encode = (x) => x, validate = true } = options;
        // Compile all the tokens into regexps.
        const matches = tokens.map((token) => {
            if (typeof token === "object") {
                return new RegExp(`^(?:${token.pattern})$`, reFlags);
            }
        });
        return (data) => {
            let path = "";
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                const value = data ? data[token.name] : undefined;
                const optional = token.modifier === "?" || token.modifier === "*";
                const repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                    }
                    if (value.length === 0) {
                        if (optional)
                            continue;
                        throw new TypeError(`Expected "${token.name}" to not be empty`);
                    }
                    for (let j = 0; j < value.length; j++) {
                        const segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    const segment = encode(String(value), token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                    }
                    path += token.prefix + segment + token.suffix;
                    continue;
                }
                if (optional)
                    continue;
                const typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
            }
            return path;
        };
    }
    exports.tokensToFunction = tokensToFunction;
    /**
     * Create path match function from `path-to-regexp` spec.
     */
    function match(str, options) {
        const keys = [];
        const re = pathToRegexp(str, keys, options);
        return regexpToFunction(re, keys, options);
    }
    exports.match = match;
    /**
     * Create a path match function from `path-to-regexp` output.
     */
    function regexpToFunction(re, keys, options = {}) {
        const { decode = (x) => x } = options;
        return function (pathname) {
            const m = re.exec(pathname);
            if (!m)
                return false;
            const { 0: path, index } = m;
            const params = Object.create(null);
            for (let i = 1; i < m.length; i++) {
                if (m[i] === undefined)
                    continue;
                const key = keys[i - 1];
                if (key.modifier === "*" || key.modifier === "+") {
                    params[key.name] = m[i].split(key.prefix + key.suffix).map((value) => {
                        return decode(value, key);
                    });
                }
                else {
                    params[key.name] = decode(m[i], key);
                }
            }
            return { path, index, params };
        };
    }
    exports.regexpToFunction = regexpToFunction;
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        const groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        let index = 0;
        let execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                // Use parenthesized substring match if available, index otherwise
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: "",
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        const parts = paths.map((path) => pathToRegexp(path, keys, options).source);
        return new RegExp(`(?:${parts.join("|")})`, flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options = {}) {
        const { strict = false, start = true, end = true, encode = (x) => x, delimiter = "/#?", endsWith = "", } = options;
        const endsWithRe = `[${escapeString(endsWith)}]|$`;
        const delimiterRe = `[${escapeString(delimiter)}]`;
        let route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (const token of tokens) {
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                const prefix = escapeString(encode(token.prefix));
                const suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            const mod = token.modifier === "*" ? "?" : "";
                            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
                        }
                        else {
                            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                        }
                    }
                    else {
                        if (token.modifier === "+" || token.modifier === "*") {
                            route += `((?:${token.pattern})${token.modifier})`;
                        }
                        else {
                            route += `(${token.pattern})${token.modifier}`;
                        }
                    }
                }
                else {
                    route += `(?:${prefix}${suffix})${token.modifier}`;
                }
            }
        }
        if (end) {
            if (!strict)
                route += `${delimiterRe}?`;
            route += !options.endsWith ? "$" : `(?=${endsWithRe})`;
        }
        else {
            const endToken = tokens[tokens.length - 1];
            const isEndDelimited = typeof endToken === "string"
                ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1
                : endToken === undefined;
            if (!strict) {
                route += `(?:${delimiterRe}(?=${endsWithRe}))?`;
            }
            if (!isEndDelimited) {
                route += `(?=${delimiterRe}|${endsWithRe})`;
            }
        }
        return new RegExp(route, flags(options));
    }
    exports.tokensToRegexp = tokensToRegexp;
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }
    exports.pathToRegexp = pathToRegexp;
});
define("@scom/scom-page-builder/utility/index.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/utility/pathToRegexp.ts"], function (require, exports, components_2, eth_wallet_1, index_1, index_2, pathToRegexp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEmbedElement = exports.isEmpty = exports.generateUUID = exports.updatePagePath = exports.getPagePath = exports.getCID = exports.isCID = exports.formatNumberWithSeparators = exports.formatNumber = exports.compile = exports.match = exports.fetchFromIPFS = exports.uploadToIPFS = exports.assignAttr = void 0;
    Object.defineProperty(exports, "match", { enumerable: true, get: function () { return pathToRegexp_1.match; } });
    Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return pathToRegexp_1.compile; } });
    const assignAttr = (module) => {
        const attrs = module.attrs;
        for (let attr in attrs) {
            if (attr === 'id' || typeof attrs[attr] === 'function')
                continue;
            module[attr] = module.getAttribute(attr, true);
        }
    };
    exports.assignAttr = assignAttr;
    const uploadToIPFS = (data) => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(index_2.IPFS_UPLOAD_END_POINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data,
                    fileName: `${+new Date().toString()}.json`
                })
            });
            let result = await response.json();
            if (result.success) {
                resolve(result.data.cid);
            }
            else
                reject();
        });
    };
    exports.uploadToIPFS = uploadToIPFS;
    const fetchFromIPFS = (cid) => {
        return new Promise(async (resolve, reject) => {
            let response;
            try {
                response = await fetch(index_2.IPFS_GATEWAY_IJS + cid);
            }
            catch (err) {
                response = await fetch(index_2.IPFS_GATEWAY + cid);
            }
            resolve(response);
        });
    };
    exports.fetchFromIPFS = fetchFromIPFS;
    const formatNumber = (value, decimals) => {
        let val = value;
        const minValue = '0.0000001';
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_1.BigNumber(val).lt(minValue)) {
            return `<${minValue}`;
        }
        return formatNumberWithSeparators(val, decimals || 4);
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substr(0, 18) + '...';
            }
            return outputStr;
            // let parts = parseFloat(value.toPrecision(precision)).toString().split(".");
            // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // return parts.join(".");
        }
        else {
            return value.toLocaleString('en-US');
            // let parts = value.toString().split(".");
            // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // return parts.join(".");
        }
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    const isCID = (cid) => {
        const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
        return regex.test(cid);
    };
    exports.isCID = isCID;
    const getCID = () => {
        if (!location.hash)
            return '';
        const segments = location.hash.split('/');
        for (const segment of segments) {
            if (isCID(segment)) {
                return segment;
            }
        }
        return '';
    };
    exports.getCID = getCID;
    const getPagePath = (path) => {
        let p = path;
        if (!p)
            p = location.hash;
        if (!p)
            return '';
        const segments = p.split('/');
        let firstEditAppeared = false;
        let paths = [];
        for (const segment of segments) {
            if (segment === '#')
                continue;
            if (!firstEditAppeared && segment === 'edit') {
                firstEditAppeared = true;
                continue;
            }
            if (isCID(segment)) {
                paths = [];
                continue;
            }
            paths.push(segment);
        }
        return paths.join('/');
    };
    exports.getPagePath = getPagePath;
    const updatePagePath = (pagePath) => {
        if (!pagePath || !location.hash)
            return;
        const cid = getCID();
        const isEdit = location.hash.indexOf('#/edit') >= 0;
        location.hash = `#/${isEdit ? 'edit/' : ''}${cid ? `${cid}/` : ''}${pagePath}`;
    };
    exports.updatePagePath = updatePagePath;
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    exports.generateUUID = generateUUID;
    const isEmpty = (value) => {
        if (value === null || value === undefined || value === false || (typeof value === 'string' && !value))
            return true;
        if (value && typeof value === 'object')
            return Object.keys(value).length === 0;
        return false;
    };
    exports.isEmpty = isEmpty;
    const getSCConfigByCid = async (cid) => {
        let scConfig;
        let result = await fetchFromIPFS(cid);
        let codeInfoFileContent = await result.json();
        let ipfsCid = codeInfoFileContent.codeCID;
        if (ipfsCid) {
            try {
                let scConfigRes = await fetchFromIPFS(`${ipfsCid}/dist/scconfig.json`);
                scConfig = await scConfigRes.json();
            }
            catch (err) { }
        }
        return scConfig;
    };
    const getEmbedElement = async (path) => {
        const rootDir = (0, index_1.getRootDir)();
        let modulePath = rootDir ? `${rootDir}/libs/@scom/${path}` : `libs/@scom/${path}`;
        components_2.application.currentModuleDir = modulePath;
        const result = await components_2.application.loadScript(`${modulePath}/index.js`);
        components_2.application.currentModuleDir = '';
        if (!result)
            return null;
        const elementName = `i-${path.split('/').pop()}`;
        const element = document.createElement(elementName);
        element.setAttribute('lazyLoad', 'true');
        return element;
    };
    exports.getEmbedElement = getEmbedElement;
});
define("@scom/scom-page-builder/interface/core.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    ;
    ;
});
define("@scom/scom-page-builder/interface/pageBlock.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-page-builder/interface/siteData.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IColumnLayoutType = exports.ElementType = exports.HeaderType = void 0;
    var HeaderType;
    (function (HeaderType) {
        HeaderType["COVER"] = "cover";
        HeaderType["LARGE"] = "largeBanner";
        HeaderType["NORMAL"] = "banner";
        HeaderType["TITLE"] = "titleOnly";
    })(HeaderType = exports.HeaderType || (exports.HeaderType = {}));
    ;
    var ElementType;
    (function (ElementType) {
        ElementType["PRIMITIVE"] = "primitive";
        ElementType["COMPOSITE"] = "composite";
    })(ElementType = exports.ElementType || (exports.ElementType = {}));
    var IColumnLayoutType;
    (function (IColumnLayoutType) {
        IColumnLayoutType["FIXED"] = "Fixed";
        IColumnLayoutType["AUTOMATIC"] = "Automatic";
    })(IColumnLayoutType = exports.IColumnLayoutType || (exports.IColumnLayoutType = {}));
});
define("@scom/scom-page-builder/interface/jsonSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-page-builder/interface/index.ts", ["require", "exports", "@scom/scom-page-builder/interface/pageBlock.ts", "@scom/scom-page-builder/interface/siteData.ts", "@scom/scom-page-builder/interface/jsonSchema.ts"], function (require, exports, pageBlock_1, siteData_1, jsonSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PAGE_SIZE = exports.MIN_COLUMN = exports.MAX_COLUMN = exports.GAP_WIDTH = exports.TEXTBOX_PATH = exports.ELEMENT_NAME = void 0;
    __exportStar(pageBlock_1, exports);
    __exportStar(siteData_1, exports);
    __exportStar(jsonSchema_1, exports);
    var ELEMENT_NAME;
    (function (ELEMENT_NAME) {
        ELEMENT_NAME["TEXTBOX"] = "Text Box";
        ELEMENT_NAME["IMAGE"] = "Image";
        ELEMENT_NAME["NFT"] = "NFT Minter Dapp";
        ELEMENT_NAME["GEM_TOKEN"] = "Gem Token Dapp";
        ELEMENT_NAME["RANDOMIZER"] = "Randomizer";
        ELEMENT_NAME["VIDEO"] = "Video";
        ELEMENT_NAME["CAROUSEL"] = "Carousel";
        ELEMENT_NAME["MAP"] = "Map";
        ELEMENT_NAME["BANNER"] = "Banner";
        ELEMENT_NAME["BLOG"] = "Blog";
        ELEMENT_NAME["CONTENT_BLOCK"] = "Content Block";
    })(ELEMENT_NAME = exports.ELEMENT_NAME || (exports.ELEMENT_NAME = {}));
    exports.TEXTBOX_PATH = 'scom-markdown-editor';
    exports.GAP_WIDTH = 15;
    exports.MAX_COLUMN = 12;
    exports.MIN_COLUMN = 2;
    exports.PAGE_SIZE = 6;
});
define("@scom/scom-page-builder/command/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-page-builder/command/updateRow.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts"], function (require, exports, components_3, index_3, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateRowCommand = void 0;
    class UpdateRowCommand {
        constructor(element, parent, data, isDeleted, prependId, appendId) {
            this.isDeleted = false;
            this.prependId = '';
            this.appendId = '';
            this.element = element;
            this.data = JSON.parse(JSON.stringify(data));
            this.rowId = data.id;
            this.parent = parent || document.body;
            this.isDeleted = typeof isDeleted === 'boolean' ? isDeleted : false;
            this.prependId = prependId || '';
            this.appendId = appendId || '';
        }
        execute() {
            var _a, _b, _c;
            this.element.parent = this.parent;
            if (this.isDeleted) {
                this.parent.removeChild(this.element);
                index_4.pageObject.removeRow(this.rowId);
                components_3.application.EventBus.dispatch(index_3.EVENT.ON_UPDATE_SECTIONS);
            }
            else {
                this.parent.appendChild(this.element);
                let index = -1;
                if (this.prependId) {
                    const prependRow = this.parent.querySelector(`#${this.prependId}`);
                    prependRow && prependRow.insertAdjacentElement('afterend', this.element);
                    const prependId = this.prependId.replace('row-', '');
                    const prependIndex = prependId ? index_4.pageObject.sections.findIndex(section => section.id === prependId) : -1;
                    index = prependIndex === -1 ? -1 : prependIndex + 1;
                }
                else if (this.appendId) {
                    const appendRow = this.parent.querySelector(`#${this.appendId}`);
                    appendRow && appendRow.insertAdjacentElement('afterend', this.element);
                    this.element.insertAdjacentElement('afterend', appendRow);
                    const appendId = this.appendId.replace('row-', '');
                    index = appendId ? index_4.pageObject.sections.findIndex(section => section.id === appendId) : -1;
                }
                index_4.pageObject.addRow(this.data, this.rowId, index);
            }
            if ((_a = this.element) === null || _a === void 0 ? void 0 : _a.toggleUI) {
                const hasData = (_c = (_b = this.data) === null || _b === void 0 ? void 0 : _b.elements) === null || _c === void 0 ? void 0 : _c.length;
                this.element.toggleUI(hasData);
            }
        }
        undo() {
            var _a, _b, _c, _d;
            if (this.isDeleted) {
                this.element.parent = this.parent;
                this.parent.appendChild(this.element);
                const prependRow = this.prependId && this.parent.querySelector(`#${this.prependId}`);
                if (prependRow) {
                    prependRow.insertAdjacentElement('afterend', this.element);
                    const prependId = this.prependId.replace('row-', '');
                    const prependIndex = prependId ? index_4.pageObject.sections.findIndex(section => section.id === prependId) : -1;
                    index_4.pageObject.addRow(this.data, this.rowId, prependIndex === -1 ? -1 : prependIndex + 1);
                }
                else {
                    const appendId = this.appendId.replace('row-', '');
                    const appendIndex = appendId ? index_4.pageObject.sections.findIndex(section => section.id === appendId) : -1;
                    if (this.appendId) {
                        const appendRow = this.parent.querySelector(`#${this.appendId}`);
                        appendRow && appendRow.insertAdjacentElement('afterend', this.element);
                        this.element.insertAdjacentElement('afterend', appendRow);
                    }
                    index_4.pageObject.addRow(this.data, this.rowId, appendIndex);
                }
                components_3.application.EventBus.dispatch(index_3.EVENT.ON_UPDATE_SECTIONS);
            }
            else {
                this.element.remove();
                this.data && index_4.pageObject.removeRow(this.rowId);
            }
            if ((_a = this.element) === null || _a === void 0 ? void 0 : _a.toggleUI) {
                const isEmpty = !((_c = (_b = this.data) === null || _b === void 0 ? void 0 : _b.elements) === null || _c === void 0 ? void 0 : _c.length) || ((_d = this.data) === null || _d === void 0 ? void 0 : _d.elements.every(el => { var _a; return el.type === "composite" && !((_a = el.elements) === null || _a === void 0 ? void 0 : _a.length); }));
                this.element.toggleUI(!isEmpty);
            }
        }
        redo() { }
    }
    exports.UpdateRowCommand = UpdateRowCommand;
});
define("@scom/scom-page-builder/command/updateRowSettings.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, index_5, index_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateRowSettingsCommand = void 0;
    class UpdateRowSettingsCommand {
        constructor(element, settings) {
            this.element = element;
            this.settings = settings;
            const id = this.element.id.replace('row-', '');
            const data = index_5.pageObject.getRow(id) || {};
            this.oldSettings = Object.assign({}, data);
        }
        execute() {
            const { backgroundColor, config } = this.settings;
            const id = this.element.id.replace('row-', '');
            if (backgroundColor !== undefined) {
                this.element.style.backgroundColor = backgroundColor;
            }
            index_5.pageObject.updateSection(id, { backgroundColor, config });
            if (config) {
                this.element.setData(index_5.pageObject.getRow(id));
                const align = config.align || 'left';
                let alignValue = 'start';
                switch (align) {
                    case 'right':
                        alignValue = 'end';
                        break;
                    case 'center':
                        alignValue = 'center';
                        break;
                }
                this.element.style.justifyContent = alignValue;
            }
        }
        undo() {
            const { backgroundColor = '', config } = this.oldSettings;
            const id = this.element.id.replace('row-', '');
            this.element.style.backgroundColor = backgroundColor;
            index_5.pageObject.updateSection(id, {
                backgroundColor,
                config: config || {
                    columnLayout: index_6.IColumnLayoutType.FIXED,
                    columnsNumber: 12,
                    align: 'left'
                }
            });
            this.element.setData(index_5.pageObject.getRow(id));
        }
        redo() { }
    }
    exports.UpdateRowSettingsCommand = UpdateRowSettingsCommand;
});
define("@scom/scom-page-builder/command/history.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commandHistory = exports.CommandHistory = void 0;
    class CommandHistory {
        constructor() {
            this.commands = [];
            this.currentCommandIndex = -1;
        }
        async execute(command) {
            this.commands = this.commands.slice(0, this.currentCommandIndex + 1);
            this.commands.push(command);
            this.currentCommandIndex++;
            await command.execute();
        }
        undo() {
            if (this.currentCommandIndex >= 0) {
                const command = this.commands[this.currentCommandIndex];
                console.log('undo', command);
                command.undo();
                this.currentCommandIndex--;
            }
        }
        redo() {
            if (this.currentCommandIndex < this.commands.length - 1) {
                this.currentCommandIndex++;
                const command = this.commands[this.currentCommandIndex];
                console.log('redo', command);
                command.execute();
            }
        }
    }
    exports.CommandHistory = CommandHistory;
    exports.commandHistory = new CommandHistory();
});
define("@scom/scom-page-builder/command/moveRow.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MoveElementCommand = void 0;
    class MoveElementCommand {
        constructor(element, dropElm, parent, data) {
            this.dragIndex = 0;
            this.dropIndex = 0;
            this.element = element;
            this.dropElm = dropElm;
            this.parent = parent;
            this.dataList = data || [];
        }
        execute() {
            if (!this.parent.contains(this.element))
                return;
            const rows = this.parent.querySelectorAll('.dropzone') || [];
            for (let i = 0; i < rows.length; i++) {
                if (this.element.isEqualNode(rows[i])) {
                    this.dragIndex = i;
                }
                if (this.dropElm.isEqualNode(rows[i])) {
                    this.dropIndex = i;
                }
            }
            if (this.dataList.length) {
                const [dragRowData] = this.dataList.splice(this.dragIndex, 1);
                this.dataList.splice(this.dropIndex, 0, dragRowData);
            }
            if (this.dragIndex < this.dropIndex) {
                this.parent.insertBefore(this.element, this.dropElm.nextSibling);
            }
            else {
                this.parent.insertBefore(this.element, this.dropElm);
            }
            let templateColumns = [];
            const length = this.parent.children.length;
            const unitWidth = Number(this.parent.offsetWidth) / 12;
            for (let i = 0; i < length; i++) {
                templateColumns.push(i === this.dropIndex ? 'minmax(auto, 100%)' : `${unitWidth}px`);
            }
            this.parent.templateColumns = templateColumns;
        }
        undo() {
            if (!this.parent.contains(this.element))
                return;
            if (this.dataList.length) {
                const [dragRowData] = this.dataList.splice(this.dropIndex, 1);
                this.dataList.splice(this.dragIndex, 0, dragRowData);
            }
            const rows = this.parent.querySelectorAll('.dropzone') || [];
            for (let i = 0; i < rows.length; i++) {
                if (i === this.dragIndex) {
                    const temp = rows[i];
                    this.parent.replaceChild(this.element, rows[i]);
                    this.parent.appendChild(temp);
                }
            }
            let templateColumns = [];
            const length = this.parent.children.length;
            const unitWidth = Number(this.parent.offsetWidth) / 12;
            for (let i = 0; i < length; i++) {
                templateColumns.push(i === this.dragIndex ? 'minmax(auto, 100%)' : `${unitWidth}px`);
            }
            this.parent.templateColumns = templateColumns;
        }
        redo() { }
    }
    exports.MoveElementCommand = MoveElementCommand;
});
define("@scom/scom-page-builder/command/resize.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, index_7, index_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResizeElementCommand = void 0;
    class ResizeElementCommand {
        get maxColumn() {
            var _a;
            const rowId = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            return index_7.pageObject.getColumnsNumber(rowId);
        }
        constructor(element, toolbar, initialWidth, initialHeight, finalWidth, finalHeight) {
            var _a, _b;
            this.gapWidth = index_8.GAP_WIDTH;
            this.gridColumnWidth = 0;
            this.element = element;
            this.toolbar = toolbar;
            this.parent = this.element.closest('ide-row');
            this.finalWidth = finalWidth || initialWidth;
            this.finalHeight = finalHeight || initialHeight;
            this.finalLeft = Number(this.element.left);
            // this.initialWidth = initialWidth;
            this.initialHeight = initialHeight;
            this.oldDataColumn = {
                column: Number(this.element.dataset.column),
                columnSpan: Number(this.element.dataset.columnSpan)
            };
            const grid = (_b = (_a = this.element) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.closest('.grid');
            if (grid) {
                this.gridColumnWidth = (grid.offsetWidth - this.gapWidth * (this.maxColumn - 1)) / this.maxColumn;
                grid.templateColumns = [`repeat(${this.maxColumn}, ${this.gridColumnWidth}px)`];
            }
        }
        getColumnData() {
            const grid = this.element.closest('.grid');
            let currentSpan = 0;
            if (!grid)
                return null;
            const sections = Array.from(grid.querySelectorAll('ide-section'));
            let prevElm = null;
            let afterElm = null;
            currentSpan = sections.reduce((result, el) => {
                if (!el.contains(this.element)) {
                    const columnSpan = Number(el.dataset.columnSpan);
                    result += (columnSpan);
                    const column = Number(el.dataset.column);
                    if (this.oldDataColumn.column > column)
                        prevElm = el;
                    if (this.oldDataColumn.column < column)
                        afterElm = el;
                }
                return result;
            }, 0);
            const numberOfColumns = Math.ceil((this.finalWidth + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
            const finalColumnSpan = Math.max(Math.min(numberOfColumns, this.maxColumn - currentSpan), 1);
            const column = Math.ceil((this.finalLeft + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
            let finalColumn = Math.max(Math.min(column, (this.maxColumn - finalColumnSpan) + 1), 1);
            if (prevElm) {
                const prevColumn = Number(prevElm.dataset.column);
                const prevColumnSpan = Number(prevElm.dataset.columnSpan);
                if (finalColumn < prevColumn + prevColumnSpan)
                    finalColumn = prevColumn + prevColumnSpan;
            }
            if (afterElm) {
                const afterColumn = Number(afterElm.dataset.column);
                if (finalColumn >= afterColumn)
                    finalColumn = afterColumn - finalColumnSpan;
            }
            return { column: finalColumn, columnSpan: finalColumnSpan };
        }
        updateElement(columnData) {
            const { column, columnSpan } = columnData;
            this.element.setAttribute('data-column-span', `${columnSpan}`);
            this.element.setAttribute('data-column', `${column}`);
            this.element.style.gridColumn = `${column} / span ${columnSpan}`;
        }
        updateToolbars(isChangedColumn, rowId, columnData, changedHeight) {
            var _a;
            const { column, columnSpan } = columnData;
            const toolbars = this.element.querySelectorAll('ide-toolbar');
            for (const toolbar of toolbars) {
                const currentTag = ((_a = toolbar === null || toolbar === void 0 ? void 0 : toolbar.data) === null || _a === void 0 ? void 0 : _a.tag) || {};
                const height = toolbar.id === this.toolbar.id ? changedHeight : '100%';
                const tag = Object.assign(Object.assign({}, currentTag), { width: '100%', height });
                toolbar.setTag(tag);
                const elementId = toolbar.elementId;
                if (isChangedColumn && elementId !== this.element.id)
                    index_7.pageObject.setElement(rowId, elementId, { column, columnSpan });
            }
        }
        execute() {
            var _a, _b;
            this.element = this.parent && this.parent.querySelector(`[id='${this.element.id}']`);
            if (!this.element)
                return;
            const columnData = this.getColumnData();
            if (!columnData)
                return;
            this.updateElement(columnData);
            const rowId = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            const elementId = this.element.id;
            const isChangedColumn = columnData.column !== this.oldDataColumn.column || columnData.columnSpan !== this.oldDataColumn.columnSpan;
            if (isChangedColumn)
                index_7.pageObject.setElement(rowId, elementId, Object.assign({}, columnData));
            this.updateToolbars(isChangedColumn, rowId, columnData, this.finalHeight);
            if ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.toggleUI)
                this.parent.toggleUI(true);
        }
        undo() {
            var _a, _b;
            const { column, columnSpan } = this.oldDataColumn;
            this.updateElement({ column, columnSpan });
            const rowId = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            const elementId = this.element.id;
            index_7.pageObject.setElement(rowId, elementId, { column, columnSpan });
            this.updateToolbars(true, rowId, { column, columnSpan }, this.initialHeight);
            if ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.toggleUI)
                this.parent.toggleUI(true);
        }
        redo() { }
    }
    exports.ResizeElementCommand = ResizeElementCommand;
});
define("@scom/scom-page-builder/command/columnUtils.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, index_9, index_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAppendColumnData = exports.getDropColumnData = exports.getPrevColumn = exports.getNextColumn = exports.getColumnSpan = exports.getColumn = exports.updateColumnData = void 0;
    const updateColumnData = (el, rowId, column, columnSpan) => {
        const newColumnData = { column, columnSpan };
        index_9.pageObject.setElement(rowId, el.id, newColumnData);
        el.setAttribute('data-column', `${column}`);
        el.setAttribute('data-column-span', `${columnSpan}`);
        el.style.gridColumn = `${column} / span ${columnSpan}`;
    };
    exports.updateColumnData = updateColumnData;
    const getColumn = (el) => {
        return Number(el.dataset.column);
    };
    exports.getColumn = getColumn;
    const getColumnSpan = (el) => {
        return Number(el.dataset.columnSpan);
    };
    exports.getColumnSpan = getColumnSpan;
    const getNextColumn = (el) => {
        return getColumn(el) + getColumnSpan(el);
    };
    exports.getNextColumn = getNextColumn;
    const getPrevColumn = (el) => {
        return getColumn(el) - getColumnSpan(el);
    };
    exports.getPrevColumn = getPrevColumn;
    const getDropColumnData = (dropElm, sortedSections, element) => {
        const dropRow = dropElm.closest('ide-row');
        const dropElmCol = getColumn(dropElm);
        let columnSpan = element ? getColumnSpan(element) : index_10.MIN_COLUMN;
        const dropRowId = ((dropRow === null || dropRow === void 0 ? void 0 : dropRow.id) || '').replace('row-', '');
        const MAX_COLUMN = index_9.pageObject.getColumnsNumber(dropRowId);
        const maxColumn = (MAX_COLUMN - columnSpan) + 1;
        let newColumn = (columnSpan > 1 && dropElmCol > maxColumn) ? maxColumn : dropElmCol;
        let newColumnSpan = columnSpan;
        let prevDropElm = null;
        let afterDropElm = null;
        let currentSpan = sortedSections.reduce((result, el) => {
            if (!element || (element && !el.contains(element))) {
                const elCol = getColumn(el);
                result += getColumnSpan(el);
                if (getColumn(dropElm) > elCol && (!prevDropElm || (prevDropElm && getColumn(prevDropElm) < elCol))) {
                    prevDropElm = el;
                }
                if (getColumn(dropElm) < elCol && (!afterDropElm || (afterDropElm && getColumn(afterDropElm) > elCol))) {
                    afterDropElm = el;
                }
            }
            return result;
        }, 0);
        if (prevDropElm) {
            const prevColumn = getColumn(prevDropElm);
            const prevColumnSpan = getColumnSpan(prevDropElm);
            const columnData = prevColumn + prevColumnSpan;
            if (columnData <= MAX_COLUMN + 1 && newColumn < columnData)
                newColumn = columnData;
        }
        if (afterDropElm) {
            const afterColumn = getColumn(afterDropElm);
            if (newColumn + columnSpan > afterColumn)
                newColumnSpan = afterColumn - newColumn;
        }
        const finalColumnSpan = Math.max(Math.min(newColumnSpan, MAX_COLUMN - currentSpan), 1);
        return { column: newColumn, columnSpan: finalColumnSpan };
    };
    exports.getDropColumnData = getDropColumnData;
    const getNewColumn = (dropSection, oldDropColumn, isAppend = true) => {
        return isAppend ? getNextColumn(dropSection) : oldDropColumn;
    };
    const getAppendColumnData = (grid, dropElm, sortedSections, updateData, element, isAppend = true) => {
        let dropSection = dropElm.closest('ide-section');
        if (!(dropSection === null || dropSection === void 0 ? void 0 : dropSection.id))
            return null;
        dropSection = grid.querySelector(`[id='${dropSection.id}']`);
        const pageRow = dropSection.closest('ide-row');
        const pageRowId = ((pageRow === null || pageRow === void 0 ? void 0 : pageRow.id) || '').replace('row-', '');
        const MAX_COLUMN = index_9.pageObject.getColumnsNumber(pageRowId);
        const oldDropColumn = getColumn(dropSection);
        let newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
        if (element && pageRow.contains(element)) {
            const elementIndex = sortedSections.findIndex(el => getColumn(el) === getColumn(element));
            const dropIndex = sortedSections.findIndex(el => getColumn(el) === getColumn(dropSection));
            if (getColumn(element) > getColumn(dropSection)) {
                for (let j = elementIndex + 1; j < dropIndex; j++) {
                    const elm = sortedSections[j];
                    updateData(elm, pageRowId, getColumn(elm) + getColumnSpan(element));
                }
            }
            else if (getColumn(element) < getColumn(dropSection)) {
                for (let j = elementIndex - 1; j >= dropIndex; j--) {
                    const elm = sortedSections[j];
                    updateData(elm, pageRowId, getColumn(elm) - getColumnSpan(element));
                }
            }
            if (!isAppend) {
                updateData(dropSection, pageRowId, oldDropColumn + getColumnSpan(element));
            }
            newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
            return { column: newColumn, columnSpan: getColumnSpan(element) };
        }
        const hasSpace = sortedSections.find((section) => getColumnSpan(section) > index_10.MIN_COLUMN);
        if (!hasSpace && sortedSections.length >= Math.ceil(MAX_COLUMN / index_10.MIN_COLUMN))
            return null;
        const columnSpan = element ? Math.min(getColumnSpan(element), index_10.MIN_COLUMN) : index_10.MIN_COLUMN;
        for (let i = 0; i < sortedSections.length; i++) {
            const el = sortedSections[i];
            const prevElm = sortedSections[i - 1];
            const nextElm = sortedSections[i + 1];
            if (getColumnSpan(el) > columnSpan) {
                const newElColSpan = getColumnSpan(el) - columnSpan;
                if (getColumn(dropSection) < getColumn(el)) {
                    updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
                    if (nextElm) {
                        for (let j = i + 1; j < sortedSections.length; j++) {
                            const elm = sortedSections[j];
                            if (getColumn(elm) < getNextColumn(dropSection))
                                break;
                            updateData(elm, pageRowId, getColumn(elm) + columnSpan);
                        }
                    }
                    if (!isAppend) {
                        updateData(dropSection, pageRowId, getColumn(dropSection) + columnSpan);
                    }
                    newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
                }
                else if (getColumn(dropSection) > getColumn(el)) {
                    updateData(el, pageRowId, getColumn(el), newElColSpan);
                    if (prevElm) {
                        for (let j = i - 1; j >= 0; j--) {
                            const elm = sortedSections[j];
                            const newElmCol = getColumn(elm) - columnSpan;
                            if (newElmCol === getNextColumn(dropSection))
                                break;
                            updateData(elm, pageRowId, newElmCol);
                        }
                    }
                    newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
                }
                else {
                    const updatedCol = isAppend ? getColumn(el) : getColumn(el) + columnSpan;
                    updateData(el, pageRowId, updatedCol, newElColSpan);
                    newColumn = isAppend ? getColumn(el) + newElColSpan : oldDropColumn;
                }
                break;
            }
            else {
                if (getNextColumn(el) < MAX_COLUMN + 1 && i === 0) {
                    updateData(el, pageRowId, (MAX_COLUMN + 1) - getColumnSpan(el));
                }
                if (nextElm) {
                    const canUpdated = getNextColumn(nextElm) !== getColumn(el) &&
                        getColumnSpan(nextElm) <= index_10.MIN_COLUMN;
                    if (canUpdated) {
                        if (getColumn(dropSection) < getColumn(el)) {
                            const pos = getColumn(el) - getColumnSpan(nextElm);
                            pos !== getNextColumn(dropSection) && updateData(nextElm, pageRowId, pos);
                        }
                        else if (getColumn(dropSection) > getColumn(el)) {
                            for (let j = i; j >= 0; j--) {
                                const elm = sortedSections[j];
                                if (getPrevColumn(elm) !== getNextColumn(dropSection)) {
                                    updateData(elm, pageRowId, getPrevColumn(elm));
                                }
                            }
                        }
                        else {
                            updateData(el, pageRowId, getPrevColumn(dropSection));
                        }
                    }
                }
                newColumn = getNewColumn(dropSection, oldDropColumn, isAppend);
            }
        }
        return { column: newColumn, columnSpan };
    };
    exports.getAppendColumnData = getAppendColumnData;
});
define("@scom/scom-page-builder/command/dragElement.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/columnUtils.ts"], function (require, exports, index_11, columnUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragElementCommand = void 0;
    class DragElementCommand {
        constructor(element, dropElm, isAppend = true, isNew = false) {
            this.oldDataColumnMap = [];
            this.isAppend = true;
            this.isNew = false;
            this.element = element;
            this.dropElm = dropElm;
            this.dropRow = dropElm.closest('ide-row');
            this.dropGrid = this.dropRow ? this.dropRow.querySelector('.grid') : null;
            this.oldDataColumn = {
                column: Number(element.dataset.column),
                columnSpan: Number(element.dataset.columnSpan)
            };
            this.parent = element.closest('ide-row');
            this.data = JSON.parse(JSON.stringify(element.data));
            this.isAppend = isAppend;
            this.isNew = isNew;
            this.updateData = this.updateData.bind(this);
        }
        updateData(el, rowId, column, columnSpan) {
            if (!column && !columnSpan)
                return;
            const oldColumnData = { el, rowId, column: (0, columnUtils_1.getColumn)(el), columnSpan: (0, columnUtils_1.getColumnSpan)(el) };
            const hasItem = this.oldDataColumnMap.find(data => data.el.id === el.id);
            !hasItem && this.oldDataColumnMap.push(oldColumnData);
            const col = column || (0, columnUtils_1.getColumn)(el);
            const colSpan = columnSpan || (0, columnUtils_1.getColumnSpan)(el);
            (0, columnUtils_1.updateColumnData)(el, rowId, col, colSpan);
        }
        getColumnData() {
            const sections = this.dropGrid ? Array.from(this.dropGrid.querySelectorAll('ide-section')) : [];
            const sortedSections = sections.sort((a, b) => Number(b.dataset.column) - Number(a.dataset.column));
            const dropElmCol = Number(this.dropElm.dataset.column);
            return isNaN(dropElmCol) ?
                (0, columnUtils_1.getAppendColumnData)(this.dropGrid, this.dropElm, sortedSections, this.updateData, this.element, this.isAppend) :
                (0, columnUtils_1.getDropColumnData)(this.dropElm, sortedSections, this.element);
        }
        execute() {
            var _a, _b;
            if (!this.parent || !this.dropRow)
                return;
            this.element = this.parent.querySelector(`[id='${this.data.id}']`);
            if (!this.element)
                return;
            let column = 1;
            let columnSpan = Number(this.element.dataset.columnSpan);
            if (this.dropGrid && !this.isNew) {
                const columnData = this.getColumnData();
                if (!columnData)
                    return;
                column = columnData.column;
                columnSpan = columnData.columnSpan;
            }
            this.element.style.gridRow = '1';
            this.element.style.gridColumn = `${column} / span ${columnSpan}`;
            this.element.setAttribute('data-column', `${column}`);
            this.element.setAttribute('data-column-span', `${columnSpan}`);
            const dropRowId = this.dropRow.id.replace('row-', '');
            const elementRowId = (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.id) || '').replace('row-', '');
            index_11.pageObject.setElement(elementRowId, this.element.id, { column, columnSpan });
            if (this.parent && !this.parent.isEqualNode(this.dropRow)) {
                index_11.pageObject.addElement(dropRowId, Object.assign(Object.assign({}, this.data), { column, columnSpan }));
                index_11.pageObject.removeElement(elementRowId, this.element.id);
                if (this.dropGrid)
                    this.dropGrid.appendChild(this.element);
                const toolbar = this.element.querySelector('ide-toolbar');
                if (toolbar)
                    toolbar.rowId = dropRowId;
                this.element.rowId = dropRowId;
                this.element.parent = this.dropGrid;
                this.dropRow.toggleUI(true);
            }
            if (this.parent) {
                const elementSection = index_11.pageObject.getRow(elementRowId);
                this.parent.visible = !!((_b = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _b === void 0 ? void 0 : _b.length);
            }
        }
        undo() {
            var _a, _b;
            if (!this.parent || !this.element)
                return;
            this.element.style.gridRow = '1';
            this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
            this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
            this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);
            const elementRow = this.element.parent.closest('ide-row');
            const elementRowId = ((elementRow === null || elementRow === void 0 ? void 0 : elementRow.id) || '').replace('row-', '');
            index_11.pageObject.setElement(elementRowId, this.element.id, Object.assign({}, this.oldDataColumn));
            if (!this.parent.id)
                return;
            const oldRowId = (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.id) || '').replace('row-', '');
            if (this.parent && elementRow && !elementRow.isEqualNode(this.parent)) {
                index_11.pageObject.addElement(oldRowId, Object.assign(Object.assign({}, this.data), this.oldDataColumn));
                index_11.pageObject.removeElement(elementRowId, this.element.id);
                const oldGrid = this.parent.querySelector('.grid');
                if (oldGrid) {
                    oldGrid.appendChild(this.element);
                    const toolbar = this.element.querySelector('ide-toolbar');
                    if (toolbar)
                        toolbar.rowId = oldRowId;
                    this.element.rowId = oldRowId;
                    this.element.parent = oldGrid;
                }
            }
            if (this.parent) {
                const oldElementSection = index_11.pageObject.getRow(oldRowId);
                this.parent.visible = !!((_b = oldElementSection === null || oldElementSection === void 0 ? void 0 : oldElementSection.elements) === null || _b === void 0 ? void 0 : _b.length);
            }
            for (let columnData of this.oldDataColumnMap) {
                const { el, rowId, column, columnSpan } = columnData;
                (0, columnUtils_1.updateColumnData)(el, rowId, column, columnSpan);
            }
        }
        redo() { }
    }
    exports.DragElementCommand = DragElementCommand;
});
define("@scom/scom-page-builder/command/removeToolbar.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts"], function (require, exports, components_4, index_12, index_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoveToolbarCommand = void 0;
    class RemoveToolbarCommand {
        constructor(element) {
            this.sectionId = '';
            this.element = element;
            this.data = JSON.parse(JSON.stringify(element.data));
            this.rowId = this.element.rowId;
            this.elementId = this.element.elementId;
            this.pageRow = this.element.closest('ide-row');
            const section = JSON.parse(JSON.stringify(index_13.pageObject.getRow(this.rowId)));
            const ideSection = this.element.closest('ide-section');
            this.sectionId = ideSection.id;
            if (this.sectionId !== this.elementId) {
                const parentElm = ideSection.id && section.elements.find(el => el.id === this.sectionId);
                if (parentElm)
                    this.elementIndex = parentElm.elements.findIndex(el => el.id === this.elementId);
            }
        }
        execute() {
            var _a, _b, _c;
            index_13.pageObject.removeElement(this.rowId, this.elementId);
            const sectionEl = this.element.closest('ide-section');
            this.element.remove();
            const section = index_13.pageObject.getRow(this.rowId);
            const isEmpty = !((_a = section === null || section === void 0 ? void 0 : section.elements) === null || _a === void 0 ? void 0 : _a.length) || (section === null || section === void 0 ? void 0 : section.elements.every(el => { var _a; return el.type === "composite" && !((_a = el.elements) === null || _a === void 0 ? void 0 : _a.length); }));
            this.pageRow && this.pageRow.toggleUI(!isEmpty);
            if (!this.sectionId || this.sectionId === this.elementId) {
                const hasSectionData = !!((_b = section === null || section === void 0 ? void 0 : section.elements) === null || _b === void 0 ? void 0 : _b.find(elm => elm.id === sectionEl.id));
                if (sectionEl && !hasSectionData)
                    sectionEl.remove();
            }
            else {
                const parentElement = ((section === null || section === void 0 ? void 0 : section.elements) || []).find(elm => elm.id === this.sectionId);
                const hasSectionData = !!((_c = parentElement === null || parentElement === void 0 ? void 0 : parentElement.elements) === null || _c === void 0 ? void 0 : _c.length);
                if (sectionEl && !hasSectionData)
                    sectionEl.remove();
            }
            components_4.application.EventBus.dispatch(index_12.EVENT.ON_UPDATE_SECTIONS);
        }
        undo() {
            index_13.pageObject.addElement(this.rowId, this.data, this.sectionId, this.elementIndex);
            const section = index_13.pageObject.getRow(this.rowId);
            const clonedSection = JSON.parse(JSON.stringify(section));
            if (this.pageRow && (this.rowId !== 'header' && this.rowId !== 'footer')) {
                this.pageRow.setData(Object.assign(Object.assign({}, clonedSection), { id: this.rowId }));
                this.pageRow.toggleUI(true);
            }
            components_4.application.EventBus.dispatch(index_12.EVENT.ON_UPDATE_SECTIONS);
        }
        redo() { }
    }
    exports.RemoveToolbarCommand = RemoveToolbarCommand;
});
define("@scom/scom-page-builder/command/updateType.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, index_14, index_15, index_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateTypeCommand = void 0;
    class UpdateTypeCommand {
        constructor(dropElm, element, config) {
            var _a;
            this.element = element || null;
            this.elementParent = (element ? element.closest('ide-row') : dropElm.closest('ide-row'));
            this.dropParent = dropElm.closest('ide-row');
            this.data = element ? JSON.parse(JSON.stringify(element.data)) : null;
            this.config = config || null;
            const dropRowId = (_a = this.dropParent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            const dropSection = dropElm.closest('ide-section');
            this.dropSectionId = ((dropSection === null || dropSection === void 0 ? void 0 : dropSection.id) || '');
            this.oldDropData = JSON.parse(JSON.stringify(index_14.pageObject.getElement(dropRowId, this.dropSectionId)));
            this.isNew = !this.element;
        }
        getElements() {
            var _a, _b, _c, _d;
            if (this.isNew) {
                const isMicroDapps = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.category) === 'micro-dapps';
                const newElData = {
                    id: (0, index_15.generateUUID)(),
                    column: 1,
                    columnSpan: 6,
                    type: ((_c = this.config) === null || _c === void 0 ? void 0 : _c.type) || index_16.ElementType.PRIMITIVE,
                    properties: {
                        showHeader: isMicroDapps,
                        showFooter: isMicroDapps
                    },
                    module: ((_d = this.config) === null || _d === void 0 ? void 0 : _d.module) || {}
                };
                return [newElData];
            }
            else {
                const clonedData = JSON.parse(JSON.stringify(this.data));
                if ((clonedData === null || clonedData === void 0 ? void 0 : clonedData.type) === index_16.ElementType.COMPOSITE)
                    return (clonedData === null || clonedData === void 0 ? void 0 : clonedData.elements) || [];
                else
                    return [clonedData];
            }
        }
        execute() {
            var _a, _b, _c, _d;
            if (this.element && this.elementParent) {
                this.element = this.elementParent.querySelector(`[id='${this.data.id}']`);
            }
            const dropRowId = (_a = this.dropParent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            const dropSection = this.dropParent.querySelector(`[id='${this.dropSectionId}']`);
            const dropSectionData = index_14.pageObject.getElement(dropRowId, this.dropSectionId);
            const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
            if (!this.dropSectionId || !dropRowId || !dropSectionData)
                return;
            const elementList = this.getElements();
            if ((clonedDropSecData === null || clonedDropSecData === void 0 ? void 0 : clonedDropSecData.type) === index_16.ElementType.COMPOSITE) {
                const elementIndex = dropSectionData.elements.findIndex(elm => elm.id === this.dropSectionId);
                for (let i = 0; i < elementList.length; i++) {
                    index_14.pageObject.addElement(dropRowId, elementList[i], this.dropSectionId, elementIndex + i + 1);
                }
            }
            else if ((clonedDropSecData === null || clonedDropSecData === void 0 ? void 0 : clonedDropSecData.type) === index_16.ElementType.PRIMITIVE) {
                clonedDropSecData.id = (0, index_15.generateUUID)();
                const updatedList = [...elementList].map(elm => {
                    elm.column = clonedDropSecData.column;
                    elm.columnSpan = clonedDropSecData.columnSpan;
                    return elm;
                });
                index_14.pageObject.setElement(dropRowId, this.dropSectionId, {
                    type: index_16.ElementType.COMPOSITE,
                    elements: [clonedDropSecData, ...updatedList],
                    dropId: ((_b = this.data) === null || _b === void 0 ? void 0 : _b.id) || ''
                });
            }
            const newDropData = index_14.pageObject.getElement(dropRowId, this.dropSectionId);
            dropSection.setData(dropRowId, newDropData);
            if (this.isNew)
                return;
            if (this.elementParent) {
                const elementRowId = (((_c = this.elementParent) === null || _c === void 0 ? void 0 : _c.id) || '').replace('row-', '');
                const elementSection = index_14.pageObject.getRow(elementRowId);
                if (elementRowId !== dropRowId && this.element)
                    index_14.pageObject.removeElement(elementRowId, this.element.id);
                this.elementParent.visible = !!((_d = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _d === void 0 ? void 0 : _d.length);
            }
            if (this.element)
                this.element.remove();
        }
        undo() {
            var _a, _b, _c;
            const dropRowId = (_a = this.dropParent) === null || _a === void 0 ? void 0 : _a.id.replace('row-', '');
            const dropSection = this.dropParent.querySelector(`[id='${this.dropSectionId}']`);
            dropSection && dropSection.setData(dropRowId, this.oldDropData);
            index_14.pageObject.setElement(dropRowId, this.oldDropData.id, this.oldDropData);
            if (this.isNew)
                return;
            if (this.elementParent) {
                const rowId = (((_b = this.elementParent) === null || _b === void 0 ? void 0 : _b.id) || '').replace('row-', '');
                index_14.pageObject.addElement(rowId, this.data);
                this.elementParent.addElement(this.data);
                const oldElementSection = index_14.pageObject.getRow(rowId);
                this.elementParent.visible = !!((_c = oldElementSection === null || oldElementSection === void 0 ? void 0 : oldElementSection.elements) === null || _c === void 0 ? void 0 : _c.length);
            }
        }
        redo() { }
    }
    exports.UpdateTypeCommand = UpdateTypeCommand;
});
define("@scom/scom-page-builder/command/addElement.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/columnUtils.ts"], function (require, exports, index_17, columnUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddElementCommand = void 0;
    class AddElementCommand {
        constructor(data, isAppend = true, isNew = false, dropElm, parent) {
            this.isAppend = true;
            this.isNew = false;
            this.oldDataColumnMap = [];
            this.data = JSON.parse(JSON.stringify(data));
            this.dropElm = dropElm;
            this.parent = parent || dropElm.closest('ide-row');
            this.isAppend = isAppend;
            this.isNew = isNew;
            this.updateData = this.updateData.bind(this);
        }
        updateData(el, rowId, column, columnSpan) {
            if (!column && !columnSpan)
                return;
            const oldColumnData = { el, rowId, column: (0, columnUtils_2.getColumn)(el), columnSpan: (0, columnUtils_2.getColumnSpan)(el) };
            const hasItem = this.oldDataColumnMap.find(data => data.el.id === el.id);
            !hasItem && this.oldDataColumnMap.push(oldColumnData);
            const col = column || (0, columnUtils_2.getColumn)(el);
            const colSpan = columnSpan || (0, columnUtils_2.getColumnSpan)(el);
            (0, columnUtils_2.updateColumnData)(el, rowId, col, colSpan);
        }
        getColumnData() {
            if (!this.dropElm)
                return null;
            const grid = this.dropElm.closest('.grid') || this.parent;
            const sections = grid ? Array.from(grid.querySelectorAll('ide-section')) : [];
            const sortedSections = sections.sort((a, b) => Number(b.dataset.column) - Number(a.dataset.column));
            const dropElmCol = Number(this.dropElm.dataset.column);
            return isNaN(dropElmCol) ?
                (0, columnUtils_2.getAppendColumnData)(grid, this.dropElm, sortedSections, this.updateData, null, this.isAppend) :
                (0, columnUtils_2.getDropColumnData)(this.dropElm, sortedSections);
        }
        async execute() {
            var _a, _b, _c, _d;
            if (!this.parent)
                return;
            let column = 1;
            let columnSpan = 6;
            if (!this.isNew) {
                const columnData = this.getColumnData();
                if (!columnData)
                    return;
                column = columnData.column;
                columnSpan = columnData.columnSpan;
            }
            const isMicroDapps = ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.category) === 'micro-dapps';
            const newElData = {
                id: this.data.id,
                column,
                columnSpan,
                type: this.data.type,
                properties: {
                    showHeader: isMicroDapps,
                    showFooter: isMicroDapps
                },
                module: this.data.module
            };
            this.element = await this.parent.addElement(newElData);
            const parentId = this.parent.id.replace('row-', '');
            index_17.pageObject.addElement(parentId, newElData);
            const elementRowId = (((_c = this.parent) === null || _c === void 0 ? void 0 : _c.id) || '').replace('row-', '');
            const elementSection = index_17.pageObject.getRow(elementRowId);
            this.parent.toggleUI(!!((_d = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _d === void 0 ? void 0 : _d.length));
        }
        undo() {
            var _a;
            if (!this.element || !this.parent)
                return;
            this.element = this.parent.querySelector(`[id='${this.element.id}']`);
            if (!this.element)
                return;
            this.element.remove();
            const parentId = this.parent.id.replace('row-', '');
            index_17.pageObject.removeElement(parentId, this.element.id);
            for (let columnData of [...this.oldDataColumnMap]) {
                const { el, rowId, column, columnSpan } = columnData;
                (0, columnUtils_2.updateColumnData)(el, rowId, column, columnSpan);
            }
            const elementSection = index_17.pageObject.getRow(parentId);
            this.parent.toggleUI(!!((_a = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _a === void 0 ? void 0 : _a.length));
        }
        redo() { }
    }
    exports.AddElementCommand = AddElementCommand;
});
define("@scom/scom-page-builder/command/index.ts", ["require", "exports", "@scom/scom-page-builder/command/updateRow.ts", "@scom/scom-page-builder/command/updateRowSettings.ts", "@scom/scom-page-builder/command/history.ts", "@scom/scom-page-builder/command/moveRow.ts", "@scom/scom-page-builder/command/resize.ts", "@scom/scom-page-builder/command/dragElement.ts", "@scom/scom-page-builder/command/removeToolbar.ts", "@scom/scom-page-builder/command/updateType.ts", "@scom/scom-page-builder/command/addElement.ts"], function (require, exports, updateRow_1, updateRowSettings_1, history_1, moveRow_1, resize_1, dragElement_1, removeToolbar_1, updateType_1, addElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddElementCommand = exports.UpdateTypeCommand = exports.RemoveToolbarCommand = exports.DragElementCommand = exports.ResizeElementCommand = exports.MoveElementCommand = exports.commandHistory = exports.CommandHistory = exports.UpdateRowSettingsCommand = exports.UpdateRowCommand = void 0;
    Object.defineProperty(exports, "UpdateRowCommand", { enumerable: true, get: function () { return updateRow_1.UpdateRowCommand; } });
    Object.defineProperty(exports, "UpdateRowSettingsCommand", { enumerable: true, get: function () { return updateRowSettings_1.UpdateRowSettingsCommand; } });
    Object.defineProperty(exports, "CommandHistory", { enumerable: true, get: function () { return history_1.CommandHistory; } });
    Object.defineProperty(exports, "commandHistory", { enumerable: true, get: function () { return history_1.commandHistory; } });
    Object.defineProperty(exports, "MoveElementCommand", { enumerable: true, get: function () { return moveRow_1.MoveElementCommand; } });
    Object.defineProperty(exports, "ResizeElementCommand", { enumerable: true, get: function () { return resize_1.ResizeElementCommand; } });
    Object.defineProperty(exports, "DragElementCommand", { enumerable: true, get: function () { return dragElement_1.DragElementCommand; } });
    Object.defineProperty(exports, "RemoveToolbarCommand", { enumerable: true, get: function () { return removeToolbar_1.RemoveToolbarCommand; } });
    Object.defineProperty(exports, "UpdateTypeCommand", { enumerable: true, get: function () { return updateType_1.UpdateTypeCommand; } });
    Object.defineProperty(exports, "AddElementCommand", { enumerable: true, get: function () { return addElement_1.AddElementCommand; } });
});
define("@scom/scom-page-builder/theme/light.theme.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = JSON.parse(JSON.stringify(components_5.Styles.Theme.defaultTheme));
    // Background
    Theme.background.main = '#FFFFFF';
    Theme.background.paper = '#FAFAFA';
    Theme.background.modal = '#FFFFFF';
    Theme.background.default = '#EEEEEE';
    // Theme.background.gradient = '';
    // Colors
    Theme.colors.primary.main = '#FF6600';
    Theme.colors.primary.light = '#FF8533';
    Theme.colors.primary.dark = '#FF8533';
    Theme.colors.primary.contrastText = '#FFFFFF';
    Theme.colors.secondary.main = '#AAAAAA';
    Theme.colors.secondary.light = '#f5f5f5';
    // Theme.colors.secondary.dark = '';
    // Theme.colors.secondary.contrastText = '';
    Theme.colors.success.main = '#77B24D';
    // Theme.colors.success.light = '';
    // Theme.colors.success.dark = '';
    Theme.colors.success.contrastText = '#FFFFFF';
    Theme.colors.error.main = '#B2554D';
    // Theme.colors.error.light = '';
    // Theme.colors.error.dark = '';
    Theme.colors.error.contrastText = '#FFFFFF';
    // Theme.colors.info.main = '';
    // Theme.colors.info.light = '';
    // Theme.colors.info.dark = '';
    // Theme.colors.info.contrastText = '';
    // Theme.colors.warning.main = '';
    // Theme.colors.warning.light = '';
    // Theme.colors.warning.dark = '';
    // Theme.colors.warning.contrastText = '';
    // Text
    Theme.text.primary = '#5f6368';
    // Theme.text.secondary = '';
    // Theme.text.third = '';
    // Theme.text.hint = '';
    // Theme.text.disabled = '';
    // Typography
    Theme.typography.fontSize = '16px';
    Theme.typography.fontFamily = 'Noto Sans';
    // Shadows
    // Theme.shadows["0"] = '';
    // Theme.shadows["1"] = '';
    // Theme.shadows["2"] = '';
    // Theme.shadows["3"] = '';
    // Theme.shadows["4"] = '';
    // Breakpoints
    // Theme.breakboints.xs = 0;
    // Theme.breakboints.sm = 0;
    // Theme.breakboints.md = 0;
    // Theme.breakboints.lg = 0;
    // Theme.breakboints.xl = 0;
    // Divider
    Theme.divider = 'rgba(217,225,232,.6)';
    // Docs
    // Theme.docs.background = '';
    // Theme.docs.text0 = '';
    // Theme.docs.text1 = '';
    // Input
    Theme.input.background = '#FAFAFA';
    // Theme.input.fontColor = '';
    // Combobox
    Theme.combobox.background = '#FAFAFA';
    // Theme.combobox.fontColor = '';
    // Action
    Theme.action.hover = 'rgba(0, 0, 0, 0.04)';
    // Theme.action.hoverOpacity = 1;
    // Theme.action.active = '';
    // Theme.action.activeOpacity = 1;
    // Theme.action.disabled = '';
    // Theme.action.disabledBackground = '';
    // Theme.action.disabledOpacity = 1;
    // Theme.action.focus = '';
    // Theme.action.focusOpacity = 1;
    // Theme.action.selected = '';
    // Theme.action.selectedOpacity = 1;
    // Layout
    exports.default = Theme;
});
define("@scom/scom-page-builder/theme/dark.theme.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = JSON.parse(JSON.stringify(components_6.Styles.Theme.darkTheme));
    // Background
    Theme.background.main = '#333333';
    Theme.background.paper = 'black';
    // Theme.background.modal = '';
    // Theme.background.default = '';
    // Theme.background.gradient = '';
    // Colors
    Theme.colors.primary.main = '#FF6600';
    // Theme.colors.primary.light = '';
    Theme.colors.primary.dark = '#FF6600DD';
    // Theme.colors.primary.contrastText = '';
    Theme.colors.secondary.main = '#333333';
    // Theme.colors.secondary.light = '';
    // Theme.colors.secondary.dark = '';
    // Theme.colors.secondary.contrastText = '';
    // Theme.colors.success.main = '';
    // Theme.colors.success.light = '';
    // Theme.colors.success.dark = '';
    // Theme.colors.success.contrastText = '';
    Theme.colors.error.main = '#B2554D';
    // Theme.colors.error.light = '';
    // Theme.colors.error.dark = '';
    // Theme.colors.error.contrastText = '';
    // Theme.colors.info.main = '';
    // Theme.colors.info.light = '';
    // Theme.colors.info.dark = '';
    // Theme.colors.info.contrastText = '';
    // Theme.colors.warning.main = '';
    // Theme.colors.warning.light = '';
    // Theme.colors.warning.dark = '';
    // Theme.colors.warning.contrastText = '';
    // Text
    Theme.text.primary = '#FFFFFF';
    // Theme.text.secondary = '';
    // Theme.text.third = '';
    // Theme.text.hint = '';
    // Theme.text.disabled = '';
    // Typography
    Theme.typography.fontSize = '16px';
    Theme.typography.fontFamily = 'Noto Sans';
    // Shadows
    // Theme.shadows["0"] = '';
    // Theme.shadows["1"] = '';
    // Theme.shadows["2"] = '';
    // Theme.shadows["3"] = '';
    // Theme.shadows["4"] = '';
    // Breakpoints
    // Theme.breakboints.xs = 0;
    // Theme.breakboints.sm = 0;
    // Theme.breakboints.md = 0;
    // Theme.breakboints.lg = 0;
    // Theme.breakboints.xl = 0;
    // Divider
    // Theme.divider = '';
    // Docs
    // Theme.docs.background = '';
    // Theme.docs.text0 = '';
    // Theme.docs.text1 = '';
    // Input
    // Theme.input.background = '';
    // Theme.input.fontColor = '';
    // Combobox
    // Theme.combobox.background = '';
    // Theme.combobox.fontColor = '';
    // Action
    Theme.action.hover = 'FF6600DD';
    // Theme.action.hoverOpacity = 1;
    // Theme.action.active = '';
    // Theme.action.activeOpacity = 1;
    // Theme.action.disabled = '';
    // Theme.action.disabledBackground = '';
    // Theme.action.disabledOpacity = 1;
    // Theme.action.focus = '';
    // Theme.action.focusOpacity = 1;
    // Theme.action.selected = '';
    // Theme.action.selectedOpacity = 1;
    exports.default = Theme;
});
define("@scom/scom-page-builder/theme/index.ts", ["require", "exports", "@scom/scom-page-builder/theme/light.theme.ts", "@scom/scom-page-builder/theme/dark.theme.ts"], function (require, exports, light_theme_1, dark_theme_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DarkTheme = exports.LightTheme = exports.currentTheme = void 0;
    exports.LightTheme = light_theme_1.default;
    exports.DarkTheme = dark_theme_1.default;
    const currentTheme = light_theme_1.default;
    exports.currentTheme = currentTheme;
});
define("@scom/scom-page-builder/page/pageHeader.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_7.Styles.Theme.ThemeVars;
    components_7.Styles.cssRule('.ide-header', {
        $nest: {
            '.toolbar': {
                boxShadow: 'none'
            },
            '.toolbar:hover': {
                boxShadow: 'none',
                background: Theme.action.hover,
                transition: 'background .3s ease-in'
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageHeader.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageHeader.css.ts"], function (require, exports, components_8, index_18, index_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageHeader = void 0;
    const Theme = index_19.currentTheme;
    let PageHeader = class PageHeader extends components_8.Module {
        constructor(parent) {
            super(parent);
            this.iconList = [];
            this.initEventBus();
        }
        initEventBus() { }
        set logo(data) {
            this._logo = data;
            this.imgLogo.url = data;
        }
        get logo() {
            return this._logo;
        }
        hideLogo(hide) {
            this.imgLogo.visible = !hide;
        }
        renderIconList() {
            this.toolbars.clearInnerHTML();
            this.iconList.forEach((icon) => {
                this.toolbars.appendChild(this.$render("i-button", { padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' }, width: 48, height: 48, border: { radius: '50%' }, caption: `<i-icon name="${icon.name}" width=${20} height=${20} fill="${Theme.text.primary}"></i-icon>`, background: { color: 'transparent' }, tooltip: icon.tooltip, class: "toolbar", onClick: icon.onClick }));
            });
        }
        renderDropdown() {
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
                    name: 'undo',
                    tooltip: { content: 'Undo last action', placement: 'bottom' },
                    onClick: () => index_18.commandHistory.undo()
                },
                {
                    name: 'redo',
                    tooltip: { content: 'Redo last action', placement: 'bottom' },
                    onClick: () => index_18.commandHistory.redo()
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
            return (this.$render("i-hstack", { height: 64, justifyContent: 'space-between', verticalAlignment: "center", alignItems: 'center', padding: { left: 10, right: 10 }, class: 'ide-header' },
                this.$render("i-panel", { width: 200 },
                    this.$render("i-image", { id: 'imgLogo', height: 40, width: 'auto' })),
                this.$render("i-hstack", { class: "page-menu-bar", gap: "1rem", verticalAlignment: "center" },
                    this.$render("i-hstack", { id: "toolbars", gap: "1rem", verticalAlignment: "center" }))));
        }
    };
    PageHeader = __decorate([
        (0, components_8.customElements)('ide-header')
    ], PageHeader);
    exports.PageHeader = PageHeader;
});
define("@scom/scom-page-builder/page/pageSection.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_9, index_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_20.currentTheme;
    components_9.Styles.cssRule('ide-section', {
        display: 'block',
        position: 'relative',
        maxWidth: '100%',
        border: '2px solid transparent',
        $nest: {
            '&.active, &:focus': {
                border: `2px solid ${Theme.colors.primary.main}`,
                transition: 'border ease-in .2s'
            },
            'h1, h2, h3, h4, h5, h6': {
                margin: 0
            },
            textarea: {
                resize: 'none'
            }
        }
    });
});
define("@scom/scom-page-builder/common/toolbar.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_10, index_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_21.currentTheme;
    const tileToolbarFadeIn = components_10.Styles.keyframes({
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
    });
    components_10.Styles.cssRule('ide-toolbar', {
        display: 'block',
        $nest: {
            '.ide-component.active, .ide-component:hover': {
                border: `2px solid ${Theme.colors.primary.main}`
            },
            '.ide-component': {
                border: `2px solid transparent`,
                boxSizing: 'content-box'
            },
            'i-button': {
                boxShadow: 'none'
            },
            'i-scom-markdown-editor i-markdown-editor': {
                width: 'auto !important'
            },
            '.ide-toolbar': {
                position: 'absolute',
                zIndex: 99,
                top: -50,
                left: 0,
                boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
                animation: `${tileToolbarFadeIn} 125ms cubic-bezier(0.4,0,1,1)`
            },
            '#form > i-vstack > i-panel': {
                width: '100%'
            },
            '.setting-modal': {
                $nest: {
                    '.i-modal_header': {
                        padding: '1rem 1rem 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600
                    },
                    'i-button': {
                        padding: '1rem'
                    },
                    'i-input': {
                        border: `1px solid ${Theme.divider}`,
                        // marginBottom: '1rem'
                    },
                    '.modal': {
                        padding: 0,
                        $nest: {
                            '#pnlForm': {
                                maxHeight: 'calc(100vh - 100px)',
                                overflowY: 'auto'
                            }
                        }
                    }
                }
            },
            '.resize-icon': {
                cursor: 'ew-resize',
                opacity: 0,
                transition: '125ms',
                border: '1px solid #fff',
                borderRadius: '50%'
            },
            '&.active .resize-icon': {
                opacity: 1
            },
            '.nw-resize': {
                cursor: 'nw-resize !important'
            },
            '.ne-resize': {
                cursor: 'ne-resize !important'
            },
            '.n-resize': {
                cursor: 'n-resize !important'
            },
            '.move': {
                cursor: 'move'
            },
            '.dragger': {
                cursor: 'move',
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateX(-50%)',
                zIndex: 10
            },
            '&:hover': {
                $nest: {
                    '.dragger': {
                        visibility: 'initial',
                        opacity: 0.48,
                        transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s'
                    }
                }
            },
            '.setting-modal i-tabs': {
                $nest: {
                    '> .tabs-nav-wrap': {
                        margin: 0,
                        $nest: {
                            '.tabs-nav': {
                                border: 0,
                                borderRight: `1px solid ${Theme.divider}`,
                                paddingRight: '0.5rem'
                            },
                            'i-tab': {
                                background: 'transparent',
                                border: 0,
                                borderRadius: '0.25rem',
                                color: Theme.text.primary,
                                fontFamily: Theme.typography.fontFamily,
                                fontSize: '0.875rem',
                                marginBottom: 0,
                            },
                            'i-tab:not(.disabled).active': {
                                background: Theme.action.selected,
                                color: Theme.text.primary,
                                fontWeight: 600,
                            },
                            'i-tab:not(.disabled):hover': {
                                background: Theme.action.hover,
                                color: Theme.text.primary,
                            },
                            'i-tab .tab-item': {
                                padding: '0.5rem 0.75rem',
                            },
                        }
                    },
                }
            }
        }
    });
});
define("@scom/scom-page-builder/common/toolbar.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/common/toolbar.css.ts"], function (require, exports, components_11, index_22, index_23, index_24, index_25, index_26, index_27) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IDEToolbar = void 0;
    const Theme = index_27.currentTheme;
    const SINGLE_CONTENT_BLOCK_ID = 'single-content-block__';
    let IDEToolbar = class IDEToolbar extends components_11.Module {
        constructor(parent) {
            super(parent);
            this._toolList = [];
            this.currentAction = null;
            this._component = null;
            this.setData = this.setData.bind(this);
            this.fetchModule = this.fetchModule.bind(this);
        }
        get data() {
            return index_24.pageObject.getElement(this.rowId, this.elementId);
        }
        get module() {
            return this._component;
        }
        get toolList() {
            return this._toolList || [];
        }
        set toolList(value) {
            this._toolList = value;
            this.renderToolbars();
        }
        get rowId() {
            return this._rowId;
        }
        set rowId(value) {
            this._rowId = value;
        }
        get elementId() {
            return this._elementId;
        }
        set elementId(value) {
            this._elementId = value;
        }
        get readonly() {
            return this._readonly;
        }
        set readonly(value) {
            this._readonly = value;
        }
        adjustCursorByAction() {
            if (this.currentAction.name == "Edit")
                this.contentStack.classList.remove('move');
            else
                this.contentStack.classList.add('move');
        }
        async renderToolbars() {
            this.toolbar.clearInnerHTML();
            for (let i = 0; i < this.toolList.length; i++) {
                const tool = this.toolList[i];
                let elm = await components_11.Button.create({
                    padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                    width: 48,
                    height: 48,
                    border: { radius: '50%' },
                    tooltip: tool.name ? { trigger: 'hover', content: tool.name, color: '#555555' } : undefined,
                    background: { color: 'transparent' },
                    visible: tool.visible ? tool.visible() : true,
                    caption: `<i-icon name="${tool.icon}" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                    onClick: () => {
                        this.currentAction = tool;
                        if ((0, index_25.isEmpty)(tool.userInputDataSchema) && (0, index_25.isEmpty)(tool.customUI)) {
                            const commandIns = this.currentAction.command(this, null);
                            index_26.commandHistory.execute(commandIns);
                        }
                        else {
                            this.mdActions.visible = true;
                        }
                        this.adjustCursorByAction();
                        this.hideToolbars();
                    }
                });
                elm.classList.add('toolbar');
                if (tool.name)
                    elm.setAttribute('tool-name', tool.name);
                this.toolbar.appendChild(elm);
            }
            const removeBtn = await components_11.Button.create({
                padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                width: 48,
                height: 48,
                border: { radius: '50%' },
                tooltip: { trigger: 'hover', content: 'Delete', color: '#555555' },
                background: { color: 'transparent' },
                caption: `<i-icon name="trash" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                onClick: () => {
                    const removeCmd = new index_26.RemoveToolbarCommand(this);
                    index_26.commandHistory.execute(removeCmd);
                    this.hideToolbars();
                }
            });
            removeBtn.classList.add('toolbar');
            this.toolbar.appendChild(removeBtn);
        }
        onShowModal() {
            this.classList.add('is-setting');
            this.pnlFormMsg.visible = false;
            this.renderToolbarAction(this.currentAction);
        }
        onCloseModal() {
            this.classList.remove('is-setting');
        }
        async renderToolbarAction(action) {
            var _a, _b, _c, _d;
            this.pnlForm.clearInnerHTML();
            const builderTarget = this._component.getConfigurators().find((conf) => conf.target === 'Builders');
            const data = (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.getData) ? await builderTarget.getData() : this.data.properties;
            if (data.height === 'auto')
                data.height = this.offsetHeight;
            if (data.width === 'auto')
                data.width = this.offsetWidth;
            let properties = data;
            if (this.isContentBlock()) {
                properties = this._currentSingleContentBlockId ? data[this._currentSingleContentBlockId].properties : data;
            }
            const tag = (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.getTag) ? await builderTarget.getTag() : (this.data.tag || {});
            this.mdActions.title = action.name || 'Update Settings';
            if (action.customUI) {
                const customUI = action.customUI;
                const element = customUI.render(Object.assign(Object.assign({}, properties), tag), this.onSave.bind(this));
                this.pnlForm.append(element);
                this.form.visible = false;
            }
            else {
                if (typeof tag.width === 'number' && ((_b = (_a = action.userInputDataSchema.properties) === null || _a === void 0 ? void 0 : _a.width) === null || _b === void 0 ? void 0 : _b.type) === 'string') {
                    tag.width = "" + tag.width;
                }
                if (typeof tag.height === 'number' && ((_d = (_c = action.userInputDataSchema.properties) === null || _c === void 0 ? void 0 : _c.height) === null || _d === void 0 ? void 0 : _d.type) === 'string') {
                    tag.height = "" + tag.height;
                }
                const options = {
                    columnWidth: '100%',
                    columnsPerRow: 1,
                    confirmButtonBackgroundColor: Theme.colors.primary.main,
                    confirmButtonFontColor: Theme.colors.primary.contrastText,
                    jsonSchema: action.userInputDataSchema,
                    dateTimeFormat: 'MM/DD/YYYY HH:mm',
                    data: Object.assign(Object.assign({}, properties), tag)
                };
                if (action.userInputUISchema)
                    options.jsonUISchema = action.userInputUISchema;
                // if (action.useRenderUI || action.name === 'Advanced') {
                //     renderUI(this.pnlForm, options, this.onSave.bind(this));
                //     this.form.visible = false;
                //     this.mdActions.refresh();
                //     return;
                // }
                // console.log('form x', options.data, this.data);
                this.form.uiSchema = action.userInputUISchema;
                this.form.jsonSchema = action.userInputDataSchema;
                this.form.formOptions = {
                    columnWidth: '100%',
                    columnsPerRow: 1,
                    confirmButtonOptions: {
                        caption: 'Confirm',
                        backgroundColor: Theme.colors.primary.main,
                        fontColor: Theme.colors.primary.contrastText,
                        hide: false,
                        onClick: async () => {
                            const data = await this.form.getFormData();
                            const commandIns = this.currentAction.command(this, data);
                            index_26.commandHistory.execute(commandIns);
                            this.mdActions.visible = false;
                        }
                    },
                    dateTimeFormat: {
                        date: 'YYYY-MM-DD',
                        time: 'HH:mm:ss',
                        dateTime: 'MM/DD/YYYY HH:mm'
                    },
                };
                this.form.renderForm();
                this.form.clearFormData();
                const formData = action.name === 'Theme Settings' ? (tag || {}) : (properties || {});
                this.form.setFormData(Object.assign({}, formData));
                this.form.visible = true;
            }
            this.mdActions.refresh();
        }
        onSave(result, data) {
            if (result) {
                const commandIns = this.currentAction.command(this, data);
                index_26.commandHistory.execute(commandIns);
                this.mdActions.visible = false;
            }
            else if (data === null || data === void 0 ? void 0 : data.errors) {
                // this.pnlFormMsg.visible = true;
                // this.renderError(data.errors || []);
            }
        }
        isTexbox(data) {
            if (data)
                return data.name.toLowerCase() === index_23.ELEMENT_NAME.TEXTBOX.toLowerCase();
            else
                return false;
        }
        isContentBlock() {
            var _a, _b;
            return ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.name) === index_23.ELEMENT_NAME.CONTENT_BLOCK;
        }
        showToolbars() {
            if (this.toolList.length)
                this.toolsStack.visible = true;
            this.contentStack && this.contentStack.classList.add('active');
            this.classList.add('active');
        }
        hideToolbars() {
            this.toolsStack.visible = false;
            this.contentStack && this.contentStack.classList.remove('active');
            this.classList.remove('active');
        }
        getActions() {
            var _a;
            if ((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators) {
                const configs = this._component.getConfigurators() || [];
                const builderTarget = configs.find(conf => conf.target === 'Builders');
                if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.getActions)
                    return builderTarget.getActions();
            }
            return [];
        }
        updateToolbar() {
            this.toolList = this.getActions() || [];
        }
        renderResizeStack(data) {
            this._eResizer = this.renderResizer('left');
            this._wResizer = this.renderResizer('right');
            this._nResizer = this.renderResizer('bottom');
            this._neResizer = this.renderResizer('bottomLeft');
            this._nwResizer = this.renderResizer('bottomRight');
            const showFull = true; // data?.module?.disableClicked;
            if (this._nResizer)
                this._nResizer.visible = showFull;
            if (this._neResizer)
                this._neResizer.visible = showFull;
            if (this._nwResizer)
                this._nwResizer.visible = showFull;
        }
        renderResizer(position) {
            const stack = this.$render("i-vstack", { minWidth: 8, verticalAlignment: "center", horizontalAlignment: "center", zIndex: 20, position: "absolute", class: "resize-stack" });
            const iconEl = this.$render("i-icon", { name: "circle", fill: Theme.colors.primary.main, height: 16, width: 16, class: "resize-icon" });
            switch (position) {
                case 'left':
                    stack.top = 0;
                    stack.left = 0;
                    stack.height = '100%';
                    iconEl.margin = { left: -8 };
                    break;
                case 'right':
                    stack.top = 0;
                    stack.right = 0;
                    stack.height = '100%';
                    iconEl.margin = { right: -8 };
                    break;
                case 'bottom':
                    stack.bottom = -10;
                    stack.left = '50%';
                    stack.style.transform = 'translateX(-50%)';
                    stack.height = 'auto';
                    iconEl.classList.add('n-resize');
                    stack.visible = false;
                    break;
                case 'bottomLeft':
                    stack.bottom = -8;
                    stack.left = 0;
                    stack.height = 'auto';
                    iconEl.margin = { left: -8 };
                    iconEl.classList.add('ne-resize');
                    stack.visible = false;
                    break;
                case 'bottomRight':
                    stack.bottom = -8;
                    stack.right = 0;
                    stack.height = 'auto';
                    iconEl.margin = { right: -8 };
                    iconEl.classList.add('nw-resize');
                    stack.visible = false;
                    break;
            }
            stack.appendChild(iconEl);
            stack.classList.add(position);
            this.contentStack.appendChild(stack);
            return stack;
        }
        async fetchModule(data) {
            var _a;
            if (this._readonly)
                return;
            try {
                const module = await (0, index_25.getEmbedElement)(((_a = data === null || data === void 0 ? void 0 : data.module) === null || _a === void 0 ? void 0 : _a.path) || '');
                if (!module)
                    throw new Error('not found');
                await this.setModule(module, data === null || data === void 0 ? void 0 : data.module);
                if (this.isTexbox(data.module)) {
                    this.dragStack.visible = true;
                }
                else if (this.isContentBlock()) {
                    const allSingleContentBlockId = Object.keys(data.properties).filter(prop => prop.includes(SINGLE_CONTENT_BLOCK_ID));
                    for (let singleContentBlockId of allSingleContentBlockId) {
                        const singleContentBlock = this.parentElement.querySelector(`#${singleContentBlockId}`);
                        singleContentBlock.fetchModule(data.properties[singleContentBlockId]);
                    }
                    this.dragStack.visible = false;
                }
                else {
                    this.dragStack.visible = false;
                }
                this.contentStack.classList.add('move');
                this.renderResizeStack(data);
            }
            catch (error) {
                console.log('fetch module error: ', error);
                index_26.commandHistory.undo();
            }
        }
        async setModule(module, data) {
            var _a;
            this._component = module;
            this._component.parent = this.contentStack;
            const builderTarget = ((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators) ? this._component.getConfigurators().find((conf) => conf.target === 'Builders') : null;
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setElementId)
                builderTarget.setElementId(this.elementId);
            this.contentStack.append(this._component);
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setRootDir)
                builderTarget.setRootDir((0, index_24.getRootDir)());
            if (this._component.ready)
                await this._component.ready();
            this._component.maxWidth = '100%';
            this._component.maxHeight = '100%';
            // this._component.overflow = 'hidden';
            this._component.style.display = 'block';
            this.backdropStack.visible = data === null || data === void 0 ? void 0 : data.shownBackdrop;
            this._component.addEventListener('click', (event) => {
                if (data === null || data === void 0 ? void 0 : data.disableClicked)
                    event.stopImmediatePropagation();
                event.preventDefault();
                this.showToolList();
            });
            this.showToolList();
        }
        showToolList() {
            this.toolList = this.getActions() || [];
            this.checkToolbar();
            this.showToolbars();
        }
        async setData(properties) {
            // update data from pageblock
            if (!this._component)
                return;
            if (this.isContentBlock()) {
                const isInitialization = Object.keys(properties)[0].includes(SINGLE_CONTENT_BLOCK_ID);
                const isContentBlockProps = Object.keys(properties).includes('numberOfBlocks');
                if (isInitialization) {
                    index_24.pageObject.setElement(this.rowId, this.data.id, { properties });
                }
                else {
                    if (isContentBlockProps) {
                        index_24.pageObject.setElement(this.rowId, this.data.id, { properties: Object.assign(Object.assign({}, this.data.properties), properties) });
                    }
                    else {
                        const element = this.data.properties[this._currentSingleContentBlockId];
                        if (element)
                            element.properties = properties;
                        index_24.pageObject.setElement(this.rowId, this.data.id, { properties: Object.assign(Object.assign({}, this.data.properties), { [this._currentSingleContentBlockId]: element }) });
                    }
                }
            }
            else {
                this.data && index_24.pageObject.setElement(this.rowId, this.data.id, { properties });
            }
        }
        async setTag(tag) {
            var _a;
            if (!this._component)
                return;
            if (tag.width === '100%')
                tag.width = Number(this.width);
            if (tag.height === '100%')
                tag.height = Number(this.height);
            if ((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators) {
                const builderTarget = this._component.getConfigurators().find((conf) => conf.target === 'Builders');
                if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setTag)
                    await builderTarget.setTag(tag);
            }
            this.data && index_24.pageObject.setElement(this.rowId, this.data.id, { tag });
        }
        async setProperties(data) {
            var _a;
            if (!this._component || !((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators))
                return;
            const builderTarget = this._component.getConfigurators().find((conf) => conf.target === 'Builders');
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setData) {
                await builderTarget.setData(data);
            }
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setRootDir)
                builderTarget.setRootDir((0, index_24.getRootDir)());
        }
        checkToolbar() {
            const isShowing = this.toolsStack.visible;
            const pageRows = document.querySelectorAll('ide-row');
            if (pageRows) {
                for (const row of pageRows) {
                    const toolbarElms = row.querySelectorAll('ide-toolbar');
                    if (toolbarElms)
                        toolbarElms.forEach((toolbarElm) => toolbarElm.hideToolbars());
                    row.classList.remove('active');
                }
            }
            isShowing && this.showToolbars();
        }
        // private renderError(errors: ValidationError[]) {
        //     this.pnlFormMsg.clearInnerHTML();
        //     errors.forEach(error => {
        //         this.pnlFormMsg.appendChild(
        //             <i-label
        //                 caption={`${error.property} ${error.message}`}
        //                 font={{color: Theme.colors.error.main, size: '0.75rem'}}
        //             ></i-label>
        //         );
        //     })
        // }
        _handleClick(event) {
            if (this._readonly)
                return super._handleClick(event, true);
            this.checkToolbar();
            return super._handleClick(event, true);
        }
        init() {
            super.init();
            this.readonly = this.getAttribute('readonly', true, false);
            components_11.application.EventBus.register(this, index_22.EVENT.ON_UPDATE_TOOLBAR, () => this.updateToolbar());
            components_11.application.EventBus.register(this, index_22.EVENT.ON_SET_ACTION_BLOCK, (data) => {
                const { id, element, elementId } = data;
                if (elementId && elementId === this.elementId) {
                    this.setData(Object.assign(Object.assign({}, this.data.properties), { [id]: element }));
                    this._currentSingleContentBlockId = id;
                }
            });
        }
        render() {
            return (this.$render("i-vstack", { id: "mainWrapper", width: "auto", maxWidth: "100%", maxHeight: "100%", position: "relative" },
                this.$render("i-panel", { id: "toolsStack", border: { radius: 4 }, background: { color: '#fff' }, class: "ide-toolbar", visible: false },
                    this.$render("i-hstack", { id: "toolbar", gap: "0.5rem" })),
                this.$render("i-panel", { id: "contentStack", height: "100%", position: 'relative', maxWidth: "100%", maxHeight: "100%", class: "ide-component", onClick: this.showToolbars.bind(this) },
                    this.$render("i-vstack", { id: "dragStack", verticalAlignment: "center", position: "absolute", left: "50%", top: "0px", width: "auto", height: "auto", class: "dragger" },
                        this.$render("i-grid-layout", { verticalAlignment: "center", autoFillInHoles: true, columnsPerRow: 4, gap: { column: '2px', row: '2px' }, class: "main-drag" },
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                            this.$render("i-icon", { name: "circle", width: 3, height: 3 }))),
                    this.$render("i-vstack", { id: "backdropStack", width: "100%", height: "100%", position: "absolute", top: "0px", left: "0px", zIndex: 15, visible: false, onClick: this.showToolList.bind(this) })),
                this.$render("i-panel", { position: "absolute", width: "100%", height: "15px", bottom: "-15px", zIndex: 999, border: { radius: '50px' }, visible: false, class: "bottom-block" }),
                this.$render("i-modal", { id: 'mdActions', title: 'Update Settings', closeIcon: { name: 'times' }, minWidth: 400, maxWidth: '900px', closeOnBackdropClick: false, onOpen: this.onShowModal.bind(this), onClose: this.onCloseModal.bind(this), class: "setting-modal" },
                    this.$render("i-panel", { padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' } },
                        this.$render("i-vstack", { id: "pnlFormMsg", padding: { left: '1.5rem', right: '1.5rem', top: '1rem' }, gap: "0.5rem", visible: false }),
                        this.$render("i-panel", { id: "pnlForm" }),
                        this.$render("i-form", { id: "form" })))));
        }
    };
    IDEToolbar = __decorate([
        (0, components_11.customElements)('ide-toolbar')
    ], IDEToolbar);
    exports.IDEToolbar = IDEToolbar;
});
define("@scom/scom-page-builder/common/collapse.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_12, index_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.collapseStyle = void 0;
    const Theme = index_28.currentTheme;
    exports.collapseStyle = components_12.Styles.style({
        display: 'block',
        $nest: {
            '.collapsible-toggle': {
                cursor: 'pointer',
                overflow: 'hidden',
            },
            '.collapsible-toggle:hover': {
                background: Theme.action.hover
            },
            'i-icon.collapsible-icon': {
                transition: 'transform 0.25s ease-in-out',
            },
            'i-icon.collapsible-icon.--rotate': {
                transform: 'rotate(-180deg)',
            },
            '.collapsible-content': {
                maxHeight: '0px',
                opacity: 0,
                overflow: 'hidden auto',
                transition: 'all 0.25s ease-in-out',
            },
            '.collapsible-content.--expanded': {
                maxHeight: '100vh',
                opacity: 1
            }
        }
    });
});
define("@scom/scom-page-builder/common/collapse.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/common/collapse.css.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, components_13, collapse_css_1, index_29, index_30, index_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapse = void 0;
    const Theme = components_13.Styles.Theme.ThemeVars;
    let Collapse = class Collapse extends components_13.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        get title() {
            return this.lblTitle.caption;
        }
        set title(value) {
            this.lblTitle.caption = value || "";
        }
        get item() {
            return this.pnlContent.children[0];
        }
        set item(target) {
            if (target && target instanceof components_13.Container) {
                this.pnlContent.clearInnerHTML();
                this.pnlContent.append(target);
            }
        }
        get expanded() {
            return this._expanded;
        }
        set expanded(value) {
            this._expanded = value;
            if (this._expanded) {
                this.iconCollapse.classList.add('--rotate');
                this.pnlContent.classList.add('--expanded');
            }
            else {
                this.iconCollapse.classList.remove('--rotate');
                this.pnlContent.classList.remove('--expanded');
            }
        }
        init() {
            this.classList.add(collapse_css_1.collapseStyle);
            super.init();
            this.style.display = "block";
            this.title = this.getAttribute('title', true);
            if (this.children.length > 1) {
                this.pnlContent.append(this.children[0]);
            }
            this.item = this.getAttribute('item', true);
            this.expanded = this.getAttribute('expanded', true, false);
        }
        onCollapse() {
            this.expanded = !this.expanded;
        }
        onShowSearch() {
            var _a;
            const category = ((_a = (0, index_30.getCategories)().find(item => item.title === this.title)) === null || _a === void 0 ? void 0 : _a.id) || '';
            components_13.application.EventBus.dispatch(index_29.EVENT.ON_FETCH_COMPONENTS, { category, pageNumber: 1, pageSize: index_31.PAGE_SIZE });
            components_13.application.EventBus.dispatch(index_29.EVENT.ON_TOGGLE_SEARCH_MODAL, true);
        }
        render() {
            return (this.$render("i-vstack", { gap: "1rem" },
                this.$render("i-vstack", { width: "100%" },
                    this.$render("i-hstack", { class: "collapsible-toggle", verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, gap: "0.5rem", onClick: this.onCollapse },
                        this.$render("i-hstack", { gap: 5, verticalAlignment: "center" },
                            this.$render("i-label", { id: "lblTitle", font: { bold: true } }),
                            this.$render("i-icon", { name: "search", fill: Theme.text.primary, width: 16, height: 16, class: "pointer", onClick: () => this.onShowSearch() })),
                        this.$render("i-icon", { id: "iconCollapse", class: "collapsible-icon", width: 16, height: 16, name: "angle-down" })),
                    this.$render("i-panel", { id: "pnlContent", class: "collapsible-content" }))));
        }
    };
    Collapse = __decorate([
        (0, components_13.customElements)('i-scom-page-builder-collapse')
    ], Collapse);
    exports.Collapse = Collapse;
});
define("@scom/scom-page-builder/common/index.ts", ["require", "exports", "@scom/scom-page-builder/common/toolbar.tsx", "@scom/scom-page-builder/common/collapse.tsx"], function (require, exports, toolbar_1, collapse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapse = exports.IDEToolbar = void 0;
    Object.defineProperty(exports, "IDEToolbar", { enumerable: true, get: function () { return toolbar_1.IDEToolbar; } });
    Object.defineProperty(exports, "Collapse", { enumerable: true, get: function () { return collapse_1.Collapse; } });
});
define("@scom/scom-page-builder/page/pageSection.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/page/pageSection.css.ts"], function (require, exports, components_14, index_32, index_33, index_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageSection = void 0;
    let PageSection = class PageSection extends components_14.Module {
        constructor(parent, options) {
            super(parent, options);
            this.pageElementMap = new WeakMap();
            this.observerOptions = {
                root: null,
                rootMargin: "0px"
            };
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const pageElement = this.pageElementMap.get(entry.target);
                        if (!pageElement)
                            return;
                        this.pageElementMap.delete(entry.target);
                        if (!(0, index_33.isEmpty)(pageElement.properties))
                            entry.target.setProperties(pageElement.properties);
                        pageElement.tag && entry.target.setTag(pageElement.tag);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
            this.rowId = '';
            this.setData = this.setData.bind(this);
        }
        get readonly() {
            return this._readonly;
        }
        set readonly(value) {
            this._readonly = value;
        }
        get data() {
            return index_34.pageObject.getElement(this.rowId, this.id);
        }
        init() {
            super.init();
            this.readonly = this.getAttribute('readonly', true, false);
        }
        clear() {
            this.pnlMain.clearInnerHTML();
        }
        async createToolbar(value) {
            const toolbar = this.$render("ide-toolbar", { readonly: this._readonly });
            toolbar.id = `elm-${value.id}`;
            toolbar.rowId = this.rowId;
            toolbar.elementId = value.id;
            toolbar.parent = this.pnlMain;
            this.pnlMain.appendChild(toolbar);
            await toolbar.fetchModule(value);
            this.pageElementMap.set(toolbar, value);
            this.observer.observe(toolbar);
        }
        async clearData() {
            const children = this.pnlMain.querySelectorAll('ide-toolbar');
            if (children && children.length)
                children.forEach((item) => item.remove());
        }
        async setData(rowId, value) {
            var _a;
            this.clearData();
            this.id = value.id;
            this.rowId = rowId;
            if (value.type === index_32.ElementType.PRIMITIVE) {
                await this.createToolbar(value);
            }
            else if ((_a = value === null || value === void 0 ? void 0 : value.elements) === null || _a === void 0 ? void 0 : _a.length) {
                for (let element of value.elements) {
                    await this.createToolbar(element);
                }
            }
        }
        render() {
            return (this.$render("i-panel", { id: 'pnlPageSection', maxWidth: "100%", maxHeight: "100%", height: "100%" },
                this.$render("i-panel", { position: "absolute", width: 15, height: "100%", top: "0px", left: "-18px", zIndex: 999, border: { radius: '50px' }, visible: false, class: "front-block block" }),
                this.$render("i-panel", { id: "pageSectionWrapper", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", padding: { top: '1.5rem', bottom: '1.5rem' } },
                    this.$render("i-panel", { id: "pnlMain", maxWidth: "100%", maxHeight: "100%" })),
                this.$render("i-panel", { position: "absolute", width: 15, height: "100%", top: "0px", right: "-18px", zIndex: 999, border: { radius: '50px' }, visible: false, class: "back-block block" })));
        }
    };
    PageSection = __decorate([
        (0, components_14.customElements)('ide-section')
    ], PageSection);
    exports.PageSection = PageSection;
});
define("@scom/scom-page-builder/page/pageFooter.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_15, index_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_35.currentTheme;
    components_15.Styles.cssRule('scpage-page-footer', {
        width: '100%',
        background: Theme.background.main,
        borderTop: '1px solid #dfe5eb',
        $nest: {
            '&.sticky': {
                //@ts-ignore
                position: 'fixed !important',
                bottom: '0',
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageFooter.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageFooter.css.ts"], function (require, exports, components_16, assets_1, index_36) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageFooter = void 0;
    const Theme = index_36.currentTheme;
    let PageFooter = class PageFooter extends components_16.Module {
        constructor(parent) {
            super(parent);
            this._sticky = false;
        }
        async init() {
            super.init();
        }
        get footer() {
            return this._footer;
        }
        set footer(value) {
            this._footer = value;
            this.lbFooter.caption = value;
        }
        get sticky() {
            return this._sticky;
        }
        set sticky(value) {
            this._sticky = value;
            this._sticky
                ? this.classList.add('sticky')
                : this.classList.remove('sticky');
        }
        render() {
            return (this.$render("i-hstack", { class: "footer", justifyContent: "start", alignItems: "center", padding: { left: 20, right: 20, top: 10, bottom: 10 } },
                this.$render("i-image", { height: 30, width: 30, url: assets_1.default.icons.logo, margin: { right: 10 } }),
                this.$render("i-panel", null,
                    this.$render("i-label", { id: "lbFooter", font: { color: Theme.text.primary } })),
                this.$render("i-panel", null)));
        }
    };
    PageFooter = __decorate([
        (0, components_16.customElements)('scpage-page-footer')
    ], PageFooter);
    exports.PageFooter = PageFooter;
});
define("@scom/scom-page-builder/dialogs/confirmDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_17, index_37, index_38) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfirmDialog = void 0;
    const Theme = index_38.currentTheme;
    ;
    let ConfirmDialog = class ConfirmDialog extends components_17.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        async init() {
            super.init();
            (0, index_37.assignAttr)(this);
            if (this.message)
                this.lbMessage.caption = this.message;
            if (this.cancelButtonText)
                this.btnCancel.caption = this.cancelButtonText;
            if (this.confirmButtonText)
                this.btnConfirm.caption = this.confirmButtonText;
        }
        async confirm() {
            if (this.onConfirm)
                await this.onConfirm();
            this.dialog.visible = false;
        }
        async cancel() {
            if (this.onCancel)
                await this.onCancel();
            this.dialog.visible = false;
        }
        show() {
            this.dialog.visible = true;
        }
        hide() {
            this.dialog.visible = false;
        }
        render() {
            return (this.$render("i-modal", { id: "dialog", showBackdrop: true, maxWidth: "400px", popupPlacement: "center" },
                this.$render("i-panel", { padding: { top: 20, bottom: 20, left: 20, right: 20 } },
                    this.$render("i-label", { id: "lbMessage", caption: "Confirm?" })),
                this.$render("i-hstack", { justifyContent: "end", alignItems: "center", padding: { top: 5, bottom: 5 } },
                    this.$render("i-button", { id: "btnCancel", caption: "No", onClick: this.cancel, background: { color: Theme.colors.success.main } }),
                    this.$render("i-button", { id: "btnConfirm", caption: "Yes", onClick: this.confirm, margin: { left: 5 } }))));
        }
    };
    ConfirmDialog = __decorate([
        (0, components_17.customElements)('scpage-confirm-dialog')
    ], ConfirmDialog);
    exports.ConfirmDialog = ConfirmDialog;
});
define("@scom/scom-page-builder/dialogs/loadingDialog.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_18, index_39) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_39.currentTheme;
    const spin = components_18.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    components_18.Styles.cssRule('scpage-loading-dialog', {
        $nest: {
            'i-modal .modal': {
                borderRadius: '5px',
            },
            'i-label': {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '100%'
            },
            '.message-box': {
                textAlign: 'center',
                overflow: 'hidden'
            },
            '.spinner': {
                display: "inline-block",
                width: "50px",
                height: "50px",
                border: "3px solid rgba(255,255,255,.3)",
                borderRadius: "50%",
                borderTopColor: Theme.colors.primary.main,
                "animation": `${spin} 1s ease-in-out infinite`,
                "-webkit-animation": `${spin} 1s ease-in-out infinite`
            }
        }
    });
});
define("@scom/scom-page-builder/dialogs/loadingDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/dialogs/loadingDialog.css.ts"], function (require, exports, components_19, index_40) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingDialog = void 0;
    let LoadingDialog = class LoadingDialog extends components_19.Module {
        constructor(parent, options) {
            super(parent, options);
            (0, index_40.assignAttr)(this);
        }
        async init() {
            super.init();
        }
        show() {
            this.mdLoading.visible = true;
        }
        hide() {
            this.mdLoading.visible = false;
        }
        updateMessage(message) {
            this.lbMessage.caption = message;
        }
        render() {
            return (this.$render("i-modal", { id: 'mdLoading', showBackdrop: true, closeOnBackdropClick: false, maxWidth: 350, height: 300 },
                this.$render("i-panel", { class: 'message-box' },
                    this.$render("i-hstack", { justifyContent: 'center', alignItems: 'center' },
                        this.$render("i-panel", { class: 'spinner' })),
                    this.$render("i-label", { id: 'lbMessage', caption: 'Loading...', margin: { top: 5 } }))));
        }
    };
    LoadingDialog = __decorate([
        (0, components_19.customElements)('scpage-loading-dialog')
    ], LoadingDialog);
    exports.LoadingDialog = LoadingDialog;
});
define("@scom/scom-page-builder/dialogs/searchComponentsDialog.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_20, index_41) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_41.currentTheme;
    components_20.Styles.cssRule('ide-search-components-dialog', {
        $nest: {
            '.search-modal': {
                $nest: {
                    '.icon-close svg': {
                        fill: Theme.colors.primary.main
                    },
                    '.i-modal_header': {
                        padding: '1rem 1rem 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600
                    },
                    '.modal': {
                        padding: 0
                    },
                    '.pnl-component:hover': {
                        border: `1px solid ${Theme.colors.primary.main}`
                    }
                }
            }
        }
    });
});
define("@scom/scom-page-builder/dialogs/searchComponentsDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/dialogs/searchComponentsDialog.css.ts"], function (require, exports, components_21, index_42, index_43, assets_2, index_44, index_45) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchComponentsDialog = void 0;
    const Theme = components_21.Styles.Theme.ThemeVars;
    let SearchComponentsDialog = class SearchComponentsDialog extends components_21.Module {
        constructor() {
            super(...arguments);
            this.totalPage = 0;
            this.pageNumber = 0;
            this.onSelectIndex = () => {
                this.pageNumber = this.paginationElm.currentPage;
                this.onFetchData();
            };
            this.resetPaging = () => {
                this.pageNumber = 1;
                if (this.paginationElm)
                    this.paginationElm.currentPage = 1;
            };
            this.renderUI = () => {
                let nodes = [];
                this.totalPage = Math.ceil(this.total / index_44.PAGE_SIZE);
                this.paginationElm.visible = this.totalPage > 1;
                if (!this.components.length) {
                    this.pnlComponents.clearInnerHTML();
                    this.pnlComponents.appendChild(this.$render("i-label", { caption: "No components", margin: { top: 'auto', bottom: 'auto' } }));
                    return;
                }
                for (const item of this.components) {
                    const pnl = (this.$render("i-vstack", { class: "text-center pointer pnl-component", verticalAlignment: "center", horizontalAlignment: "center", gap: "0.5rem", overflow: 'hidden', background: { color: Theme.action.hover }, border: { radius: 8, width: 1, style: 'solid', color: Theme.text.primary }, width: 'calc(33.33% - 7px)', minWidth: 200, minHeight: 100, padding: { top: 10, bottom: 10, left: 10, right: 10 }, onClick: () => this.onSelected(item) },
                        this.$render("i-image", { url: item.imgUrl || assets_2.default.icons.logo, width: 24, height: 24, display: "block" }),
                        this.$render("i-label", { caption: item.name, font: { size: '0.813rem' }, opacity: 0.7, maxHeight: 34, overflow: "hidden" })));
                    nodes.push(pnl);
                }
                this.pnlComponents.clearInnerHTML();
                this.pnlComponents.append(...nodes);
            };
            this.onSearch = () => {
                this.resetPaging();
                this.onFetchData();
            };
        }
        init() {
            super.init();
            (0, index_42.assignAttr)(this);
        }
        get components() {
            var _a;
            return ((_a = (0, index_43.getSearchData)()) === null || _a === void 0 ? void 0 : _a.items) || [];
        }
        get total() {
            var _a;
            return ((_a = (0, index_43.getSearchData)()) === null || _a === void 0 ? void 0 : _a.total) || 0;
        }
        hide() {
            this.mdSearch.visible = false;
        }
        show() {
            this.mdSearch.visible = true;
            this.resetPaging();
        }
        onFetchData() {
            const oldOptions = (0, index_43.getSearchOptions)();
            components_21.application.EventBus.dispatch(index_45.EVENT.ON_FETCH_COMPONENTS, {
                category: oldOptions.category || '',
                pageNumber: this.pageNumber,
                pageSize: oldOptions.pageSize,
                keyword: this.inputSearch.value.trim()
            });
        }
        onSelected(item) {
            this.mdSearch.visible = false;
            (0, index_43.addPageBlock)(item);
            components_21.application.EventBus.dispatch(index_45.EVENT.ON_UPDATE_SIDEBAR, { category: item.category });
        }
        render() {
            return (this.$render("i-modal", { id: 'mdSearch', minWidth: 400, maxWidth: 900, title: "Search", closeOnBackdropClick: false, closeIcon: { name: 'times' }, class: "search-modal" },
                this.$render("i-panel", { padding: { top: '1rem', bottom: '2rem', left: '1rem', right: '1rem' } },
                    this.$render("i-vstack", { id: "pnlMain", gap: '1rem' },
                        this.$render("i-input", { id: "inputSearch", width: 300, maxWidth: "100%", height: 32, border: { radius: 5, style: 'solid', width: 1, color: Theme.text.primary }, placeholder: "Search components", onChanged: this.onSearch }),
                        this.$render("i-hstack", { id: "pnlComponents", minHeight: 120, gap: 10, wrap: "wrap", horizontalAlignment: "center" }),
                        this.$render("i-pagination", { id: "paginationElm", margin: { top: 16, bottom: 16, left: 'auto', right: 'auto' }, width: "auto", currentPage: this.pageNumber, totalPages: this.totalPage, onPageChanged: this.onSelectIndex })))));
        }
    };
    __decorate([
        (0, components_21.observable)()
    ], SearchComponentsDialog.prototype, "totalPage", void 0);
    SearchComponentsDialog = __decorate([
        (0, components_21.customElements)('ide-search-components-dialog')
    ], SearchComponentsDialog);
    exports.SearchComponentsDialog = SearchComponentsDialog;
});
define("@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_22.Styles.cssRule('ide-row-settings-dialog', {
        $nest: {
            '.custom-modal': {
                $nest: {
                    '.i-modal_header': {
                        padding: '1rem 1rem 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600
                    },
                    'i-button': {
                        padding: '0.5rem 1rem'
                    },
                    '.modal': {
                        maxHeight: 'calc(100vh - 48px)',
                        padding: 0
                    }
                }
            }
        }
    });
});
define("@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts"], function (require, exports, components_23, index_46, index_47, index_48) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RowSettingsDialog = void 0;
    const Theme = components_23.Styles.Theme.ThemeVars;
    let RowSettingsDialog = class RowSettingsDialog extends components_23.Module {
        constructor(parent, options) {
            super(parent, options);
            this.rowId = '';
            (0, index_46.assignAttr)(this);
        }
        get data() {
            return index_48.pageObject.getRow(this.rowId) || {};
        }
        get type() {
            return this._type;
        }
        set type(value) {
            this._type = value;
        }
        init() {
            super.init();
            this.type = this.getAttribute('type', true);
        }
        show(id) {
            this.rowId = id || '';
            this.reset();
            this.renderForm();
            this.dialog.visible = true;
        }
        getSchema() {
            let jsonSchema;
            if (this.type === 'color') {
                jsonSchema = {
                    type: 'object',
                    properties: {
                        "backgroundColor": {
                            type: 'string',
                            format: 'color'
                        }
                    }
                };
            }
            else {
                jsonSchema = {
                    type: 'object',
                    required: ['columnLayout'],
                    properties: {
                        "columnLayout": {
                            type: 'string',
                            enum: [
                                index_47.IColumnLayoutType.FIXED,
                                index_47.IColumnLayoutType.AUTOMATIC
                            ],
                            default: index_47.IColumnLayoutType.FIXED
                        },
                        "columnsNumber": {
                            type: 'number'
                        },
                        "maxColumnsPerRow": {
                            type: 'number'
                        },
                        "columnMinWidth": {
                            type: 'number'
                        },
                        align: {
                            type: 'string',
                            enum: [
                                'left',
                                'center',
                                'right'
                            ]
                        }
                    }
                };
            }
            const formOptions = {
                columnWidth: '100%',
                columnsPerRow: 1,
                confirmButtonOptions: {
                    caption: 'Confirm',
                    backgroundColor: Theme.colors.primary.main,
                    fontColor: Theme.colors.primary.contrastText,
                    hide: false,
                    onClick: async () => {
                        const config = await this.formElm.getFormData();
                        const params = this.type === 'color' ? config : { config };
                        if (this.onSave)
                            await this.onSave(params);
                        this.dialog.visible = false;
                    }
                }
            };
            return { jsonSchema, formOptions };
        }
        renderForm() {
            var _a, _b;
            const { jsonSchema, formOptions } = this.getSchema();
            this.formElm.jsonSchema = jsonSchema;
            this.formElm.formOptions = formOptions;
            this.formElm.renderForm();
            const config = this.type === 'column' ?
                ((_a = this.data) === null || _a === void 0 ? void 0 : _a.config) || {
                    columnLayout: index_47.IColumnLayoutType.FIXED,
                    columnsNumber: 12,
                    align: 'left'
                } : { backgroundColor: ((_b = this.data) === null || _b === void 0 ? void 0 : _b.backgroundColor) || '' };
            this.formElm.setFormData(Object.assign({}, config));
        }
        close() {
            this.dialog.visible = false;
        }
        reset() {
            this.formElm.clearFormData();
        }
        render() {
            return (this.$render("i-modal", { id: 'dialog', showBackdrop: true, closeOnBackdropClick: false, closeIcon: { name: 'times' }, visible: false, minWidth: 400, maxWidth: 500, title: "Section Settings", class: "custom-modal" },
                this.$render("i-panel", { padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-form", { id: "formElm" }))));
        }
    };
    RowSettingsDialog = __decorate([
        (0, components_23.customElements)('ide-row-settings-dialog')
    ], RowSettingsDialog);
    exports.RowSettingsDialog = RowSettingsDialog;
});
define("@scom/scom-page-builder/dialogs/index.ts", ["require", "exports", "@scom/scom-page-builder/dialogs/confirmDialog.tsx", "@scom/scom-page-builder/dialogs/loadingDialog.tsx", "@scom/scom-page-builder/dialogs/searchComponentsDialog.tsx", "@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx"], function (require, exports, confirmDialog_1, loadingDialog_1, searchComponentsDialog_1, rowSettingsDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchComponentsDialog = exports.RowSettingsDialog = exports.LoadingDialog = exports.ConfirmDialog = void 0;
    Object.defineProperty(exports, "ConfirmDialog", { enumerable: true, get: function () { return confirmDialog_1.ConfirmDialog; } });
    Object.defineProperty(exports, "LoadingDialog", { enumerable: true, get: function () { return loadingDialog_1.LoadingDialog; } });
    Object.defineProperty(exports, "SearchComponentsDialog", { enumerable: true, get: function () { return searchComponentsDialog_1.SearchComponentsDialog; } });
    Object.defineProperty(exports, "RowSettingsDialog", { enumerable: true, get: function () { return rowSettingsDialog_1.RowSettingsDialog; } });
});
define("@scom/scom-page-builder/page/pageRow.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_24, index_49) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_49.currentTheme;
    components_24.Styles.cssRule('#editor', {
        $nest: {
            '.hidden': {
                display: 'none'
            }
        }
    });
    components_24.Styles.cssRule('ide-row', {
        display: 'block',
        position: 'relative',
        transition: 'translate .3s ease-in',
        border: '3px solid transparent',
        $nest: {
            '.drag-stack': {
                visibility: 'hidden',
                opacity: 0,
                cursor: 'move',
                zIndex: 10,
                $nest: {
                    '.main-drag': {
                        paddingLeft: 7,
                        width: 15,
                        height: 22,
                        overflow: 'hidden'
                    }
                }
            },
            '&.dropzone:hover': {
                $nest: {
                    '.drag-stack': {
                        visibility: 'initial',
                        opacity: 0.48,
                        transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1),visibility 0s .2s'
                    }
                }
            },
            '&.disabled:hover': {
                cursor: 'default',
                backgroundColor: 'inherit'
            },
            '.row-actions-bar': {
                opacity: 0,
                zIndex: 10,
                position: 'absolute',
                top: '0',
                left: '-3em',
                width: '34px',
                padding: 0,
                transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
                $nest: {
                    '.actions': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        padding: 3,
                        background: 'transparent',
                        $nest: {
                            '&:hover': {
                                boxShadow: 'none',
                                background: Theme.action.hover,
                                transition: 'background .3s ease-in'
                            }
                        }
                    },
                    '&:hover': {
                        opacity: '1 !important',
                        visibility: 'initial',
                        $nest: {
                            '> i-panel': {
                                boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                            }
                        }
                    }
                }
            },
            '.btn-add': {
                visibility: 'hidden',
                opacity: 0,
                transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
                $nest: {
                    'i-icon svg': {
                        fill: Theme.colors.primary.contrastText
                    }
                }
            },
            '&:hover': {
                $nest: {
                    '.row-actions-bar': {
                        opacity: '1 !important',
                        transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
                        $nest: {
                            '> i-panel': {
                                boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                            }
                        }
                    },
                    '.btn-add': {
                        visibility: 'visible',
                        opacity: 1
                    }
                }
            },
            'h1, h2, h3, h4, h5, h6': {
                margin: 0
            },
            textarea: {
                resize: 'none'
            },
            '&.active, &:focus': {
                border: `2px solid ${Theme.colors.primary.main}`,
                transition: 'border ease-in .2s'
            },
            '.is-dragenter': {
                background: '#cae5fbc4',
                border: `1px solid ${Theme.colors.primary.main}`,
                height: '100%',
                opacity: 1
            },
            '.rectangle': {
                display: 'none',
                position: 'absolute',
                top: 0,
                height: '100%',
                border: 'solid 2px blue'
            },
            '.border-x-dotted': {
                borderLeft: 'dotted 1px black',
                borderRight: 'dotted 1px black'
            },
            '.border-dotted': {
                border: 'dotted 1px black'
            },
            '.pnl-empty': {
                userSelect: 'none'
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageRow.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/page/pageRow.css.ts"], function (require, exports, components_25, index_50, index_51, index_52, index_53, index_54) {
    "use strict";
    var PageRow_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageRow = void 0;
    const Theme = components_25.Styles.Theme.ThemeVars;
    let PageRow = PageRow_1 = class PageRow extends components_25.Module {
        constructor(parent) {
            super(parent);
            this.isResizing = false;
            this.rowId = '';
            this.isDragging = false;
            this.gridColumnWidth = 0;
            this.isCloned = true;
            this.isChanged = true;
            this.setData = this.setData.bind(this);
        }
        get data() {
            return this.rowId ? index_52.pageObject.getRow(this.rowId) : this.rowData;
        }
        get maxColumn() {
            var _a;
            const rowId = (_a = this.id) === null || _a === void 0 ? void 0 : _a.replace('row-', '');
            return index_52.pageObject.getColumnsNumber(rowId);
        }
        get align() {
            var _a;
            const rowId = (_a = this.id) === null || _a === void 0 ? void 0 : _a.replace('row-', '');
            const config = index_52.pageObject.getConfig(rowId);
            return (config === null || config === void 0 ? void 0 : config.align) || 'left';
        }
        init() {
            var _a, _b;
            this._readonly = this.getAttribute('readonly', true, false);
            super.init();
            const hasData = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.length;
            this.toggleUI(hasData);
            this.renderFixedGrid();
            this.initEventListeners();
            this.initEventBus();
        }
        toggleUI(value) {
            if (this.pnlRow)
                this.pnlRow.opacity = value ? 1 : 0;
            if (this.pnlEmty)
                this.pnlEmty.visible = !value;
            this.updateAlign(); // TODO: check
        }
        async createNewElement(i) {
            const sectionData = this.data.elements[i];
            return this.createElementFn(sectionData);
        }
        async createElementFn(data) {
            const pageSection = (this.$render("ide-section", { id: data.id, readonly: this._readonly, display: "block", maxWidth: "100%", maxHeight: "100%", position: "relative" }));
            if (!this._readonly) {
                pageSection.setAttribute('draggable', 'true');
                pageSection.style.gridRow = '1';
                pageSection.style.gridColumn = `${data.column || 1} / span ${data.columnSpan || 1}`;
                pageSection.setAttribute('data-column', `${data.column || 1}`);
                pageSection.setAttribute('data-column-span', `${data.columnSpan || 1}`);
            }
            pageSection.visible = !!data;
            this.pnlRow.appendChild(pageSection);
            await pageSection.setData(this.rowId, data);
            return pageSection;
        }
        async addElement(data) {
            if (!data)
                return;
            const element = await this.createElementFn(data);
            this.toggleUI(true);
            return element;
        }
        async clearData() {
            var _a;
            const children = (_a = this.pnlRow) === null || _a === void 0 ? void 0 : _a.querySelectorAll('ide-section');
            if (children === null || children === void 0 ? void 0 : children.length)
                children.forEach((item) => item.remove());
        }
        async setData(rowData) {
            var _a, _b, _c, _d;
            this.clearData();
            const { id, row, image, elements, backgroundColor } = rowData;
            this.id = `row-${id}`;
            this.rowId = id;
            this.rowData = rowData;
            this.setAttribute('data-row', `${row}`);
            if (image)
                this.background.image = image;
            else if (backgroundColor)
                this.background.color = backgroundColor;
            this.isCloned = ((_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.nodeName) !== 'BUILDER-HEADER';
            this.isChanged = ((_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.nodeName) !== 'BUILDER-HEADER';
            if (elements && elements.length > 0) {
                for (let i = 0; i < elements.length; i++) {
                    await this.createNewElement(i);
                }
            }
            this.actionsBar.minHeight = '100%';
            const hasData = (_d = (_c = this.data) === null || _c === void 0 ? void 0 : _c.elements) === null || _d === void 0 ? void 0 : _d.length;
            this.toggleUI(hasData);
            this.updateColumn();
        }
        onOpenRowSettingsDialog(type) {
            if (type === 'color')
                this.mdRowColorSetting.show(this.rowId);
            else
                this.mdRowColumnSetting.show(this.rowId);
        }
        onSaveRowSettings(data) {
            const updateCmd = new index_53.UpdateRowSettingsCommand(this, data);
            index_53.commandHistory.execute(updateCmd);
        }
        updateColumn() {
            this.updateGrid();
            this.updateFixedGrid();
            this.updateAlign();
        }
        updateGrid() {
            this.gridColumnWidth = (this.pnlRow.offsetWidth - index_51.GAP_WIDTH * (this.maxColumn - 1)) / this.maxColumn;
            const fixedGrid = this.pnlRow.querySelector('.fixed-grid');
            fixedGrid && this.updateGridColumn(fixedGrid);
            this.updateGridColumn(this.pnlRow);
        }
        updateAlign() {
            var _a, _b;
            let alignValue = 'start';
            switch (this.align) {
                case 'right':
                    alignValue = 'end';
                    break;
                case 'center':
                    alignValue = 'center';
                    break;
            }
            this.pnlRow.grid = { horizontalAlignment: alignValue };
            this.pnlRow.style.maxWidth = '100%';
            if (alignValue === 'start') {
                this.pnlRow.templateColumns = [`repeat(${this.maxColumn}, 1fr)`];
            }
            else {
                this.pnlRow.templateColumns = ['min-content'];
                const sections = Array.from(this.pnlRow.querySelectorAll('ide-section'));
                for (let section of sections) {
                    const sectionId = section.id;
                    const rowId = (_a = this.id) === null || _a === void 0 ? void 0 : _a.replace('row-', '');
                    const element = index_52.pageObject.getElement(rowId, sectionId);
                    let width = (_b = element === null || element === void 0 ? void 0 : element.tag) === null || _b === void 0 ? void 0 : _b.width;
                    if (!width) {
                        const columnSpan = Number(section.dataset.columnSpan);
                        const widthNumber = columnSpan * this.gridColumnWidth - ((columnSpan - 1) * index_51.GAP_WIDTH);
                        width = `${widthNumber}px`;
                    }
                    section.width = width;
                }
            }
        }
        async onClone() {
            const rowData = index_52.pageObject.getRow(this.rowId);
            if (!rowData)
                return;
            components_25.application.EventBus.dispatch(index_50.EVENT.ON_CLONE, { rowData, id: this.id });
        }
        onDeleteRow() {
            const prependRow = this.previousElementSibling;
            const appendRow = this.nextElementSibling;
            const rowCmd = new index_53.UpdateRowCommand(this, this.parent, this.data, true, (prependRow === null || prependRow === void 0 ? void 0 : prependRow.id) || '', (appendRow === null || appendRow === void 0 ? void 0 : appendRow.id) || '');
            index_53.commandHistory.execute(rowCmd);
        }
        onMoveUp() {
            this.actionsBar.classList.add('hidden');
            this.dragStack.classList.add('hidden');
            this.background = { color: '#f2f2f2' };
        }
        onMoveDown() {
            this.actionsBar.classList.remove('hidden');
            this.dragStack.classList.remove('hidden');
            this.background = { color: 'initial' };
        }
        renderFixedGrid() {
            this.pnlRow.clearInnerHTML();
            this.pnlRow.appendChild(this.$render("i-panel", { class: "rectangle" }));
            const grid = (this.$render("i-grid-layout", { position: "absolute", width: "100%", height: "100%", minHeight: "3rem", top: "0px", left: "0px", class: "fixed-grid" }));
            for (let i = 0; i < this.maxColumn; i++) {
                const elm = this.$render("i-panel", { class: "fixed-grid-item" });
                elm.setAttribute('data-column', `${i + 1}`);
                elm.style.gridColumn = `${i + 1}`;
                grid.append(elm);
            }
            this.pnlRow.appendChild(grid);
        }
        updateFixedGrid() {
            const grid = this.pnlRow.querySelector('.fixed-grid');
            if (!grid)
                return;
            grid.clearInnerHTML();
            for (let i = 0; i < this.maxColumn; i++) {
                const elm = this.$render("i-panel", { class: "fixed-grid-item" });
                elm.setAttribute('data-column', `${i + 1}`);
                elm.style.gridColumn = `${i + 1}`;
                grid.append(elm);
            }
        }
        updateGridColumn(grid) {
            grid.templateColumns = [`repeat(${this.maxColumn}, ${this.gridColumnWidth}px)`];
            grid.gap = { column: `${index_51.GAP_WIDTH}px` };
        }
        initEventListeners() {
            this.onClick = (target, event) => this.setActive();
            let self = this;
            let newWidth = 0;
            let newHeight = 0;
            let currentDot;
            let startX = 0;
            let startY = 0;
            let toolbar;
            let dragStartTarget;
            let dragOverTarget;
            this.addEventListener('mousedown', (e) => {
                const target = e.target;
                const parent = target.closest('.resize-stack');
                if (!parent)
                    return;
                e.preventDefault();
                const resizableElm = target.closest('ide-section');
                self.currentElement = resizableElm;
                toolbar = target.closest('ide-toolbar');
                self.addDottedLines();
                self.isResizing = true;
                currentDot = parent;
                startX = e.clientX;
                startY = e.clientY;
                self.currentWidth = toolbar.offsetWidth;
                self.currentHeight = toolbar.offsetHeight;
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
            function mouseMoveHandler(e) {
                if (!self.isResizing || !toolbar)
                    return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                if (currentDot.classList.contains('topLeft')) {
                    newWidth = self.currentWidth - deltaX;
                    newHeight = self.currentHeight - deltaY;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('topRight')) {
                    newWidth = self.currentWidth + deltaX;
                    newHeight = self.currentHeight - deltaY;
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('bottomLeft')) {
                    newWidth = self.currentWidth - deltaX;
                    newHeight = self.currentHeight + deltaY;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('bottomRight')) {
                    newWidth = self.currentWidth + deltaX;
                    newHeight = self.currentHeight + deltaY;
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('top')) {
                    newHeight = self.currentHeight - deltaY;
                    updateDimension(undefined, newHeight);
                }
                else if (currentDot.classList.contains('bottom')) {
                    newHeight = self.currentHeight + deltaY;
                    updateDimension(undefined, newHeight);
                }
                else if (currentDot.classList.contains('left')) {
                    newWidth = self.currentWidth - deltaX;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, undefined);
                }
                else if (currentDot.classList.contains('right')) {
                    newWidth = self.currentWidth + deltaX;
                    updateDimension(newWidth, undefined);
                }
            }
            function mouseUpHandler(e) {
                e.preventDefault();
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                self.removeDottedLines();
                self.isResizing = false;
                if (!toolbar)
                    return;
                toolbar.width = 'initial';
                toolbar.height = 'initial';
                const contentStack = toolbar.querySelector('#contentStack');
                if (contentStack) {
                    contentStack.height = 'initial';
                    contentStack.width = 'initial';
                }
                self.currentElement.width = 'initial';
                self.currentElement.height = 'initial';
                const resizeCmd = new index_53.ResizeElementCommand(self.currentElement, toolbar, self.currentWidth, self.currentHeight, newWidth, newHeight);
                index_53.commandHistory.execute(resizeCmd);
                self.currentElement.style.left = 'initial';
                self.currentElement = null;
                toolbar = null;
            }
            function updateDimension(newWidth, newHeight) {
                if (newWidth !== undefined)
                    toolbar.width = newWidth;
                if (newHeight !== undefined)
                    toolbar.height = newHeight;
                const contentStack = toolbar.querySelector('#contentStack');
                if (contentStack) {
                    if (newWidth !== undefined)
                        contentStack.width = newWidth;
                    if (newHeight !== undefined)
                        contentStack.height = newHeight;
                }
            }
            function updateClass(elm, className) {
                if (elm.visible) {
                    elm.classList.add(className);
                }
                else {
                    elm.classList.remove(className);
                }
            }
            this.addEventListener('dragstart', function (event) {
                const eventTarget = event.target;
                if (eventTarget instanceof PageRow_1)
                    return;
                const target = eventTarget.closest && eventTarget.closest('ide-section');
                const toolbar = target === null || target === void 0 ? void 0 : target.querySelector('ide-toolbar');
                const cannotDrag = toolbar &&
                    (toolbar.classList.contains('is-editing') ||
                        toolbar.classList.contains('is-setting'));
                if (target && !cannotDrag) {
                    self.pnlRow.templateColumns = [`repeat(${self.maxColumn}, 1fr)`];
                    self.currentElement = target;
                    self.currentElement.opacity = 0;
                    components_25.application.EventBus.dispatch(index_50.EVENT.ON_SET_DRAG_ELEMENT, target);
                    self.addDottedLines();
                }
                else {
                    event.preventDefault();
                }
                dragStartTarget = eventTarget;
            });
            this.addEventListener('drag', function (event) { });
            document.addEventListener('dragend', function (event) {
                if (self.currentElement && !self.currentElement.classList.contains('builder-item'))
                    self.currentElement.opacity = 1;
                self.currentElement = null;
                components_25.application.EventBus.dispatch(index_50.EVENT.ON_SET_DRAG_ELEMENT, null);
                self.isDragging = false;
                (0, index_52.setDragData)(null);
                self.removeDottedLines();
                updateRectangles();
                removeClass('is-dragenter');
                removeClass('row-entered');
                removeClass('is-dragging');
                // self.updateAlign();
            });
            function dragEnter(enterTarget, clientX, clientY, isOverlap = false) {
                var _a, _b, _c, _d;
                const elementConfig = (0, index_52.getDragData)();
                const pageRow = enterTarget.closest('ide-row');
                if (pageRow && ((_a = elementConfig === null || elementConfig === void 0 ? void 0 : elementConfig.module) === null || _a === void 0 ? void 0 : _a.name) === 'sectionStack') {
                    pageRow.classList.add('row-entered');
                }
                if (!enterTarget || !self.currentElement)
                    return;
                let target;
                if (isOverlap)
                    target = findNearestFixedGridInRow(clientX);
                else
                    target = enterTarget.closest('.fixed-grid-item');
                self.addDottedLines();
                if (target) {
                    const column = Number(target.dataset.column);
                    const columnSpan = self.currentElement.dataset.columnSpan ? Number(self.currentElement.dataset.columnSpan) : index_51.MIN_COLUMN;
                    const colSpan = Math.min(columnSpan, self.maxColumn);
                    const colStart = Math.min(column, self.maxColumn - colSpan + 1);
                    const grid = target.closest('.grid');
                    const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
                    const sortedSections = sections.sort((a, b) => Number(a.dataset.column) - Number(b.dataset.column));
                    const findedSection = sortedSections.find((section) => {
                        const sectionColumn = Number(section.dataset.column);
                        const sectionColumnSpan = Number(section.dataset.columnSpan);
                        const colData = colStart + colSpan;
                        return colStart >= sectionColumn && colData <= sectionColumn + sectionColumnSpan;
                    });
                    if (findedSection && findedSection != self.currentElement)
                        return;
                    const rectangle = target
                        .closest('.fixed-grid')
                        .parentNode.querySelector(`.rectangle`);
                    rectangle.style.display = 'block';
                    rectangle.style.left = (self.gridColumnWidth + index_51.GAP_WIDTH) * (colStart - 1) + 'px';
                    rectangle.style.width =
                        self.gridColumnWidth * columnSpan + index_51.GAP_WIDTH * (columnSpan - 1) + 'px';
                }
                else {
                    const section = enterTarget.closest('ide-section');
                    if (section && !section.isSameNode(self.currentElement)) {
                        const toolbar = enterTarget.closest('ide-toolbar');
                        if (toolbar) {
                            const { y, height } = toolbar.getBoundingClientRect();
                            const bottomBlock = toolbar.querySelector('.bottom-block');
                            if (bottomBlock) {
                                bottomBlock.visible = Math.ceil(clientY) >= Math.ceil(y + height) - 2;
                                updateClass(bottomBlock, 'is-dragenter');
                            }
                        }
                        const curElmCol = Number((_b = section === null || section === void 0 ? void 0 : section.dataset) === null || _b === void 0 ? void 0 : _b.column);
                        const curElmColSpan = Number((_c = section === null || section === void 0 ? void 0 : section.dataset) === null || _c === void 0 ? void 0 : _c.columnSpan);
                        const sections = Array.from((_d = section.closest('#pnlRow')) === null || _d === void 0 ? void 0 : _d.querySelectorAll('ide-section'));
                        const nextElm = sections.find((el) => {
                            const column = Number(el.dataset.column);
                            return !isNaN(column) && (curElmCol + curElmColSpan === column);
                        });
                        const showHiddenBlock = curElmCol === 1 && (curElmCol + curElmColSpan === self.maxColumn + 1) ||
                            (nextElm) ||
                            (curElmCol + curElmColSpan === self.maxColumn + 1);
                        if (showHiddenBlock) {
                            const { left, right } = section.getBoundingClientRect();
                            const backBlock = section.querySelector('.back-block');
                            const frontBlock = section.querySelector('.front-block');
                            if (backBlock) {
                                backBlock.visible = Math.abs(clientX - right) <= 15;
                                updateClass(backBlock, 'is-dragenter');
                            }
                            if (frontBlock) {
                                frontBlock.visible = Math.abs(clientX - left) <= 15 && curElmCol === 1;
                                updateClass(frontBlock, 'is-dragenter');
                            }
                        }
                    }
                }
            }
            function dragLeave(leaveTarget, clientX, isOverlap = false) {
                let target;
                if (isOverlap)
                    target = findNearestFixedGridInRow(clientX);
                else
                    target = leaveTarget.closest('.fixed-grid-item');
                if (target)
                    updateRectangles();
                else {
                    const blocks = document.getElementsByClassName('is-dragenter');
                    for (const block of blocks) {
                        const currentSection = leaveTarget.closest('ide-section');
                        const blockSection = block.closest('ide-section');
                        if (currentSection && blockSection && currentSection.id === blockSection.id)
                            continue;
                        block.visible = false;
                        block.classList.remove('is-dragenter');
                    }
                }
                const pageRows = document.getElementsByClassName('row-entered');
                for (const row of pageRows) {
                    const currentRow = leaveTarget.closest('ide-row');
                    if (currentRow && row && currentRow.id === row.id)
                        continue;
                    row.classList.remove('row-entered');
                }
            }
            this.addEventListener('dragenter', function (event) {
                const eventTarget = event.target;
                if (dragStartTarget && (dragStartTarget == eventTarget || dragStartTarget.contains(eventTarget)))
                    dragEnter(eventTarget, event.clientX, event.clientY, true);
                else
                    dragEnter(eventTarget, event.clientX, event.clientY);
            });
            document.addEventListener('dragover', function (event) {
                event.preventDefault();
                const eventTarget = event.target;
                let enterTarget;
                // if target overlap
                if (dragStartTarget && (dragStartTarget == eventTarget || dragStartTarget.contains(eventTarget))) {
                    const cursorPosition = { x: event.clientX, y: event.clientY };
                    const elements = self.pnlRow.querySelectorAll('.fixed-grid-item');
                    let nearestElement = null;
                    let minDistance = Number.MAX_VALUE;
                    // time complexity = O(columnSpan)
                    elements.forEach((element) => {
                        const bounds = element.getBoundingClientRect();
                        const distanceLeft = Math.abs(bounds.left - cursorPosition.x);
                        const distanceRight = Math.abs(bounds.right - cursorPosition.x);
                        if (distanceLeft < minDistance) {
                            minDistance = distanceLeft;
                            nearestElement = element;
                        }
                        if (distanceRight < minDistance) {
                            minDistance = distanceRight;
                            nearestElement = element;
                        }
                    });
                    enterTarget = nearestElement;
                }
                else
                    return;
                if (enterTarget == dragOverTarget)
                    return;
                // leave previous element: dragOverTarget
                dragLeave(dragOverTarget, event.clientX, true);
                // enter current element: enterTarget
                dragEnter(enterTarget, event.clientX, event.clientY, true);
                dragOverTarget = enterTarget;
            });
            document.addEventListener('dragleave', function (event) {
                const eventTarget = event.target;
                dragLeave(eventTarget, event.clientX);
            });
            function findNearestFixedGridInRow(clientX) {
                const elements = self.pnlRow.querySelectorAll('.fixed-grid-item');
                let nearestElement = null;
                let minDistance = Number.MAX_VALUE;
                // time complexity = O(columnSpan)
                elements.forEach((element) => {
                    const bounds = element.getBoundingClientRect();
                    const distanceLeft = Math.abs(bounds.left - clientX);
                    const distanceRight = Math.abs(bounds.right - clientX);
                    if (distanceLeft < minDistance) {
                        minDistance = distanceLeft;
                        nearestElement = element;
                    }
                    if (distanceRight < minDistance) {
                        minDistance = distanceRight;
                        nearestElement = element;
                    }
                });
                return nearestElement;
            }
            this.addEventListener('drop', async function (event) {
                var _a, _b;
                const elementConfig = (0, index_52.getDragData)();
                const eventTarget = event.target;
                const pageRow = eventTarget.closest('ide-row');
                event.preventDefault();
                event.stopPropagation();
                if (pageRow && ((_a = elementConfig === null || elementConfig === void 0 ? void 0 : elementConfig.module) === null || _a === void 0 ? void 0 : _a.name) === 'sectionStack')
                    components_25.application.EventBus.dispatch(index_50.EVENT.ON_ADD_SECTION, { prependId: pageRow.id });
                if (!self.currentElement)
                    return;
                let nearestFixedItem = eventTarget.closest('.fixed-grid-item');
                // if target overlap
                if (dragStartTarget && (dragStartTarget == eventTarget || dragStartTarget.contains(eventTarget))) {
                    nearestFixedItem = findNearestFixedGridInRow(event.clientX);
                }
                if (nearestFixedItem) {
                    const column = Number(nearestFixedItem.dataset.column);
                    const columnSpan = self.currentElement.dataset.columnSpan ?
                        Number(self.currentElement.dataset.columnSpan) : index_51.MIN_COLUMN;
                    const colSpan = Math.min(columnSpan, self.maxColumn);
                    const colStart = Math.min(column, self.maxColumn - colSpan + 1);
                    const grid = nearestFixedItem.closest('.grid');
                    const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
                    const sortedSections = sections.sort((a, b) => Number(a.dataset.column) - Number(b.dataset.column));
                    const findedSection = sortedSections.find((section) => {
                        const sectionColumn = Number(section.dataset.column);
                        const sectionColumnSpan = Number(section.dataset.columnSpan);
                        const colData = colStart + colSpan;
                        const sectionData = sectionColumn + sectionColumnSpan;
                        return colStart >= sectionColumn && colData <= sectionData;
                    });
                    if (findedSection || self.isDragging)
                        return;
                    self.isDragging = true;
                    if (self.currentElement.data) {
                        const dragCmd = new index_53.DragElementCommand(self.currentElement, nearestFixedItem);
                        index_53.commandHistory.execute(dragCmd);
                    }
                    else if ((0, index_52.getDragData)()) {
                        const dragCmd = new index_53.AddElementCommand(self.getNewElementData(), true, false, nearestFixedItem);
                        index_53.commandHistory.execute(dragCmd);
                    }
                    self.isDragging = false;
                }
                else {
                    const isPageRow = eventTarget.classList.contains('page-row');
                    let dropElm = (isPageRow
                        ? eventTarget.querySelector('.is-dragenter')
                        : eventTarget.closest('.is-dragenter'));
                    if (self.isDragging)
                        return;
                    const blocks = Array.from(self.parentElement.getElementsByClassName('is-dragenter'));
                    const activedBlock = blocks.find((block) => block.visible);
                    dropElm = dropElm || activedBlock;
                    if (dropElm) {
                        self.isDragging = true;
                        dropElm.classList.remove('is-dragenter');
                        const isBottomBlock = dropElm.classList.contains('bottom-block');
                        if (isBottomBlock) {
                            const config = (0, index_52.getDragData)();
                            const dragCmd = new index_53.UpdateTypeCommand(dropElm, config ? null : self.currentElement, config);
                            index_53.commandHistory.execute(dragCmd);
                        }
                        else {
                            const isAppend = dropElm.classList.contains('back-block');
                            const dragCmd = (0, index_52.getDragData)() ?
                                new index_53.AddElementCommand(self.getNewElementData(), isAppend, false, dropElm, null) :
                                new index_53.DragElementCommand(self.currentElement, dropElm, isAppend);
                            dragCmd && await index_53.commandHistory.execute(dragCmd);
                        }
                        self.isDragging = false;
                    }
                    else if (pageRow && !self.isDragging) {
                        self.isDragging = true;
                        if (elementConfig) {
                            const parentId = pageRow === null || pageRow === void 0 ? void 0 : pageRow.id.replace('row-', '');
                            const elements = parentId ? ((_b = index_52.pageObject.getRow(parentId)) === null || _b === void 0 ? void 0 : _b.elements) || [] : [];
                            const hasData = elements.find(el => { var _a; return el.type === 'primitive' || (el.type === 'composite' && ((_a = el.elements) === null || _a === void 0 ? void 0 : _a.length)); });
                            const dragCmd = hasData && activedBlock ?
                                new index_53.AddElementCommand(self.getNewElementData(), activedBlock.classList.contains('back-block'), false, activedBlock) :
                                !hasData && new index_53.AddElementCommand(self.getNewElementData(), true, true, null, pageRow);
                            dragCmd && await index_53.commandHistory.execute(dragCmd);
                        }
                        else {
                            const dragCmd = new index_53.DragElementCommand(self.currentElement, pageRow, true, true);
                            index_53.commandHistory.execute(dragCmd);
                        }
                        self.isDragging = false;
                    }
                    self.removeDottedLines();
                }
            });
            function removeClass(className) {
                const elements = document.getElementsByClassName(className);
                for (const element of elements) {
                    if (className === 'is-dragenter') {
                        element.visible = false;
                    }
                    element.classList.remove(className);
                }
            }
            function updateRectangles() {
                const rectangles = document.getElementsByClassName('rectangle');
                for (const rectangle of rectangles) {
                    rectangle.style.display = 'none';
                }
            }
        }
        initEventBus() {
            components_25.application.EventBus.register(this, index_50.EVENT.ON_SET_DRAG_ELEMENT, async (el) => this.currentElement = el);
        }
        getNewElementData() {
            const elementConfig = Object.assign({}, ((0, index_52.getDragData)() || {}));
            const id = (0, index_54.generateUUID)();
            return Object.assign(Object.assign({}, elementConfig), { id });
        }
        addDottedLines() {
            const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.add('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName('fixed-grid');
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.add('border-dotted');
            }
        }
        removeDottedLines() {
            const fixedGridItems = document.getElementsByClassName('fixed-grid-item');
            for (let i = 0; i < fixedGridItems.length; i++) {
                fixedGridItems[i].classList.remove('border-x-dotted');
            }
            const fixedGrids = document.getElementsByClassName('fixed-grid');
            for (let i = 0; i < fixedGrids.length; i++) {
                fixedGrids[i].classList.remove('border-dotted');
            }
        }
        setActive() {
            const pageRows = document.querySelectorAll('ide-row');
            if (pageRows) {
                for (const row of pageRows) {
                    row.classList.remove('active');
                    const toolbars = row.querySelectorAll('ide-toolbar');
                    toolbars.forEach((toolbar) => toolbar.hideToolbars());
                }
            }
            this.classList.add('active');
        }
        onAddSection(type) {
            const prependId = type === 1 ? this.id : '';
            const appendId = type === -1 ? this.id : '';
            components_25.application.EventBus.dispatch(index_50.EVENT.ON_ADD_SECTION, { prependId, appendId });
        }
        render() {
            return (this.$render("i-panel", { id: "pnlRowWrap", class: 'page-row', width: "100%", height: "100%", padding: { left: '3rem', right: '3rem' } },
                this.$render("i-button", { caption: '', icon: { name: 'plus', width: 14, height: 14, fill: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, top: "-12px", left: "50%", zIndex: 100, class: "btn-add", onClick: () => this.onAddSection(-1) }),
                this.$render("i-vstack", { id: 'actionsBar', class: "row-actions-bar", verticalAlignment: "center" },
                    this.$render("i-vstack", { background: { color: '#fff' }, border: { radius: '20px' }, maxWidth: "100%", maxHeight: "100%", horizontalAlignment: "center", padding: { top: 5, bottom: 5 } },
                        this.$render("i-panel", { class: "actions", tooltip: { content: 'Section settings', placement: 'right' }, visible: this.isChanged, onClick: () => this.onOpenRowSettingsDialog('column') },
                            this.$render("i-icon", { name: "cog", width: 16, height: 16, fill: "#80868b" })),
                        this.$render("i-panel", { id: "btnSetting", class: "actions", tooltip: { content: 'Section colors', placement: 'right' }, visible: this.isChanged, onClick: () => this.onOpenRowSettingsDialog('color') },
                            this.$render("i-icon", { name: "palette", width: 16, height: 16, fill: "#80868b" })),
                        this.$render("i-panel", { id: "btnClone", class: "actions", tooltip: { content: 'Duplicate section', placement: 'right' }, visible: this.isCloned, onClick: this.onClone },
                            this.$render("i-icon", { name: "clone", width: 16, height: 16, fill: "#80868b" })),
                        this.$render("i-panel", { id: "btnDelete", class: "actions delete", tooltip: { content: 'Delete section', placement: 'right' }, onClick: this.onDeleteRow },
                            this.$render("i-icon", { name: "trash", width: 16, height: 16, fill: "#80868b" })))),
                this.$render("i-vstack", { id: "dragStack", height: "100%", verticalAlignment: "center", position: "absolute", left: "0px", top: "0px", class: "drag-stack" },
                    this.$render("i-grid-layout", { verticalAlignment: "center", autoFillInHoles: true, columnsPerRow: 2, class: "main-drag" },
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }),
                        this.$render("i-icon", { name: "circle", width: 3, height: 3 }))),
                this.$render("i-vstack", { id: "pnlEmty", width: "100%", visible: false, verticalAlignment: 'center', horizontalAlignment: 'center', class: "pnl-empty" },
                    this.$render("i-panel", { padding: { top: '3rem', bottom: '3rem' }, margin: { top: '3rem', bottom: '3rem' }, width: "100%", border: { width: '1px', style: 'dashed', color: Theme.divider }, class: "text-center" },
                        this.$render("i-label", { caption: 'Drag Elements Here', font: { transform: 'uppercase', color: Theme.divider, size: '1.25rem' } }))),
                this.$render("i-grid-layout", { id: "pnlRow", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", position: "relative", class: "grid", opacity: 0 }),
                this.$render("ide-row-settings-dialog", { id: "mdRowColorSetting", type: "color", onSave: this.onSaveRowSettings.bind(this) }),
                this.$render("ide-row-settings-dialog", { id: "mdRowColumnSetting", type: "column", onSave: this.onSaveRowSettings.bind(this) }),
                this.$render("i-button", { caption: '', icon: { name: 'plus', width: 14, height: 14, fill: Theme.colors.primary.contrastText }, background: { color: Theme.colors.primary.main }, padding: { top: 5, bottom: 5, left: 5, right: 5 }, bottom: "-12px", left: "50%", zIndex: 100, class: "btn-add", onClick: () => this.onAddSection(1) })));
        }
    };
    __decorate([
        (0, components_25.observable)()
    ], PageRow.prototype, "isCloned", void 0);
    __decorate([
        (0, components_25.observable)()
    ], PageRow.prototype, "isChanged", void 0);
    PageRow = PageRow_1 = __decorate([
        (0, components_25.customElements)('ide-row')
    ], PageRow);
    exports.PageRow = PageRow;
});
define("@scom/scom-page-builder/page/pageRows.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_26.Styles.cssRule('ide-rows', {
        $nest: {
            '.drag-overlay': {
                zIndex: '-1',
                display: 'none',
                transition: 'all .5s ease-in',
                boxShadow: 'inset 0 2px 0 #686565, inset 0 -2px 0 #686565'
            },
            '.row-dragged': {
                position: 'relative',
                zIndex: 999
            },
            '.row-entered': {
                borderBottom: '3px solid #1976D2'
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageRows.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/page/pageSection.tsx", "@scom/scom-page-builder/page/pageRow.tsx", "@scom/scom-page-builder/page/pageFooter.tsx", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageRows.css.ts"], function (require, exports, components_27, pageSection_1, pageRow_1, pageFooter_1, index_55, index_56, index_57, index_58, index_59) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageFooter = exports.PageSection = exports.PageRows = void 0;
    Object.defineProperty(exports, "PageSection", { enumerable: true, get: function () { return pageSection_1.PageSection; } });
    Object.defineProperty(exports, "PageFooter", { enumerable: true, get: function () { return pageFooter_1.PageFooter; } });
    const Theme = index_59.currentTheme;
    let PageRows = class PageRows extends components_27.Module {
        constructor(parent) {
            super(parent);
            this.isDragging = false;
            this.mouseDownHandler = this.mouseDownHandler.bind(this);
            this.mouseUpHandler = this.mouseUpHandler.bind(this);
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
            this.initEventBus();
            this.getRows = this.getRows.bind(this);
            this.setRows = this.setRows.bind(this);
        }
        initEventBus() {
            components_27.application.EventBus.register(this, index_55.EVENT.ON_CLONE, this.onClone);
            components_27.application.EventBus.register(this, index_55.EVENT.ON_ADD_SECTION, this.onCreateSection);
        }
        _handleClick(event) {
            if (this._readonly)
                return super._handleClick(event, true);
            const toolbars = document.querySelectorAll('ide-toolbar');
            for (const toolbar of toolbars) {
                toolbar.hideToolbars();
            }
            return super._handleClick(event, true);
        }
        init() {
            this._readonly = this.getAttribute('readonly', true, false);
            this.draggable = this.getAttribute('draggable', true, false);
            super.init();
        }
        get draggable() {
            return this._draggable;
        }
        set draggable(value) {
            if (this._draggable === value)
                return;
            this._draggable = value;
            this.handleDrag();
        }
        handleDrag() {
            if (!this.pnlRows)
                return;
            const rows = Array.from(this.pnlRows.querySelectorAll('ide-row'));
            if (!(rows === null || rows === void 0 ? void 0 : rows.length))
                return;
            rows.forEach((row, rowid) => {
                this.initDragEvent(row);
            });
        }
        initDragEvent(row) {
            const dragStack = row.querySelector('#dragStack');
            if (!dragStack)
                return;
            if (this.draggable) {
                row.classList.add('dropzone');
                dragStack.addEventListener('mousedown', this.mouseDownHandler, false);
            }
            else {
                row.classList.remove('dropzone');
                dragStack.removeEventListener('mousedown', this.mouseDownHandler, false);
            }
            dragStack.ondragstart = function () {
                return false;
            };
        }
        mouseDownHandler(event) {
            event.stopPropagation();
            const target = event.target;
            const currentDragEl = target instanceof pageRow_1.PageRow ? target : target.closest('ide-row');
            if (currentDragEl && !this.isDragging) {
                this.isDragging = true;
                this.currentRow = currentDragEl;
                const data = this.currentRow.getBoundingClientRect();
                const { top, left } = this.pnlRows.getBoundingClientRect();
                this.currentPosition = data;
                this.pnlRowOverlay.width = this.currentPosition.width;
                this.pnlRowOverlay.height = this.currentPosition.height;
                this.pnlRowOverlay.zIndex = '1';
                this.pnlRowOverlay.left = this.currentPosition.left - left;
                this.pnlRowOverlay.top = this.currentPosition.top - top;
                this.currentRow.classList.add('row-dragged');
                document.addEventListener('mousemove', this.mouseMoveHandler);
                document.addEventListener('mouseup', this.mouseUpHandler);
                this.click();
            }
        }
        mouseUpHandler(event) {
            document.removeEventListener('mousemove', this.mouseMoveHandler);
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.currentRow.classList.remove('row-dragged');
            this.resetCurrentRow();
            this.isDragging = false;
            const rows = this.pnlRows.querySelectorAll('ide-row');
            for (let row of rows) {
                row.classList.remove('row-entered');
            }
            const canDrop = this.currentRow && this.enteredRow && this.enteredRow.classList.contains('dropzone');
            if (canDrop && !this.currentRow.isSameNode(this.enteredRow)) {
                const moveRowCmd = new index_57.MoveElementCommand(this.currentRow, this.enteredRow, this.pnlRows, index_58.pageObject.sections);
                index_57.commandHistory.execute(moveRowCmd);
            }
            this.pnlRowOverlay.visible = false;
            this.pnlRowOverlay.zIndex = '-1';
            this.currentRow = null;
            this.enteredRow = null;
            this.currentPosition = null;
        }
        mouseMoveHandler(event) {
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            const dropzones = (this.querySelectorAll('.dropzone') || []);
            const centerPoints = this.getDropzoneCenterPoints(dropzones);
            let nearestElement = null;
            let shortestDistance = Infinity;
            for (let data of centerPoints) {
                const { centerX, centerY, dropzone } = data;
                const dx = centerX - mouseX;
                const dy = centerY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestElement = dropzone;
                }
                dropzone.classList.remove('row-entered');
            }
            if (nearestElement && !nearestElement.isSameNode(this.currentRow)) {
                nearestElement.classList.add('row-entered');
                this.enteredRow = nearestElement;
                this.pnlRowOverlay.visible = true;
                this.pnlRowOverlay.zIndex = '1';
                this.updateCurrentRow(mouseX - this.currentPosition.x, mouseY - this.currentPosition.y);
            }
            else {
                this.enteredRow = null;
            }
        }
        getDropzoneCenterPoints(dropzones) {
            const centerPoints = [];
            for (let dropzone of dropzones) {
                const rect = dropzone.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                centerPoints.push({ centerX, centerY, dropzone });
            }
            return centerPoints;
        }
        resetCurrentRow() {
            if (!this.currentRow)
                return;
            this.currentRow.style.transform = 'none';
            this.pnlRowOverlay.visible = false;
            this.pnlRowOverlay.zIndex = '-1';
            this.currentRow.onMoveDown();
        }
        updateCurrentRow(x, y) {
            this.currentRow.style.transform = `translate(${x}px, ${y}px)`;
            this.currentRow.style.width = this.currentPosition.width;
            this.currentRow.style.height = this.currentPosition.height;
            this.currentRow.onMoveUp();
        }
        getRows() {
            return index_58.pageObject.sections;
        }
        async setRows(rows) {
            index_58.pageObject.sections = rows;
            await this.renderRows();
        }
        async renderRows() {
            var _a;
            this.clearRows();
            for (let i = 0; i < index_58.pageObject.sections.length; i++) {
                const rowData = index_58.pageObject.sections[i];
                const pageRow = (this.$render("ide-row", { maxWidth: "100%", maxHeight: "100%" }));
                if (!this._readonly) {
                    pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
                    this.initDragEvent(pageRow);
                }
                pageRow.visible = !!((_a = rowData === null || rowData === void 0 ? void 0 : rowData.elements) === null || _a === void 0 ? void 0 : _a.length);
                pageRow.parent = this.pnlRows;
                this.pnlRows.append(pageRow);
                await pageRow.setData(rowData);
            }
        }
        async appendRow(rowData, prependId) {
            var _a;
            const pageRow = (this.$render("ide-row", { maxWidth: "100%", maxHeight: "100%" }));
            if (!this._readonly) {
                pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
                this.initDragEvent(pageRow);
            }
            pageRow.visible = !!((_a = rowData === null || rowData === void 0 ? void 0 : rowData.elements) === null || _a === void 0 ? void 0 : _a.length);
            const addRowCmd = new index_57.UpdateRowCommand(pageRow, this.pnlRows, rowData, false, prependId);
            index_57.commandHistory.execute(addRowCmd);
            await pageRow.setData(rowData);
            return pageRow;
        }
        async onClone(data) {
            const { rowData, id } = data;
            const row = this.pnlRows.querySelector(`#${id}`);
            if (!row)
                return;
            const clonedData = JSON.parse(JSON.stringify(rowData));
            const newId = (0, index_56.generateUUID)();
            const newElements = clonedData.elements.map((el) => {
                el.id = (0, index_56.generateUUID)();
                return el;
            });
            await this.appendRow(Object.assign(Object.assign({}, clonedData), { elements: newElements, id: newId, row: this.getRows().length }), id);
        }
        async onCreateSection(params) {
            const { prependId = '', appendId = '' } = params || {};
            const pageRow = (this.$render("ide-row", { maxWidth: "100%", maxHeight: "100%" }));
            if (!this._readonly) {
                pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
                this.initDragEvent(pageRow);
            }
            const rowData = {
                id: (0, index_56.generateUUID)(),
                row: this.getRows().length,
                elements: [],
            };
            const addRowCmd = new index_57.UpdateRowCommand(pageRow, this.pnlRows, rowData, false, prependId || '', appendId || '');
            index_57.commandHistory.execute(addRowCmd);
            await pageRow.setData(rowData);
            return pageRow;
        }
        clearRows() {
            var _a;
            (_a = this.pnlRows) === null || _a === void 0 ? void 0 : _a.clearInnerHTML();
        }
        set footerVisible(value) {
            this.pageFooter.visible = value;
        }
        set footerSticky(value) {
            this.pageFooter.sticky = value;
        }
        set footerCopyright(value) {
            this.pageFooter.footer = value;
        }
        render() {
            return (this.$render("i-panel", { height: "100%" },
                this.$render("i-vstack", { id: 'pnlRows', class: 'container', verticalAlignment: "center", maxWidth: "100%", height: "100%" }),
                this.$render("i-panel", { id: "pnlRowOverlay", position: 'fixed', zIndex: -1, visible: false, opacity: 0.4, background: { color: '#ddd' }, class: 'drag-overlay' }),
                this.$render("scpage-page-footer", { id: 'pageFooter', class: 'boxed-style', visible: false })));
        }
    };
    PageRows = __decorate([
        (0, components_27.customElements)('ide-rows')
    ], PageRows);
    exports.PageRows = PageRows;
});
define("@scom/scom-page-builder/page/pageSidebar.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_28, index_60) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_60.currentTheme;
    components_28.Styles.cssRule('ide-sidebar', {
        borderRight: `1px solid ${Theme.divider}`,
        $nest: {
            '.block-image': {
                maxHeight: 74,
                boxShadow: '0 0 0 1px rgb(218 220 224)',
                overflow: 'hidden'
            },
            '.pointer': {
                cursor: 'all-scroll'
            },
            '.insert-tabs': {
                $nest: {
                    'i-tab:not(.disabled).active': {
                        backgroundColor: 'transparent',
                        color: Theme.colors.primary.main,
                    },
                    'i-tab:not(.disabled).active .tab-item': {
                        color: Theme.colors.primary.main,
                        // borderBottom: `1px solid ${Theme.colors.primary.main}`
                    },
                    '.tab-item': {
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: Theme.text.primary,
                        fontFamily: Theme.typography.fontFamily
                    },
                    'i-tab:not(.disabled):hover': {
                        backgroundColor: Theme.action.hover
                    }
                }
            },
            'i-tabs i-tab:not(.disabled).active': {
                borderColor: 'transparent'
            },
            '.builder-item': {
                transition: 'opacity .2s ease-in-out, transform 0.2s ease-in-out',
                width: 97,
                height: '5rem',
                opacity: 1
            },
            '.is-dragging': {
                opacity: 0
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageSidebar.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/page/pageSidebar.css.ts"], function (require, exports, components_29, index_61, index_62, index_63, assets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageSidebar = void 0;
    const Theme = components_29.Styles.Theme.ThemeVars;
    let PageSidebar = class PageSidebar extends components_29.Module {
        get pageBlocks() {
            return (0, index_61.getPageBlocks)();
        }
        constructor(parent) {
            super(parent);
        }
        init() {
            super.init();
            this.renderUI();
            this.initEventListeners();
            this.initEventBus();
        }
        async renderUI() {
            const categories = (0, index_61.getCategories)();
            this.pnlLayouts.clearInnerHTML();
            this.pnlLayouts.appendChild(this.$render("i-vstack", { padding: { top: '1rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, border: { bottom: { width: 1, style: 'solid', color: Theme.divider } } },
                this.$render("i-vstack", { id: "sectionStack", class: "text-center pointer builder-item", verticalAlignment: "center", horizontalAlignment: "center", height: "68px", width: "100%", background: { color: Theme.action.hover }, gap: "0.5rem" },
                    this.$render("i-image", { url: assets_3.default.icons.logo, width: 24, height: 24, display: "block" }),
                    this.$render("i-label", { caption: "Section", font: { size: '0.813rem' }, maxHeight: 34, overflow: "hidden", opacity: 0.7 }))));
            this.pnlEmbeddables.clearInnerHTML();
            for (const stack of categories) {
                this.pnlEmbeddables.appendChild(this.$render("i-scom-page-builder-collapse", { title: stack.title, border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, expanded: true },
                    this.$render("i-grid-layout", { id: `${stack.id.replace('-', '')}Stack`, templateColumns: ['repeat(2, 1fr)'], gap: { column: '0.5rem', row: '0.75rem' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' } })));
                this.renderList(this[`${stack.id.replace('-', '')}Stack`], stack.id);
            }
            this.sectionStack.setAttribute('draggable', 'true');
        }
        async renderList(parent, category) {
            parent.clearInnerHTML();
            let components = this.pageBlocks.filter(p => p.category === category);
            let matchedModules = components;
            for (const module of matchedModules) {
                const moduleCard = (this.$render("i-vstack", { class: "text-center pointer builder-item", verticalAlignment: "center", horizontalAlignment: "center", gap: "0.5rem", overflow: 'hidden', background: { color: Theme.action.hover }, border: { radius: 5 } },
                    this.$render("i-image", { url: module.imgUrl || assets_3.default.icons.logo, width: 24, height: 24, display: "block" }),
                    this.$render("i-label", { caption: module.name, font: { size: '0.813rem' }, opacity: 0.7, maxHeight: 34, overflow: "hidden" })));
                parent.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
        initDrag(module, data) {
            module.setAttribute('draggable', 'true');
            module.setAttribute('data-type', index_63.ElementType.PRIMITIVE);
            module.setAttribute('data-name', data.name);
        }
        initEventListeners() {
            const self = this;
            this.addEventListener('dragstart', function (event) {
                var _a;
                event.stopPropagation();
                const eventTarget = event.target;
                if (eventTarget.nodeName === 'IMG' || ((eventTarget === null || eventTarget === void 0 ? void 0 : eventTarget.closest) && !eventTarget.closest('.builder-item')))
                    event.preventDefault();
                if (eventTarget.id === 'sectionStack') {
                    (0, index_61.setDragData)({ module: { name: 'sectionStack', path: '' }, type: index_63.ElementType.PRIMITIVE });
                    eventTarget.classList.add('is-dragging');
                }
                else if ((_a = eventTarget === null || eventTarget === void 0 ? void 0 : eventTarget.dataset) === null || _a === void 0 ? void 0 : _a.name) {
                    const currentName = eventTarget.dataset.name;
                    const type = eventTarget.dataset.type;
                    const module = self.pageBlocks.find(block => block.name === currentName);
                    if (module && type) {
                        components_29.application.EventBus.dispatch(index_62.EVENT.ON_SET_DRAG_ELEMENT, eventTarget);
                        (0, index_61.setDragData)({ module, type });
                        eventTarget.classList.add('is-dragging');
                    }
                }
                else {
                    event.preventDefault();
                }
            });
        }
        initEventBus() {
            components_29.application.EventBus.register(this, index_62.EVENT.ON_UPDATE_SIDEBAR, (category) => {
                const categoryStack = category && this[`${category.replace('-', '')}Stack`];
                if (categoryStack)
                    this.renderList(this[`${category.replace('-', '')}Stack`], category);
            });
        }
        render() {
            return (this.$render("i-panel", { class: "navigator", height: '100%', maxWidth: "100%" },
                this.$render("i-vstack", { padding: { top: '1rem', bottom: '0.5rem' } },
                    this.$render("i-label", { caption: "Layouts", font: { size: '1rem', weight: 600 }, maxHeight: 34, overflow: "hidden", margin: { left: '0.5rem', bottom: '0.5rem' } }),
                    this.$render("i-panel", { id: "pnlLayouts" })),
                this.$render("i-vstack", { padding: { top: '1rem', bottom: '0.5rem' } },
                    this.$render("i-label", { caption: "Embeddables", font: { size: '1rem', weight: 600 }, maxHeight: 34, overflow: "hidden", margin: { left: '0.5rem', bottom: '0.5rem' } }),
                    this.$render("i-panel", { id: "pnlEmbeddables" }))));
        }
    };
    PageSidebar = __decorate([
        (0, components_29.customElements)('ide-sidebar')
    ], PageSidebar);
    exports.PageSidebar = PageSidebar;
});
define("@scom/scom-page-builder/page/index.ts", ["require", "exports", "@scom/scom-page-builder/page/pageHeader.tsx", "@scom/scom-page-builder/page/pageSection.tsx", "@scom/scom-page-builder/page/pageFooter.tsx", "@scom/scom-page-builder/page/pageRows.tsx", "@scom/scom-page-builder/page/pageRow.tsx", "@scom/scom-page-builder/page/pageSidebar.tsx"], function (require, exports, pageHeader_1, pageSection_2, pageFooter_2, pageRows_1, pageRow_2, pageSidebar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageSidebar = exports.PageRow = exports.PageRows = exports.PageFooter = exports.PageSection = exports.PageHeader = void 0;
    Object.defineProperty(exports, "PageHeader", { enumerable: true, get: function () { return pageHeader_1.PageHeader; } });
    Object.defineProperty(exports, "PageSection", { enumerable: true, get: function () { return pageSection_2.PageSection; } });
    Object.defineProperty(exports, "PageFooter", { enumerable: true, get: function () { return pageFooter_2.PageFooter; } });
    Object.defineProperty(exports, "PageRows", { enumerable: true, get: function () { return pageRows_1.PageRows; } });
    Object.defineProperty(exports, "PageRow", { enumerable: true, get: function () { return pageRow_2.PageRow; } });
    Object.defineProperty(exports, "PageSidebar", { enumerable: true, get: function () { return pageSidebar_1.PageSidebar; } });
});
define("@scom/scom-page-builder/builder/builderHeader.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_30, index_64) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_64.currentTheme;
    components_30.Styles.cssRule('builder-header', {
        $nest: {
            '#pnlHeader': {
                backgroundSize: 'cover',
                $nest: {
                    'ide-section': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%'
                    },
                    '.has-header > input': {
                        color: 'rgba(255,255,255,1)'
                    },
                    'i-input > input': {
                        background: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        color: Theme.text.primary,
                        paddingLeft: 15
                    },
                    '.page-title input': {
                        lineHeight: 1.333,
                        fontSize: '1rem',
                        textAlign: 'left',
                        fontWeight: 600
                    },
                    '#pnlConfig': {
                        opacity: 0,
                        $nest: {
                            'i-button': {
                                boxShadow: 'none'
                            }
                        }
                    },
                    '&:hover': {
                        $nest: {
                            '.page-title': {
                                transition: 'box-shadow 125ms cubic-bezier(0.4,0,0.2,1)',
                                $nest: {
                                    '&:hover, &:focus': {
                                        boxShadow: '0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%)'
                                    },
                                    '&:hover ~ .edit-stack': {
                                        opacity: 1,
                                        transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                                    }
                                }
                            },
                            '#pnlConfig': {
                                opacity: 1,
                                transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                            }
                        }
                    },
                    '.custom-box': {
                        boxShadow: '0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)'
                    },
                    '.type': {
                        cursor: 'pointer',
                        $nest: {
                            '&.active': {
                                $nest: {
                                    'i-label': {
                                        color: `${Theme.colors.primary.main} !important`
                                    },
                                    'svg': {
                                        fill: Theme.colors.primary.main
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '.edit-stack': {
                opacity: 0,
                $nest: {
                    '&:hover': {
                        opacity: 1,
                        transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                    }
                }
            }
        }
    });
});
define("@scom/scom-page-builder/builder/builderHeader.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/builder/builderHeader.css.ts"], function (require, exports, components_31, assets_4, index_65, index_66, index_67, index_68, index_69) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderHeader = void 0;
    const Theme = index_69.currentTheme;
    let BuilderHeader = class BuilderHeader extends components_31.Module {
        constructor(parent) {
            super(parent);
            this._readonly = false;
            this._isUpdatingBg = false;
            this.showAddStack = true;
            this.initEventBus();
            this.setData = this.setData.bind(this);
        }
        initEventBus() {
            components_31.application.EventBus.register(this, index_65.EVENT.ON_UPDATE_SECTIONS, async () => {
                this.updateHeader();
            });
        }
        async setData(value) {
            index_67.pageObject.header = value;
            await this.updateHeader();
        }
        get _elements() {
            return index_67.pageObject.header.elements || [];
        }
        get _image() {
            return index_67.pageObject.header.image || '';
        }
        get _headerType() {
            return index_67.pageObject.header.headerType || '';
        }
        async updateHeader() {
            this.pnlHeaderMain.clearInnerHTML();
            this.showAddStack = this._elements.length === 0 && !this._image;
            this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
            this.updateHeaderType();
            this.pnlConfig.visible = !this.showAddStack;
            if (!this.showAddStack) {
                const pageRow = (this.$render("ide-row", { width: "100vw", maxWidth: "100%", maxHeight: "100%" }));
                const rowData = {
                    id: 'header',
                    row: 1,
                    elements: this._elements
                };
                await pageRow.setData(rowData);
                pageRow.parent = this.pnlHeaderMain;
                this.pnlHeaderMain.appendChild(pageRow);
            }
        }
        addHeader() {
            const pageBlocks = (0, index_67.getPageBlocks)();
            const textBlock = pageBlocks.find((v) => v.name === index_66.ELEMENT_NAME.TEXTBOX);
            this.setData({
                image: '',
                headerType: index_66.HeaderType.NORMAL,
                elements: [{
                        id: (0, index_68.generateUUID)(),
                        column: 4,
                        columnSpan: 5,
                        type: index_66.ElementType.PRIMITIVE,
                        module: textBlock,
                        properties: {},
                        tag: {
                            width: '100%',
                            height: '130px'
                        }
                    }]
            });
        }
        onShowUpload() {
            this.uploader.clear();
            this.mdUpload.visible = true;
        }
        onChangedBg() {
            this._isUpdatingBg = true;
            this.onShowUpload();
        }
        onToggleType(value) {
            this.pnlHeaderType.visible = value;
            this.pnlConfig.visible = !value;
        }
        async onUpdateImage() {
            const fileList = this.uploader.fileList || [];
            const file = fileList[0];
            if (this._isUpdatingBg) {
                const image = file ? await this.uploader.toBase64(file) : '';
                this.pnlHeader.background = { image };
                index_67.pageObject.header = Object.assign(Object.assign({}, index_67.pageObject.header), { image });
                this._isUpdatingBg = false;
            }
            else {
                if (this.pnlTitle.contains(this.pnlLogo))
                    this.pnlTitle.removeChild(this.pnlLogo);
                if (!file) {
                    this.mdUpload.visible = false;
                    this.btnAddLogo.caption = 'Add logo';
                    this.pnlLogo = null;
                    return;
                }
                const imgStr = await this.uploader.toBase64(file);
                this.pnlLogo = (this.$render("i-panel", null,
                    this.$render("i-image", { url: imgStr, width: "35", height: "auto", display: "block" })));
                this.btnAddLogo.caption = 'Edit logo';
                this.pnlTitle.insertBefore(this.pnlLogo, this.nameInput);
            }
            this.mdUpload.visible = false;
        }
        onActiveType(source, type) {
            const types = Array.from(this.pnlHeaderTypeMain.querySelectorAll('.type'));
            types.forEach(type => {
                type.classList.remove('active');
            });
            source.classList.add('active');
            const header = index_67.pageObject.header;
            this.setData(Object.assign(Object.assign({}, header), { headerType: type.type }));
            this.updateHeaderType();
        }
        updateHeaderType() {
            if (!this._headerType || this.showAddStack) {
                this.height = 'auto';
                return;
            }
            switch (this._headerType) {
                case index_66.HeaderType.COVER:
                    this.height = '100vh';
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_66.HeaderType.LARGE:
                    this.height = 520;
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_66.HeaderType.NORMAL:
                    this.height = 340;
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_66.HeaderType.TITLE:
                    this.height = 180;
                    this.pnlHeader.background = { color: '#fff', image: '' };
                    this.btnChangeImg.visible = false;
                    break;
            }
        }
        renderHeaderType() {
            const headerTypes = [
                {
                    caption: 'Cover',
                    type: index_66.HeaderType.COVER,
                    image: assets_4.default.fullPath('img/components/cover.svg')
                },
                {
                    caption: 'Large Banner',
                    type: index_66.HeaderType.LARGE,
                    image: assets_4.default.fullPath('img/components/large.svg')
                },
                {
                    caption: 'Banner',
                    type: index_66.HeaderType.NORMAL,
                    image: assets_4.default.fullPath('img/components/banner.svg')
                },
                {
                    caption: 'Title Only',
                    type: index_66.HeaderType.TITLE,
                    image: assets_4.default.fullPath('img/components/title.svg')
                }
            ];
            this.pnlHeaderTypeMain.clearInnerHTML();
            this.pnlHeaderTypeMain.appendChild(this.$render("i-panel", { onClick: () => this.onToggleType(false), class: "pointer" },
                this.$render("i-icon", { name: "angle-left", width: 24, height: 24, fill: "rgba(0,0,0,.54)" })));
            headerTypes.forEach(type => {
                this.pnlHeaderTypeMain.appendChild(this.$render("i-hstack", { gap: "10px", class: "type", verticalAlignment: "center", onClick: (source) => this.onActiveType(source, type) },
                    this.$render("i-panel", null,
                        this.$render("i-image", { url: type.image, width: 34, height: 34 })),
                    this.$render("i-label", { caption: type.caption, font: { color: 'rgba(0,0,0,.54)' } })));
            });
        }
        init() {
            this._readonly = this.getAttribute('readonly', true, false);
            super.init();
            this.display = "block";
            this.btnAddLogo.caption = this.pnlLogo ? 'Edit logo' : 'Add logo';
            this.renderHeaderType();
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlHeader", position: "relative", width: "100%", height: "100%", maxHeight: "100%", maxWidth: "100%" },
                this.$render("i-hstack", { id: "pnlTitle", class: "page-title", height: "3.5rem", minWidth: "12.5rem", gap: "1.125rem", padding: {
                        left: '1.125rem',
                        right: '1.125rem',
                        top: '0.5rem',
                        bottom: '0.5rem',
                    }, background: { color: 'transparent' }, verticalAlignment: "center", visible: false },
                    this.$render("i-input", { id: "nameInput", placeholder: "Enter site name", height: "100%", width: "100%", class: "custom-input" })),
                this.$render("i-vstack", { id: "pnlHeaderMain", height: "100%", maxHeight: "100%", horizontalAlignment: "center", verticalAlignment: "center" }),
                this.$render("i-hstack", { horizontalAlignment: "space-between", position: "absolute", top: "0px", zIndex: 15, width: "100%", padding: { left: 10, bottom: 5, right: 10 }, class: "edit-stack" },
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnAddLogo", class: "btn-add", icon: { name: 'image', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Add logo", onClick: () => this.onShowUpload(), visible: false })),
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnAddHeader", class: "btn-add", icon: { name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Add header", visible: this.showAddStack, onClick: () => this.addHeader() })),
                    this.$render("i-panel", null)),
                this.$render("i-hstack", { id: "pnlConfig", background: { color: '#fafafa' }, bottom: "0px", left: "0px", position: "absolute", verticalAlignment: "center", border: { radius: 2 }, margin: { left: 12, top: 12, bottom: 12, right: 12 }, height: "40px", class: "custom-box", visible: false },
                    this.$render("i-button", { id: "btnChangeImg", class: "btn-add", icon: { name: 'image', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: 'transparent' }, padding: { left: 6, right: 6 }, height: "100%", border: { width: 0 }, caption: "Change Image", onClick: () => this.onChangedBg() }),
                    this.$render("i-button", { id: "btnChangeType", class: "btn-add", icon: { name: 'columns', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: 'transparent' }, padding: { left: 6, right: 6 }, height: "100%", border: { width: 0, left: { width: '1px', style: 'solid', color: Theme.divider } }, caption: "Header Type", onClick: () => this.onToggleType(true) })),
                this.$render("i-panel", { id: "pnlHeaderType", visible: false, background: { color: '#fafafa' }, bottom: "0px", left: "0px", position: "absolute", border: { radius: 2 }, margin: { left: 12, top: 12, bottom: 12, right: 12 }, class: "custom-box", height: "auto", width: "auto" },
                    this.$render("i-hstack", { id: "pnlHeaderTypeMain", gap: "1rem", margin: { left: 8, top: 8, bottom: 8, right: 8 }, height: "100%", width: "100%", verticalAlignment: "center" })),
                this.$render("i-modal", { id: 'mdUpload', title: 'Select Image', closeIcon: { name: 'times' }, width: 400, closeOnBackdropClick: false },
                    this.$render("i-vstack", { padding: { top: '1rem' }, gap: "1rem" },
                        this.$render("i-upload", { id: 'uploader', draggable: true, caption: 'Drag and Drop image', class: "custom-uploader" }),
                        this.$render("i-hstack", { horizontalAlignment: "end" },
                            this.$render("i-button", { id: "btnAddImage", icon: { name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Add Image", onClick: this.onUpdateImage.bind(this) }))))));
        }
    };
    __decorate([
        (0, components_31.observable)()
    ], BuilderHeader.prototype, "showAddStack", void 0);
    BuilderHeader = __decorate([
        (0, components_31.customElements)('builder-header')
    ], BuilderHeader);
    exports.BuilderHeader = BuilderHeader;
});
define("@scom/scom-page-builder/builder/builderFooter.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_32.Styles.cssRule('builder-footer', {
        $nest: {
            '#pnlFooter': {
                backgroundSize: 'cover',
                $nest: {
                    '&:hover ~ .edit-stack': {
                        opacity: 1,
                        transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                    },
                    '> .edit-stack': {
                        opacity: 0,
                        $nest: {
                            '&:hover': {
                                opacity: 1,
                                transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                            }
                        }
                    },
                    '.flex': {
                        display: 'flex !important'
                    }
                }
            }
        }
    });
});
define("@scom/scom-page-builder/builder/builderFooter.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/builder/builderFooter.css.ts"], function (require, exports, components_33, index_70, index_71, index_72, index_73, index_74) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderFooter = void 0;
    const Theme = index_74.currentTheme;
    let BuilderFooter = class BuilderFooter extends components_33.Module {
        constructor(parent) {
            super(parent);
            this._readonly = false;
            this.showAddStack = true;
            this.initEventBus();
            this.setData = this.setData.bind(this);
        }
        initEventBus() {
            components_33.application.EventBus.register(this, index_70.EVENT.ON_UPDATE_SECTIONS, async () => {
                // if (!pageObject.footer?.elements?.length)
                this.updateFooter();
            });
        }
        async setData(value) {
            index_73.pageObject.footer = value;
            await this.updateFooter();
        }
        get _elements() {
            var _a;
            return ((_a = index_73.pageObject.footer) === null || _a === void 0 ? void 0 : _a.elements) || [];
        }
        get _image() {
            var _a;
            return ((_a = index_73.pageObject.footer) === null || _a === void 0 ? void 0 : _a.image) || '';
        }
        async updateFooter() {
            var _a;
            this.pnlFooterMain.clearInnerHTML();
            this.showAddStack = ((_a = this._elements) === null || _a === void 0 ? void 0 : _a.length) === 0 && !this._image;
            this.pnlFooter.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
            this.pnlEditOverlay.visible = !this.showAddStack;
            this.pnlEditOverlay.classList.remove('flex');
            this.pnlConfig.visible = !this.showAddStack;
            if (!this.showAddStack) {
                const pageRow = (this.$render("ide-row", { maxWidth: "100%", maxHeight: "100%" }));
                const rowData = {
                    id: 'footer',
                    row: -1,
                    elements: this._elements
                };
                await pageRow.setData(rowData);
                pageRow.parent = this.pnlFooterMain;
                this.pnlFooterMain.append(pageRow);
                this.pnlEditOverlay.classList.add('flex');
            }
            components_33.application.EventBus.dispatch(index_70.EVENT.ON_UPDATE_FOOTER);
        }
        addFooter() {
            const pageBlocks = (0, index_73.getPageBlocks)();
            const textBlock = pageBlocks.find((v) => v.path === index_71.TEXTBOX_PATH);
            this.setData({
                image: '',
                elements: [{
                        id: (0, index_72.generateUUID)(),
                        column: 1,
                        columnSpan: 12,
                        type: index_71.ElementType.PRIMITIVE,
                        module: textBlock,
                        properties: {},
                        tag: {
                            width: '100%',
                            height: '130px'
                        }
                    }]
            });
        }
        updateOverlay(value) {
            this.pnlEditOverlay.visible = value && !this.showAddStack;
            if (this.pnlEditOverlay.visible)
                this.pnlEditOverlay.classList.add('flex');
            else
                this.pnlEditOverlay.classList.remove('flex');
            this.pnlOverlay.visible = !this.pnlEditOverlay.visible && !this.showAddStack;
            this.pnlOverlay.height = this.pnlOverlay.visible ? document.body.offsetHeight + this.offsetHeight : 0;
            if (!this.pnlOverlay.visible) {
                const row = this.querySelector('ide-row');
                if (row) {
                    row.classList.remove('active');
                    const toolbars = row.querySelectorAll('ide-toolbar');
                    toolbars.forEach((toolbar) => {
                        toolbar.hideToolbars();
                    });
                }
            }
        }
        onChangedBg() {
            this.uploader.clear();
            this.mdUpload.visible = true;
        }
        async onUpdateImage() {
            const fileList = this.uploader.fileList || [];
            const file = fileList[0];
            const image = file ? await this.uploader.toBase64(file) : '';
            this.pnlFooter.background = { image };
            index_73.pageObject.footer = Object.assign(Object.assign({}, index_73.pageObject.footer), { image });
            this.mdUpload.visible = false;
        }
        init() {
            this._readonly = this.getAttribute('readonly', true, false);
            super.init();
            this.position = 'absolute',
                this.width = '100%';
            this.display = 'block';
            this.bottom = '0px';
            this.minHeight = 180;
        }
        render() {
            return (this.$render("i-vstack", { id: "pnlFooter", width: "100%", height: "100%", minHeight: 180, maxWidth: "100%", maxHeight: "40%" },
                this.$render("i-panel", { id: "pnlOverlay", width: "100%", height: "100%", background: { color: 'rgba(0,0,0,.6)' }, position: "absolute", zIndex: 29, left: "0px", bottom: "100%", visible: false, onClick: () => this.updateOverlay(true) }),
                this.$render("i-hstack", { id: "pnlEditOverlay", width: "100%", height: "100%", position: "absolute", top: "0px", left: "0px", background: { color: 'rgba(0,0,0,.6)' }, zIndex: 29, visible: false, verticalAlignment: "center", horizontalAlignment: "center", class: "edit-stack" },
                    this.$render("i-button", { class: "btn-add", icon: { name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Edit Footer", onClick: () => this.updateOverlay(false) })),
                this.$render("i-hstack", { verticalAlignment: "end", horizontalAlignment: "center", width: "100%", height: "auto", display: 'inline-block', position: "absolute", bottom: "0px", margin: { bottom: -10 }, class: "edit-stack", visible: this.showAddStack },
                    this.$render("i-panel", null,
                        this.$render("i-button", { id: "btnAddFooter", class: "btn-add", icon: { name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Add Footer", onClick: () => this.addFooter() }))),
                this.$render("i-panel", { id: "pnlFooterMain", "max-maxWidth": "100%", maxHeight: "100%" }),
                this.$render("i-hstack", { id: "pnlConfig", background: { color: '#fafafa' }, bottom: "0px", left: "0px", position: "absolute", verticalAlignment: "center", border: { radius: 2 }, margin: { left: 12, top: 12, bottom: 12, right: 12 }, height: "40px", class: "custom-box", visible: false },
                    this.$render("i-button", { class: "btn-add", icon: { name: 'image', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: 'transparent' }, padding: { left: 6, right: 6 }, height: "100%", border: { width: 0 }, caption: "Change Image", onClick: () => this.onChangedBg() })),
                this.$render("i-modal", { id: 'mdUpload', title: 'Select Image', closeIcon: { name: 'times' }, width: 400, closeOnBackdropClick: false },
                    this.$render("i-vstack", { padding: { top: '1rem' }, gap: "1rem" },
                        this.$render("i-upload", { id: 'uploader', draggable: true, caption: 'Drag and Drop image', class: "custom-uploader" }),
                        this.$render("i-hstack", { horizontalAlignment: "end" },
                            this.$render("i-button", { id: "btnAddImage", icon: { name: 'plus-circle', fill: 'rgba(0,0,0,.54)' }, font: { color: 'rgba(0,0,0,.54)' }, background: { color: Theme.colors.secondary.light }, padding: { top: 10, left: 6, right: 6, bottom: 10 }, border: { radius: 2 }, caption: "Add Image", onClick: this.onUpdateImage.bind(this) }))))));
        }
    };
    __decorate([
        (0, components_33.observable)()
    ], BuilderFooter.prototype, "showAddStack", void 0);
    BuilderFooter = __decorate([
        (0, components_33.customElements)('builder-footer')
    ], BuilderFooter);
    exports.BuilderFooter = BuilderFooter;
});
define("@scom/scom-page-builder/builder/index.ts", ["require", "exports", "@scom/scom-page-builder/builder/builderHeader.tsx", "@scom/scom-page-builder/builder/builderFooter.tsx"], function (require, exports, builderHeader_1, builderFooter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderFooter = exports.BuilderHeader = void 0;
    Object.defineProperty(exports, "BuilderHeader", { enumerable: true, get: function () { return builderHeader_1.BuilderHeader; } });
    Object.defineProperty(exports, "BuilderFooter", { enumerable: true, get: function () { return builderFooter_1.BuilderFooter; } });
});
define("@scom/scom-page-builder/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_34, index_75) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_75.currentTheme;
    components_34.Styles.cssRule('#editor', {
        $nest: {
            '.pnl-editor-wrapper': {
                display: 'block',
                boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
            },
            '.custom-input input': {
                paddingLeft: 10
            },
            '::-webkit-scrollbar': {
                width: '7px',
            },
            '::-webkit-scrollbar-track': {
                borderRadius: '10px',
                border: '1px solid transparent',
                // background: Theme.divider
            },
            '::-webkit-scrollbar-thumb': {
                background: Theme.action.focus,
                borderRadius: '10px',
                outline: '1px solid transparent'
            },
            '#pnlForm i-input > input': {
                boxShadow: 'none',
                border: 'none',
                background: 'transparent'
            },
            '#pnlWrap': {
                scrollBehavior: 'smooth'
            },
            '.pnl-scrollable': {
                maskImage: 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 7px, black 7px)',
                maskSize: '100% 20000px',
                maskPosition: 'left bottom',
                '-webkit-mask-image': 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 7px, black 7px)',
                '-webkit-mask-size': '100% 20000px',
                '-webkit-mask-position': 'left bottom',
                transition: 'mask-position 0.3s, -webkit-mask-position 0.3s',
                $nest: {
                    '&::-webkit-scrollbar-thumb': {
                        background: 'var(--action-focus)'
                    },
                    // '::-webkit-scrollbar-track': {
                    //   background: 'transparent'
                    // },
                    '&:hover': {
                        '-webkit-mask-position': 'left top',
                        $nest: {
                            'ide-sidebar': {
                                borderRightStyle: 'none'
                            }
                        }
                    }
                }
            }
        }
    });
});
define("@scom/scom-page-builder", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/index.css.ts"], function (require, exports, components_35, index_76, index_77, index_78) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_78.currentTheme;
    let Editor = class Editor extends components_35.Module {
        constructor(parent, options) {
            super(parent, options);
            this.events = [];
            this.isFirstLoad = false;
            this.getData = this.getData.bind(this);
            this.setData = this.setData.bind(this);
            this.initEventBus();
        }
        get rootDir() {
            return (0, index_77.getRootDir)();
        }
        set rootDir(value) {
            (0, index_77.setRootDir)(value);
        }
        get components() {
            return (0, index_77.getPageBlocks)();
        }
        set components(value) {
            (0, index_77.setPageBlocks)(value);
            this.pageSidebar.renderUI();
        }
        get categories() {
            return (0, index_77.getCategories)();
        }
        set categories(value) {
            (0, index_77.setCategories)(value);
            this.pageSidebar.renderUI();
        }
        async onFetchComponents(options) {
            return { items: [], total: 0 };
        }
        initScrollEvent(containerElement) {
            let scrollPos = 0;
            let ticking = false;
            const scrollSpeed = 1000;
            const scrollThreshold = 100;
            containerElement.addEventListener("dragover", (event) => {
                event.preventDefault();
                if (!this.currentElement && !(0, index_77.getDragData)())
                    return;
                scrollPos = event.clientY;
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        adjustScrollSpeed(scrollPos);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            function adjustScrollSpeed(mouseY) {
                const { top, bottom } = containerElement.getBoundingClientRect();
                const isNearTop = mouseY < top + scrollThreshold;
                const isNearBottom = mouseY > bottom - scrollThreshold;
                const isNearWindowTop = mouseY <= scrollThreshold;
                const isNearWindowBottom = mouseY > window.innerHeight - scrollThreshold;
                const scrollAmountTop = Math.max(scrollThreshold - (mouseY - top), 0);
                const scrollAmountBottom = Math.max(scrollThreshold - (bottom - mouseY), 0);
                if (isNearTop || isNearWindowTop) {
                    const scrollFactor = 1 + (scrollThreshold - scrollAmountTop) / scrollThreshold;
                    containerElement.scrollTop -= scrollSpeed * scrollFactor;
                }
                else if (isNearBottom || (isNearWindowBottom && bottom > window.innerHeight)) {
                    const scrollFactor = 1 + (scrollThreshold - scrollAmountBottom) / scrollThreshold;
                    containerElement.scrollTop += scrollSpeed * scrollFactor;
                }
                else {
                    containerElement.scrollTo({ behavior: 'auto', top: containerElement.scrollTop });
                }
            }
            containerElement.addEventListener('drop', (event) => {
                var _a;
                const elementConfig = (0, index_77.getDragData)();
                if (((_a = elementConfig === null || elementConfig === void 0 ? void 0 : elementConfig.module) === null || _a === void 0 ? void 0 : _a.name) === 'sectionStack') {
                    components_35.application.EventBus.dispatch(index_76.EVENT.ON_ADD_SECTION);
                }
            });
        }
        initEventListeners() {
            this.initScrollEvent(this.pnlWrap);
        }
        init() {
            const rootDir = this.getAttribute('rootDir', true);
            if (rootDir)
                this.setRootDir(rootDir);
            const components = this.getAttribute('components', true);
            if (components)
                (0, index_77.setPageBlocks)(components);
            const categories = this.getAttribute('categories', true);
            if (categories)
                (0, index_77.setCategories)(categories);
            const onFetchComponents = this.getAttribute('onFetchComponents', true);
            if (onFetchComponents)
                this.onFetchComponents = onFetchComponents.bind(this);
            super.init();
            this.initEventListeners();
            this.initData();
        }
        setRootDir(value) {
            (0, index_77.setRootDir)(value);
        }
        getData() {
            const hasData = (el) => { var _a; return el.type === 'primitive' || (el.type === 'composite' && ((_a = el.elements) === null || _a === void 0 ? void 0 : _a.length)); };
            return {
                // header: pageObject.header,
                sections: index_77.pageObject.sections.filter(section => {
                    var _a;
                    const hasElements = !!((_a = section.elements) === null || _a === void 0 ? void 0 : _a.length);
                    if (hasElements) {
                        const elements = [...section.elements].filter(hasData);
                        section.elements = elements;
                    }
                    return !!section.elements.length;
                }),
                footer: index_77.pageObject.footer
            };
        }
        async setData(value) {
            // pageObject.header = value.header;
            index_77.pageObject.sections = (value === null || value === void 0 ? void 0 : value.sections) || [];
            index_77.pageObject.footer = value === null || value === void 0 ? void 0 : value.footer;
            try {
                // await this.builderHeader.setData(value.header);
                await this.pageRows.setRows((value === null || value === void 0 ? void 0 : value.sections) || []);
                await this.builderFooter.setData(value === null || value === void 0 ? void 0 : value.footer);
            }
            catch (error) {
                console.log('setdata', error);
            }
        }
        onHide() {
            for (let event of this.events) {
                event.unregister();
            }
            this.events = [];
        }
        initEventBus() {
            this.events.push(components_35.application.EventBus.register(this, index_76.EVENT.ON_UPDATE_FOOTER, async () => this.onUpdateWrapper()));
            this.events.push(components_35.application.EventBus.register(this, index_76.EVENT.ON_SET_DRAG_ELEMENT, async (el) => this.currentElement = el));
            this.events.push(components_35.application.EventBus.register(this, index_76.EVENT.ON_TOGGLE_SEARCH_MODAL, this.onToggleSearch));
            this.events.push(components_35.application.EventBus.register(this, index_76.EVENT.ON_FETCH_COMPONENTS, this.onSearch));
        }
        onUpdateWrapper() {
            //     this.contentWrapper.minHeight = `calc((100vh - 6rem) - ${this.builderFooter.offsetHeight}px)`;
            //     this.contentWrapper.padding = {bottom: this.builderFooter.offsetHeight};
        }
        async onToggleSearch(visible) {
            if (visible)
                this.mdComponentsSearch.show();
            else
                this.mdComponentsSearch.hide();
        }
        async onSearch(options) {
            const params = Object.assign({}, options) || {
                category: undefined,
                pageNumber: undefined,
                pageSize: undefined
            };
            const { items = [], total = 0 } = await this.onFetchComponents(params);
            (0, index_77.setSearchData)({ items, total });
            (0, index_77.setSearchOptions)(params);
            this.mdComponentsSearch.renderUI();
        }
        async initData() {
            var _a;
            if (this.isFirstLoad)
                return;
            await this.onSearch();
            this.components = ((_a = (0, index_77.getSearchData)()) === null || _a === void 0 ? void 0 : _a.items) || [];
            this.isFirstLoad = true;
        }
        render() {
            return (this.$render("i-vstack", { id: "editor", width: '100%', height: '100%', maxHeight: "100vh", overflow: 'hidden' },
                this.$render("ide-header", { id: 'pageHeader', border: { bottom: { width: 1, style: 'solid', color: '#dadce0' } } }),
                this.$render("i-grid-layout", { templateColumns: ['auto', 'minmax(auto, 235px)'], autoFillInHoles: true, height: "calc(100% -64px)", overflow: "hidden" },
                    this.$render("i-panel", { id: "pnlWrap", height: "100%", width: "100%", overflow: { y: 'auto', x: 'hidden' }, background: { color: Theme.background.default }, border: { right: { width: 1, style: 'solid', color: Theme.divider } }, padding: { bottom: '1rem' } },
                        this.$render("i-panel", { id: "pageContent", maxWidth: 1400, width: "100%", margin: { left: 'auto', right: 'auto' } },
                            this.$render("i-panel", { maxWidth: 1280, minHeight: "100vh", margin: { top: 8, bottom: 8, left: 60, right: 60 }, background: { color: '#fff' }, class: "pnl-editor-wrapper" },
                                this.$render("i-panel", { id: "contentWrapper", padding: { bottom: '12rem' }, minHeight: "calc((100vh - 6rem) - 12rem)" },
                                    this.$render("ide-rows", { id: "pageRows", draggable: true })),
                                this.$render("builder-footer", { id: "builderFooter" })))),
                    this.$render("i-panel", { id: "pnlSidebar", height: "100%", overflow: { x: 'hidden', y: 'auto' }, class: "pnl-scrollable" },
                        this.$render("ide-sidebar", { id: 'pageSidebar', display: 'block', width: "100%" }))),
                this.$render("ide-search-components-dialog", { id: "mdComponentsSearch" })));
        }
    };
    Editor = __decorate([
        (0, components_35.customElements)('i-scom-page-builder'),
        components_35.customModule
    ], Editor);
    exports.default = Editor;
});
