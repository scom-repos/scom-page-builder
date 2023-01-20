import {Styles} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

const spin = Styles.keyframes({
    "to": {
        "-webkit-transform": "rotate(360deg)"
    }
})

Styles.cssRule('ide-section', {
    display: 'block',
    position: 'relative',
    border: '2px solid transparent',

    $nest: {
        // '.drag-overlay': {
        //     zIndex: '-1',
        //     display: 'none'
        // },
        // '&.dragging': {
        //     $nest: {
        //         '.drag-overlay': {
        //             zIndex: '9999',
        //             display: 'block'
        //         }
        //     }
        // },
        // '&.dragenter': {
        //     borderTop: '3px solid #1976D2'
        // },
        '&.active, &:focus': {
            border: `2px solid ${Theme.colors.primary.main}`, // #4285f4
            transition: 'border ease-in .2s',
            $nest: {
                '.dragger': {
                    visibility: 'initial'
                }
            }
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        },
        '.dragger': {
            cursor: 'move',
            visibility: 'hidden',
            $nest: {
                'i-icon': {
                    display: 'none'
                },
                '&:hover': {
                    backgroundColor: '#CCCCCCCC'
                },
                '&.disabled:hover': {
                    cursor: 'default',
                    backgroundColor: 'inherit'
                }
            }
        }
    }
});
