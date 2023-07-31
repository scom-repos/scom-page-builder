import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const menuBtnStyle = Styles.style({
    padding: 4,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
    background: '#fff',
    borderRadius: 5
})

export const widgetModalStyle = Styles.style({
    $nest: {
        '> div': {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
            overflow: 'hidden'
        },
        '.modal': {
            // marginLeft: -8,
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