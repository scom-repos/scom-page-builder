import { Styles } from '@ijstech/components';

Styles.cssRule('scpage-tree-view', {
    width: '100%',

    $nest: {
        '.pages-tree.tree-root': {
            padding: '0 0 20px',
        },

        'scpage-tree-node': {
            display: 'block',
            position: 'relative',
            margin: '4px 0 6px',
            border: 0,

            $nest: {
                '&:first-of-type': {
                    marginTop: 0,
                },

                '&.has-children >.expander': {
                    display: 'block',
                },
            },
        },

        '.expander': {
            display: 'none',
            position: 'absolute',
            top: '12.5px',
            left: '-7px',
            width: '14px',
            height: '14px',
            textAlign: 'center',
            backgroundColor: '#80b1ff',
            borderRadius: '100%',
            border: 0,
            padding: 0,
            color: '#1a92df',
            fontSize: '14px',
            lineHeight: '10px',
            zIndex: 1,
            cursor: 'pointer',

            $nest: {
                'i-icon': {
                    width: '8px!important',
                    height: '8px!important',
                    fill: '#1a92df!important',
                },
            },
        },

        '.scpage-tree-node-content': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            height: '42px',
            lineHeight: 'inherit',
            padding: '0 6px 0 8px',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#3b4057',
            border: '1px solid #dfe5eb',
            marginBottom: '6px',
            cursor: 'move',

            $nest: {
                '&::before': {
                    display: 'none',
                    content: "''",
                    position: 'absolute',
                    width: '11px',
                    height: '120%',
                    bottom: '50%',
                    left: '-12px',
                    border: '1px solid #cde',
                    borderTop: 0,
                    borderRight: 0,
                    padding: '4px 0 0',
                },

                '.left-container': {
                    display: 'flex',
                    alignItems: 'center',
                },

                '.right-container': {
                    display: 'flex',
                    alignItems: 'center',

                    $nest: {
                        '.tools': {
                            display: 'flex',
                        },

                        '.symbol-dots': {
                            display: 'none',
                        },
                    },
                },

                '.symbol-type': {
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '10px',

                    $nest: {
                        svg: {
                            width: '10px',
                            height: '10px',
                            fill: '#3b4057',
                            marginRight: '6px',
                        },
                    },
                },

                '.symbol-eye': {
                    background: 'transparent',
                    padding: '0!important',
                    boxShadow: 'none',

                    $nest: {
                        svg: {
                            width: '15px',
                            height: '15px',
                            fill: '#868aa5',
                        },
                    },
                },

                '.symbol-dots': {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '24px',
                    width: '24px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '1px solid #a8caff',
                    boxShadow: 'none',
                    padding: '0!important',
                    marginLeft: '0.25rem',
                    gap: 'unset',

                    $nest: {
                        'i-icon': {
                            width: '12px!important',
                            height: '12px!important',
                        },

                        svg: {
                            fill: ' #116dff',
                        },
                    },
                },
            },
        },

        'scpage-tree-node scpage-tree-node': {
            marginLeft: '25px',

            $nest: {
                '&:first-child>.scpage-tree-node-content:before': {
                    height: '70%',
                },

                '&>.scpage-tree-node-content:before': {
                    display: 'block',
                },
            },
        },

        'scpage-tree-node.tree-collapsed': {
            $nest: {
                'scpage-tree-node': {
                    display: 'none',
                },
            },
        },

        'scpage-tree-node.active': {
            $nest: {
                '&>.scpage-tree-node-content': {
                    backgroundColor: '#d6e6fe',
                    borderColor: '#80b1ff',

                    $nest: {
                        '.right-container': {
                            $nest: {
                                '.symbol-dots': {
                                    display: 'flex',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
});
