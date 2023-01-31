import { BigNumber } from '@ijstech/eth-wallet';
import { IPFS_UPLOAD_END_POINT, IPFS_GATEWAY_IJS, IPFS_GATEWAY } from '@page/const';
import { match, MatchFunction, compile } from './pathToRegexp';

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

const fetchFromIPFS = (cid: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        let response;
        try {
            response = await fetch(IPFS_GATEWAY_IJS + cid);
        } catch (err) {
            response = await fetch(IPFS_GATEWAY + cid);
        }
        resolve(response);
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

export {
    assignAttr,
    uploadToIPFS,
    fetchFromIPFS,
    match,
    MatchFunction,
    compile,
    formatNumber,
    formatNumberWithSeparators,
    isCID,
    getCID,
    getPagePath,
    updatePagePath
};

export * from './command/index';





