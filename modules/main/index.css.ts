import { Styles } from '@ijstech/components';
import Assets from '@page/assets';
import { DEFAULT_BOXED_LAYOUT_WIDTH } from '@page/const';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('body', {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    background: Theme.background.main,
    $nest: {
        '&.boxed-layout .boxed-wrapper': {
            //@ts-ignore
            position: 'relative !important',
            // height: 'auto !important',
            maxWidth: DEFAULT_BOXED_LAYOUT_WIDTH,
            margin: '0 auto',
            // boxShadow: '0 0 5px 0 rgb(0 0 0 / 75%)',
            $nest: {
                '.pnl-editor': {
                    //@ts-ignore
                    position: 'relative !important',
                    height: 'inherit !important',
                    left: '0px !important',
                    maxWidth: '100% !important',
                },
                '.boxed-style': {
                    // height: 'inherit !important',
                    width: 'inherit',
                },
                '.page-content': {
                    minHeight: 'calc(100vh - 148px)', // 148px = height of the scpage-header
                },
                'ide-row': {
                    height: '100% !important'
                }
            }
        },
        'i-input input': {
            width: '100% !important',
            height: '100% !important',
        },
        'i-upload': {
            marginTop: '0'
        },
        '.toolbar:hover': {
            background: Theme.action.hover
        },
        '.toolbar': {
            background: 'transparent',
            boxShadow: 'none'
        }
    }
});

// Roboto
Styles.fontFace({
    fontFamily: 'Roboto',
    src: `url("${Assets.fonts.roboto.bold}") format("truetype")`,
    fontWeight: 'bold',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Roboto',
    src: `url("${Assets.fonts.roboto.italic}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'italic'
});
Styles.fontFace({
    fontFamily: 'Roboto',
    src: `url("${Assets.fonts.roboto.regular}") format("truetype")`,
    fontWeight: 'normal',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Roboto',
    src: `url("${Assets.fonts.roboto.medium}") format("truetype")`,
    fontWeight: '600',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Roboto',
    src: `url("${Assets.fonts.roboto.thin}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'normal'
});

// Notosans
Styles.fontFace({
    fontFamily: 'Noto Sans',
    src: `url("${Assets.fonts.notosans.bold}") format("truetype")`,
    fontWeight: 'bold',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Noto Sans',
    src: `url("${Assets.fonts.notosans.italic}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'italic'
});
Styles.fontFace({
    fontFamily: 'Noto Sans',
    src: `url("${Assets.fonts.notosans.regular}") format("truetype")`,
    fontWeight: 'normal',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Noto Sans',
    src: `url("${Assets.fonts.notosans.medium}") format("truetype")`,
    fontWeight: '600',
    fontStyle: 'normal'
});
Styles.fontFace({
    fontFamily: 'Noto Sans',
    src: `url("${Assets.fonts.notosans.thin}") format("truetype")`,
    fontWeight: '300',
    fontStyle: 'normal'
});
