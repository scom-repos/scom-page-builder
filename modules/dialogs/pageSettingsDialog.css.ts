import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-settings-dialog', {
    zIndex: 2,

    $nest: {
        '> .tools': {
            display: 'none'
        },

        'i-modal': {
            padding: 0,
            height: 'calc(100vh - 88px - 50px)',

            $nest: {
                '> div': {
                    position: 'fixed',
                    left: '54px!important',
                    top: '88px!important'
                },

                '.modal': {
                    padding: 0,
                    height: '100%',
                    backgroundColor: '#fff',
                    borderLeft: '1px solid #dfe5eb',
                    borderRight: '1px solid #dfe5eb',
                    boxShadow:
                        '0 1px 5px 0 rgb(0 0 0 / 12%), 0 2px 10px 0 rgb(0 0 0 / 8%), 0 1px 20px 0 rgb(0 0 0 / 8%)',
                    overflow: 'hidden'
                }
            }
        },

        '.settings-header': {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Theme.colors.primary.contrastText,
            width: '100%',
            height: '55px',
            minHeight: '55px',
            borderTop: '6px solid #00a87e',
            borderBottom: '1px solid #dfe5eb',
            padding: '0 9px 0 24px',

            $nest: {
                '.settings-header-title': {
                    fontSize: '16px',
                    fontWeight: 'bold'
                },

                '.settings-close': {
                    gap: 0,
                    backgroundColor: 'transparent',
                    height: '25px',
                    width: '25px',
                    border: 0,
                    borderRadius: '50%',
                    padding: '0!important',
                    cursor: 'pointer',
                    boxShadow: 'none'
                }
            }
        },

        '.settings-body': {
            flex: 1,
            height: 'calc(100% - 54px)',
            overflowX: 'hidden',
            overflowY: 'auto'
        },

        '.settings-sidebar': {
            color: '#3b4057',
            borderRight: '1px solid #dfe5eb',
            padding: '12px',
            backgroundColor: '#f7f8f8',
            position: 'relative',
            width: '150px',
            height: '100%',
            overflow: 'hidden',
            zIndex: 2,

            $nest: {
                'i-button': {
                    height: '30px',
                    color: '#0057e1',
                    backgroundColor: '#d6e6fe',
                    borderRadius: '20px',
                    padding: '0 12px',
                    fontSize: '14px',
                    boxShadow: 'none',

                    $nest: {
                        '&:hover': {
                            backgroundColor: '#d6e6fe'
                        }
                    }
                }
            }
        },

        '.right-side-area': {
            position: 'relative',
            background: '#fff',
            overflowX: 'hidden',
            overflowY: 'auto',
            width: '336px',

            $nest: {
                '.page-header-container': {
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '17px 24px 0',
                    paddingBottom: '7px',
                    borderBottom: '1px solid #dfe5eb',

                    $nest: {
                        'i-label': {
                            fontSize: '14px'
                        },

                        'i-button': {
                            color: '#116dff',
                            backgroundColor: 'transparent',
                            fontSize: '12px',
                            boxShadow: 'none',

                            $nest: {
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                },

                                'i-icon': {
                                    width: '10px!important',
                                    fill: '#116dff!important'
                                }
                            }
                        }
                    }
                },

                '.page-tree-container': {
                    position: 'relative',
                    height: 'calc(100% - 54px - 2 * 12px)',
                    width: '100%',

                    $nest: {
                        '.page-area': {
                            height: '100%',
                            padding: '0 24px 20px'
                        },

                        '.i-tree-node': {
                            $nest: {
                                '.i-tree-node_children': {
                                    marginLeft: '0.5rem'
                                }
                            }
                        },

                        '.i-tree-node_content': {
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            margin: '4px 0 6px',
                            height: '42px',
                            borderRadius: '4px',
                            border: '1px solid #dfe5eb',
                            padding: '0 6px 0 8px',
                            backgroundColor: '#fff',
                            color: '#3b4057',
                            cursor: 'pointer'
                        },

                        'scpage-tree-node scpage-tree-node': {
                            $nest: {
                                '&:first-child>.scpage-tree-node-content:before': {
                                    height: '105%',
                                },
                            },
                        },

                        '.scpage-tree-node-content': {
                            marginBottom: 0,
                            $nest: {
                                '&::before': {
                                    height: '190%',
                                }
                            }
                        },

                        '.pages-tree': {
                            paddingTop: '16px',
                            display: 'block',
                        },

                        '.expander': {
                            top: '18.5px',
                            paddingBottom: '2.5px',
                        },

                        'scpage-tree-node': {
                            borderBlock: '2px solid transparent',
                            marginBlock: '10px',
                            paddingBlock: '8px',
                        },

                        '.scpage-tree-node-children': {
                            paddingBottom: '6px',
                        },

                        '.drag-enter > .scpage-tree-node-content': {
                            background: Theme.action.focus
                        },

                        '.drag-to-bottom': {
                            borderBottomColor: Theme.colors.primary.main,
                        },

                        '.drag-to-top': {
                            borderTopColor: Theme.colors.primary.main,
                        },
                    }
                }
            }
        }
    }
});
