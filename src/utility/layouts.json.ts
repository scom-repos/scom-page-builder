const emptySection: any = []

const title: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 12,
        "module": {
            "name": "Banner",
            "path": "scom-banner",
            "category": "widgets",
        },
        "properties": {
            "title": 'Title',
            "description": 'Short description or subheading',
            "backgroundInageUrl": ''
        },
        "tag": {
            "dark": {
                "descriptionFontColor": "#565656",
                "linkButtonStyle": undefined,
                "titleFontColor": "#036ac4"
            },
            "light": {
                "descriptionFontColor": "#565656",
                "linkButtonStyle": undefined,
                "titleFontColor": "#036ac4"
            }
        }
    }
]

const titleWithBulletPoint: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 6,
        "module": {
            "name": "Text box",
            "path": "scom-markdown-editor",
            "category": "widgets"
        },
        "properties": {
            "content": '## **<span style="color: #036ac4">Title</span>**\n\n* item 1\n* item 2\n* item 3'
        },
        "tag": {
            "width": "100%",
            "height": 200
        }
    }
]

const titleWithTaskList: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 6,
        "module": {
            "name": "Text box",
            "path": "scom-markdown-editor",
            "category": "widgets"
        },
        "properties": {
            "content": '## **<span style="color: #036ac4">Title</span>**\n\n - [ ] Item 1\n - [ ] Item 2\n - [ ] Item 3'
        },
        "tag": {
            "width": "100%",
            "height": 200
        }
    }
]

const titleWithButton: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 12,
        "module": {
            "name": "Banner",
            "path": "scom-banner",
            "category": "widgets",
        },
        "properties": {
            "title": 'Title',
            "description": 'Short description or subheading',
            "backgroundInageUrl": '',
            "linkButtons": [
                {
                    "caption": "button",
                    "url": ""
                }
            ]
        },
        "tag": {
            "dark": {
                "descriptionFontColor": "#565656",
                "linkButtonStyle": undefined,
                "titleFontColor": "#036ac4"
            },
            "light": {
                "descriptionFontColor": "#565656",
                "linkButtonStyle": undefined,
                "titleFontColor": "#036ac4"
            }
        }
    }
]

const titleWithText: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 12,
        "module": {
            "name": "Text box",
            "path": "scom-markdown-editor",
            "category": "widgets"
        },
        "properties": {
            "content": "## **<span style='color: #036ac4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>**\n\nNulla ac est sit amet urna consectetur semper. Curabitur posuere justo et nibh gravida, non tristique urna fringilla. Vestibulum id velit sed nisl tincidunt aliquet. Morbi viverra sapien eu purus venenatis, vitae vestibulum odio bibendum. Fusce volutpat gravida velit, id efficitur erat luctus id. Nullam malesuada hendrerit orci, a pretium tortor facilisis non. Sed euismod euismod felis. Nunc rhoncus diam in mi placerat efficitur. Aenean pulvinar neque ac nisl consequat, non lacinia lectus dapibus. Phasellus sagittis sagittis massa a luctus. Etiam auctor semper ullamcorper. Suspendisse potenti."
        },
        "tag": {
            "width": "100%",
            "height": 191
        }
    }
]

const accentLeft: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 5,
        "module": {
            "name": "Image",
            "path": "scom-image",
            "category": "widgets",
            "disableClicked": true
        },
        "properties": {
            "showFooter": false,
            "showHeader": false
        },
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    },
    {
        "id": "",
        "column": 6,
        "columnSpan": 7,
        "module": {
            "name": "Text box",
            "path": "scom-markdown-editor",
            "category": "widgets"
        },
        "properties": {
            "content": "## **<span style='color: #036ac4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>**\n\nNulla ac est sit amet urna consectetur semper. Curabitur posuere justo et nibh gravida, non tristique urna fringilla. Vestibulum id velit sed nisl tincidunt aliquet. Morbi viverra sapien eu purus venenatis, vitae vestibulum odio bibendum. Fusce volutpat gravida velit, id efficitur erat luctus id. Nullam malesuada hendrerit orci, a pretium tortor facilisis non. Sed euismod euismod felis. Nunc rhoncus diam in mi placerat efficitur. Aenean pulvinar neque ac nisl consequat, non lacinia lectus dapibus. Phasellus sagittis sagittis massa a luctus. Etiam auctor semper ullamcorper. Suspendisse potenti."
        },
        "tag": {
            "width": "100%",
            "height": 270
        }
    }
]

const accentRight: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 7,
        "module": {
            "name": "Text box",
            "path": "scom-markdown-editor",
            "category": "widgets"
        },
        "properties": {
            "content": "## **<span style='color: #036ac4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>**\n\nNulla ac est sit amet urna consectetur semper. Curabitur posuere justo et nibh gravida, non tristique urna fringilla. Vestibulum id velit sed nisl tincidunt aliquet. Morbi viverra sapien eu purus venenatis, vitae vestibulum odio bibendum. Fusce volutpat gravida velit, id efficitur erat luctus id. Nullam malesuada hendrerit orci, a pretium tortor facilisis non. Sed euismod euismod felis. Nunc rhoncus diam in mi placerat efficitur. Aenean pulvinar neque ac nisl consequat, non lacinia lectus dapibus. Phasellus sagittis sagittis massa a luctus. Etiam auctor semper ullamcorper. Suspendisse potenti."
        },
        "tag": {
            "width": "100%",
            "height": 270
        }
    },
    {
        "id": "",
        "column": 8,
        "columnSpan": 5,
        "module": {
            "name": "Image",
            "path": "scom-image",
            "category": "widgets",
            "disableClicked": true
        },
        "properties": {
            "showFooter": false,
            "showHeader": false
        },
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    }
]

const twoImageColumn: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 6,
        "module": {},
        "properties": { "showHeader": false, "showFooter": false },
        "elements": [
            {
                "id": "",
                "column": 1,
                "columnSpan": 6,
                "module": { "name": 'Image', "path": 'scom-image', "category": 'widgets', "disableClicked": true },
                "properties": { "showHeader": false, "showFooter": false },
                "tag": {
                    "width": "100%",
                    "height": 'auto'
                }
            },
            {
                "id": "",
                "column": 1,
                "columnSpan": 6,
                "module": { "name": 'Text box', "path": 'scom-markdown-editor', "category": 'widgets' },
                "properties": { "showHeader": false, "showFooter": false }
            }
        ],
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    },
    {
        "id": "",
        "column": 7,
        "columnSpan": 6,
        "module": {},
        "properties": { "showHeader": false, "showFooter": false },
        "elements": [
            {
                "id": "",
                "column": 7,
                "columnSpan": 6,
                "module": { "name": 'Image', "path": 'scom-image', "category": 'widgets', "disableClicked": true },
                "properties": { "showHeader": false, "showFooter": false },
                "tag": {
                    "width": "100%",
                    "height": 'auto'
                }
            },
            {
                "id": "",
                "column": 7,
                "columnSpan": 6,
                "module": { "name": 'Text box', "path": 'scom-markdown-editor', "category": 'widgets' },
                "properties": { "showHeader": false, "showFooter": false }
            }
        ],
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    }
]

const threeImageColumn: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 4,
        "module": {},
        "properties": { "showHeader": false, "showFooter": false },
        "elements": [
            {
                "id": "",
                "column": 1,
                "columnSpan": 4,
                "module": { "name": 'Image', "path": 'scom-image', "category": 'widgets', "disableClicked": true },
                "properties": { "showHeader": false, "showFooter": false },
                "tag": {
                    "width": "100%",
                    "height": 'auto'
                }
            },
            {
                "id": "",
                "column": 1,
                "columnSpan": 4,
                "module": { "name": 'Text box', "path": 'scom-markdown-editor', "category": 'widgets' },
                "properties": { "showHeader": false, "showFooter": false }
            }
        ],
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    },
    {
        "id": "",
        "column": 5,
        "columnSpan": 4,
        "module": {},
        "properties": { "showHeader": false, "showFooter": false },
        "elements": [
            {
                "id": "",
                "column": 5,
                "columnSpan": 4,
                "module": { "name": 'Image', "path": 'scom-image', "category": 'widgets', "disableClicked": true },
                "properties": { "showHeader": false, "showFooter": false },
                "tag": {
                    "width": "100%",
                    "height": 'auto'
                }
            },
            {
                "id": "",
                "column": 5,
                "columnSpan": 4,
                "module": { "name": 'Text box', "path": 'scom-markdown-editor', "category": 'widgets' },
                "properties": { "showHeader": false, "showFooter": false }
            }
        ],
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    },
    {
        "id": "",
        "column": 9,
        "columnSpan": 4,
        "module": {},
        "properties": { "showHeader": false, "showFooter": false },
        "elements": [
            {
                "id": "",
                "column": 9,
                "columnSpan": 4,
                "module": { "name": 'Image', "path": 'scom-image', "category": 'widgets', "disableClicked": true },
                "properties": { "showHeader": false, "showFooter": false },
                "tag": {
                    "width": "100%",
                    "height": 'auto'
                }
            },
            {
                "id": "",
                "column": 9,
                "columnSpan": 4,
                "module": { "name": 'Text box', "path": 'scom-markdown-editor', "category": 'widgets' },
                "properties": { "showHeader": false, "showFooter": false }
            }
        ],
        "tag": {
            "width": "100%",
            "height": 'auto'
        }
    }
]

export const layouts = {
    "oneWidget": {
        "emptySection": emptySection,
        "title": title,
        "titleWithText": titleWithText,
        "titleWithButton": titleWithButton,
        "titleWithBulletPoint": titleWithBulletPoint,
        "titleWithTaskList": titleWithTaskList
    },
    "twoWidgets": {
        "accentLeft": accentLeft,
        "accentRight": accentRight,
        "twoImageColumn": twoImageColumn
    },
    "multipleWidgets": {
        "threeImageColumn": threeImageColumn
    }
}