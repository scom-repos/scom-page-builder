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
      top: -53,
      left: 0,
      boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
      animation: `${tileToolbarFadeIn} 125ms cubic-bezier(0.4,0,1,1)`
    },
    '.setting-modal':{
      $nest: {
        '.i-modal_header': {
          padding: '1rem 1rem 0.5rem',
          fontSize: '1rem',
          fontWeight: 600
        },
        'i-button': {
          padding: '1rem'
        },
        'i-input': {
          border: `1px solid ${Theme.divider}`,
          width: '100% !important',
          marginBottom: '1rem'
        }
      }
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
    },
    '.dragger': {
      cursor: 'move',
      opacity: 0,
      visibility: 'hidden',
      transform: 'translateX(-50%)',
      zIndex: 10
    },
    '&:hover': {
      $nest: {
        '.dragger': {
          visibility: 'initial',
          opacity: 0.48,
          transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s'
        }
      }
    }
  }
})
