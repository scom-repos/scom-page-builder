import { Styles } from "@ijstech/components";
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

export const collapseStyle = Styles.style({
  display: 'block',
  $nest: {
    '.collapsible-toggle': {
      cursor: 'pointer',
      overflow: 'hidden',
    },
    '.collapsible-toggle:hover': {
      background: Theme.action.hover
    },
    'i-icon.collapsible-icon': {
      transition: 'transform 0.25s ease-in-out',
    },
    'i-icon.collapsible-icon.--rotate': {
      transform: 'rotate(-180deg)',
    },
    '.collapsible-content': {
      maxHeight: '0px',
      opacity: 0,
      overflow: 'hidden auto',
      transition: 'all 0.25s ease-in-out',
    },
    '.collapsible-content.--expanded': {
      maxHeight: '100vh',
      opacity: 1
    }
  }
})