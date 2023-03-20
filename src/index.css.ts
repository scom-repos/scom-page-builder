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
    }
  }
});
