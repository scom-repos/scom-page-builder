import { Styles } from '@ijstech/components';

Styles.cssRule('ide-rows', {
    $nest: {
        '.drag-overlay': {
            zIndex: '-1',
            display: 'none',
            transition: 'all .5s ease-in',
            boxShadow: 'inset 0 2px 0 #686565, inset 0 -2px 0 #686565'
        },
        '.row-dragged': {
            position: 'relative',
            zIndex: 999
        },
        '.container > *:not(.active):not(:focus):first-child': {
            borderTopColor: 'transparent'
        }
    }
});