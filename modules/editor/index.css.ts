import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#editor', {
  $nest: {
    '.pnl-editor-wrapper': {
      display: 'block',
      boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)',
    },

    'i-modal.button-dropdown > div': {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: Theme.colors.secondary.main
    },

    'i-button': {
      padding: '5px 10px',
      $nest: {
        '&.primary': {
          background: Theme.colors.primary.main,
          color: Theme.colors.primary.contrastText
        },
        '&.secondary': {
          background: Theme.colors.info.main,
          color: Theme.colors.secondary.contrastText
        },
        '&.success': {
          background: Theme.colors.success.main,
          color: Theme.colors.success.contrastText
        },
        '&.error': {
          background: Theme.colors.error.main,
          color: Theme.colors.error.contrastText
        },
        '&.warning': {
          background: Theme.colors.warning.main,
          color: Theme.colors.warning.contrastText
        },
        '&.info': {
          background: Theme.colors.info.main,
          color: Theme.colors.info.contrastText
        }
      }
    },

    '.theme-config': {
      position: 'absolute',
      top: '90px',
      right: 0,
      overflow: 'hidden',

      $nest: {
        '.theme-config-box': {
          position: 'relative',
          marginRight: '-220px',
          zIndex: 2100,
          transitionDuration: '0.8s'
        },

        'i-icon': {
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: Styles.Theme.ThemeVars.colors.primary.main,
          padding: '7px 10px 7px 13px',
          borderRadius: '20px 0 0 20px',
          fontSize: '16px',
          width: '40px',
          cursor: 'pointer',

          $nest: {
            svg: { animation: 'fa-spin 2s infinite linear' }
          }
        },

        '.skin-settings': {
          width: '220px',
          marginLeft: '40px',
          background: '#f3f3f4',

          $nest: {
            '.title': {
              display: 'block',
              background: '#efefef',
              textAlign: 'center',
              fontWeight: 600,
              padding: '10px 15px',

              $nest: {
                '.small': {
                  fontWeight: 400
                }
              }
            }
          }
        },

        '.setings-item': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 30px'
        }
      }
    },

    '#btnConfig': {
      borderTopLeftRadius: '25px',
      borderBottomLeftRadius: '25px'
    }
  }
});
