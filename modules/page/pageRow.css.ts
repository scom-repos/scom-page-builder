import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#editor', {
    $nest: {
        '.row-actions-bar': {
            opacity: 0,
            visibility: 'hidden',
            zIndex: 1,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '-3em',
            flexDirection: 'column',
            background: '#fff',
            width: '34px',
            borderRadius: '20px',
            padding: 0,
            overflow: 'hidden',
            transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',

            $nest: {
                '.actions': {
                    display: 'flex',
                    justifyContent: 'center',
                    maxHeight: '30px',
                    cursor: 'pointer',

                    $nest: {
                        svg: {
                            width: '14px',
                            fill: '#80868b'
                        }
                    }
                },
                '&:hover': {
                    opacity: 1
                }
            }
        },
        'ide-row:hover': {
            $nest: {
                '.row-actions-bar': {
                    opacity: 1,
                    visibility: 'visible',
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
                    boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                }
            }
        }
    }
});

Styles.cssRule('ide-row', {
    display: 'block',
    position: 'relative',
    background: '#fff',
    $nest: {
        'ide-section': {
            flexGrow: '1'
        },
        '.drag-overlay': {
            zIndex: '-1',
            display: 'none'
        },
        '&.dragging': {
            $nest: {
                '.drag-overlay': {
                    zIndex: '9999',
                    display: 'block'
                }
            }
        },
        '&.dragenter': {
            borderTop: '3px solid #1976D2'
        },
        '.drag-stack': {
            visibility: 'hidden',
            opacity: 0,
            cursor: 'move',
            zIndex: 10,
            $nest: {
                '.main-drag': {
                    paddingLeft: 7,
                    width: 15,
                    height: 22,
                    overflow: 'hidden'
                }
            }
        },
        '&:hover': {
            $nest: {
                '.drag-stack': {
                    visibility: 'initial',
                    opacity: 0.48,
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1),visibility 0s .2s'
                },
                'i-hstack.dragger': {
                    borderRight: `2px dashed ${Theme.colors.secondary.main}`
                }
            }
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        }
    }
});
