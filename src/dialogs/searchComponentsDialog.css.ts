import { Styles } from '@ijstech/components';
import { currentTheme  } from '../theme/index';
const Theme = currentTheme;

Styles.cssRule('ide-search-components-dialog', {
  $nest: {
    '.search-modal': {
      $nest: {
        '.icon-close svg': {
          fill: Theme.colors.primary.main
        },
        '.i-modal_header': {
          padding: '1rem 1rem 0.5rem',
          fontSize: '1rem',
          fontWeight: 600
        },
        '.modal': {
          padding: 0
        },
        '.pnl-component:hover': {
          border: `1px solid ${Theme.colors.primary.main}`
        }
      }
    }
  }
})
