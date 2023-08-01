import {
    Styles
} from '@ijstech/components';

Styles.cssRule('i-form', {
    $nest: {
        'i-label': {
          fontWeight: 400,
          fontSize: '0.9rem !important'
        },
        'i-input': {
            height: '45px !important',
            padding: '10px',
            backgroundColor: '#F3F6F9',
            borderColor: "#F3F6F9 !important",
            color: '#3F4254',
            borderRadius: 5,
            $nest: {
                'input': {
                    borderStyle: 'none',
                    padding: 0,
                    background: 'transparent'
                }
            }
        },
        'i-combo-box': {
            height: '45px !important',
            padding: '10px',
            backgroundColor: '#F3F6F9',
            borderColor: "#F3F6F9 !important",
            color: '#3F4254',
            borderRadius: 5,
            $nest: {
                'div.selection': {
                    borderStyle: 'none',
                    background: 'transparent',
                    $nest: {
                        'input': {
                            padding: 0,
                            background: 'transparent',
                        }
                    }
                },
                'span.icon-btn': {
                    borderStyle: 'none',
                }
            }
        }
    }
});
