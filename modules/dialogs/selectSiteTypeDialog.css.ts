import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('scpage-select-site-type-dialog', {
    $nest: {
        // '.modal': {
        //     padding: 0
        // },
        '.selections': {
            // display: 'flex',
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            $nest: {
                '.selection': {
                    cursor: 'pointer',
                    transition: '.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid ${Theme.divider}`,
                    borderRadius: '5px',
                    $nest: {
                        'svg, i-label': {
                            transition: '.2s'
                        },
                        '&:hover': {
                            backgroundColor: Theme.colors.primary.main,
                            $nest: {
                                'svg': {
                                    fill: Theme.colors.primary.contrastText
                                },
                                'i-label': {
                                    color: Theme.colors.primary.contrastText,
                                }
                            }
                        },
                    }
                }
            }
        }
    }
});
