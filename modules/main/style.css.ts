import { Styles } from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('body', {
    $nest: {
        // Tabsheet
        '.tabs-nav-wrap': {
          border: '0px'
        },
        'i-tabs .tabs-nav': {
            borderBottom: '0px'
        },
        'i-tabs i-tab': {
            color: Theme.text.primary,
            backgroundColor: Theme.background.paper,
            border: '0px',
            $nest: {
                '&:not(.disabled).active': {
                    color: Theme.colors.primary.contrastText,
                    backgroundColor: Theme.colors.primary.main
                },
                '&:hover': {
                    color: Theme.text.primary,
                }

            }
        },

        // Config dialog
        '.config': {
            maxWidth: '1400px',
            $nest: {
                '.modal': {
                  padding: 0
                },
                '.config-header': {
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    height: '54px',
                    padding: '0 20px',
                    backgroundColor: Theme.colors.primary.main,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    $nest: {
                        '.title': {
                            color: Theme.colors.primary.contrastText,
                        },
                        '.close': {
                            cursor: 'pointer',
                            height: Theme.typography.fontSize,
                            width: Theme.typography.fontSize,
                            $nest: {
                                'svg': {
                                    fill: Theme.colors.primary.contrastText
                                }
                            }
                        }
                    }

                },
                '.config-sidebar': {
                    backgroundColor: '#131720'
                },
                '.config-body': {
                    padding: '10px 20px',
                },
                '.config-footer': {
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '10px 20px',
                    justifyContent: 'end',
                    alignItems: 'center'
                },
                '.form-group': {
                    marginBottom: '1rem',
                    display: 'block',
                    height: 'auto',
                    $nest: {
                        '.form-label': {
                            height: '25px',
                            width: '100%'
                        },
                        '.form-control': {
                            height: '100%',
                            width: '100%',
                            $nest: {
                                'i-checkbox': {
                                    marginRight: '1rem'
                                },
                                'i-input': {
                                    width: '100% !important',
                                    height: '30px !important',
                                    $nest: {
                                        'input[type="color"]': {
                                            width: '50px !important',
                                            float: 'right'
                                        },
                                        'input': {
                                            border: '0',
                                            borderBottom: `.5px solid #999`,
                                            backgroundColor: 'transparent'
                                        }
                                    }
                                },
                                'i-switch': {
                                    float: 'right',
                                    height: '30px'
                                },
                                'i-upload': {
                                    width: '100% !important',
                                    height: '100% !important'
                                },
                                'i-range': {
                                    width: '100% !important',
                                    $nest: {
                                        '.slider': {
                                            width: '100% !important'
                                        }
                                    }
                                },
                                'i-combo-box': {
                                    height: '30px !important',
                                    border: `0`,
                                    borderBottom: `.5px solid #999`,
                                    $nest: {
                                        '.selection': {
                                            border: 'unset',
                                            backgroundColor: 'transparent',
                                            $nest: {
                                                'input': {
                                                    backgroundColor: 'transparent'
                                                }
                                            }
                                        },
                                        '.icon-btn': {
                                            border: 'unset'
                                        }
                                    }
                                },
                                'i-datepicker': {
                                    height: '30px !important',
                                    width: '100% !important',
                                    borderBottom: '.5px solid #999',
                                    $nest: {
                                        'input': {
                                            width: 'calc(100% - 25px) !important',
                                            height: '100% !important',
                                            border: '0'
                                        },
                                        '.datepicker-toggle': {
                                            backgroundColor: 'transparent'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            },
        },

        // Box
        'i-panel.box': {
            borderRadius: '5px',
            // background: Theme.background.paper,
            background: Theme.background.main,
            boxShadow: `rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px`,
            marginBottom: '1rem',
            $nest: {
                'i-panel.box-header': {
                    height: '50px',
                    borderBottom: `1px solid ${Theme.divider}`,
                    padding: '10px 20px',
                    $nest: {
                        'i-label': {
                            lineHeight: '30px',
                            height: '30px'
                        }
                    }
                },
                'i-panel.box-content': {
                    padding: '20px 20px',
                    $nest: {
                        '> i-panel.box': {
                            border: `1px solid ${Theme.divider}`,
                            borderRadius: '5px'
                        }
                    }
                },
                'i-panel.box-footer': {
                    height: '50px',
                    borderTop: `1px solid ${Theme.divider}`,
                    padding: '10px 20px',
                    $nest: {
                        'i-label': {
                            lineHeight: '30px',
                            height: '30px'
                        }
                    }
                },

            }
        },

        // Form1
        'i-panel.form-group': {
            marginBottom: '1rem',
            display: 'flex',
            height: 'auto',
            $nest: {
                'i-label.form-label': {
                    height: '100%',
                    width: '25%'
                },
                'i-panel.form-control': {
                    height: '100%',
                    width: '75%',
                    $nest: {
                        'i-checkbox': {
                            marginRight: '1rem'
                        },
                        'i-input': {
                            width: '100% !important',
                            height: '30px !important',
                            $nest: {
                                'input[type="color"]': {
                                    width: '50px !important',
                                    float: 'right'
                                }
                            }
                        },
                        'i-switch': {
                            float: 'right',
                            height: '30px'
                        },
                        'i-upload': {
                            width: '100% !important',
                            height: '100% !important'
                        },
                        'i-range': {
                            width: '100% !important',
                            $nest: {
                                '.slider': {
                                    width: '100% !important'
                                }
                            }
                        },
                        'i-combo-box': {
                            height: '30px !important',
                            border: `0.5px solid ${Theme.divider}`,
                            $nest: {
                                '.selection': {
                                    border: 'unset'
                                },
                                '.icon-btn': {
                                    border: 'unset',
                                    borderLeft: `0.5px solid ${Theme.divider}`
                                }
                            }
                        },
                        'i-datepicker': {
                            height: '30px !important',
                            width: '100% !important',
                            $nest: {
                                'input': {
                                    width: 'calc(100% - 25px) !important',
                                    height: '100% !important'
                                }
                            }
                        }
                    }
                }
            }
        },

        // Buttons
        'i-button.btn': {
            height: '30px',
            // marginRight: '5px',
            $nest: {
                '&.btn-primary': {
                    background: Theme.colors.primary.main,
                    color: Theme.colors.primary.contrastText
                },
                '&.btn-secondary': {
                    background: Theme.colors.secondary.main,
                    color: Theme.colors.secondary.contrastText
                },
                '&.btn-success': {
                    background: Theme.colors.success.main,
                    color: Theme.colors.success.contrastText
                },
                '&.btn-error, &.btn-danger': {
                    background: Theme.colors.error.main,
                    color: Theme.colors.error.contrastText
                },
                '&.btn-warning': {
                    background: Theme.colors.warning.main,
                    color: Theme.colors.warning.contrastText
                },
                '&.btn-info': {
                    background: Theme.colors.info.main,
                    color: Theme.colors.info.contrastText
                }

            }
        },

        // Divider
        'i-panel.divider': {
            height: '1px',
            borderTop: `1px solid ${Theme.divider}`,
            marginTop: '1rem',
            marginBottom: '1rem'
        },

        // Paddings
        '.p-5': {
            padding: '5px'
        },
        '.p-10': {
            padding: '10px'
        },
        '.p-15': {
            padding: '15px'
        },
        '.p-20': {
            padding: '20px'
        },

        '.pt-5': {
            paddingTop: '5px'
        },
        '.pt-10': {
            paddingTop: '10px'
        },
        '.pt-15': {
            paddingTop: '15px'
        },
        '.pt-20': {
            paddingTop: '20px'
        },

        '.pb-5': {
            paddingBottom: '5px'
        },
        '.pb-10': {
            paddingBottom: '10px'
        },
        '.pb-15': {
            paddingBottom: '15px'
        },
        '.pb-20': {
            paddingBottom: '20px'
        },

        '.pl-5': {
            paddingLeft: '5px'
        },
        '.pl-10': {
            paddingLeft: '10px'
        },
        '.pl-15': {
            paddingLeft: '15px'
        },
        '.pl-20': {
            paddingLeft: '20px'
        },

        '.pr-5': {
            paddingRight: '5px'
        },
        '.pr-10': {
            paddingRight: '10px'
        },
        '.pr-15': {
            paddingRight: '15px'
        },
        '.pr-20': {
            paddingRight: '20px'
        },

        '.ph-5': {
            paddingLeft: '5px',
            paddingRight: '5px'
        },
        '.ph-10': {
            paddingLeft: '10px',
            paddingRight: '10px'
        },
        '.ph-15': {
            paddingLeft: '15px',
            paddingRight: '15px'
        },
        '.ph-20': {
            paddingLeft: '20px',
            paddingRight: '20px'
        },

        '.pv-5': {
            paddingTop: '5px',
            paddingBottom: '5px'
        },
        '.pv-10': {
            paddingTop: '10px',
            paddingBottom: '10px'
        },
        '.pv-15': {
            paddingTop: '15px',
            paddingBottom: '15px'
        },
        '.pv-20': {
            paddingTop: '20px',
            paddingBottom: '20px'
        },

        // Margins
        '.m-5': {
            margin: '5px'
        },
        '.m-10': {
            margin: '10px'
        },
        '.m-15': {
            margin: '15px'
        },
        '.m-20': {
            margin: '20px'
        },

        '.mt-5': {
            marginTop: '5px'
        },
        '.mt-10': {
            marginTop: '10px'
        },
        '.mt-15': {
            marginTop: '15px'
        },
        '.mt-20': {
            marginTop: '20px'
        },

        '.mb-5': {
            marginBottom: '5px'
        },
        '.mb-10': {
            marginBottom: '10px'
        },
        '.mb-15': {
            marginBottom: '15px'
        },
        '.mb-20': {
            marginBottom: '20px'
        },

        '.ml-5': {
            marginLeft: '5px'
        },
        '.ml-10': {
            marginLeft: '10px'
        },
        '.ml-15': {
            marginLeft: '15px'
        },
        '.ml-20': {
            marginLeft: '20px'
        },

        '.mr-5': {
            marginRight: '5px'
        },
        '.mr-10': {
            marginRight: '10px'
        },
        '.mr-15': {
            marginRight: '15px'
        },
        '.mr-20': {
            marginRight: '20px'
        },

        '.mh-5': {
            marginLeft: '5px',
            marginRight: '5px'
        },
        '.mh-10': {
            marginLeft: '10px',
            marginRight: '10px'
        },
        '.mh-15': {
            marginLeft: '15px',
            marginRight: '15px'
        },
        '.mh-20': {
            marginLeft: '20px',
            marginRight: '20px'
        },

        '.mv-5': {
            marginTop: '5px',
            marginBottom: '5px'
        },
        '.mv-10': {
            marginTop: '10px',
            marginBottom: '10px'
        },
        '.mv-15': {
            marginTop: '15px',
            marginBottom: '15px'
        },
        '.mv-20': {
            marginTop: '20px',
            marginBottom: '20px'
        },

        //menu
        'i-menu-item.invisible': {
            display: 'none',
        }
    }
});
