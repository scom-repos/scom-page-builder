import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-site-settings-dialog', {
    $nest: {
        '.modal': {
            height: 'calc(100vh - 48px)',
            padding: 0
        },

        '.settings-header': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Theme.colors.primary.main,
            width: '100%',
            height: '54px',
            minHeight: '54px',
            position: 'relative',
            padding: '0 20px',

            $nest: {
                '.settings-header-title': {
                    fontSize: '14px',
                    color: Theme.colors.primary.contrastText
                },

                '.settings-close': {
                    gap: 0,
                    backgroundColor: Theme.colors.error.dark,
                    height: '25px',
                    width: '25px',
                    border: 0,
                    borderRadius: '50%',
                    padding: '0!important',
                    cursor: 'pointer',

                    $nest: {
                        'i-icon': {
                            fill: `${Theme.colors.primary.contrastText}!important`
                        }
                    }
                }
            }
        },

        '.settings-body': {
            flex: 1,
            height: 'calc(100% - 54px)',
            overflow: 'hidden'
        },

        '.settings-sidebar': {
            backgroundColor: '#131720',
            position: 'relative',
            width: '228px',
            height: '100%',
            overflow: 'hidden',
            minHeight: 0,
            zIndex: 2,
            marginLeft: 0,
            marginRight: 0,
            transitionProperty: 'margin-left,margin-right',
            transitionDuration: '0.6s',

            $nest: {
                '.persistent-header': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px 0 20px',
                    maxWidth: '228px',
                    width: '100%',
                    minHeight: '32px',
                    border: 0,
                    maxHeight: '200px',
                    margin: '7px 0',
                    borderBottom: '1px solid #2b2f37',

                    $nest: {
                        'i-label': {
                            color: Theme.colors.primary.contrastText
                        }
                    }
                },

                '.circular-progressbar': {
                    width: '56px',
                    height: '56px'
                },

                '.wadoz': {
                    position: 'relative',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',

                    $nest: {
                        '.space': {
                            marginBottom: '12px'
                        },

                        '.divider': {
                            border: 0,
                            height: '1px',
                            maxWidth: '228px',
                            margin: '8px 20px 9px',
                            background: '#2b2f37'
                        },

                        'i-button': {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px',
                            color: Theme.colors.primary.contrastText,
                            padding: '0 20px 0 20px!important',
                            maxWidth: '228px',
                            width: '100%',
                            minHeight: '32px',
                            background: 'transparent',
                            boxShadow: 'none',

                            $nest: {
                                '&:hover': {
                                    background: 'transparent',
                                    boxShadow: 'none'
                                }
                            }
                        }
                    }
                }
            }
        },

        '.right-side-area': {
            flex: 1,
            position: 'relative',
            background: '#f0f4f7',
            overflowX: 'hidden',
            overflowY: 'auto',

            $nest: {
                '.page-header-container': {
                    width: '100%',
                    padding: '30px 48px 24px',
                    margin: '0 auto',
                    minHeight: '132px'
                },

                '.breadcrumb': {
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '-10px',

                    $nest: {
                        'i-button': {
                            fontSize: '14px',
                            lineHeight: '18px',
                            padding: '0 10px',
                            background: 'transparent',
                            boxShadow: 'none'
                        },

                        'i-label': {
                            padding: '0 10px',

                            $nest: {
                                span: {
                                    fontSize: '14px',
                                    lineHeight: '18px'
                                }
                            }
                        }
                    }
                },

                '.page-body-container': {
                    width: '100%',
                    padding: '0 48px',
                    margin: '0 auto',
                    gap: '30px',

                    $nest: {
                        '.page-area': {
                            background: '#fff',
                            borderRadius: '8px'
                        },

                        '.area-heading': {
                            padding: '18px 30px 22px'
                        },

                        '.area-content': {
                            padding: '24px 30px 30px',
                            borderTop: '1px solid #dfe5eb',
                            gap: '20px'
                        },

                        '.area-config': {
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },

                        '.container-input input': {
                            textAlign: 'center',
                        },

                        '.modal-selection': {
                            $nest: {
                                '.modal': {
                                    border: `2px solid ${Theme.divider}`,
                                    borderRadius: 4,
                                    minWidth: 150,
                                    maxHeight: '40vh',
                                    overflow: 'auto',
                                    $nest: {
                                      '&::-webkit-scrollbar': {
                                        width: '3px',
                                      },
                                      '&::-webkit-scrollbar-thumb': {
                                        background: Theme.colors.primary.main,
                                        borderRadius: '5px',
                                      },
                                      'i-button': {
                                        display: 'block',
                                        padding: '0.35rem 0.5rem',
                                        background: Theme.background.default,
                                        borderRadius: '0',
                                        border: 'none',
                                        boxShadow: 'none',
                                        fontSize: '0.875rem',
                                        height: 'auto',
                                        textAlign: 'center'
                                      },
                                      'i-button:last-child': {
                                        marginBottom: 0
                                      }
                                    }
                                },
                            }
                        }
                    }
                }
            }
        },

        'i-upload i-button': {
            background: Theme.colors.primary.main,
            color: Theme.colors.primary.contrastText
        }
    }
});
