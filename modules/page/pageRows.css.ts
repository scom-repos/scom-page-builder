import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;


Styles.cssRule('ide-rows', {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,

    $nest: {
        '.container': {
            // paddingTop: '12px',
            paddingBottom: '50px'
        }
    }
});

Styles.cssRule('#viewer', {
    $nest: {
        '.container': {
            maxWidth: '100%'
        }
    }
})

Styles.cssRule('#editor', {
    $nest: {
        '.container': {
            maxWidth: '92%'
        }
    }
})

