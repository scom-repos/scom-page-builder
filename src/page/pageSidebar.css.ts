import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const categoryPanelStyle = Styles.style({
    padding: 4,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
    background: '#fff',
    borderRadius: 5
})

export const categoryButtonStyle = Styles.style({
    position: 'relative',
    cursor: 'pointer',
    borderRadius: 4,
    $nest: {
        '&:hover': {
            background: 'rgba(243, 178, 111, 0.08)',
            transition: 'background .15s ease-in'
        }
    }
})

export const widgetModalStyle = Styles.style({
    $nest: {
        '> div': {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
            overflow: 'hidden'
        },
        '.modal': {
            marginRight: -8,
            padding: '0.75rem',
            borderRadius: 5,
            backgroundColor: '#fff',
            overflow: 'auto'
        },
        '.prevent-select': {
            userSelect: 'none'
        }
    }
})

export const widgetStyle = Styles.style({
    cursor: 'grab',
    opacity: 1,
    transition: 'opacity .2s ease-in-out, transform 0.2s ease-in-out',
    $nest: {
        '&.is-dragging': {
            opacity: 0.7
        },
        '&:hover': {
            transform: 'scale(1.04) translateY(-4px)'
        },
        'i-label': {
            overflow: 'hidden',
            // whiteSpace: 'nowrap',
            // textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.25
        },
        '> i-image img': {
            width: 40,
            height: 40,
            objectFit: 'cover',
            borderRadius: 5
        }
    }
})