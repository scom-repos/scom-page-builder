import { Styles } from '@ijstech/components';
import { currentTheme  } from './theme/index';
const Theme = currentTheme;

Styles.cssRule('#editor', {
  $nest: {
    '.pnl-editor-wrapper': {
      display: 'block',
      boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
    },
    '.custom-input input': {
      paddingLeft: 10
    },
    '::-webkit-scrollbar': {
      width: '7px',
    },
    '::-webkit-scrollbar-track': {
      borderRadius: '10px',
      border: '1px solid transparent',
      background: Theme.divider
    },
    '::-webkit-scrollbar-thumb': {
      background: Theme.action.focus,
      borderRadius: '10px',
      outline: '1px solid transparent'
    },
    '#pnlForm i-input > input': {
      boxShadow: 'none',
      border: 'none',
      background: 'transparent'
    },
    '.pnl-scrollable': {
      maskImage: 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 17px, black 17px)',
      maskSize: '100% 20000px',
      maskPosition: 'left bottom',
      '-webkit-mask-image': 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 17px, black 17px)',
      '-webkit-mask-size': '100% 20000px',
      '-webkit-mask-position': 'left bottom',
      transition: 'mask-position 0.3s, -webkit-mask-position 0.3s',
      $nest: {
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--action-focus)'
        },
        '::-webkit-scrollbar-track': {
          background: 'var(--background-default)'
        },
        '&:hover': {
          '-webkit-mask-position': 'left top',
          $nest: {
            'ide-sidebar': {
              borderRightStyle: 'none'
            }
          }
        }
      }
    }
  }
});
