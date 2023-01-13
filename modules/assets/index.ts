import {application} from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
    return `${moduleDir}/${path}`
}
export default {
    fonts: {
        roboto: {
            bold: fullPath('fonts/roboto/Roboto-Bold.ttf'),
            italic: fullPath('fonts/roboto/Roboto-Italic.ttf'),
            light: fullPath('fonts/roboto/Roboto-Light.ttf'),
            medium: fullPath('fonts/roboto/Roboto-Medium.ttf'),
            regular: fullPath('fonts/roboto/Roboto-Regular.ttf'),
            thin: fullPath('fonts/roboto/Roboto-Thin.ttf'),
        },
        notosans: {
            bold: fullPath('fonts/notosans/NotoSans-Bold.ttf'),
            italic: fullPath('fonts/notosans/NotoSans-Italic.ttf'),
            light: fullPath('fonts/notosans/NotoSans-Light.ttf'),
            medium: fullPath('fonts/notosans/NotoSans-Medium.ttf'),
            regular: fullPath('fonts/notosans/NotoSans-Regular.ttf'),
            thin: fullPath('fonts/notosans/NotoSans-Thin.ttf'),
        }
    },
    icons: {
        logo: `${moduleDir}/assets/img/sc-logo.svg`,
        logoMobile: `${moduleDir}/assets/img/sc-logo-mobile.svg`,
        validocs: `${moduleDir}/assets/img/validocs.svg`
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
}
