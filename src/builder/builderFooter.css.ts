import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('builder-footer', {
  $nest: {
    '#pnlFooter': {
      backgroundSize: 'cover',
      $nest: {
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
        },
        '.flex': {
          display: 'flex !important'
        }
      }
    }
  }
});
