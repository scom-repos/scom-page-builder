import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-sidebar', {
    borderRight: `1px solid ${Theme.divider}`,
    $nest: {
        '::-webkit-scrollbar': {
            width: '7px',
        },
        '::-webkit-scrollbar-track': {
            borderRadius: '10px',
            border: '1px solid transparent',
            background: Theme.divider
        },
        '::-webkit-scrollbar-thumb': {
            background: Theme.action.focus,
            borderRadius: '10px',
            outline: '1px solid transparent'
        },
        '.block-image': {
            maxHeight: 74,
            boxShadow: '0 0 0 1px rgb(218 220 224)',
            overflow: 'hidden'
        },
        '.pointer': {
            cursor: 'pointer'
        },
        '.pointer:hover': {
            background: Theme.action.hover
        },
        // '.block-image:hover::before': {
        //     content: '""',
        //     opacity: 0.04,
        //     backgroundColor: '#000',
        //     position: 'absolute',
        //     top: 'calc(50% - 100%)',
        //     left: 'calc(50% - 100%)',
        //     width: '200%',
        //     height: '200%',
        //     transition: 'opacity 15ms linear, background-color 15ms linear'
        // }
    }
});
