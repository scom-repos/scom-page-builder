import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-sidebar', {
    borderRight: `1px solid ${Theme.divider}`,
    $nest: {
        '.block-image': {
            maxHeight: 74,
            boxShadow: '0 0 0 1px rgb(218 220 224)',
            overflow: 'hidden'
        },
        '.pointer': {
            cursor: 'pointer'
        },
        '.pointer:hover': {
            background: Theme.action.hover
        },
        '.insert-tabs': {
            $nest: {
                'i-tab:not(.disabled).active': {
                    backgroundColor: 'transparent',
                    color: Theme.colors.primary.main,
                },
                'i-tab:not(.disabled).active .tab-item': {
                    color: Theme.colors.primary.main,
                    // borderBottom: `1px solid ${Theme.colors.primary.main}`
                },
                '.tab-item': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: Theme.text.primary
                },
                'i-tab:not(.disabled):hover': {
                    backgroundColor: Theme.action.hover
                }
            }
        },
        'i-tabs i-tab:not(.disabled).active': {
            borderColor: 'transparent'
        }
    }
});
