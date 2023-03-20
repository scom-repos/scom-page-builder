import { Styles } from '@ijstech/components';
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

Styles.cssRule('scpage-page-footer', {   
    width: '100%',
    background: Theme.background.main,
    borderTop: '1px solid #dfe5eb',

    $nest: {
        '&.sticky': {
            //@ts-ignore
            position: 'fixed !important',
            bottom: '0',
        }
    }
});
