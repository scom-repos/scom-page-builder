import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

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
    'i-input > input': {
      boxShadow: 'none',
      border: 'none',
      background: 'transparent'
    },
    '#headerStack': {
      backgroundSize: 'cover',
      $nest: {
        'ide-section': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        },
        'i-input > input': {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
          color: 'rgba(255,255,255,1)',
          textAlign: 'center'
        },
        '.page-title input': {
          lineHeight: 1.333,
          fontSize: '1rem',
          textAlign: 'left'
        },
        '&:hover': {
          $nest: {
            '.page-title': {
              transition: 'box-shadow 125ms cubic-bezier(0.4,0,0.2,1)',
              $nest: {
                '&:hover, &:focus': {
                  boxShadow: '0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%)'
                },
                '&:hover ~ .header-stack': {
                  opacity: 1,
                  transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                }
              }
            }
          }
        }
      }
    },
    '.header-stack': {
      opacity: 0,
      $nest: {
        '&:hover': {
          opacity: 1,
          transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
        }
      }
    }
  }
});
