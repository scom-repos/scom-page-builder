import {Styles} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

const spin = Styles.keyframes({
    "to": {
        "-webkit-transform": "rotate(360deg)"
    }
})

Styles.cssRule('#editor ', {
    $nest: {
        'ide-section': {
            $nest: {
                '&:hover': {
                    borderColor: Theme.colors.warning.light,
                    $nest: {
                        '.actions-bar': {
                            opacity: 1
                        }
                    }
                },
                '.actions-bar': {
                    opacity: 0
                }
            }
        }
    }
})


Styles.cssRule('ide-section', {
    display: 'block',
    position: 'relative',

    $nest: {
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
        '&.active, &:focus': {
            borderColor: Theme.colors.primary.main,
            $nest: {
                '.section-toolbar': {
                    visibility: 'initial'
                },
                'i-hstack.dragger': {
                    // borderRight: `2px dashed ${Theme.colors.secondary.main}`,
                    $nest: {
                        'i-icon': {
                            display: 'block'
                        }
                    }
                },
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
        },

        '.btn-add': {
            zIndex: '10',
            display: 'none',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '3px 18px 3px 12px',
            backgroundColor: Theme.colors.primary.main,
            color: Theme.colors.primary.contrastText,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            fontSize: '14px',
            height: '30px',
            lineHeight: '18px',
            borderRadius: '15px',
            cursor: 'pointer',

            $nest: {
                'i-icon': {
                    fill: Theme.colors.primary.contrastText,
                    height: '14px',
                    width: '14px',
                    marginRight: '5px'
                },
                '&#btnAddBefore': {
                    top: '-15px'
                },

                '&#btnAddAfter': {
                    bottom: '-15px'
                },

                '&:hover': {
                    backgroundColor: '#4429da',
                    boxShadow: 'none'
                }
            }
        },

        '.actions-bar': {
            display: 'none',
            zIndex: 1,
            position: 'absolute',
            top: '0',
            right: '32px',
            flexDirection: 'row',
            alignItems: 'center',
            background: '#fff',
            maxHeight: '152px',
            borderRadius: '4px',
            padding: '0 16px',
            boxShadow:
                '0 1px 5px 0 rgb(0 0 0 / 12%), 0 2px 10px 0 rgb(0 0 0 / 8%), 0 1px 20px 0 rgb(0 0 0 / 8%)',
            overflow: 'hidden',

            $nest: {
                '.actions': {
                    display: 'flex',
                    justifyContent: 'center',
                    maxHeight: '30px',
                    cursor: 'pointer',

                    $nest: {
                        svg: {
                            width: '14px'
                        }
                    }
                },

                '.actions-edit': {
                    borderTop: `1px solid ${Theme.background.default}`,
                    borderBottom: `1px solid ${Theme.background.default}`,
                    display: 'flex',
                    $nest: {
                        'i-icon': {
                            marginRight: '16px',
                        },
                    }
                }
            }
        },
        '.spinner': {
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "3px solid rgba(255,255,255,.3)",
            borderRadius: "50%",
            borderTopColor: Theme.colors.primary.main,
            "animation": `${spin} 1s ease-in-out infinite`,
            "-webkit-animation": `${spin} 1s ease-in-out infinite`
        }
    }
});
