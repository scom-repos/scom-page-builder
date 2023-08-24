// import { application, Module } from '@ijstech/components';
import { BigNumber } from '@ijstech/eth-wallet';
// import { getRootDir } from '../store/index';
import { IPFS_UPLOAD_END_POINT, IPFS_GATEWAY_IJS } from '../const/index';
import { match, MatchFunction, compile } from './pathToRegexp';
import { checkDragDropResult, findNearestSectionInRow, getDropFrontBackResult } from './dragDrop'

const assignAttr = (module: any) => {
    const attrs = module.attrs;
    for (let attr in attrs) {
        if (attr === 'id' || typeof attrs[attr] === 'function') continue;
        module[attr] = module.getAttribute(attr, true);
    }
};

const uploadToIPFS = (data: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(IPFS_UPLOAD_END_POINT, {
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
        } else
            reject();
    });
};

const formatNumber = (value: any, decimals?: number) => {
    let val = value;
    const minValue = '0.0000001';
    if (typeof value === 'string') {
        val = new BigNumber(value).toNumber();
    } else if (typeof value === 'object') {
        val = value.toNumber();
    }
    if (val != 0 && new BigNumber(val).lt(minValue)) {
        return `<${minValue}`;
    }
    return formatNumberWithSeparators(val, decimals || 4);
};


const formatNumberWithSeparators = (value: number, precision?: number) => {
    if (!value) value = 0;
    if (precision) {
        let outputStr = '';
        if (value >= 1) {
            outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
        } else {
            outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
        }

        if (outputStr.length > 18) {
            outputStr = outputStr.substr(0, 18) + '...';
        }
        return outputStr;
        // let parts = parseFloat(value.toPrecision(precision)).toString().split(".");
        // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // return parts.join(".");
    } else {
        return value.toLocaleString('en-US');
        // let parts = value.toString().split(".");
        // parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // return parts.join(".");
    }
};

const isCID = (cid: string) => {
    const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
    return regex.test(cid);
};

const getCID = (): string => {
    if (!location.hash) return '';
    const segments = location.hash.split('/');
    for (const segment of segments) {
        if (isCID(segment)) {
            return segment;
        }
    }
    return '';
};

const getPagePath = (path?: string) => {
    let p = path;
    if(!p) p = location.hash;
    if (!p) return '';
    const segments = p.split('/');
    let firstEditAppeared = false;
    let paths = [];
    for (const segment of segments) {
        if (segment === '#') continue;
        if (!firstEditAppeared && segment === 'edit') {
            firstEditAppeared = true;
            continue;
        }
        if(isCID(segment)) {
            paths = [];
            continue;
        }
        paths.push(segment);
    }
    return paths.join('/');
};

const updatePagePath = (pagePath: string) => {
    if(!pagePath || !location.hash) return;
    const cid = getCID();
    const isEdit = location.hash.indexOf('#/edit') >= 0;
    location.hash = `#/${isEdit ? 'edit/' : ''}${cid ? `${cid}/` : ''}${pagePath}`;
}

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const isEmpty = (value: any) => {
    if (value === null || value === undefined || value === false || (typeof value === 'string' && !value)) return true;
    if (value && typeof value === 'object')
        return Object.keys(value).length === 0
    return false;
}

const fetchScconfigByRootCid = async (cid: string) => {
    try {
        let path = IPFS_GATEWAY_IJS + cid;
        let cidInfo = await (await fetch(path)).json();
        let hasScconfig = cidInfo.links?.find(link => link.name === 'scconfig.json');
        if (hasScconfig) {
            path += '/scconfig.json';
            let scconfig = await (await fetch(path)).json();
            return scconfig;
        } else {
            cid = cidInfo.links.find(link => link.name !== 'index.html')?.cid;
            if (cid) return fetchScconfigByRootCid(cid);
        }
        return null;
    } catch {
        return null;
    }
}

// const getEmbedElement = async (path: string) => {
//     const rootDir = getRootDir();
//     let modulePath = rootDir ? `${rootDir}/libs/@scom/${path}` : `libs/@scom/${path}`;
//     application.currentModuleDir = modulePath;
//     const result = await application.loadScript(`${modulePath}/index.js`);
//     application.currentModuleDir = '';
//     if (!result) return null;
//     const elementName = `i-${path.split('/').pop()}`;
//     const element = document.createElement(elementName);
//     element.setAttribute('lazyLoad', 'true');
//     return element;
// }

export {
    assignAttr,
    uploadToIPFS,
    formatNumber,
    formatNumberWithSeparators,
    isCID,
    getCID,
    getPagePath,
    updatePagePath,
    generateUUID,
    isEmpty,
    MatchFunction,
    fetchScconfigByRootCid,
    checkDragDropResult,
    findNearestSectionInRow,
    getDropFrontBackResult
};
