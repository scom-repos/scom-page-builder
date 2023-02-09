import {Styles} from '@ijstech/components';

const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-module-card', {
    $nest: {
        "&.active i-panel.module-card": {
            border: "3px solid #77B24D"
        },
        "i-panel.module-card": {
            padding: 0,
            display: 'flex',
            flexDirection: "column",
            background: Theme.background.main,
            width: '100%',
            boxShadow: "1px 1px 5px rgb(0 0 0 / 30%)",
            $nest: {
                "i-panel.module-card-header": {
                    display: 'flex',
                    justifyContent: 'stretch',
                    padding: '20px',
                    $nest: {
                        "i-icon": {
                            marginLeft: '5px',
                            cursor: 'pointer'
                        },
                        "i-panel.module-card-header-title": {
                            flexGrow: 8,
                            $nest: {
                                "input": {
                                    fontSize: '16px',
                                    border: 0
                                }
                            }
                        },
                        "i-panel.module-card-header-buttons": {
                            flexGrow: 2,
                            textAlign: 'right'
                        }
                    }
                },
                "i-panel.module-card-body": {
                    padding: "20px"
                }
            }
        },
    }
});
