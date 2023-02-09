import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-rows', {
    $nest: {
        '.drag-overlay': {
            zIndex: '-1',
            display: 'none',
            // boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)',
            transition: 'all .5s ease-in'
        }
    }
});