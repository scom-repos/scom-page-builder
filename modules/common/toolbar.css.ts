import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;


const tileToolbarFadeIn = Styles.keyframes({
  '0%': { opacity: 0 },
  '100%':  { opacity: 1 }
})


Styles.cssRule('ide-toolbar', {
  $nest: {
    '.ide-component.active, .ide-component:hover': {
      border: `2px solid ${Theme.colors.primary.main}`
    },
    '.ide-component': {
      border: `2px solid transparent`
    },
    'i-button': {
      boxShadow: 'none'
    },
    '.ide-toolbar': {
      position: 'absolute',
      zIndex: 99,
      top: -62,
      left: 0,
      boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
      animation: `${tileToolbarFadeIn} 125ms cubic-bezier(0.4,0,1,1)`
    }
  }
})
