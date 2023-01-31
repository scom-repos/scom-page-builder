import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;


const tileToolbarFadeIn = Styles.keyframes({
  '0%': { opacity: 0 },
  '100%':  { opacity: 1 }
})


Styles.cssRule('ide-toolbar', {
  display: 'block',
  $nest: {
    '.ide-component.active, .ide-component:hover': {
      border: `2px solid ${Theme.colors.primary.main}`
    },
    '.ide-component': {
      border: `2px solid transparent`,
      boxSizing: 'content-box'
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
    },
    '.modal': {
      padding: 0
    },
    'i-modal > div': {
      boxShadow: '0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%), 0px 5px 5px -3px rgb(0 0 0 / 20%)',
      borderRadius: '4px',
      marginTop: 5
    },
    '.resize-icon': {
      cursor: 'ew-resize',
      opacity: 0,
      transition: '125ms',
      border: '1px solid #fff',
      borderRadius: '50%'
    },
    '&.active .resize-icon': {
      opacity: 1
    },
    '.nw-resize': {
      cursor: 'nw-resize !important'
    },
    '.ne-resize': {
      cursor: 'ne-resize !important'
    },
    '.n-resize': {
      cursor: 'n-resize !important'
    },
    '.move': {
      cursor: 'move'
    }
  }
})
