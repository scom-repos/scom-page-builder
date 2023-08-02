import { Styles } from '@ijstech/components';
import { currentTheme  } from './theme/index';
const Theme = currentTheme;

Styles.cssRule('#editor', {
  $nest: {
    '.pnl-editor-wrapper': {
      display: 'block',
      boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
    },
    '.custom-input input': {
      paddingLeft: 10
    },
    // '::-webkit-scrollbar': {
    //   width: '7px',
    // },
    // '::-webkit-scrollbar-track': {
    //   borderRadius: '10px',
    //   border: '1px solid transparent',
    //   // background: Theme.divider
    // },
    // '::-webkit-scrollbar-thumb': {
    //   background: Theme.action.focus,
    //   borderRadius: '10px',
    //   outline: '1px solid transparent'
    // },
    '#pnlForm i-input > input': {
      boxShadow: 'none',
      border: 'none',
      background: 'transparent'
    },
    '#pnlWrap': {
      scrollBehavior: 'smooth',
    },
    '.pnl-scrollable': {
      maskImage: 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 7px, black 7px)',
      maskSize: '100% 20000px',
      maskPosition: 'left bottom',
      '-webkit-mask-image': 'linear-gradient(to top, transparent, black),linear-gradient(to left, transparent 7px, black 7px)',
      '-webkit-mask-size': '100% 20000px',
      '-webkit-mask-position': 'left bottom',
      transition: 'mask-position 0.3s, -webkit-mask-position 0.3s',
      $nest: {
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--action-focus)'
        },
        // '::-webkit-scrollbar-track': {
        //   background: 'transparent'
        // },
        '&:hover': {
          '-webkit-mask-position': 'left top',
          $nest: {
            'ide-sidebar': {
              borderRightStyle: 'none'
            }
          }
        }
      }
    },
    'ide-rows ide-row:first-child': {
      // paddingTop: 50
    }
  }
});
