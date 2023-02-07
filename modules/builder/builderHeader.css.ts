import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('builder-header', {
  $nest: {
    '#pnlHeader': {
      backgroundSize: 'cover',
      $nest: {
        'ide-section': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        },
        '.has-header > input': {
          color: 'rgba(255,255,255,1)'
        },
        'i-input > input': {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
          color: Theme.text.primary,
          paddingLeft: 15
        },
        '.page-title input': {
          lineHeight: 1.333,
          fontSize: '1rem',
          textAlign: 'left',
          fontWeight: 600
        },
        '#pnlConfig': {
          opacity: 0,
          $nest: {
            'i-button': {
              boxShadow: 'none'
            }
          }
        },
        '&:hover': {
          $nest: {
            '.page-title': {
              transition: 'box-shadow 125ms cubic-bezier(0.4,0,0.2,1)',
              $nest: {
                '&:hover, &:focus': {
                  boxShadow: '0 10px 20px rgb(0 0 0 / 19%), 0 6px 6px rgb(0 0 0 / 23%)'
                },
                '&:hover ~ .edit-stack': {
                  opacity: 1,
                  transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
                }
              }
            },
            '#pnlConfig': {
              opacity: 1,
              transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
            }
          }
        },
        '.custom-box': {
          boxShadow: '0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)'
        },
        '.type': {
          cursor: 'pointer'
        },
        '.type.active': {
          color: Theme.colors.primary.main
        }
      }
    },
    '.edit-stack': {
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
