import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#paging-container', {
    $nest: {
        '.raise:hover': {
            boxShadow: `0 0.5em 0.5em -0.4em ${Theme.colors.primary.main}`,
            transform: 'translateY(-0.25em)'
        },
        '.cut-text span': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: '100%'
        },
        '.shadow': {
            boxShadow: '0px 1px 2px rgb(0 0 0 / 12%)'
        }
    }
});