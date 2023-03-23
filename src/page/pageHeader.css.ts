import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('.ide-header', {
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
