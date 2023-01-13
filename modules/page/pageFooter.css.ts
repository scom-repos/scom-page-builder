import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-page-footer', {   
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
