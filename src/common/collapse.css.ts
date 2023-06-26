import { Styles } from "@ijstech/components";
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

export const collapseStyle = Styles.style({
  display: 'block',
  overflow: 'hidden',
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
    '.collapsible-content.--hidden': {
      display: 'none'
    },
    '.collapsible-content.--collapsing': {
      height: 0,
      opacity: 0,
      overflow: 'hidden',
      transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in-out',
    }
  }
})