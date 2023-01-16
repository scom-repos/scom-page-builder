import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-toolbar', {
  $nest: {
    '.ide-component.active': {
      border: `1px solid ${Theme.colors.primary.main}`
    },
    'i-button': {
      boxShadow: 'none'
    },
    '.ide-toolbar': {
      position: 'absolute',
      zIndex: 99,
      top: -62,
      left: 0,
      boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)'
    }
  }
})
