import { Styles } from '@ijstech/components';
import { currentTheme  } from '../theme/index';

const Theme = currentTheme;

Styles.cssRule('#editor', {
    $nest: {
        '.hidden': {
            display: 'none'
        }
    }
});

Styles.cssRule('ide-row', {
    paddingBottom: 20,
    display: 'block',
    position: 'relative',
    transition: 'translate .3s ease-in',
    border: '1px solid transparent',
    boxSizing: 'border-box',
    backgroundColor: 'var(--custom-background-color, var(--background-main))',
    $nest: {
        '.page-row-container': {
            borderRadius: 10,

            $nest: {
                '.page-row': {
                    borderRadius: 10,
                }
            }
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
        '&.dropzone:hover': {
            $nest: {
                '.drag-stack': {
                    visibility: 'initial',
                    opacity: 0.48,
                    transition: 'opacity .3s .15s cubic-bezier(0.4,0,0.2,1),visibility 0s .1s'
                }
            }
        },
        '&.disabled:hover': {
            cursor: 'default',
            backgroundColor: 'inherit'
        },
        '.row-actions-bar': {
            opacity: 0,
            zIndex: 10,
            position: 'absolute',
            top: '0',
            left: -52,
            width: '49px',
            padding: 0,
            paddingRight: 11,
            transition: 'opacity .3s .1s cubic-bezier(0.4,0,0.2,1), visibility 0s .1s',

            $nest: {
                '.actions': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: 5,
                    padding: 6,
                    background: 'transparent',
                    $nest: {
                        '&:hover i-icon svg': {
                          fill: `${Theme.colors.primary.main} !important`,
                          transition: 'fill .15s ease-in'
                        }
                    }
                },
                '&:hover': {
                    opacity: '1 !important',
                    visibility: 'initial',
                    zIndex: 980
                },
                '.bar-shadow': {
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px 0px'
                }
            }
        },
        '.btn-add': {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity .3s .15s cubic-bezier(0.4,0,0.2,1), visibility 0s .1s',
            $nest: {
                'i-icon svg': {
                    fill: Theme.colors.primary.contrastText
                }
            }
        },
        '&:hover': {
            $nest: {
                '.row-actions-bar': {
                    opacity: '1 !important',
                    transition: 'opacity .3s .1s cubic-bezier(0.4,0,0.2,1), visibility 0s .1s',
                    $nest: {
                        '> i-panel': {
                            boxShadow: '0 1px 2px rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)'
                        }
                    }
                },
                '.btn-add': {
                    visibility: 'visible',
                    opacity: 1
                }
            }
        },
        'h1, h2, h3, h4, h5, h6': {
            margin: 0
        },
        textarea: {
            resize: 'none'
        },
        '&.active, &:focus': {
            border: `2px solid ${Theme.colors.primary.main}`,
            transition: 'border ease-in .2s'
        },
        '.is-dragenter': {
            background: 'rgba(66,133,244,.9)',
            opacity: 1
        },
        '.rectangle': {
            display: 'none',
            position: 'absolute',
            top: 0,
            height: '100%',
            border: 'solid 2px blue',
            transition: 'width .3s .2s cubic-bezier(.4,0,.2,1), left 0s .2s'
        },
        '.border-x-dotted': {
            borderLeft: 'dotted 1px #808080',
            borderRight: 'dotted 1px #808080',
            boxSizing: 'border-box',
        },
        '.border-x-dotted-left': {
            borderRight: 'dotted 1px #808080',
            boxSizing: 'border-box',
        },
        '.border-x-dotted-right': {
            borderLeft: 'dotted 1px #808080',
            boxSizing: 'border-box'
        },
        '.border-dotted': {
            outline: 'dotted 1px #808080'
        },
        '.pnl-empty': {
            userSelect: 'none'
        },
        '.to-be-dropped': {
            outline: 'dotted 1px #808080'
        }
    }
});
