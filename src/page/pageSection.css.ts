import {Styles} from '@ijstech/components';
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

Styles.cssRule('ide-section', {
    display: 'block',
    position: 'relative',
    maxWidth: '100%',
    // border: '2px solid transparent',
    transition: 'opacity .2s .1s cubic-bezier(0.4,0,0.2,1), left 0s .1s',
    $nest: {
        '&:hover .section-border': {
            display: 'block',
            outline: `2px solid ${Theme.colors.primary.main}`,
            transition: 'border ease-in .2s'
        },
        '&.is-dragging .section-border': {
            outline: `2px solid transparent !important`,
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        }
    }
});
