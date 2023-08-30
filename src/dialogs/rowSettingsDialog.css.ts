import { Styles } from '@ijstech/components';

Styles.cssRule('.custom-modal', {
  visibility: 'hidden',
  $nest: {
    '.i-modal_header': {
      padding: '1rem 1.5rem 0.5rem',
      fontSize: '1rem',
      fontWeight: 600
    },
    'i-button': {
      padding: '0.5rem 1rem'
    },
    '.modal': {
      maxHeight: 'calc(100vh - 48px)',
      padding: 0,
      borderRadius: 5,
      overflowY: 'auto',
    }
  }
})
