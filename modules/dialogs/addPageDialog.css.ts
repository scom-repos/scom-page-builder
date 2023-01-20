import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-add-page-dialog', {
    zIndex: 3,

    $nest: {
        'i-modal': {
            // @ts-ignore
            position: 'fixed!important',

            $nest: {
                '> div': {
                    left: '50%!important',
                    top: '50%!important',
                    transform: 'translate(-50%,-50%)!important'
                },

                '.modal': {
                    padding: 0,
                    height: 'auto',
                    backgroundColor: '#fff',
                    borderLeft: '1px solid #dfe5eb',
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

        '.right-side-area': {
            position: 'relative',
            background: '#fff',
            overflowX: 'hidden',
            overflowY: 'auto',
            width: '100%',

            $nest: {
                '.page-header-container': {
                    alignItems: 'center',
                    margin: '17px 24px 16px',
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

                        'i-input input': {
                            backgroundColor: '#fff',
                            border: '1px solid #80b1ff',
                            height: '34px',
                            padding: '0 11px',
                            borderRadius: '4px'
                        }
                    }
                }
            }
        },

        '.settings-footer': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px',
            borderTop: '1px solid #dfe5eb',

            $nest: {
                'i-button': {
                    height: '30px',
                    fontSize: '14px',
                    lineHeight: '24px',
                    padding: '0 24px',
                    borderRadius: '18px',
                    boxShadow: 'none'
                },

                '.settings-cancel': {
                    backgroundColor: '#e7f0ff',
                    color: '#116dff'
                },

                '.settings-done': {
                    backgroundColor: Theme.colors.primary.main,
                    color: Theme.colors.primary.contrastText
                }
            }
        }
    }
});
