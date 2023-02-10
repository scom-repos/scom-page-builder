import {Styles} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-section', {
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
    border: '2px solid transparent',
    $nest: {
        '&.active, &:focus': {
            border: `2px solid ${Theme.colors.primary.main}`,
            transition: 'border ease-in .2s'
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        }
    }
});