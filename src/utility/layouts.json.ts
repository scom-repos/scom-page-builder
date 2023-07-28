const emptySection: any = []

const accentLeft: any = [
    {
        "id": "",
        "column": 1,
        "columnSpan": 5,
        "module": {
            "name": "Image",
            "path": "scom-image",
            "category": "composables",
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
            "category": "composables"
        },
        "properties": {
            "showFooter": false,
            "showHeader": false
        },
        "tag": {
            "width": "100%",
            "height": 244
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
            "category": "composables"
        },
        "properties": {
            "showFooter": false,
            "showHeader": false
        },
        "tag": {
            "width": "100%",
            "height": 244
        }
    },
    {
        "id": "",
        "column": 8,
        "columnSpan": 5,
        "module": {
            "name": "Image",
            "path": "scom-image",
            "category": "composables",
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

export const layouts = {
    "oneWidget" : {
        "emptySection": emptySection,
    },
    "twoWidgets": {
        "accentLeft": accentLeft,
        "accentRight": accentRight
    },
    "multipleWidgets": {

    }
}