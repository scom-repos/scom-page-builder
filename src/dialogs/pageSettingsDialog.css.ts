import { Styles } from '@ijstech/components';

Styles.cssRule('ide-page-settings-dialog', {
  $nest: {
    '.custom-modal': {
      $nest: {
        '.i-modal_header': {
          padding: '1rem 1rem 0.5rem',
          fontSize: '1rem',
          fontWeight: 600
        },
        'i-button': {
          padding: '0.5rem 1rem'
        },
        '.modal': {
          maxHeight: 'calc(100vh - 48px)',
          padding: 0
        }
      }
    }
  }
})
