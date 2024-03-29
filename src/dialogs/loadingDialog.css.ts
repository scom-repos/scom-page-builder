import {Styles} from '@ijstech/components';
import { currentTheme  } from '../theme/index';
const Theme = currentTheme;


const spin = Styles.keyframes({
    "to": {
        "-webkit-transform": "rotate(360deg)"
    }
})


Styles.cssRule('scpage-loading-dialog', {
    $nest: {
        'i-modal .modal': {
            borderRadius: '5px',
        },
        'i-label': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: '100%'
        },
        '.message-box': {
            textAlign: 'center',
            overflow: 'hidden'
        },
        '.spinner': {
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "3px solid rgba(255,255,255,.3)",
            borderRadius: "50%",
            borderTopColor: Theme.colors.primary.main,
            "animation": `${spin} 1s ease-in-out infinite`,
            "-webkit-animation": `${spin} 1s ease-in-out infinite`
        }
    }
})
