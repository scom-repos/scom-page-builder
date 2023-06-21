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
    display: 'block',
    position: 'relative',
    transition: 'translate .3s ease-in',
    border: '3px solid transparent',
    backgroundColor: 'var(--builder-bg)',
    $nest: {
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
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1),visibility 0s .2s'
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
            left: '-3em',
            width: '34px',
            padding: 0,
            transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',

            $nest: {
                '.actions': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    padding: 3,
                    background: 'transparent',
                    $nest: {
                        '&:hover': {
                            boxShadow: 'none',
                            background: Theme.action.hover,
                            transition: 'background .3s ease-in'
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
                },
                '.bar-shadow': {
                    boxShadow: '0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%), 0px 1px 5px 0px rgb(0 0 0 / 20%)'
                }
            }
        },
        '.btn-add': {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
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
                    transition: 'opacity .3s .3s cubic-bezier(0.4,0,0.2,1), visibility 0s .2s',
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
            background: '#cae5fbc4',
            border: `1px solid ${Theme.colors.primary.main}`,
            height: '100%',
            opacity: 1
        },
        '.rectangle': {
            display: 'none',
            position: 'absolute',
            top: 0,
            height: '100%',
            border: 'solid 2px blue'
        },
        '.border-x-dotted': {
            borderLeft: 'dotted 1px black',
            borderRight: 'dotted 1px black'
        },
        '.border-dotted': {
            border: 'dotted 1px black'
        },
        '.pnl-empty': {
            userSelect: 'none'
        }
    }
});
