import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#editor', {
    $nest: {
        '.row-actions-bar': {
            opacity: 0,
            visibility: 'hidden',
            zIndex: 10,
            position: 'absolute',
            top: '0',
            left: '-3em',
            width: '34px',
            padding: 0,
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
                    opacity: '1 !important',
                    visibility: 'initial',
                    $nest: {
                        '> i-panel': {
                            boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                        }
                    }
                }
            }
        },
        'ide-row:hover': {
            $nest: {
                '.row-actions-bar': {
                    opacity: '1 !important',
                    visibility: 'initial',
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
                    $nest: {
                        '> i-panel': {
                            boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                        }
                    }
                }
            }
        }
    }
});

Styles.cssRule('ide-row', {
    display: 'block',
    position: 'relative',
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
            border: '2px solid #1976D2'
        },
        '&.dropzone': {
            boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
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
        '&:hover[draggable="true"]': {
            $nest: {
                '.drag-stack': {
                    visibility: 'initial',
                    opacity: 0.48,
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1),visibility 0s .2s'
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
