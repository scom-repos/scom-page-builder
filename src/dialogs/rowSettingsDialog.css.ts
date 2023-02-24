import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-row-settings-dialog', {
    $nest: {
        '.modal': {
            maxHeight: 'calc(100vh - 48px)',
            padding: 0
        },

        '.settings-header': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Theme.colors.primary.main,
            width: '100%',
            height: '54px',
            minHeight: '54px',
            position: 'relative',
            padding: '0 20px',

            $nest: {
                '.settings-header-title': {
                    fontSize: '14px',
                    color: Theme.colors.primary.contrastText
                },

                '.settings-close': {
                    gap: 0,
                    backgroundColor: Theme.colors.error.dark,
                    height: '25px',
                    width: '25px',
                    border: 0,
                    borderRadius: '50%',
                    padding: '0!important',
                    cursor: 'pointer',

                    $nest: {
                        'i-icon': {
                            fill: `${Theme.colors.primary.contrastText}!important`
                        }
                    }
                }
            }
        }
    }
});
