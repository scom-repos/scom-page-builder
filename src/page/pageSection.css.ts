import {Styles} from '@ijstech/components';
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

Styles.cssRule('ide-section', {
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
    // border: '2px solid transparent',
    transition: 'all .3s ease-in',
    $nest: {
        '&:hover .section-border': {
            display: 'block',
            outline: `2px solid ${Theme.colors.primary.main}`,
            transition: 'border ease-in .2s'
        },
        '&.is-dragging:hover .section-border, &.is-dragging .hover-border': {
            outline: `none`,
        },
        '&.is-dragging .resize-icon': {
            display: 'none'
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        }
    }
});
