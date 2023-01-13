import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#editor', {
    $nest: {
        '.row-actions-bar': {
            opacity: 0,
            zIndex: 1,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '0',
            flexDirection: 'column',
            background: '#fff',
            width: '34px',
            borderRadius: '20px',
            padding: 0,
            overflow: 'hidden',

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

                '.actions-edit': {
                    borderTop: `1px solid ${Theme.background.default}`,
                    borderBottom: `1px solid ${Theme.background.default}`
                }
            }
        },
        'scpage-page-row:hover': {
            $nest: {
                '.row-actions-bar': {
                    opacity: 1,
                    transition: 'opacity .5s .5s cubic-bezier(0.4,0,0.2,1),visibility 0s .4s',
                    boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                }
            }
        }
    }
});

Styles.cssRule('scpage-page-row', {
    display: 'block',
    position: 'relative',
    $nest: {
        'scpage-page-section': {
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
        '.section-toolbar': {
            visibility: 'hidden'
        },
        '&.active, &:hover': {
            $nest: {
                '.section-toolbar': {
                    visibility: 'initial'
                },
                'i-hstack.dragger': {
                    borderRight: `2px dashed ${Theme.colors.secondary.main}`,
                    $nest: {
                        'i-icon': {
                            display: 'block'
                        }
                    }
                }
            }
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        },
        '.section-toolbar i-icon': {
            marginLeft: '5px',
            cursor: 'pointer'
        },
        'i-panel.card': {
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            width: '70%',
            margin: '50px auto',
            boxShadow: '1px 1px 5px rgb(0 0 0 / 30%)',
            $nest: {
                'i-panel.section-toolbar': {
                    flexGrow: 2,
                    textAlign: 'right'
                }
            }
        }
    }
});
