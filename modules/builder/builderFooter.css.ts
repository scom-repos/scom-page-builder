import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('builder-footer', {
  $nest: {
    '#pnlFooter': {
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
        '&:hover ~ .edit-stack': {
          opacity: 1,
          transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
        },
        '> .edit-stack': {
          opacity: 0,
          $nest: {
            '&:hover': {
              opacity: 1,
              transition: 'opacity 125ms cubic-bezier(0.4,0,0.2,1)'
            }
          }
        }
      }
    }
  }
});
