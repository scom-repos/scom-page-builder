import {application} from '@ijstech/components';
let moduleDir = application.currentModuleDir;

function fullPath(path: string): string{
    return `${moduleDir}/${path}`
}
export default {
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
        },
        layout: {
            emptySection: fullPath('img/layouts/oneWidget/empty_section.svg'),
            title: fullPath('img/layouts/oneWidget/title.svg'),
            titleWithText: fullPath('img/layouts/oneWidget/title_with_text.svg'),
            titleWithButton: fullPath('img/layouts/oneWidget/title_with_button.svg'),
            titleWithBulletPoint: fullPath('img/layouts/oneWidget/title_with_bullet_point.svg'),
            titleWithTaskList: fullPath('img/layouts/oneWidget/title_with_task_list.svg'),

            accentLeft: fullPath('img/layouts/twoWidget/accent_left.svg'),
            accentRight: fullPath('img/layouts/twoWidget/accent_right.svg'),
            twoImageColumn: fullPath('img/layouts/twoWidget/two_image_column.svg'),

            threeImageColumn: fullPath('img/layouts/multipleWidget/three_image_column.svg')
        },
        grip: fullPath('img/grip.svg')
    },
    fullPath
}
