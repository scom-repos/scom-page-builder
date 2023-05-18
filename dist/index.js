var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
        ON_ADD_SECTION: 'ON_ADD_SECTION'
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
    exports.getDragData = exports.setDragData = exports.getRootDir = exports.setRootDir = exports.getDappContainer = exports.getPageBlocks = exports.setPageBlocks = exports.state = exports.pageObject = exports.PageObject = void 0;
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
        addSection(value, prependId) {
            const prependIndex = prependId ? this._sections.findIndex(section => section.id === prependId) : -1;
            if (prependIndex === -1)
                this._sections.push(value);
            else
                this._sections.splice(prependIndex + 1, 0, value);
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
            const section = this.getSection(id);
            if (section) {
                if (data.backgroundColor !== undefined)
                    section.backgroundColor = data.backgroundColor;
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
        addRow(data, id, prependId) {
            if (id === 'header')
                this.header = data;
            else if (id === 'footer')
                this.footer = data;
            else
                this.addSection(data, prependId);
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
            if (value.column !== undefined)
                elm.column = value.column;
            if (value.columnSpan !== undefined)
                elm.columnSpan = value.columnSpan;
            if (value.tag !== undefined)
                elm.tag = value.tag;
            if (value.type !== undefined && elm.type !== value.type) {
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
    }
    exports.PageObject = PageObject;
    exports.pageObject = new PageObject();
    exports.state = {
        pageBlocks: [],
        rootDir: '',
        dragData: null
    };
    const setPageBlocks = (value) => {
        exports.state.pageBlocks = value || [];
    };
    exports.setPageBlocks = setPageBlocks;
    const getPageBlocks = () => {
        return exports.state.pageBlocks || [];
    };
    exports.getPageBlocks = getPageBlocks;
    const getDappContainer = () => {
        return (exports.state.pageBlocks || []).find(pageblock => pageblock.path === 'scom-dapp-container');
    };
    exports.getDappContainer = getDappContainer;
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
        const rootDir = index_1.getRootDir();
        let modulePath = rootDir ? `${rootDir}/libs/@scom/${path}` : `libs/@scom/${path}`;
        components_2.application.currentModuleDir = modulePath;
        const result = await components_2.application.loadScript(`${modulePath}/index.js`);
        components_2.application.currentModuleDir = '';
        if (!result)
            return null;
        const elementName = `i-${path.split('/').pop()}`;
        const element = document.createElement(elementName);
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
    exports.ElementType = exports.HeaderType = void 0;
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
});
define("@scom/scom-page-builder/interface/component.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-page-builder/interface/jsonSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-page-builder/interface/index.ts", ["require", "exports", "@scom/scom-page-builder/interface/pageBlock.ts", "@scom/scom-page-builder/interface/component.ts", "@scom/scom-page-builder/interface/siteData.ts", "@scom/scom-page-builder/interface/jsonSchema.ts"], function (require, exports, pageBlock_1, component_1, siteData_1, jsonSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ELEMENT_NAME = void 0;
    __exportStar(pageBlock_1, exports);
    __exportStar(component_1, exports);
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
});
define("@scom/scom-page-builder/command/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MIN_COLUMN = exports.MAX_COLUMN = void 0;
    exports.MAX_COLUMN = 12;
    exports.MIN_COLUMN = 2;
});
define("@scom/scom-page-builder/command/updateRow.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts"], function (require, exports, components_3, index_3, index_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateRowCommand = void 0;
    class UpdateRowCommand {
        constructor(element, parent, data, isDeleted, prependId) {
            this.isDeleted = false;
            this.prependId = '';
            this.element = element;
            this.data = JSON.parse(JSON.stringify(data));
            this.rowId = data.id;
            this.parent = parent || document.body;
            this.isDeleted = typeof isDeleted === 'boolean' ? isDeleted : false;
            this.prependId = prependId || '';
        }
        execute() {
            this.element.parent = this.parent;
            if (this.isDeleted) {
                this.parent.removeChild(this.element);
                index_4.pageObject.removeRow(this.rowId);
                components_3.application.EventBus.dispatch(index_3.EVENT.ON_UPDATE_SECTIONS);
            }
            else {
                this.parent.appendChild(this.element);
                if (this.prependId) {
                    const prependRow = this.parent.querySelector(`#${this.prependId}`);
                    prependRow && prependRow.insertAdjacentElement('afterend', this.element);
                }
                index_4.pageObject.addRow(this.data, this.rowId, this.prependId.replace('row-', ''));
            }
        }
        undo() {
            if (this.isDeleted) {
                this.parent.appendChild(this.element);
                const sibling = this.parent.children[this.data.row];
                if (sibling)
                    this.parent.insertBefore(this.element, sibling);
                index_4.pageObject.addRow(this.data, this.rowId);
                components_3.application.EventBus.dispatch(index_3.EVENT.ON_UPDATE_SECTIONS);
            }
            else {
                this.element.remove();
                this.data && index_4.pageObject.removeRow(this.rowId);
            }
        }
        redo() { }
    }
    exports.UpdateRowCommand = UpdateRowCommand;
});
define("@scom/scom-page-builder/command/updateColor.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts"], function (require, exports, index_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateColorCommand = void 0;
    class UpdateColorCommand {
        constructor(element, color) {
            var _a, _b;
            this.element = element;
            this.color = color;
            this.oldColor = ((_b = (_a = this.element) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.color) || '';
        }
        execute() {
            this.element.style.backgroundColor = this.color;
            const id = this.element.id.replace('row-', '');
            index_5.pageObject.updateSection(id, { backgroundColor: this.color });
        }
        undo() {
            this.element.style.backgroundColor = this.oldColor;
            const id = this.element.id.replace('row-', '');
            index_5.pageObject.updateSection(id, { backgroundColor: this.oldColor });
        }
        redo() { }
    }
    exports.UpdateColorCommand = UpdateColorCommand;
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
define("@scom/scom-page-builder/command/resize.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/interface.ts"], function (require, exports, index_6, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResizeElementCommand = void 0;
    class ResizeElementCommand {
        constructor(element, initialWidth, initialHeight, finalWidth, finalHeight) {
            this.gapWidth = 15;
            this.gridColumnWidth = 0;
            this.element = element;
            this.toolbar = element.querySelector('ide-toolbar');
            this.finalWidth = finalWidth || initialWidth;
            this.finalHeight = finalHeight || initialHeight;
            this.finalLeft = Number(this.element.left);
            this.initialWidth = initialWidth;
            this.initialHeight = initialHeight;
            this.oldDataColumn = {
                column: Number(element.dataset.column),
                columnSpan: Number(element.dataset.columnSpan)
            };
            const grid = this.element.parent.closest('.grid');
            if (grid)
                this.gridColumnWidth = (grid.offsetWidth - this.gapWidth * (interface_1.MAX_COLUMN - 1)) / interface_1.MAX_COLUMN;
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
            const finalColumnSpan = Math.max(Math.min(numberOfColumns, interface_1.MAX_COLUMN - currentSpan), 1);
            const column = Math.ceil((this.finalLeft + this.gapWidth) / (this.gridColumnWidth + this.gapWidth));
            let finalColumn = Math.max(Math.min(column, (interface_1.MAX_COLUMN - finalColumnSpan) + 1), 1);
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
        execute() {
            var _a, _b;
            this.element = document.getElementById(`${this.element.id}`);
            this.toolbar = this.element.querySelector('ide-toolbar');
            const newColumnData = this.getColumnData();
            if (!newColumnData)
                return;
            if (newColumnData) {
                this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);
                this.element.setAttribute('data-column', `${newColumnData.column}`);
                this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
            }
            if (this.toolbar) {
                const rowId = this.toolbar.rowId;
                const elementId = this.toolbar.elementId;
                const currentTag = ((_b = (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.tag) || {};
                const tag = Object.assign(Object.assign({}, currentTag), { width: this.finalWidth || '100%', height: this.finalHeight || this.initialHeight });
                this.toolbar.setTag(tag);
                if (newColumnData.column !== this.oldDataColumn.column || newColumnData.columnSpan !== this.oldDataColumn.columnSpan)
                    index_6.pageObject.setElement(rowId, elementId, Object.assign({ tag }, newColumnData));
            }
        }
        undo() {
            var _a, _b;
            this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
            this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
            this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);
            if (this.toolbar) {
                const rowId = this.toolbar.rowId;
                const elementId = this.toolbar.elementId;
                const currentTag = ((_b = (_a = this.toolbar) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.tag) || {};
                const tag = Object.assign(Object.assign({}, currentTag), { width: this.initialWidth, height: this.initialHeight });
                this.toolbar.setTag(tag);
                index_6.pageObject.setElement(rowId, elementId, Object.assign({ tag }, this.oldDataColumn));
            }
        }
        redo() { }
    }
    exports.ResizeElementCommand = ResizeElementCommand;
});
define("@scom/scom-page-builder/command/columnUtils.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/interface.ts"], function (require, exports, index_7, interface_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAppendColumnData = exports.getDropColumnData = exports.getPrevColumn = exports.getNextColumn = exports.getColumnSpan = exports.getColumn = exports.resetColumnData = exports.updateColumnData = void 0;
    const updateColumnData = (el, rowId, column, columnSpan) => {
        if (!column && !columnSpan)
            return;
        const col = column || getColumn(el);
        const colSpan = columnSpan || getColumnSpan(el);
        const newColumnData = { column: col, columnSpan: colSpan };
        index_7.pageObject.setElement(rowId, el.id, newColumnData);
        el.setAttribute('data-column', `${col}`);
        el.setAttribute('data-column-span', `${colSpan}`);
        el.style.gridColumn = `${col} / span ${colSpan}`;
    };
    exports.updateColumnData = updateColumnData;
    const resetColumnData = (el, rowId, column, columnSpan) => {
        index_7.pageObject.setElement(rowId, el.id, { column, columnSpan });
        el.setAttribute('data-column', `${column}`);
        el.setAttribute('data-column-span', `${columnSpan}`);
        el.style.gridColumn = `${column} / span ${columnSpan}`;
    };
    exports.resetColumnData = resetColumnData;
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
        const dropElmCol = getColumn(dropElm);
        let columnSpan = element ? getColumnSpan(element) : interface_2.MIN_COLUMN;
        const maxColumn = (interface_2.MAX_COLUMN - columnSpan) + 1;
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
            if (columnData <= 13 && newColumn < columnData)
                newColumn = columnData;
        }
        if (afterDropElm) {
            const afterColumn = getColumn(afterDropElm);
            if (newColumn + columnSpan > afterColumn)
                newColumnSpan = afterColumn - newColumn;
        }
        const finalColumnSpan = Math.max(Math.min(newColumnSpan, interface_2.MAX_COLUMN - currentSpan), 1);
        return { column: newColumn, columnSpan: finalColumnSpan };
    };
    exports.getDropColumnData = getDropColumnData;
    const getAppendColumnData = (dropElm, sortedSections, updateData, element) => {
        const dropSection = dropElm.closest('ide-section');
        if (!dropSection)
            return null;
        const pageRow = dropElm.closest('ide-row');
        const pageRowId = ((pageRow === null || pageRow === void 0 ? void 0 : pageRow.id) || '').replace('row-', '');
        let newColumn = getNextColumn(dropSection);
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
            newColumn = getNextColumn(dropSection);
            return { column: newColumn, columnSpan: getColumnSpan(element) };
        }
        const hasSpace = sortedSections.find((section) => getColumnSpan(section) > interface_2.MIN_COLUMN);
        if (!hasSpace && sortedSections.length >= 6)
            return null;
        const columnSpan = element ? Math.min(getColumnSpan(element), interface_2.MIN_COLUMN) : interface_2.MIN_COLUMN;
        for (let i = 0; i < sortedSections.length; i++) {
            const el = sortedSections[i];
            const prevElm = sortedSections[i - 1];
            const nextElm = sortedSections[i + 1];
            if (getColumnSpan(el) > columnSpan) {
                const newElColSpan = getColumnSpan(el) - columnSpan;
                if (getColumn(dropSection) < getColumn(el)) {
                    const nextPos = getColumn(el) - getColumnSpan(nextElm);
                    if (getColumn(nextElm) !== nextPos && nextPos !== getNextColumn(dropSection)) {
                        updateData(nextElm, pageRowId, nextPos);
                    }
                    else if (getColumn(nextElm) === nextPos && nextPos === getNextColumn(dropSection)) {
                        updateData(nextElm, pageRowId, nextPos + newElColSpan);
                    }
                    updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
                    newColumn = getNextColumn(dropSection);
                }
                else if (getColumn(dropSection) > getColumn(el)) {
                    updateData(el, pageRowId, getColumn(el), newElColSpan);
                    if (prevElm) {
                        for (let j = i - 1; j >= 0; j--) {
                            const elm = sortedSections[j];
                            const newElmCol = getColumn(elm) - columnSpan;
                            if (newElmCol !== getNextColumn(dropSection))
                                updateData(elm, pageRowId, newElmCol);
                        }
                    }
                    newColumn = getNextColumn(dropSection);
                }
                else {
                    updateData(el, pageRowId, getColumn(el), newElColSpan);
                    newColumn = getColumn(el) + newElColSpan;
                }
                break;
            }
            else {
                if (getNextColumn(el) < interface_2.MAX_COLUMN + 1 && i === 0) {
                    updateData(el, pageRowId, (interface_2.MAX_COLUMN + 1) - getColumnSpan(el));
                }
                if (nextElm) {
                    const canUpdated = getNextColumn(nextElm) !== getColumn(el) &&
                        getColumnSpan(nextElm) <= interface_2.MIN_COLUMN;
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
                newColumn = getNextColumn(dropSection);
            }
        }
        return { column: newColumn, columnSpan };
    };
    exports.getAppendColumnData = getAppendColumnData;
});
define("@scom/scom-page-builder/command/dragElement.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/columnUtils.ts"], function (require, exports, index_8, columnUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragElementCommand = void 0;
    class DragElementCommand {
        constructor(element, dropElm) {
            this.oldDataColumnMap = [];
            this.element = element;
            this.dropElm = dropElm;
            this.oldDataColumn = {
                column: Number(element.dataset.column),
                columnSpan: Number(element.dataset.columnSpan)
            };
            const pageRow = element.closest('ide-row');
            this.oldDataRow = ((pageRow === null || pageRow === void 0 ? void 0 : pageRow.id) || '').replace('row-', '');
            this.data = JSON.parse(JSON.stringify(element.data));
            this.updateData = this.updateData.bind(this);
        }
        updateData(el, rowId, column, columnSpan) {
            if (!column && !columnSpan)
                return;
            const oldColumnData = { el, rowId, column: columnUtils_1.getColumn(el), columnSpan: columnUtils_1.getColumnSpan(el) };
            this.oldDataColumnMap.push(oldColumnData);
            columnUtils_1.updateColumnData(el, rowId, column, columnSpan);
        }
        getColumnData() {
            const grid = this.dropElm.closest('.grid');
            const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
            const sortedSections = sections.sort((a, b) => Number(b.dataset.column) - Number(a.dataset.column));
            const dropElmCol = Number(this.dropElm.getAttribute('data-column'));
            return isNaN(dropElmCol) ?
                columnUtils_1.getAppendColumnData(this.dropElm, sortedSections, this.updateData, this.element) :
                columnUtils_1.getDropColumnData(this.dropElm, sortedSections);
        }
        execute() {
            var _a;
            this.element = document.getElementById(`${this.element.id}`);
            this.dropElm.style.border = "";
            const grid = this.dropElm.closest('.grid');
            if (!grid)
                return;
            const newColumnData = this.getColumnData();
            if (!newColumnData)
                return;
            this.element.style.gridRow = '1';
            this.element.style.gridColumn = `${newColumnData.column} / span ${newColumnData.columnSpan}`;
            this.element.setAttribute('data-column', `${newColumnData.column}`);
            this.element.setAttribute('data-column-span', `${newColumnData.columnSpan}`);
            const elementRow = this.element.closest('ide-row');
            const dropRow = this.dropElm.closest('ide-row');
            const dropRowId = ((dropRow === null || dropRow === void 0 ? void 0 : dropRow.id) || '').replace('row-', '');
            const elementRowId = ((elementRow === null || elementRow === void 0 ? void 0 : elementRow.id) || '').replace('row-', '');
            index_8.pageObject.setElement(elementRowId, this.element.id, Object.assign({}, newColumnData));
            if (elementRow && !elementRow.isEqualNode(dropRow)) {
                index_8.pageObject.addElement(dropRowId, Object.assign(Object.assign({}, this.data), newColumnData));
                index_8.pageObject.removeElement(elementRowId, this.element.id);
                grid.appendChild(this.element);
                const toolbar = this.element.querySelector('ide-toolbar');
                if (toolbar)
                    toolbar.rowId = dropRowId;
                this.element.rowId = dropRowId;
                this.element.parent = grid;
            }
            const elementSection = index_8.pageObject.getRow(elementRowId);
            elementRow.visible = !!((_a = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _a === void 0 ? void 0 : _a.length);
        }
        undo() {
            var _a;
            this.element.style.gridRow = '1';
            this.element.style.gridColumn = `${this.oldDataColumn.column} / span ${this.oldDataColumn.columnSpan}`;
            this.element.setAttribute('data-column', `${this.oldDataColumn.column}`);
            this.element.setAttribute('data-column-span', `${this.oldDataColumn.columnSpan}`);
            const elementRow = this.element.closest('ide-row');
            const elementRowId = ((elementRow === null || elementRow === void 0 ? void 0 : elementRow.id) || '').replace('row-', '');
            index_8.pageObject.setElement(elementRowId, this.element.id, Object.assign({}, this.oldDataColumn));
            if (!this.oldDataRow)
                return;
            const oldElementRow = document.querySelector(`#row-${this.oldDataRow}`);
            if (oldElementRow && !elementRow.isEqualNode(oldElementRow)) {
                index_8.pageObject.addElement(this.oldDataRow, Object.assign(Object.assign({}, this.data), this.oldDataColumn));
                index_8.pageObject.removeElement(elementRowId, this.element.id);
                const oldGrid = oldElementRow.querySelector('.grid');
                if (oldGrid) {
                    oldGrid.appendChild(this.element);
                    const toolbar = this.element.querySelector('ide-toolbar');
                    if (toolbar)
                        toolbar.rowId = this.oldDataRow;
                    this.element.rowId = this.oldDataRow;
                    this.element.parent = oldGrid;
                }
            }
            const oldElementSection = index_8.pageObject.getRow(this.oldDataRow);
            oldElementRow && (oldElementRow.visible = !!((_a = oldElementSection === null || oldElementSection === void 0 ? void 0 : oldElementSection.elements) === null || _a === void 0 ? void 0 : _a.length));
            for (let columnData of this.oldDataColumnMap) {
                const { el, rowId, column, columnSpan } = columnData;
                columnUtils_1.resetColumnData(el, rowId, column, columnSpan);
            }
        }
        redo() { }
    }
    exports.DragElementCommand = DragElementCommand;
});
define("@scom/scom-page-builder/command/removeToolbar.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts"], function (require, exports, components_4, index_9, index_10) {
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
            const section = JSON.parse(JSON.stringify(index_10.pageObject.getRow(this.rowId)));
            const ideSection = this.element.closest('ide-section');
            this.sectionId = ideSection.id;
            if (this.sectionId !== this.elementId) {
                const parentElm = ideSection.id && section.elements.find(el => el.id === this.sectionId);
                if (parentElm)
                    this.elementIndex = parentElm.elements.findIndex(el => el.id === this.elementId);
            }
        }
        execute() {
            var _a, _b;
            index_10.pageObject.removeElement(this.rowId, this.elementId);
            const sectionEl = this.element.closest('ide-section');
            this.element.remove();
            if (sectionEl)
                sectionEl.remove();
            const section = index_10.pageObject.getRow(this.rowId);
            if (this.pageRow) {
                if (!this.sectionId || this.sectionId === this.elementId) {
                    this.pageRow.visible = !!((_a = section === null || section === void 0 ? void 0 : section.elements) === null || _a === void 0 ? void 0 : _a.length);
                }
                else {
                    const parentElement = ((section === null || section === void 0 ? void 0 : section.elements) || []).find(elm => elm.id === this.sectionId);
                    this.pageRow.visible = !!((_b = parentElement === null || parentElement === void 0 ? void 0 : parentElement.elements) === null || _b === void 0 ? void 0 : _b.length);
                }
            }
            components_4.application.EventBus.dispatch(index_9.EVENT.ON_UPDATE_SECTIONS);
        }
        undo() {
            index_10.pageObject.addElement(this.rowId, this.data, this.sectionId, this.elementIndex);
            const section = index_10.pageObject.getRow(this.rowId);
            const clonedSection = JSON.parse(JSON.stringify(section));
            if (this.pageRow && (this.rowId !== 'header' && this.rowId !== 'footer')) {
                this.pageRow.setData(Object.assign(Object.assign({}, clonedSection), { id: this.rowId }));
                this.pageRow.visible = true;
            }
            components_4.application.EventBus.dispatch(index_9.EVENT.ON_UPDATE_SECTIONS);
        }
        redo() { }
    }
    exports.RemoveToolbarCommand = RemoveToolbarCommand;
});
define("@scom/scom-page-builder/command/updateType.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/interface/index.ts"], function (require, exports, index_11, index_12, index_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UpdateTypeCommand = void 0;
    class UpdateTypeCommand {
        constructor(dropElm, element, config) {
            this.element = element || null;
            this.dropElm = dropElm;
            const pageRow = (element ? element.closest('ide-row') : dropElm.closest('ide-row'));
            this.oldDataRow = ((pageRow === null || pageRow === void 0 ? void 0 : pageRow.id) || '').replace('row-', '');
            this.data = element ? JSON.parse(JSON.stringify(element.data)) : null;
            this.config = config || null;
            const dropToolbar = this.dropElm.closest('ide-toolbar');
            const dropRowId = dropToolbar === null || dropToolbar === void 0 ? void 0 : dropToolbar.rowId;
            const dropSection = this.dropElm.closest('ide-section');
            const dropSectionId = ((dropSection === null || dropSection === void 0 ? void 0 : dropSection.id) || '');
            this.oldDropData = JSON.parse(JSON.stringify(index_11.pageObject.getElement(dropRowId, dropSectionId)));
        }
        getElements() {
            var _a, _b, _c, _d, _e, _f;
            if (this.isNew) {
                const isMicroDapps = ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.category) === 'micro-dapps';
                const newElData = {
                    id: index_12.generateUUID(),
                    column: 1,
                    columnSpan: 6,
                    type: ((_c = this.config) === null || _c === void 0 ? void 0 : _c.type) || index_13.ElementType.PRIMITIVE,
                    properties: {
                        showHeader: isMicroDapps,
                        showFooter: isMicroDapps
                    },
                    module: ((_d = this.config) === null || _d === void 0 ? void 0 : _d.module) || {}
                };
                return [newElData];
            }
            else {
                if (((_e = this.data) === null || _e === void 0 ? void 0 : _e.type) === index_13.ElementType.COMPOSITE)
                    return ((_f = this.data) === null || _f === void 0 ? void 0 : _f.elements) || [];
                else
                    return [this.data];
            }
        }
        get isNew() {
            return !this.element;
        }
        execute() {
            var _a;
            this.dropElm.style.border = "";
            const dropToolbar = this.dropElm.closest('ide-toolbar');
            if (!dropToolbar)
                return;
            const dropRowId = dropToolbar === null || dropToolbar === void 0 ? void 0 : dropToolbar.rowId;
            const dropSectionId = dropToolbar === null || dropToolbar === void 0 ? void 0 : dropToolbar.elementId;
            const dropSection = document.getElementById(`${dropSectionId}`);
            const dropSectionData = index_11.pageObject.getElement(dropRowId, dropSectionId);
            const clonedDropSecData = JSON.parse(JSON.stringify(dropSectionData));
            if (!dropSectionId || !dropRowId || !dropSectionData)
                return;
            if ((clonedDropSecData === null || clonedDropSecData === void 0 ? void 0 : clonedDropSecData.type) === index_13.ElementType.COMPOSITE) {
                const elementIndex = dropSectionData.elements.findIndex(elm => elm.id === dropSectionId);
                const elementList = this.getElements();
                for (let i = 0; i < elementList.length; i++) {
                    index_11.pageObject.addElement(dropRowId, elementList[i], dropSectionId, elementIndex + i + 1);
                }
            }
            else if ((clonedDropSecData === null || clonedDropSecData === void 0 ? void 0 : clonedDropSecData.type) === index_13.ElementType.PRIMITIVE) {
                const elementList = this.getElements();
                clonedDropSecData.id = index_12.generateUUID();
                index_11.pageObject.setElement(dropRowId, dropSectionId, {
                    type: index_13.ElementType.COMPOSITE,
                    elements: [clonedDropSecData, ...elementList]
                });
            }
            dropSection.setData(dropRowId, index_11.pageObject.getElement(dropRowId, dropSectionId));
            if (this.isNew)
                return;
            const elementRow = this.element.closest('ide-row');
            const elementRowId = ((elementRow === null || elementRow === void 0 ? void 0 : elementRow.id) || '').replace('row-', '');
            index_11.pageObject.removeElement(elementRowId, this.element.id);
            const elementSection = index_11.pageObject.getRow(elementRowId);
            elementRow.visible = !!((_a = elementSection === null || elementSection === void 0 ? void 0 : elementSection.elements) === null || _a === void 0 ? void 0 : _a.length);
        }
        undo() {
            var _a;
            const dropToolbar = this.dropElm.closest('ide-toolbar');
            const dropRowId = dropToolbar === null || dropToolbar === void 0 ? void 0 : dropToolbar.rowId;
            const dropSection = dropToolbar.parent.closest('ide-section');
            dropSection && dropSection.setData(dropRowId, this.oldDropData);
            index_11.pageObject.setElement(dropRowId, this.oldDropData.id, this.oldDropData);
            if (this.isNew)
                return;
            const oldElementRow = document.querySelector(`#row-${this.oldDataRow}`);
            index_11.pageObject.addElement(this.oldDataRow, this.data);
            const oldElementSection = index_11.pageObject.getRow(this.oldDataRow);
            oldElementRow && (oldElementRow.visible = !!((_a = oldElementSection === null || oldElementSection === void 0 ? void 0 : oldElementSection.elements) === null || _a === void 0 ? void 0 : _a.length));
        }
        redo() { }
    }
    exports.UpdateTypeCommand = UpdateTypeCommand;
});
define("@scom/scom-page-builder/command/addElement.ts", ["require", "exports", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/columnUtils.ts"], function (require, exports, index_14, columnUtils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddElementCommand = void 0;
    class AddElementCommand {
        constructor(data, isAppend, dropElm, parent) {
            this.isAppend = true;
            this.oldDataColumnMap = [];
            this.oldId = '';
            this.data = JSON.parse(JSON.stringify(data));
            this.dropElm = dropElm;
            this.parent = parent || dropElm.closest('ide-row');
            this.isAppend = isAppend;
            this.updateData = this.updateData.bind(this);
            this.oldId = this.data.id;
        }
        get isNew() {
            return this.isAppend && !this.dropElm;
        }
        updateData(el, rowId, column, columnSpan) {
            if (!column && !columnSpan)
                return;
            const oldColumnData = { el, rowId, column: columnUtils_2.getColumn(el), columnSpan: columnUtils_2.getColumnSpan(el) };
            const insertedIndex = this.oldDataColumnMap.findIndex(data => data.rowId === rowId);
            insertedIndex === -1 && this.oldDataColumnMap.push(oldColumnData);
            columnUtils_2.updateColumnData(el, rowId, column, columnSpan);
        }
        getNewColumn(oldDropColumn) {
            // const dropSection = document.getElementById(`${this.sectionId}`) as Control;
            // if (!dropSection) return oldDropColumn;
            return this.isAppend ? columnUtils_2.getNextColumn(this.dropElm) : oldDropColumn;
        }
        // private getColumnData() {
        //   if (!this.sectionId) return null;
        //   const dropSection = document.getElementById(`${this.sectionId}`) as Control;
        //   if (!dropSection) return null;
        //   const grid = dropSection.closest('.grid');
        //   const sections = Array.from(grid?.querySelectorAll('ide-section'));
        //   const sortedSections = sections.sort((a: HTMLElement, b: HTMLElement) => Number(b.dataset.column) - Number(a.dataset.column));
        //   const pageRow = dropSection.closest('ide-row') as Control;
        //   const pageRowId = (pageRow?.id || '').replace('row-', '');
        //   const oldDropColumn = getColumn(dropSection);
        //   let newColumn = this.getNewColumn(oldDropColumn);
        //   const hasSpace = sortedSections.find((section: Control) => getColumnSpan(section) > MIN_COLUMN);
        //   if (!hasSpace && sortedSections.length >= 6) return null;
        //   const columnSpan = MIN_COLUMN;
        //   console.log(dropSection, sortedSections)
        //   // if (!this.isAppend) {
        //   //   this.updateData(dropSection, pageRowId, columnSpan + newColumn);
        //   // }
        //   for (let i = 0; i < sortedSections.length; i++) {
        //     const el = sortedSections[i] as Control;
        //     const prevElm = sortedSections[i - 1] as Control;
        //     const nextElm = sortedSections[i + 1] as Control;
        //     if (getColumnSpan(el) > columnSpan) {
        //       const newElColSpan = getColumnSpan(el) - columnSpan;
        //       if (getColumn(dropSection) < getColumn(el)) {
        //         const nextPos = getColumn(el) - getColumnSpan(nextElm);
        //         if (getColumn(nextElm) !== nextPos && nextPos !== getNextColumn(dropSection))
        //           this.updateData(nextElm, pageRowId, nextPos);
        //         this.updateData(el, pageRowId, getColumn(el) + columnSpan, newElColSpan);
        //         newColumn = this.getNewColumn(oldDropColumn);
        //       } else if (getColumn(dropSection) > getColumn(el)) {
        //         this.updateData(el, pageRowId, getColumn(el), newElColSpan);
        //         if (prevElm) {
        //           for (let j = i - 1; j >= 0; j--) {
        //             const elm = sortedSections[j] as Control;
        //             const newElmCol = getColumn(elm) - columnSpan;
        //             if (newElmCol !== getNextColumn(dropSection))
        //               this.updateData(elm, pageRowId, newElmCol);
        //           }
        //         }
        //         newColumn = this.getNewColumn(oldDropColumn);
        //       } else {
        //         this.updateData(el, pageRowId, getColumn(el), newElColSpan);
        //         newColumn = this.isAppend ? getColumn(el) + newElColSpan : oldDropColumn;
        //       }
        //       break;
        //     } else {
        //       if (getNextColumn(el) < MAX_COLUMN + 1 && i === 0) {
        //         this.updateData(el, pageRowId, (MAX_COLUMN + 1) - getColumnSpan(el));
        //       }
        //       if (nextElm) {
        //         const canUpdated = getNextColumn(nextElm) !== getColumn(el) &&
        //           getColumnSpan(nextElm) <= MIN_COLUMN;
        //         if (canUpdated) {
        //           if (getColumn(dropSection) < getColumn(el)) {
        //             const pos = getColumn(el) - getColumnSpan(nextElm);
        //             pos !== getNextColumn(dropSection) && this.updateData(nextElm, pageRowId, pos);
        //           } else if (getColumn(dropSection) > getColumn(el)) {
        //             for (let j = i; j >= 0; j--) {
        //               const elm = sortedSections[j] as Control;
        //               if (getPrevColumn(elm) !== getNextColumn(dropSection)) {
        //                 this.updateData(elm, pageRowId, getPrevColumn(elm));
        //               }
        //             }
        //           } else {
        //             this.updateData(el, pageRowId, getPrevColumn(dropSection));
        //           }
        //         }
        //       }
        //       newColumn = this.getNewColumn(oldDropColumn);
        //     }
        //   }
        //   return { column: newColumn, columnSpan };
        // }
        getColumnData() {
            const grid = this.dropElm.closest('.grid');
            const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
            const sortedSections = sections.sort((a, b) => Number(b.dataset.column) - Number(a.dataset.column));
            const dropElmCol = Number(this.dropElm.getAttribute('data-column'));
            return isNaN(dropElmCol) ?
                columnUtils_2.getAppendColumnData(this.dropElm, sortedSections, this.updateData) :
                columnUtils_2.getDropColumnData(this.dropElm, sortedSections);
        }
        async execute() {
            var _a, _b;
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
                id: this.oldId,
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
            index_14.pageObject.addElement(parentId, newElData);
        }
        undo() {
            if (!this.element)
                return;
            this.element.remove();
            const parentId = this.parent.id.replace('row-', '');
            index_14.pageObject.removeElement(parentId, this.element.id);
            for (let columnData of this.oldDataColumnMap) {
                const { el, rowId, column, columnSpan } = columnData;
                columnUtils_2.resetColumnData(el, rowId, column, columnSpan);
            }
        }
        redo() { }
    }
    exports.AddElementCommand = AddElementCommand;
});
define("@scom/scom-page-builder/command/index.ts", ["require", "exports", "@scom/scom-page-builder/command/updateRow.ts", "@scom/scom-page-builder/command/updateColor.ts", "@scom/scom-page-builder/command/history.ts", "@scom/scom-page-builder/command/moveRow.ts", "@scom/scom-page-builder/command/resize.ts", "@scom/scom-page-builder/command/dragElement.ts", "@scom/scom-page-builder/command/removeToolbar.ts", "@scom/scom-page-builder/command/updateType.ts", "@scom/scom-page-builder/command/addElement.ts", "@scom/scom-page-builder/command/interface.ts"], function (require, exports, updateRow_1, updateColor_1, history_1, moveRow_1, resize_1, dragElement_1, removeToolbar_1, updateType_1, addElement_1, interface_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MIN_COLUMN = exports.MAX_COLUMN = exports.AddElementCommand = exports.UpdateTypeCommand = exports.RemoveToolbarCommand = exports.DragElementCommand = exports.ResizeElementCommand = exports.MoveElementCommand = exports.commandHistory = exports.CommandHistory = exports.UpdateColorCommand = exports.UpdateRowCommand = void 0;
    Object.defineProperty(exports, "UpdateRowCommand", { enumerable: true, get: function () { return updateRow_1.UpdateRowCommand; } });
    Object.defineProperty(exports, "UpdateColorCommand", { enumerable: true, get: function () { return updateColor_1.UpdateColorCommand; } });
    Object.defineProperty(exports, "CommandHistory", { enumerable: true, get: function () { return history_1.CommandHistory; } });
    Object.defineProperty(exports, "commandHistory", { enumerable: true, get: function () { return history_1.commandHistory; } });
    Object.defineProperty(exports, "MoveElementCommand", { enumerable: true, get: function () { return moveRow_1.MoveElementCommand; } });
    Object.defineProperty(exports, "ResizeElementCommand", { enumerable: true, get: function () { return resize_1.ResizeElementCommand; } });
    Object.defineProperty(exports, "DragElementCommand", { enumerable: true, get: function () { return dragElement_1.DragElementCommand; } });
    Object.defineProperty(exports, "RemoveToolbarCommand", { enumerable: true, get: function () { return removeToolbar_1.RemoveToolbarCommand; } });
    Object.defineProperty(exports, "UpdateTypeCommand", { enumerable: true, get: function () { return updateType_1.UpdateTypeCommand; } });
    Object.defineProperty(exports, "AddElementCommand", { enumerable: true, get: function () { return addElement_1.AddElementCommand; } });
    Object.defineProperty(exports, "MAX_COLUMN", { enumerable: true, get: function () { return interface_3.MAX_COLUMN; } });
    Object.defineProperty(exports, "MIN_COLUMN", { enumerable: true, get: function () { return interface_3.MIN_COLUMN; } });
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
define("@scom/scom-page-builder/page/pageHeader.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageHeader.css.ts"], function (require, exports, components_8, index_15, index_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageHeader = void 0;
    const Theme = index_16.currentTheme;
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
                    onClick: () => index_15.commandHistory.undo()
                },
                {
                    name: 'redo',
                    tooltip: { content: 'Redo last action', placement: 'bottom' },
                    onClick: () => index_15.commandHistory.redo()
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
        components_8.customElements('ide-header')
    ], PageHeader);
    exports.PageHeader = PageHeader;
});
define("@scom/scom-page-builder/page/pageSection.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_9, index_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_17.currentTheme;
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
define("@scom/scom-page-builder/dialogs/confirmDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_10, index_18, index_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfirmDialog = void 0;
    const Theme = index_19.currentTheme;
    ;
    let ConfirmDialog = class ConfirmDialog extends components_10.Module {
        constructor(parent, options) {
            super(parent, options);
        }
        async init() {
            super.init();
            index_18.assignAttr(this);
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
        components_10.customElements('scpage-confirm-dialog')
    ], ConfirmDialog);
    exports.ConfirmDialog = ConfirmDialog;
});
define("@scom/scom-page-builder/dialogs/loadingDialog.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_11, index_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_20.currentTheme;
    const spin = components_11.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    components_11.Styles.cssRule('scpage-loading-dialog', {
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
define("@scom/scom-page-builder/dialogs/loadingDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/dialogs/loadingDialog.css.ts"], function (require, exports, components_12, index_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingDialog = void 0;
    let LoadingDialog = class LoadingDialog extends components_12.Module {
        constructor(parent, options) {
            super(parent, options);
            index_21.assignAttr(this);
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
        components_12.customElements('scpage-loading-dialog')
    ], LoadingDialog);
    exports.LoadingDialog = LoadingDialog;
});
define("@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_13, index_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_22.currentTheme;
    components_13.Styles.cssRule('ide-row-settings-dialog', {
        $nest: {
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
                        marginBottom: '1rem'
                    },
                    '.modal': {
                        maxHeight: 'calc(100vh - 48px)',
                        padding: 0
                    }
                }
            },
        }
    });
});
define("@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/dialogs/rowSettingsDialog.css.ts"], function (require, exports, components_14, index_23, index_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RowSettingsDialog = void 0;
    const Theme = index_24.currentTheme;
    let RowSettingsDialog = class RowSettingsDialog extends components_14.Module {
        constructor(parent) {
            super(parent);
            index_23.assignAttr(this);
        }
        show() {
            this.dialog.visible = true;
        }
        hide() {
            this.dialog.visible = false;
        }
        setConfig(config) {
            this.txtRowBackgroundColor.value = config;
        }
        getConfig() {
            const backgroundColor = this.txtRowBackgroundColor.value;
            return backgroundColor;
        }
        async confirm() {
            const config = this.getConfig();
            if (this.onSave)
                await this.onSave(config);
            this.dialog.visible = false;
        }
        cancel() {
            this.dialog.visible = false;
        }
        render() {
            return (this.$render("i-modal", { id: 'dialog', minWidth: 400, maxWidth: 500, title: "Section Colors", closeOnBackdropClick: false, closeIcon: { name: 'times' }, class: "setting-modal" },
                this.$render("i-vstack", { padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' } },
                    this.$render("i-vstack", { class: 'form-group', margin: { bottom: '2rem' }, gap: "0.5rem" },
                        this.$render("i-label", { class: 'form-label', caption: 'Background color' }),
                        this.$render("i-panel", { class: 'form-control' },
                            this.$render("i-input", { inputType: 'color', id: 'txtRowBackgroundColor' }))),
                    this.$render("i-hstack", { justifyContent: 'end', alignItems: 'center', gap: "0.5rem" },
                        this.$render("i-button", { caption: 'Cancel', background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, onClick: this.cancel }),
                        this.$render("i-button", { caption: 'Confirm', background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, onClick: this.confirm })))));
        }
    };
    RowSettingsDialog = __decorate([
        components_14.customElements('ide-row-settings-dialog')
    ], RowSettingsDialog);
    exports.RowSettingsDialog = RowSettingsDialog;
});
define("@scom/scom-page-builder/dialogs/pageBlockSettingsDialog.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/utility/index.ts"], function (require, exports, components_15, index_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageBlockSettingsDialog = void 0;
    let PageBlockSettingsDialog = class PageBlockSettingsDialog extends components_15.Module {
        constructor(parent, options) {
            super(parent, options);
            this.form = {};
            index_25.assignAttr(this);
        }
        async init() {
            super.init();
        }
        show(data) {
            if (!data)
                return;
            const { schema, configData, events, visibleOn, invisibleOn } = data;
            this.reset();
            this.schema = schema;
            this.configData = configData;
            const form = this.renderForm(schema, '', '', this.configData);
            if (form)
                this.pnlConfig.append(form);
            if (events) {
                for (const event of events) {
                    const box = this.$render("i-panel", { class: 'box' },
                        this.$render("i-panel", { class: 'box-header' },
                            this.$render("i-label", { caption: event.name }),
                            this.$render("i-label", { caption: event.description, class: 'ml-20', font: { size: '14px' } })));
                    this.pnlEvents.append(box);
                }
            }
            this.txtVisibleOn.value = visibleOn;
            this.txtInvisibleOn.value = invisibleOn;
            this.dialog.visible = true;
        }
        close() {
            this.dialog.visible = false;
        }
        async handleSaveClick() {
            const data = await this.getFormData(this.schema, '');
            if (this.onSave)
                await this.onSave({
                    visibleOn: this.txtVisibleOn.value,
                    invisibleOn: this.txtInvisibleOn.value,
                    configData: data
                });
            this.close();
        }
        async getFormData(object, name) {
            var _a, _b;
            switch ((_a = object.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                case 'object':
                    let data = {};
                    const properties = object.properties;
                    for (const propertyName in properties) {
                        data[propertyName] = await this.getFormData(properties[propertyName], `${name}/${propertyName}`);
                    }
                    return data;
                case 'string':
                case 'number':
                case 'integer':
                case 'boolean':
                    switch (this.form[name].type) {
                        case 'input':
                        case 'datepicker':
                        case 'colorpicker':
                            return this.form[name].control.value;
                        case 'combobox':
                            return (_b = this.form[name].control.value) === null || _b === void 0 ? void 0 : _b.value;
                        case 'checkbox':
                            return this.form[name].control.checked;
                        case 'uploader':
                            if (this.form[name].control.fileList && this.form[name].control.fileList.length > 0)
                                return await this.form[name].control.toBase64(this.form[name].control.fileList[0]);
                            else
                                return '';
                    }
                default:
                    return null;
            }
            return null;
        }
        reset() {
            this.schema = undefined;
            this.configData = undefined;
            this.form = {};
            this.pnlConfig.clearInnerHTML();
        }
        renderForm(object, name, nameBuilder = "", data, required) {
            var _a, _b;
            if (!object)
                return null;
            const labelName = this.convertFieldNameToLabel(name);
            switch ((_a = object.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                case 'object':
                    const req = object.required;
                    const properties = object.properties;
                    const box = this.$render("i-panel", { class: 'box' });
                    if (name) {
                        box.append(this.$render("i-panel", { class: 'box-header' },
                            this.$render("i-label", { caption: this.convertFieldNameToLabel(name) })));
                    }
                    const form = this.$render("i-panel", { class: 'box-content' });
                    for (const propertyName in properties) {
                        let subLevelData = data;
                        if (data && name)
                            subLevelData = data[name];
                        const control = this.renderForm(properties[propertyName], propertyName, `${nameBuilder}/${propertyName}`, subLevelData, req);
                        form.append(control);
                    }
                    box.append(form);
                    return box;
                case 'string':
                    switch ((_b = object.format) === null || _b === void 0 ? void 0 : _b.toLowerCase()) {
                        case 'date':
                            const datePicker = this.$render("i-datepicker", null);
                            if (data)
                                datePicker.value = data[name];
                            this.form[nameBuilder] = {
                                control: datePicker,
                                type: 'datepicker',
                                required: required && required.indexOf(name) >= 0
                            };
                            return this.$render("i-panel", { class: 'form-group' },
                                this.$render("i-label", { class: 'form-label', caption: labelName }),
                                this.$render("i-panel", { class: 'form-control' }, datePicker));
                        case 'datetime':
                            const dateTimePicker = this.$render("i-datepicker", { dateTimeFormat: 'YYYY-MM-DD HH:mm:ss' });
                            if (data)
                                dateTimePicker.value = data[name];
                            this.form[nameBuilder] = {
                                control: dateTimePicker,
                                type: 'datepicker',
                                required: required && required.indexOf(name) >= 0
                            };
                            return this.$render("i-panel", { class: 'form-group' },
                                this.$render("i-label", { class: 'form-label', caption: labelName }),
                                this.$render("i-panel", { class: 'form-control' }, dateTimePicker));
                        case 'color':
                            const colorPicker = this.$render("i-input", { inputType: 'color' });
                            if (data)
                                colorPicker.value = data[name];
                            this.form[nameBuilder] = {
                                control: colorPicker,
                                type: 'colorpicker',
                                required: required && required.indexOf(name) >= 0
                            };
                            return this.$render("i-panel", { class: 'form-group' },
                                this.$render("i-label", { class: 'form-label', caption: labelName }),
                                this.$render("i-panel", { class: 'form-control' }, colorPicker));
                        // case 'image':
                        //     const uploader: Upload = <i-upload></i-upload>
                        //     if(data) {
                        //         uploader.preview(data[name]);
                        //     }
                        //     this.form[name] = {
                        //         control: uploader,
                        //         type: 'uploader',
                        //         required: required && required.indexOf(name) >= 0
                        //     }
                        default:
                            if (object.enum && object.enum.length > 0) {
                                const items = [];
                                for (const item of object.enum) {
                                    items.push({ label: item, value: item });
                                }
                                // Drop down list
                                const comboBox = this.$render("i-combo-box", { items: items, icon: { name: 'caret-down' } });
                                if (data)
                                    comboBox.value = data[name];
                                this.form[nameBuilder] = {
                                    control: comboBox,
                                    type: 'combobox',
                                    required: required && required.indexOf(name) >= 0
                                };
                                return this.$render("i-panel", { class: 'form-group' },
                                    this.$render("i-label", { class: 'form-label', caption: labelName }),
                                    this.$render("i-panel", { class: 'form-control' }, comboBox));
                            }
                            else {
                                const input = this.$render("i-input", { inputType: 'text' });
                                if (data)
                                    input.value = data[name];
                                this.form[nameBuilder] = {
                                    control: input,
                                    type: 'input',
                                    required: required && required.indexOf(name) >= 0
                                };
                                // const { minLength, maxLength } = object.minLength;
                                // if(minLength) {
                                // }
                                // if(maxLength) {
                                // }
                                return this.$render("i-panel", { class: 'form-group' },
                                    this.$render("i-label", { class: 'form-label', caption: labelName }),
                                    this.$render("i-panel", { class: 'form-control' }, input));
                            }
                    }
                case 'number':
                    var { minimum, maximum } = object;
                    if (minimum != undefined && maximum != undefined) {
                        const input = this.$render("i-input", { inputType: 'range', min: minimum, max: maximum, tooltipVisible: true });
                        if (data)
                            input.value = data[name];
                        this.form[nameBuilder] = {
                            control: input,
                            type: 'input',
                            required: required && required.indexOf(name) >= 0
                        };
                        return this.$render("i-panel", { class: 'form-group' },
                            this.$render("i-label", { class: 'form-label', caption: labelName }),
                            this.$render("i-panel", { class: 'form-control' }, input));
                    }
                    else {
                        const input = this.$render("i-input", { inputType: 'number' });
                        if (data)
                            input.value = data[name];
                        this.form[nameBuilder] = {
                            control: input,
                            type: 'input',
                            required: required && required.indexOf(name) >= 0
                        };
                        return this.$render("i-panel", { class: 'form-group' },
                            this.$render("i-label", { class: 'form-label', caption: labelName }),
                            this.$render("i-panel", { class: 'form-control' }, input));
                    }
                case 'integer':
                    var { minimum, maximum } = object;
                    if (minimum != undefined && maximum != undefined) {
                        var input = this.$render("i-input", { inputType: 'range', min: minimum, max: maximum, value: minimum, tooltipVisible: true });
                        if (data)
                            input.value = data[name];
                        this.form[nameBuilder] = {
                            control: input,
                            type: 'input',
                            required: required && required.indexOf(name) >= 0
                        };
                        return this.$render("i-panel", { class: 'form-group' },
                            this.$render("i-label", { class: 'form-label', caption: labelName }),
                            this.$render("i-panel", { class: 'form-control' }, input));
                    }
                    else {
                        var input = this.$render("i-input", { inputType: 'number' });
                        if (data)
                            input.value = data[name];
                        this.form[nameBuilder] = {
                            control: input,
                            type: 'input',
                            required: required && required.indexOf(name) >= 0
                        };
                        return this.$render("i-panel", { class: 'form-group' },
                            this.$render("i-label", { class: 'form-label', caption: labelName }),
                            this.$render("i-panel", { class: 'form-control' }, input));
                    }
                case 'boolean':
                    var checkbox = this.$render("i-checkbox", null);
                    if (data)
                        checkbox.checked = data[name];
                    this.form[nameBuilder] = {
                        control: checkbox,
                        type: 'checkbox',
                        required: required && required.indexOf(name) >= 0
                    };
                    return this.$render("i-panel", { class: 'form-group' },
                        this.$render("i-label", { class: 'form-label', caption: labelName }),
                        this.$render("i-panel", { class: 'form-control' }, checkbox));
                default:
                    return null;
            }
        }
        convertFieldNameToLabel(name) {
            let label = '';
            for (let i = 0; i < name.length; i++) {
                let char = name[i];
                if (i == 0) {
                    label += char.toUpperCase();
                    continue;
                }
                if (char == char.toUpperCase())
                    label += ` ${char}`;
                else
                    label += char;
            }
            return label;
        }
        async render() {
            return this.$render("i-modal", { id: 'dialog', showBackdrop: true, closeOnBackdropClick: false, closeIcon: { name: 'times' }, visible: false, maxWidth: '1460px' },
                this.$render("i-tabs", null,
                    this.$render("i-tab", { caption: "Config" },
                        this.$render("i-panel", { id: 'pnlConfig' })),
                    this.$render("i-tab", { caption: "Global Events" },
                        this.$render("i-panel", { class: 'box' },
                            this.$render("i-panel", { id: 'pnlEvents', class: 'box-content' }))),
                    this.$render("i-tab", { caption: "Visible on" },
                        this.$render("i-panel", { class: 'box' },
                            this.$render("i-panel", { class: 'box-content' },
                                this.$render("i-panel", { class: 'form-group' },
                                    this.$render("i-label", { class: 'form-label', caption: "Visible on" }),
                                    this.$render("i-panel", { class: 'form-control' },
                                        this.$render("i-input", { inputType: 'text', id: "txtVisibleOn" }))),
                                this.$render("i-panel", { class: 'form-group' },
                                    this.$render("i-label", { class: 'form-label', caption: "Invisible on" }),
                                    this.$render("i-panel", { class: 'form-control' },
                                        this.$render("i-input", { inputType: 'text', id: "txtInvisibleOn" }))))))),
                this.$render("i-panel", null,
                    this.$render("i-button", { class: 'btn btn-secondary', caption: 'Cancel', onClick: this.close.bind(this) }),
                    this.$render("i-button", { class: 'btn btn-primary', caption: 'Save', onClick: this.handleSaveClick.bind(this) })));
        }
    };
    PageBlockSettingsDialog = __decorate([
        components_15.customElements('scpage-pageblock-settings-dialog')
    ], PageBlockSettingsDialog);
    exports.PageBlockSettingsDialog = PageBlockSettingsDialog;
});
define("@scom/scom-page-builder/dialogs/index.ts", ["require", "exports", "@scom/scom-page-builder/dialogs/confirmDialog.tsx", "@scom/scom-page-builder/dialogs/loadingDialog.tsx", "@scom/scom-page-builder/dialogs/rowSettingsDialog.tsx", "@scom/scom-page-builder/dialogs/pageBlockSettingsDialog.tsx"], function (require, exports, confirmDialog_1, loadingDialog_1, rowSettingsDialog_1, pageBlockSettingsDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageBlockSettingsDialog = exports.RowSettingsDialog = exports.LoadingDialog = exports.ConfirmDialog = void 0;
    Object.defineProperty(exports, "ConfirmDialog", { enumerable: true, get: function () { return confirmDialog_1.ConfirmDialog; } });
    Object.defineProperty(exports, "LoadingDialog", { enumerable: true, get: function () { return loadingDialog_1.LoadingDialog; } });
    Object.defineProperty(exports, "RowSettingsDialog", { enumerable: true, get: function () { return rowSettingsDialog_1.RowSettingsDialog; } });
    Object.defineProperty(exports, "PageBlockSettingsDialog", { enumerable: true, get: function () { return pageBlockSettingsDialog_1.PageBlockSettingsDialog; } });
});
define("@scom/scom-page-builder/common/toolbar.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_16, index_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_26.currentTheme;
    const tileToolbarFadeIn = components_16.Styles.keyframes({
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
    });
    components_16.Styles.cssRule('ide-toolbar', {
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
            '.ide-toolbar': {
                position: 'absolute',
                zIndex: 99,
                top: -50,
                left: 0,
                boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
                animation: `${tileToolbarFadeIn} 125ms cubic-bezier(0.4,0,1,1)`
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
                        marginBottom: '1rem'
                    },
                    '.modal': {
                        padding: 0
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
define("@scom/scom-page-builder/common/toolbar.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/common/toolbar.css.ts"], function (require, exports, components_17, index_27, index_28, index_29, index_30, index_31, index_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IDEToolbar = void 0;
    const Theme = index_32.currentTheme;
    const SINGLE_CONTENT_BLOCK_ID = 'single-content-block__';
    let IDEToolbar = class IDEToolbar extends components_17.Module {
        constructor(parent) {
            super(parent);
            this._toolList = [];
            this.currentAction = null;
            this._component = null;
            this.setData = this.setData.bind(this);
            this.fetchModule = this.fetchModule.bind(this);
        }
        get data() {
            return index_29.pageObject.getElement(this.rowId, this.elementId);
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
        async renderToolbars() {
            this.toolbar.clearInnerHTML();
            for (let i = 0; i < this.toolList.length; i++) {
                const tool = this.toolList[i];
                let elm = await components_17.Button.create({
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
                        if (index_30.isEmpty(tool.userInputDataSchema) && index_30.isEmpty(tool.customUI)) {
                            const commandIns = this.currentAction.command(this, null);
                            index_31.commandHistory.execute(commandIns);
                        }
                        else {
                            this.mdActions.visible = true;
                        }
                        this.hideToolbars();
                    }
                });
                elm.classList.add('toolbar');
                this.toolbar.appendChild(elm);
            }
            const removeBtn = await components_17.Button.create({
                padding: { left: '12px', right: '12px', top: '12px', bottom: '12px' },
                width: 48,
                height: 48,
                border: { radius: '50%' },
                tooltip: { trigger: 'hover', content: 'Delete', color: '#555555' },
                background: { color: 'transparent' },
                caption: `<i-icon name="trash" width=${20} height=${20} display="block" fill="${Theme.text.primary}"></i-icon>`,
                onClick: () => {
                    const removeCmd = new index_31.RemoveToolbarCommand(this);
                    index_31.commandHistory.execute(removeCmd);
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
            var _a, _b, _c, _d, _e;
            this.pnlForm.clearInnerHTML();
            const builderTarget = this._component.getConfigurators().find((conf) => conf.target === 'Builders');
            const data = (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.getData) ? await builderTarget.getData() : this.data.properties;
            if (data.height === 'auto')
                data.height = this.offsetHeight;
            if (data.width === 'auto')
                data.width = this.offsetWidth;
            let properties;
            //FIXME: used temporarily for container type
            if (data.content && data.content.properties) {
                properties = data.content.properties;
            }
            else if (this.isContentBlock()) {
                properties = this._currentSingleContentBlockId ? data[this._currentSingleContentBlockId].properties : data;
            }
            else {
                properties = data;
            }
            let tag = ((_a = data === null || data === void 0 ? void 0 : data.content) === null || _a === void 0 ? void 0 : _a.tag) || this.data.tag || {};
            this.mdActions.title = action.name || 'Update Settings';
            if (action.customUI) {
                const customUI = action.customUI;
                const element = customUI.render(Object.assign(Object.assign({}, properties), tag), this.onSave.bind(this));
                this.pnlForm.append(element);
            }
            else {
                if (typeof tag.width === 'number' && ((_c = (_b = action.userInputDataSchema.properties) === null || _b === void 0 ? void 0 : _b.width) === null || _c === void 0 ? void 0 : _c.type) === 'string') {
                    tag.width = "" + tag.width;
                }
                if (typeof tag.height === 'number' && ((_e = (_d = action.userInputDataSchema.properties) === null || _d === void 0 ? void 0 : _d.height) === null || _e === void 0 ? void 0 : _e.type) === 'string') {
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
                // console.log('schema: ', action.userInputDataSchema)
                // console.log('data: ', data)
                // renderUI(this.pnlForm, action.userInputDataSchema, this.onSave.bind(this), data, options);
                components_17.renderUI(this.pnlForm, options, this.onSave.bind(this));
            }
        }
        onSave(result, data) {
            if (result) {
                const commandIns = this.currentAction.command(this, data);
                index_31.commandHistory.execute(commandIns);
                this.mdActions.visible = false;
            }
            else if (data === null || data === void 0 ? void 0 : data.errors) {
                // this.pnlFormMsg.visible = true;
                // this.renderError(data.errors || []);
            }
        }
        isTexbox() {
            var _a, _b;
            return ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.name) === index_28.ELEMENT_NAME.TEXTBOX;
        }
        isContentBlock() {
            var _a, _b;
            return ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.name) === index_28.ELEMENT_NAME.CONTENT_BLOCK;
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
            var _a;
            this._eResizer = this.renderResizer('left');
            this._wResizer = this.renderResizer('right');
            this._nResizer = this.renderResizer('bottom');
            this._neResizer = this.renderResizer('bottomLeft');
            this._nwResizer = this.renderResizer('bottomRight');
            const showFull = (_a = data === null || data === void 0 ? void 0 : data.module) === null || _a === void 0 ? void 0 : _a.disableClicked;
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
                const module = await index_30.getEmbedElement(((_a = data === null || data === void 0 ? void 0 : data.module) === null || _a === void 0 ? void 0 : _a.path) || '');
                if (!module)
                    throw new Error('not found');
                await this.setModule(module);
                if (this.isTexbox()) {
                    this.dragStack.visible = true;
                    this.contentStack.classList.remove('move');
                }
                else if (this.isContentBlock()) {
                    const allSingleContentBlockId = Object.keys(data.properties).filter(prop => prop.includes(SINGLE_CONTENT_BLOCK_ID));
                    for (let singleContentBlockId of allSingleContentBlockId) {
                        const singleContentBlock = this.parentElement.querySelector(`#${singleContentBlockId}`);
                        singleContentBlock.fetchModule(data.properties[singleContentBlockId]);
                    }
                    this.dragStack.visible = false;
                    this.contentStack.classList.add('move');
                }
                else {
                    this.dragStack.visible = false;
                    this.contentStack.classList.add('move');
                }
                this.renderResizeStack(data);
            }
            catch (error) {
                console.log('fetch module error: ', error);
                index_31.commandHistory.undo();
            }
        }
        async setModule(module) {
            var _a, _b, _c;
            this._component = module;
            this._component.parent = this.contentStack;
            const builderTarget = ((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators) ? this._component.getConfigurators().find((conf) => conf.target === 'Builders') : null;
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setElementId)
                builderTarget.setElementId(this.elementId);
            this.contentStack.append(this._component);
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setRootDir)
                builderTarget.setRootDir(index_29.getRootDir());
            if (this._component.ready)
                await this._component.ready();
            this._component.maxWidth = '100%';
            this._component.maxHeight = '100%';
            this._component.overflow = 'hidden';
            this._component.style.display = 'block';
            this.backdropStack.visible = (_c = (_b = this.data) === null || _b === void 0 ? void 0 : _b.module) === null || _c === void 0 ? void 0 : _c.shownBackdrop;
            this._component.addEventListener('click', (event) => {
                var _a, _b;
                if ((_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.disableClicked)
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
                    index_29.pageObject.setElement(this.rowId, this.data.id, { properties });
                }
                else {
                    if (isContentBlockProps) {
                        index_29.pageObject.setElement(this.rowId, this.data.id, { properties: Object.assign(Object.assign({}, this.data.properties), properties) });
                    }
                    else {
                        const element = this.data.properties[this._currentSingleContentBlockId];
                        if (element)
                            element.properties = properties;
                        index_29.pageObject.setElement(this.rowId, this.data.id, { properties: Object.assign(Object.assign({}, this.data.properties), { [this._currentSingleContentBlockId]: element }) });
                    }
                }
            }
            else {
                this.data && index_29.pageObject.setElement(this.rowId, this.data.id, { properties });
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
            index_29.pageObject.setElement(this.rowId, this.data.id, { tag });
        }
        async setProperties(data) {
            var _a;
            if (!this._component || !((_a = this._component) === null || _a === void 0 ? void 0 : _a.getConfigurators))
                return;
            const builderTarget = this._component.getConfigurators().find((conf) => conf.target === 'Builders');
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setData) {
                await builderTarget.setData(data);
                //FIXME: need to check if this is needed
                if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.getData) {
                    const data = await builderTarget.getData();
                    await this.setData(data);
                }
            }
            if (builderTarget === null || builderTarget === void 0 ? void 0 : builderTarget.setRootDir)
                builderTarget.setRootDir(index_29.getRootDir());
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
            components_17.application.EventBus.register(this, index_27.EVENT.ON_UPDATE_TOOLBAR, () => this.updateToolbar());
            components_17.application.EventBus.register(this, index_27.EVENT.ON_SET_ACTION_BLOCK, (data) => {
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
                this.$render("i-modal", { id: 'mdActions', title: 'Update Settings', closeIcon: { name: 'times' }, minWidth: 400, maxWidth: 500, closeOnBackdropClick: false, onOpen: this.onShowModal.bind(this), onClose: this.onCloseModal.bind(this), class: "setting-modal" },
                    this.$render("i-panel", null,
                        this.$render("i-vstack", { id: "pnlFormMsg", padding: { left: '1.5rem', right: '1.5rem', top: '1rem' }, gap: "0.5rem", visible: false }),
                        this.$render("i-panel", { id: "pnlForm", padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' } })))));
        }
    };
    IDEToolbar = __decorate([
        components_17.customElements('ide-toolbar')
    ], IDEToolbar);
    exports.IDEToolbar = IDEToolbar;
});
define("@scom/scom-page-builder/common/dragger.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/command/index.ts"], function (require, exports, components_18, index_33) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContainerDragger = void 0;
    class ContainerDragger {
        constructor(target, stack, dragger, dataList) {
            this.target = target;
            this.stack = stack;
            this.dataList = dataList || [];
            this.dragger = dragger || this.target.querySelector('#dragStack');
            this.mouseDownHandler = this.mouseDownHandler.bind(this);
            this.mouseUpHandler = this.mouseUpHandler.bind(this);
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
            this.initDragEvent();
        }
        initDragEvent() {
            if (!this.dragger)
                return;
            this.target.classList.add('dropzone');
            if (!this.target.readonly) {
                this.dragger.addEventListener('mousedown', this.mouseDownHandler, false);
                const rows = Array.from(this.stack.children);
                rows.forEach(row => {
                    row.classList.add("dropzone");
                });
            }
            else
                this.dragger.removeEventListener('mousedown', this.mouseDownHandler, false);
            this.dragger.ondragstart = function () { return false; };
            if (!this.pnlOverlay) {
                this.pnlOverlay = new components_18.Panel(undefined, {
                    position: 'fixed',
                    zIndex: -1,
                    visible: false,
                    opacity: 0.4,
                    background: { color: '#ddd' }
                });
                this.pnlOverlay.classList.add('drag-overlay');
            }
            this.stack.parent && this.stack.parent.appendChild(this.pnlOverlay);
        }
        mouseDownHandler(event) {
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
        mouseUpHandler(event) {
            document.removeEventListener('mousemove', this.mouseMoveHandler);
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.resetTarget();
            const target = event.target;
            const dropElm = target.closest('.dropzone');
            const rows = Array.from(document.querySelectorAll('.is-dragenter'));
            rows.forEach(row => {
                row.classList.remove("is-dragenter");
            });
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
                const moveRowCmd = new index_33.MoveElementCommand(this.target, dropElm, this.stack, this.dataList);
                index_33.commandHistory.execute(moveRowCmd);
            }
            this.isDragging = false;
        }
        resetTarget() {
            if (!this.target)
                return;
            this.target.style.transform = 'none';
            this.target.classList.remove('dragging');
            this.pnlOverlay.visible = false;
            this.pnlOverlay.zIndex = '-1';
            if (this.target.onMoveDown)
                this.target.onMoveDown();
        }
        updateTarget(x, y) {
            this.target.classList.add('dragging');
            const elementWidth = (Number(this.currentPosition.width) / 2);
            const newX = elementWidth < 0 ? x + elementWidth : x - elementWidth;
            const newY = y - (Number(this.currentPosition.height) / 2);
            this.target.style.transform = `scale(0.5) translate(${newX}px, ${newY}px)`;
            if (this.target.onMoveUp)
                this.target.onMoveUp();
        }
        mouseMoveHandler(event) {
            let x = event.clientX;
            let y = event.clientY;
            const target = event.target;
            const dropZone = target.closest('.dropzone');
            const rows = Array.from(document.querySelectorAll('.is-dragenter'));
            rows.forEach(row => {
                row.classList.remove("is-dragenter");
            });
            if (dropZone && !dropZone.isEqualNode(this.target))
                dropZone.classList.add('is-dragenter');
            this.pnlOverlay.visible = true;
            this.pnlOverlay.zIndex = '1';
            this.updateTarget(x - this.currentPosition.x, y - this.currentPosition.y);
        }
    }
    exports.ContainerDragger = ContainerDragger;
});
define("@scom/scom-page-builder/common/collapse.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_19, index_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.collapseStyle = void 0;
    const Theme = index_34.currentTheme;
    exports.collapseStyle = components_19.Styles.style({
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
define("@scom/scom-page-builder/common/collapse.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/common/collapse.css.ts"], function (require, exports, components_20, collapse_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapse = void 0;
    let Collapse = class Collapse extends components_20.Module {
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
            if (target && target instanceof components_20.Container) {
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
        render() {
            return (this.$render("i-vstack", { gap: "1rem" },
                this.$render("i-vstack", { width: "100%" },
                    this.$render("i-hstack", { class: "collapsible-toggle", verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.75rem', bottom: '0.75rem', left: '1rem', right: '1rem' }, gap: "0.5rem", onClick: this.onCollapse },
                        this.$render("i-panel", null,
                            this.$render("i-label", { id: "lblTitle", font: { bold: true } })),
                        this.$render("i-icon", { id: "iconCollapse", class: "collapsible-icon", width: 16, height: 16, name: "angle-down" })),
                    this.$render("i-panel", { id: "pnlContent", class: "collapsible-content" }))));
        }
    };
    Collapse = __decorate([
        components_20.customElements('i-scom-page-builder-collapse')
    ], Collapse);
    exports.Collapse = Collapse;
});
define("@scom/scom-page-builder/common/index.ts", ["require", "exports", "@scom/scom-page-builder/common/toolbar.tsx", "@scom/scom-page-builder/common/dragger.tsx", "@scom/scom-page-builder/common/collapse.tsx"], function (require, exports, toolbar_1, dragger_1, collapse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapse = exports.ContainerDragger = exports.IDEToolbar = void 0;
    Object.defineProperty(exports, "IDEToolbar", { enumerable: true, get: function () { return toolbar_1.IDEToolbar; } });
    Object.defineProperty(exports, "ContainerDragger", { enumerable: true, get: function () { return dragger_1.ContainerDragger; } });
    Object.defineProperty(exports, "Collapse", { enumerable: true, get: function () { return collapse_1.Collapse; } });
});
define("@scom/scom-page-builder/page/pageSection.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/dialogs/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/page/pageSection.css.ts"], function (require, exports, components_21, index_35, index_36, index_37, index_38) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RowSettingsDialog = exports.PageSection = void 0;
    Object.defineProperty(exports, "RowSettingsDialog", { enumerable: true, get: function () { return index_36.RowSettingsDialog; } });
    let PageSection = class PageSection extends components_21.Module {
        constructor(parent, options) {
            super(parent, options);
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
            return index_38.pageObject.getElement(this.rowId, this.id);
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
            if (!index_37.isEmpty(value.properties))
                toolbar.setProperties(value.properties);
            value.tag && toolbar.setTag(value.tag);
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
            if (value.type === index_35.ElementType.PRIMITIVE) {
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
        components_21.customElements('ide-section')
    ], PageSection);
    exports.PageSection = PageSection;
});
define("@scom/scom-page-builder/page/pageFooter.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_22, index_39) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_39.currentTheme;
    components_22.Styles.cssRule('scpage-page-footer', {
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
define("@scom/scom-page-builder/page/pageFooter.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageFooter.css.ts"], function (require, exports, components_23, assets_1, index_40) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageFooter = void 0;
    const Theme = index_40.currentTheme;
    let PageFooter = class PageFooter extends components_23.Module {
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
        components_23.customElements('scpage-page-footer')
    ], PageFooter);
    exports.PageFooter = PageFooter;
});
define("@scom/scom-page-builder/page/pageRow.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_24, index_41) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_41.currentTheme;
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
        border: '2px solid transparent',
        $nest: {
            '&.dragenter': {
                border: '2px solid #1976D2'
            },
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
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageRow.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/page/pageRow.css.ts"], function (require, exports, components_25, index_42, index_43, index_44, index_45) {
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
            this.isCloned = true;
            this.isChanged = true;
            this.setData = this.setData.bind(this);
        }
        get data() {
            return this.rowId ? index_43.pageObject.getRow(this.rowId) : this.rowData;
        }
        init() {
            var _a, _b;
            this._readonly = this.getAttribute('readonly', true, false);
            super.init();
            this.renderFixedGrid();
            this.initEventListeners();
            const hasData = (_b = (_a = this.data) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.length;
            this.toggleUI(hasData);
            components_25.application.EventBus.register(this, index_42.EVENT.ON_SET_DRAG_ELEMENT, async (el) => this.currentElement = el);
        }
        toggleUI(value) {
            if (this.pnlWrap)
                this.pnlWrap.opacity = value ? 1 : 0;
            if (this.pnlEmty)
                this.pnlEmty.visible = !value;
        }
        async createNewElement(i) {
            const sectionData = this.data.elements[i];
            return this.createElementFn(sectionData);
        }
        async createElementFn(data) {
            const pageSection = (this.$render("ide-section", { readonly: this._readonly, display: "block", maxWidth: "100%", maxHeight: "100%", position: "relative" }));
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
        }
        onOpenRowSettingsDialog() {
            this.mdRowSetting.show();
        }
        onSaveRowSettings(color) {
            const updateCmd = new index_44.UpdateColorCommand(this, color);
            index_44.commandHistory.execute(updateCmd);
        }
        async onClone() {
            const rowData = index_43.pageObject.getRow(this.rowId);
            if (!rowData)
                return;
            components_25.application.EventBus.dispatch(index_42.EVENT.ON_CLONE, { rowData, id: this.id });
        }
        onDeleteRow() {
            const rowCmd = new index_44.UpdateRowCommand(this, this.parent, this.data, true);
            index_44.commandHistory.execute(rowCmd);
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
            for (let i = 0; i < 12; i++) {
                const elm = this.$render("i-panel", { class: "fixed-grid-item" });
                elm.setAttribute('data-column', `${i + 1}`);
                elm.style.gridColumn = `${i + 1}`;
                grid.append(elm);
            }
            this.pnlRow.appendChild(grid);
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
            let grids = document.getElementsByClassName('grid');
            const gapWidth = 15;
            const gridColumnWidth = (this.pnlRow.offsetWidth - gapWidth * 11) / 12;
            for (const grid of grids) {
                const gridElm = grid;
                gridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
                gridElm.gap = { column: `${gapWidth}px` };
            }
            let fixedGrids = document.getElementsByClassName('fixed-grid');
            for (const fixedGrid of fixedGrids) {
                const fixedGridElm = fixedGrid;
                fixedGridElm.templateColumns = [`repeat(12, ${gridColumnWidth}px)`];
                fixedGridElm.gap = { column: `${gapWidth}px` };
            }
            this.addEventListener('mousedown', (e) => {
                const target = e.target;
                const parent = target.closest('.resize-stack');
                if (!parent)
                    return;
                e.preventDefault();
                const resizableElm = target.closest('ide-section');
                self.currentElement = resizableElm;
                toolbar = self.currentElement.querySelector('ide-toolbar');
                self.addDottedLines();
                this.isResizing = true;
                currentDot = parent;
                startX = e.clientX;
                startY = e.clientY;
                this.currentWidth = toolbar.offsetWidth;
                this.currentHeight = toolbar.offsetHeight;
            });
            document.addEventListener('mouseup', (e) => {
                e.preventDefault();
                if (!toolbar)
                    return;
                this.isResizing = false;
                self.removeDottedLines();
                toolbar.width = 'initial';
                toolbar.height = 'initial';
                const contentStack = toolbar.querySelector('#contentStack');
                if (contentStack) {
                    contentStack.height = 'initial';
                    contentStack.width = 'initial';
                }
                self.currentElement.width = 'initial';
                self.currentElement.height = 'initial';
                const resizeCmd = new index_44.ResizeElementCommand(self.currentElement, this.currentWidth, this.currentHeight, newWidth, newHeight);
                index_44.commandHistory.execute(resizeCmd);
                self.currentElement.style.left = 'initial';
                self.currentElement = null;
                toolbar = null;
            });
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
            function updateClass(el, value) {
            }
            document.addEventListener('mousemove', (e) => {
                if (!this.isResizing || !toolbar)
                    return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                if (currentDot.classList.contains('topLeft')) {
                    newWidth = this.currentWidth - deltaX;
                    newHeight = this.currentHeight - deltaY;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('topRight')) {
                    newWidth = this.currentWidth + deltaX;
                    newHeight = this.currentHeight - deltaY;
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('bottomLeft')) {
                    newWidth = this.currentWidth - deltaX;
                    newHeight = this.currentHeight + deltaY;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('bottomRight')) {
                    newWidth = this.currentWidth + deltaX;
                    newHeight = this.currentHeight + deltaY;
                    updateDimension(newWidth, newHeight);
                }
                else if (currentDot.classList.contains('top')) {
                    newHeight = this.currentHeight - deltaY;
                    updateDimension(undefined, newHeight);
                }
                else if (currentDot.classList.contains('bottom')) {
                    newHeight = this.currentHeight + deltaY;
                    updateDimension(undefined, newHeight);
                }
                else if (currentDot.classList.contains('left')) {
                    newWidth = this.currentWidth - deltaX;
                    self.currentElement.style.left = deltaX + 'px';
                    updateDimension(newWidth, undefined);
                }
                else if (currentDot.classList.contains('right')) {
                    newWidth = this.currentWidth + deltaX;
                    updateDimension(newWidth, undefined);
                }
            });
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
                    self.currentElement = target;
                    self.currentElement.opacity = 0;
                    components_25.application.EventBus.dispatch(index_42.EVENT.ON_SET_DRAG_ELEMENT, target);
                    self.addDottedLines();
                }
                else {
                    event.preventDefault();
                }
            });
            this.addEventListener('drag', function (event) { });
            document.addEventListener('dragend', function (event) {
                if (self.currentElement)
                    self.currentElement.opacity = 1;
                self.currentElement = null;
                self.isDragging = false;
                index_43.setDragData(null);
                self.removeDottedLines();
                let rectangles = document.getElementsByClassName('rectangle');
                for (const rectangle of rectangles) {
                    rectangle.style.display = 'none';
                }
                let backBlocks = document.getElementsByClassName('is-dragenter');
                for (const block of backBlocks) {
                    block.visible = false;
                    block.classList.remove('is-dragenter');
                }
            });
            this.addEventListener('dragenter', function (event) {
                var _a, _b, _c;
                const eventTarget = event.target;
                if (!eventTarget || !self.currentElement)
                    return;
                const target = eventTarget.closest('.fixed-grid-item');
                if (target) {
                    const column = Number(target.dataset.column);
                    const columnSpan = self.currentElement.dataset.columnSpan ? Number(self.currentElement.dataset.columnSpan) : index_44.MIN_COLUMN;
                    const colSpan = Math.min(columnSpan, 12);
                    const colStart = Math.min(column, 12 - colSpan + 1);
                    const grid = target.closest('.grid');
                    const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
                    const sortedSections = sections.sort((a, b) => Number(a.dataset.column) - Number(b.dataset.column));
                    const findedSection = sortedSections.find((section) => {
                        const sectionColumn = Number(section.dataset.column);
                        const sectionColumnSpan = Number(section.dataset.columnSpan);
                        const colData = colStart + colSpan;
                        return colStart >= sectionColumn && colData <= sectionColumn + sectionColumnSpan;
                    });
                    if (findedSection)
                        return;
                    const rectangle = target
                        .closest('.fixed-grid')
                        .parentNode.querySelector(`.rectangle`);
                    rectangle.style.display = 'block';
                    rectangle.style.left = (gridColumnWidth + gapWidth) * (colStart - 1) + 'px';
                    rectangle.style.width =
                        gridColumnWidth * columnSpan + gapWidth * (columnSpan - 1) + 'px';
                }
                else {
                    const section = eventTarget.closest('ide-section');
                    if (section && !section.isSameNode(self.currentElement)) {
                        const toolbar = eventTarget.closest('ide-toolbar');
                        if (toolbar) {
                            const { y, height } = toolbar.getBoundingClientRect();
                            const bottomBlock = toolbar.querySelector('.bottom-block');
                            if (bottomBlock) {
                                bottomBlock.visible = Math.ceil(event.clientY) >= Math.ceil(y + height) - 2;
                                if (bottomBlock.visible) {
                                    bottomBlock.classList.add('is-dragenter');
                                }
                                else {
                                    bottomBlock.classList.remove('is-dragenter');
                                }
                            }
                        }
                        const curElmCol = Number((_a = section === null || section === void 0 ? void 0 : section.dataset) === null || _a === void 0 ? void 0 : _a.column);
                        const curElmColSpan = Number((_b = section === null || section === void 0 ? void 0 : section.dataset) === null || _b === void 0 ? void 0 : _b.columnSpan);
                        const sections = Array.from((_c = section.closest('#pnlRow')) === null || _c === void 0 ? void 0 : _c.querySelectorAll('ide-section'));
                        const nextElm = sections.find((el) => {
                            const column = Number(el.dataset.column);
                            return !isNaN(column) && (curElmCol + curElmColSpan === column);
                        });
                        const showHiddenBlock = curElmCol === 1 && (curElmCol + curElmColSpan === index_44.MAX_COLUMN + 1) ||
                            (nextElm) ||
                            (curElmCol + curElmColSpan === index_44.MAX_COLUMN + 1);
                        if (showHiddenBlock) {
                            const { left, right } = section.getBoundingClientRect();
                            const backBlock = section.querySelector('.back-block');
                            const frontBlock = section.querySelector('.front-block');
                            if (backBlock) {
                                backBlock.visible = Math.abs(event.clientX - right) <= 15;
                                if (backBlock.visible) {
                                    backBlock.classList.add('is-dragenter');
                                }
                                else {
                                    backBlock.classList.remove('is-dragenter');
                                }
                            }
                            if (frontBlock) {
                                frontBlock.visible = Math.abs(event.clientX - left) <= 15 && curElmCol === 1;
                                if (frontBlock.visible) {
                                    frontBlock.classList.add('is-dragenter');
                                }
                                else {
                                    frontBlock.classList.remove('is-dragenter');
                                }
                            }
                        }
                    }
                }
            });
            document.addEventListener('dragover', function (event) {
                event.preventDefault();
            });
            document.addEventListener('dragleave', function (event) {
                const eventTarget = event.target;
                const target = eventTarget.closest('.fixed-grid-item');
                if (target) {
                    target.style.border = '';
                    let rectangles = document.getElementsByClassName('rectangle');
                    for (const rectangle of rectangles) {
                        rectangle.style.display = 'none';
                    }
                }
                else {
                    const backBlock = eventTarget.closest('.back-block');
                    if (backBlock) {
                        backBlock.visible = false;
                        backBlock.classList.remove('is-dragenter');
                    }
                    const bottomBlock = eventTarget.closest('.bottom-block');
                    if (bottomBlock) {
                        bottomBlock.visible = false;
                        bottomBlock.classList.remove('is-dragenter');
                    }
                }
            });
            this.addEventListener('drop', async function (event) {
                var _a;
                event.preventDefault();
                event.stopPropagation();
                if (!self.currentElement)
                    return;
                const eventTarget = event.target;
                const pageRow = eventTarget.closest('ide-row');
                const nearestFixedItem = eventTarget.closest('.fixed-grid-item');
                const elementConfig = index_43.getDragData();
                if (nearestFixedItem) {
                    const column = Number(nearestFixedItem.dataset.column);
                    const columnSpan = self.currentElement.dataset.columnSpan ?
                        Number(self.currentElement.dataset.columnSpan) : index_44.MIN_COLUMN;
                    const colSpan = Math.min(columnSpan, 12);
                    const colStart = Math.min(column, 12 - colSpan + 1);
                    const grid = nearestFixedItem.closest('.grid');
                    const sections = Array.from(grid === null || grid === void 0 ? void 0 : grid.querySelectorAll('ide-section'));
                    let prependId = '';
                    const sortedSections = sections.sort((a, b) => Number(a.dataset.column) - Number(b.dataset.column));
                    const findedSection = sortedSections.find((section) => {
                        const sectionColumn = Number(section.dataset.column);
                        const sectionColumnSpan = Number(section.dataset.columnSpan);
                        const colData = colStart + colSpan;
                        const sectionData = sectionColumn + sectionColumnSpan;
                        if (sectionColumn < colStart && colData > sectionData) {
                            prependId = section.id;
                        }
                        return colStart >= sectionColumn && colData <= sectionData;
                    });
                    if (findedSection || self.isDragging)
                        return;
                    self.isDragging = true;
                    if (self.currentElement.data) {
                        const dragCmd = new index_44.DragElementCommand(self.currentElement, nearestFixedItem);
                        index_44.commandHistory.execute(dragCmd);
                    }
                    else if (index_43.getDragData()) {
                        const dragCmd = new index_44.AddElementCommand(self.getNewElementData(), true, nearestFixedItem);
                        index_44.commandHistory.execute(dragCmd);
                    }
                    self.isDragging = false;
                }
                else {
                    const isPageRow = eventTarget.classList.contains('page-row');
                    const dropElm = (isPageRow
                        ? eventTarget.querySelector('.is-dragenter')
                        : eventTarget.closest('.is-dragenter'));
                    if (self.isDragging)
                        return;
                    if (dropElm) {
                        self.isDragging = true;
                        dropElm.classList.remove('is-dragenter');
                        const isBottomBlock = dropElm.classList.contains('bottom-block');
                        if (isBottomBlock) {
                            const dragCmd = new index_44.UpdateTypeCommand(dropElm, index_43.getDragData() ? null : self.currentElement, index_43.getDragData());
                            index_44.commandHistory.execute(dragCmd);
                        }
                        else {
                            if (index_43.getDragData()) {
                                // const sectionId = eventTarget.closest('ide-section')?.id || '';
                                const isAppend = dropElm.classList.contains('back-block');
                                const dragCmd = new index_44.AddElementCommand(self.getNewElementData(), isAppend, dropElm, null);
                                index_44.commandHistory.execute(dragCmd);
                            }
                            else {
                                const dragCmd = new index_44.DragElementCommand(self.currentElement, dropElm);
                                index_44.commandHistory.execute(dragCmd);
                            }
                        }
                        self.isDragging = false;
                    }
                    else if (pageRow && elementConfig && !self.isDragging) {
                        const parentId = pageRow === null || pageRow === void 0 ? void 0 : pageRow.id.replace('row-', '');
                        const elements = parentId ? ((_a = index_43.pageObject.getRow(parentId)) === null || _a === void 0 ? void 0 : _a.elements) || [] : [];
                        if (elements.length)
                            return;
                        self.isDragging = true;
                        const dragCmd = new index_44.AddElementCommand(self.getNewElementData(), true, null, pageRow);
                        await index_44.commandHistory.execute(dragCmd);
                        self.isDragging = false;
                    }
                }
            });
        }
        getNewElementData() {
            const elementConfig = Object.assign({}, (index_43.getDragData() || {}));
            const id = index_45.generateUUID();
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
        render() {
            return (this.$render("i-panel", { id: "pnlRowWrap", class: 'page-row', width: "100%", height: "100%", padding: { left: '3rem', right: '3rem' } },
                this.$render("i-vstack", { id: 'actionsBar', class: "row-actions-bar", verticalAlignment: "center" },
                    this.$render("i-vstack", { background: { color: '#fff' }, border: { radius: '20px' }, maxWidth: "100%", maxHeight: "100%", horizontalAlignment: "center", padding: { top: 5, bottom: 5 } },
                        this.$render("i-panel", { id: "btnSetting", class: "actions", tooltip: { content: 'Section colors', placement: 'right' }, visible: this.isChanged, onClick: this.onOpenRowSettingsDialog },
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
                this.$render("i-vstack", { id: "pnlEmty", width: "100%", visible: false, verticalAlignment: 'center', horizontalAlignment: 'center' },
                    this.$render("i-panel", { padding: { top: '3rem', bottom: '3rem' }, margin: { top: '3rem', bottom: '3rem' }, width: "100%", border: { width: '1px', style: 'dashed', color: Theme.divider }, class: "text-center" },
                        this.$render("i-label", { caption: 'Drag Elements Here', font: { transform: 'uppercase', color: Theme.divider, size: '1.25rem' } }))),
                this.$render("i-panel", { id: "pnlWrap", opacity: 0 },
                    this.$render("i-grid-layout", { id: "pnlRow", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", position: "relative", class: "grid" })),
                this.$render("ide-row-settings-dialog", { id: "mdRowSetting", onSave: this.onSaveRowSettings.bind(this) })));
        }
    };
    __decorate([
        components_25.observable()
    ], PageRow.prototype, "isCloned", void 0);
    __decorate([
        components_25.observable()
    ], PageRow.prototype, "isChanged", void 0);
    PageRow = PageRow_1 = __decorate([
        components_25.customElements('ide-row')
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
                // boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)',
                transition: 'all .5s ease-in'
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageRows.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/page/pageSection.tsx", "@scom/scom-page-builder/page/pageRow.tsx", "@scom/scom-page-builder/page/pageFooter.tsx", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/command/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/page/pageRows.css.ts"], function (require, exports, components_27, pageSection_1, pageRow_1, pageFooter_1, index_46, index_47, index_48, index_49, index_50) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageFooter = exports.PageSection = exports.PageRows = void 0;
    Object.defineProperty(exports, "PageSection", { enumerable: true, get: function () { return pageSection_1.PageSection; } });
    Object.defineProperty(exports, "PageFooter", { enumerable: true, get: function () { return pageFooter_1.PageFooter; } });
    const Theme = index_50.currentTheme;
    let PageRows = class PageRows extends components_27.Module {
        constructor(parent) {
            super(parent);
            this.isDragging = false;
            this.mouseDownHandler = this.mouseDownHandler.bind(this);
            this.mouseUpHandler = this.mouseUpHandler.bind(this);
            this.onMoveHandler = this.onMoveHandler.bind(this);
            this.initEventBus();
            this.getRows = this.getRows.bind(this);
            this.setRows = this.setRows.bind(this);
        }
        initEventBus() {
            components_27.application.EventBus.register(this, index_46.EVENT.ON_CLONE, this.onClone);
            components_27.application.EventBus.register(this, index_46.EVENT.ON_ADD_SECTION, this.onCreateSection);
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
                this.currentPosition = data;
                this.pnlRowOverlay.width = this.currentPosition.width;
                this.pnlRowOverlay.height = this.currentPosition.height;
                this.pnlRowOverlay.zIndex = '1';
                this.pnlRowOverlay.left = this.currentPosition.left;
                this.pnlRowOverlay.top = this.currentPosition.top;
                document.addEventListener('mousemove', this.onMoveHandler);
                document.addEventListener('mouseup', this.mouseUpHandler);
                this.click();
            }
        }
        mouseUpHandler(event) {
            document.removeEventListener('mousemove', this.onMoveHandler);
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.resetCurrentRow();
            const target = event.target;
            const dropElm = target instanceof pageRow_1.PageRow ? target : target.closest('ide-row');
            if (!dropElm || !dropElm.classList.contains('dropzone')) {
                event.preventDefault();
                this.pnlRowOverlay.visible = false;
                this.pnlRowOverlay.zIndex = '-1';
                return;
            }
            dropElm.classList.remove("dragenter");
            if (!this.currentRow) {
                event.preventDefault();
                this.pnlRowOverlay.visible = false;
                this.pnlRowOverlay.zIndex = '-1';
                return;
            }
            if (dropElm && !this.currentRow.isSameNode(dropElm)) {
                const moveRowCmd = new index_48.MoveElementCommand(this.currentRow, dropElm, this.pnlRows, index_49.pageObject.sections);
                index_48.commandHistory.execute(moveRowCmd);
            }
            this.currentRow = null;
            this.currentPosition = null;
            this.isDragging = false;
        }
        resetCurrentRow() {
            if (!this.currentRow)
                return;
            this.currentRow.style.transform = 'none';
            this.currentRow.classList.remove('dragging');
            this.pnlRowOverlay.visible = false;
            this.pnlRowOverlay.zIndex = '-1';
            this.currentRow.onMoveDown();
        }
        updateCurrentRow(x, y) {
            this.currentRow.classList.add('dragging');
            this.currentRow.style.transform = `translate(${x}px, ${y}px)`;
            this.currentRow.style.width = this.currentPosition.width;
            this.currentRow.style.height = this.currentPosition.height;
            this.currentRow.onMoveUp();
        }
        onMoveHandler(event) {
            let x = event.clientX;
            let y = event.clientY;
            const target = event.target;
            const dropZone = target instanceof pageRow_1.PageRow ? target : target.closest('ide-row');
            const rows = this.pnlRows.querySelectorAll('ide-row');
            rows.forEach(row => {
                row.classList.remove("dragenter");
            });
            if (dropZone && !dropZone.isEqualNode(this.currentRow) && dropZone.classList.contains('dropzone'))
                dropZone.classList.add('dragenter');
            this.pnlRowOverlay.visible = true;
            this.pnlRowOverlay.zIndex = '1';
            this.updateCurrentRow(x - this.currentPosition.x, y - this.currentPosition.y);
        }
        getRows() {
            // const rows = this.pnlRows.querySelectorAll('ide-row');
            // const rowDataList: IPageSection[] = [];
            // for (const row of rows) {
            //     const rowData = await (row as PageRow).getData();
            //     rowDataList.push(rowData);
            // }
            // return rowDataList;
            return index_49.pageObject.sections;
        }
        async setRows(rows) {
            index_49.pageObject.sections = rows;
            await this.renderRows();
        }
        async renderRows() {
            var _a;
            this.clearRows();
            for (let i = 0; i < index_49.pageObject.sections.length; i++) {
                const rowData = index_49.pageObject.sections[i];
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
            const addRowCmd = new index_48.UpdateRowCommand(pageRow, this.pnlRows, rowData, false, prependId);
            index_48.commandHistory.execute(addRowCmd);
            await pageRow.setData(rowData);
            return pageRow;
        }
        async onClone(data) {
            const { rowData, id } = data;
            const row = this.pnlRows.querySelector(`#${id}`);
            if (!row)
                return;
            const clonedData = JSON.parse(JSON.stringify(rowData));
            const newId = index_47.generateUUID();
            const newElements = clonedData.elements.map((el) => {
                el.id = index_47.generateUUID();
                return el;
            });
            const newRow = await this.appendRow(Object.assign(Object.assign({}, clonedData), { elements: newElements, id: newId }));
            this.pnlRows.insertBefore(newRow, row);
        }
        async onCreateSection() {
            const pageRow = (this.$render("ide-row", { maxWidth: "100%", maxHeight: "100%" }));
            if (!this._readonly) {
                pageRow.border = { top: { width: '1px', style: 'dashed', color: Theme.divider } };
                this.initDragEvent(pageRow);
            }
            const rowData = {
                id: index_47.generateUUID(),
                row: this.getRows().length,
                elements: []
            };
            const addRowCmd = new index_48.UpdateRowCommand(pageRow, this.pnlRows, rowData, false);
            index_48.commandHistory.execute(addRowCmd);
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
        components_27.customElements('ide-rows')
    ], PageRows);
    exports.PageRows = PageRows;
});
define("@scom/scom-page-builder/page/pageSidebar.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_28, index_51) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_51.currentTheme;
    components_28.Styles.cssRule('ide-sidebar', {
        borderRight: `1px solid ${Theme.divider}`,
        $nest: {
            '.block-image': {
                maxHeight: 74,
                boxShadow: '0 0 0 1px rgb(218 220 224)',
                overflow: 'hidden'
            },
            '.pointer': {
                cursor: 'grab'
            },
            '.pointer:hover': {
                background: Theme.action.hover
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
            }
        }
    });
});
define("@scom/scom-page-builder/page/pageSidebar.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/page/pageSidebar.css.ts"], function (require, exports, components_29, index_52, index_53, index_54, assets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageSidebar = void 0;
    const Theme = components_29.Styles.Theme.ThemeVars;
    let PageSidebar = class PageSidebar extends components_29.Module {
        constructor(parent) {
            super(parent);
        }
        init() {
            super.init();
            this.renderUI();
            this.initEventListeners();
        }
        async renderUI() {
            this.pageBlocks = await this.getPageBlocks();
            index_52.setPageBlocks(this.pageBlocks);
            this.renderComponentList();
            this.renderMircoDAppList();
            this.renderChartList();
            this.sectionStack.setAttribute('draggable', 'true');
        }
        async getPageBlocks() {
            let rootDir = index_52.getRootDir();
            let path = rootDir ? rootDir + "/scconfig.json" : "scconfig.json";
            let content = await components_29.application.getContent(path);
            let pageBlocks = [];
            try {
                let scconfig = JSON.parse(content);
                let components = (scconfig === null || scconfig === void 0 ? void 0 : scconfig.components) || {};
                for (let key in components) {
                    pageBlocks.push(components[key]);
                }
            }
            catch (err) { }
            return pageBlocks;
        }
        // private onAddComponent(module: IPageBlockData, type: ElementType) {
        //     application.EventBus.dispatch(EVENT.ON_ADD_ELEMENT, { type, module });
        // }
        async renderComponentList() {
            this.componentsStack.clearInnerHTML();
            let components = this.pageBlocks.filter(p => p.category === 'components');
            let matchedModules = components;
            for (const module of matchedModules) {
                const moduleCard = (this.$render("i-vstack", { class: "text-center pointer builder-item", verticalAlignment: "center", horizontalAlignment: "center", minWidth: 88, height: "5rem", gap: "0.5rem" },
                    this.$render("i-image", { url: module.imgUrl || assets_2.default.icons.logo, width: 24, height: 24, display: "block" }),
                    this.$render("i-label", { caption: module.name })));
                this.componentsStack.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
        async renderMircoDAppList() {
            this.microDAppsStack.clearInnerHTML();
            let components = this.pageBlocks.filter(p => p.category === 'micro-dapps');
            let matchedModules = components;
            for (const module of matchedModules) {
                const moduleCard = (this.$render("i-hstack", { height: 48, verticalAlignment: "center", gap: "1rem", padding: { left: '1rem', right: '1rem' }, class: "pointer builder-item" },
                    this.$render("i-image", { url: module.imgUrl || assets_2.default.icons.logo, width: 24, height: 24, display: "block" }),
                    this.$render("i-label", { caption: module.name, font: { weight: 600 } })));
                this.microDAppsStack.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
        async renderChartList() {
            this.chartsStack.clearInnerHTML();
            let components = this.pageBlocks.filter(p => p.category === 'charts');
            let matchedModules = components;
            for (const module of matchedModules) {
                const moduleCard = (this.$render("i-hstack", { height: 48, verticalAlignment: "center", gap: "1rem", padding: { left: '1rem', right: '1rem' }, class: "pointer builder-item" },
                    this.$render("i-panel", null,
                        this.$render("i-image", { url: module.imgUrl || assets_2.default.icons.logo, width: 24, height: 24, display: "block" })),
                    this.$render("i-label", { caption: module.name, font: { weight: 600 } })));
                this.chartsStack.append(moduleCard);
                this.initDrag(moduleCard, module);
            }
        }
        initDrag(module, data) {
            module.setAttribute('draggable', 'true');
            module.setAttribute('data-type', index_54.ElementType.PRIMITIVE);
            module.setAttribute('data-name', data.name);
        }
        initEventListeners() {
            const self = this;
            this.addEventListener('dragstart', function (event) {
                event.stopPropagation();
                const eventTarget = event.target;
                if (eventTarget.nodeName === 'IMG' || !eventTarget.closest('.builder-item'))
                    event.preventDefault();
                if (eventTarget.id === 'sectionStack')
                    components_29.application.EventBus.dispatch(index_53.EVENT.ON_ADD_SECTION);
                else {
                    const currentName = eventTarget.dataset.name;
                    const type = eventTarget.dataset.type;
                    const module = self.pageBlocks.find(block => block.name === currentName);
                    if (module && type) {
                        components_29.application.EventBus.dispatch(index_53.EVENT.ON_SET_DRAG_ELEMENT, eventTarget);
                        index_52.setDragData({ module, type });
                    }
                }
            });
        }
        render() {
            return (this.$render("i-panel", { class: "navigator", height: '100%', maxWidth: "100%" },
                this.$render("i-vstack", { padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' } },
                    this.$render("i-vstack", { id: "sectionStack", class: "text-center pointer builder-item", verticalAlignment: "center", horizontalAlignment: "center", height: "5rem", width: "100%", gap: "0.5rem" },
                        this.$render("i-image", { url: assets_2.default.icons.logo, width: 24, height: 24, display: "block" }),
                        this.$render("i-label", { caption: "Section" }))),
                this.$render("i-scom-page-builder-collapse", { title: "Components", border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, expanded: true },
                    this.$render("i-grid-layout", { id: "componentsStack", templateColumns: ['repeat(2, 1fr)'], margin: { top: 6 } })),
                this.$render("i-scom-page-builder-collapse", { title: "Micro DApps", border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, expanded: true },
                    this.$render("i-vstack", { id: "microDAppsStack", padding: { top: '8px', bottom: '8px' } })),
                this.$render("i-scom-page-builder-collapse", { title: "Charts", border: { bottom: { width: 1, style: 'solid', color: Theme.divider } }, expanded: true },
                    this.$render("i-vstack", { id: "chartsStack", padding: { top: '8px', bottom: '8px' } }))));
        }
    };
    PageSidebar = __decorate([
        components_29.customElements('ide-sidebar')
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
define("@scom/scom-page-builder/builder/builderHeader.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_30, index_55) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_55.currentTheme;
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
define("@scom/scom-page-builder/builder/builderHeader.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/assets.ts", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/builder/builderHeader.css.ts"], function (require, exports, components_31, assets_3, index_56, index_57, index_58, index_59, index_60) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderHeader = void 0;
    const Theme = index_60.currentTheme;
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
            components_31.application.EventBus.register(this, index_56.EVENT.ON_UPDATE_SECTIONS, async () => {
                this.updateHeader();
            });
        }
        async setData(value) {
            index_58.pageObject.header = value;
            await this.updateHeader();
        }
        get _elements() {
            return index_58.pageObject.header.elements || [];
        }
        get _image() {
            return index_58.pageObject.header.image || '';
        }
        get _headerType() {
            return index_58.pageObject.header.headerType || '';
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
            const pageBlocks = index_58.getPageBlocks();
            const textBlock = pageBlocks.find((v) => v.name === index_57.ELEMENT_NAME.TEXTBOX);
            this.setData({
                image: '',
                headerType: index_57.HeaderType.NORMAL,
                elements: [{
                        id: index_59.generateUUID(),
                        column: 4,
                        columnSpan: 5,
                        type: index_57.ElementType.PRIMITIVE,
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
                index_58.pageObject.header = Object.assign(Object.assign({}, index_58.pageObject.header), { image });
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
            const header = index_58.pageObject.header;
            this.setData(Object.assign(Object.assign({}, header), { headerType: type.type }));
            this.updateHeaderType();
        }
        updateHeaderType() {
            if (!this._headerType || this.showAddStack) {
                this.height = 'auto';
                return;
            }
            switch (this._headerType) {
                case index_57.HeaderType.COVER:
                    this.height = '100vh';
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_57.HeaderType.LARGE:
                    this.height = 520;
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_57.HeaderType.NORMAL:
                    this.height = 340;
                    this.pnlHeader.background = this.showAddStack ? { color: '#fff', image: '' } : { image: this._image };
                    this.btnChangeImg.visible = true;
                    break;
                case index_57.HeaderType.TITLE:
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
                    type: index_57.HeaderType.COVER,
                    image: assets_3.default.fullPath('img/components/cover.svg')
                },
                {
                    caption: 'Large Banner',
                    type: index_57.HeaderType.LARGE,
                    image: assets_3.default.fullPath('img/components/large.svg')
                },
                {
                    caption: 'Banner',
                    type: index_57.HeaderType.NORMAL,
                    image: assets_3.default.fullPath('img/components/banner.svg')
                },
                {
                    caption: 'Title Only',
                    type: index_57.HeaderType.TITLE,
                    image: assets_3.default.fullPath('img/components/title.svg')
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
        components_31.observable()
    ], BuilderHeader.prototype, "showAddStack", void 0);
    BuilderHeader = __decorate([
        components_31.customElements('builder-header')
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
define("@scom/scom-page-builder/builder/builderFooter.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/interface/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/builder/builderFooter.css.ts"], function (require, exports, components_33, index_61, index_62, index_63, index_64, index_65) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BuilderFooter = void 0;
    const Theme = index_65.currentTheme;
    let BuilderFooter = class BuilderFooter extends components_33.Module {
        constructor(parent) {
            super(parent);
            this._readonly = false;
            this.showAddStack = true;
            this.initEventBus();
            this.setData = this.setData.bind(this);
        }
        initEventBus() {
            components_33.application.EventBus.register(this, index_61.EVENT.ON_UPDATE_SECTIONS, async () => {
                // if (!pageObject.footer?.elements?.length)
                this.updateFooter();
            });
        }
        async setData(value) {
            index_64.pageObject.footer = value;
            await this.updateFooter();
        }
        get _elements() {
            var _a;
            return ((_a = index_64.pageObject.footer) === null || _a === void 0 ? void 0 : _a.elements) || [];
        }
        get _image() {
            var _a;
            return ((_a = index_64.pageObject.footer) === null || _a === void 0 ? void 0 : _a.image) || '';
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
            components_33.application.EventBus.dispatch(index_61.EVENT.ON_UPDATE_FOOTER);
        }
        addFooter() {
            const pageBlocks = index_64.getPageBlocks();
            const textBlock = pageBlocks.find((v) => v.name === index_62.ELEMENT_NAME.TEXTBOX);
            this.setData({
                image: '',
                elements: [{
                        id: index_63.generateUUID(),
                        column: 1,
                        columnSpan: 12,
                        type: index_62.ElementType.PRIMITIVE,
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
            index_64.pageObject.footer = Object.assign(Object.assign({}, index_64.pageObject.footer), { image });
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
        components_33.observable()
    ], BuilderFooter.prototype, "showAddStack", void 0);
    BuilderFooter = __decorate([
        components_33.customElements('builder-footer')
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
define("@scom/scom-page-builder/index.css.ts", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/theme/index.ts"], function (require, exports, components_34, index_66) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_66.currentTheme;
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
                background: Theme.divider
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
            }
        }
    });
});
define("@scom/scom-page-builder", ["require", "exports", "@ijstech/components", "@scom/scom-page-builder/const/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/theme/index.ts", "@scom/scom-page-builder/utility/index.ts", "@scom/scom-page-builder/store/index.ts", "@scom/scom-page-builder/index.css.ts"], function (require, exports, components_35, index_67, index_68, index_69, index_70, index_71) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = index_69.currentTheme;
    let Editor = class Editor extends components_35.Module {
        constructor(parent, options) {
            super(parent, options);
            this.events = [];
            this.getData = this.getData.bind(this);
            this.setData = this.setData.bind(this);
            this.initEventBus();
        }
        init() {
            const rootDir = this.getAttribute('rootDir', true);
            if (rootDir)
                this.setRootDir(rootDir);
            super.init();
            const self = this;
            document.addEventListener('dragenter', function (event) {
                event.preventDefault();
                const { top, height } = self.pnlWrap.getBoundingClientRect();
                if (event.clientY < top) {
                    self.pageContent.scrollBy(0, -10);
                }
                if (event.clientY > height) {
                    self.pageContent.scrollBy(0, 10);
                }
            });
        }
        setRootDir(value) {
            index_71.setRootDir(value);
        }
        getData() {
            return {
                // header: pageObject.header,
                sections: index_68.pageObject.sections,
                footer: index_68.pageObject.footer
            };
        }
        async setData(value) {
            // pageObject.header = value.header;
            index_68.pageObject.sections = (value === null || value === void 0 ? void 0 : value.sections) || [];
            index_68.pageObject.footer = value === null || value === void 0 ? void 0 : value.footer;
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
        ;
        initEventBus() {
            this.events.push(components_35.application.EventBus.register(this, index_67.EVENT.ON_ADD_ELEMENT, (data) => {
                if (!data)
                    return;
                this.onAddRow(data);
            }));
            this.events.push(components_35.application.EventBus.register(this, index_67.EVENT.ON_UPDATE_SECTIONS, async () => { }));
            this.events.push(components_35.application.EventBus.register(this, index_67.EVENT.ON_UPDATE_FOOTER, async () => this.onUpdateWrapper()));
        }
        async onAddRow(data) {
            const { type, module, prependId } = data;
            let element = {
                id: index_70.generateUUID(),
                column: 1,
                columnSpan: module.category === 'components' ? 12 : 3,
                type,
                module,
                properties: {
                    showHeader: false,
                    showFooter: false
                }
            };
            if (module.category === 'components') {
                element.properties = {
                    showHeader: false,
                    showFooter: false
                };
            }
            else if (module.category === 'micro-dapps') {
                element.properties = {
                    showHeader: true,
                    showFooter: true
                };
            }
            let rowData = {
                id: index_70.generateUUID(),
                row: index_68.pageObject.sections.length + 1,
                elements: [element]
            };
            //FIXME: remove this
            if (module.path === 'scom-nft-minter' || module.path === 'scom-gem-token') {
                element.module = module;
                element.columnSpan = 6;
                element.properties = {
                    networks: [{
                            chainId: 43113
                        }],
                    wallets: [{
                            name: "metamask"
                        }],
                    width: '100%'
                };
            }
            return await this.pageRows.appendRow(rowData, prependId);
        }
        onUpdateWrapper() {
            //     this.contentWrapper.minHeight = `calc((100vh - 6rem) - ${this.builderFooter.offsetHeight}px)`;
            //     this.contentWrapper.padding = {bottom: this.builderFooter.offsetHeight};
        }
        render() {
            return (this.$render("i-vstack", { id: "editor", width: '100%', height: '100%', overflow: "hidden" },
                this.$render("ide-header", { id: 'pageHeader', border: { bottom: { width: 1, style: 'solid', color: '#dadce0' } } }),
                this.$render("i-grid-layout", { templateColumns: ['auto', '400px'], autoFillInHoles: true, height: "calc(100% -64px)", overflow: { y: 'auto' } },
                    this.$render("i-panel", { id: "pnlWrap", class: "main-content", height: "100%", overflow: { y: 'auto' }, background: { color: Theme.background.default }, border: { right: { width: 1, style: 'solid', color: Theme.divider } }, padding: { bottom: '1rem' } },
                        this.$render("i-panel", { id: "pageContent", maxWidth: 1400, width: "100%", margin: { left: 'auto', right: 'auto' } },
                            this.$render("i-panel", { maxWidth: 1280, minHeight: "100vh", margin: { top: 8, bottom: 8, left: 60, right: 60 }, background: { color: '#fff' }, class: "pnl-editor-wrapper" },
                                this.$render("i-panel", { id: "contentWrapper", padding: { bottom: '12rem' }, minHeight: "calc((100vh - 6rem) - 12rem)" },
                                    this.$render("ide-rows", { id: "pageRows", draggable: true })),
                                this.$render("builder-footer", { id: "builderFooter" })))),
                    this.$render("i-panel", { class: "main-sidebar", height: "100%", overflow: { y: 'auto' } },
                        this.$render("ide-sidebar", { id: 'pageSidebar', display: 'block', width: "100%" })))));
        }
    };
    Editor = __decorate([
        components_35.customElements("i-scom-page-builder"),
        components_35.customModule
    ], Editor);
    exports.default = Editor;
});
