import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('ide-row-settings-dialog', {
    $nest: {
        '.setting-modal': {
            $nest: {
                '.i-modal_header': {
                    padding: '1rem 1rem 0.5rem',
                    fontSize: '1rem',
                    fontWeight: 600
                },
                'i-button': {
                    padding: '1rem'
                },
                'i-input': {
                    border: `1px solid ${Theme.divider}`,
                    marginBottom: '1rem'
                },
                '.modal': {
                    maxHeight: 'calc(100vh - 48px)',
                    padding: 0
                }
            }
        },
    }
});
