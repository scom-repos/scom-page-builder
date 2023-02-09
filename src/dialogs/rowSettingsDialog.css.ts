import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-row-settings-dialog', {
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
                    padding: '30px 48px',
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
                        }
                    }
                }
            }
        }
    }
});
