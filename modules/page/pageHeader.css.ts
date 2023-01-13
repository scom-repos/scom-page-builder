import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('.ide-header', {
    $nest: {
        '.toolbar:hover': {
            background: Theme.action.hover
        },
        '.toolbar': {
            background: 'transparent',
            boxShadow: 'none'
        }
    }
});
