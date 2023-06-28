import { Container, customModule, Module } from "@ijstech/components";
import Editor, { IOnFetchComponentsOptions } from '@scom/scom-page-builder';

@customModule
export class MainModule extends Module {
  private pageBuilder: Editor;
  private _components: any;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this._components = [
      {
        "title": "Text box",
        "name": "scom-markdown-editor",
        "path": "https://ipfs.scom.dev/ipfs/bafybeieycyk24ssgsnfaanjfxg2kpmceu6cwrtf3cje4jwio2ldpl4o4hu/dist/index.js",
        "category": "composables"
      },
      {
        "title": "Image",
        "name": "scom-image",
        "category": "composables",
        "disableClicked": true
      },
      {
        "title": "Carousel",
        "name": "scom-carousel",
        "category": "composables"
      },
      {
        "title": "Banner",
        "name": "scom-banner",
        "category": "composables"
      },
      {
        "title": "Blog",
        "name": "scom-blog",
        "category": "composables",
        "disableClicked": true
      },
      {
        "title": "NFT Minter DApp",
        "name": "scom-nft-minter",
        "category": "micro-dapps"
      },
      {
        "title": "Gem Token DApp",
        "name": "scom-gem-token",
        "category": "micro-dapps"
      },
      {
        "title": "Randomizer",
        "name": "scom-randomizer",
        "category": "micro-dapps"
      },
      {
        "title": "Video",
        "name": "scom-video",
        "category": "micro-dapps",
        "disableClicked": true,
        "shownBackdrop": true
      },
      {
        "title": "Map",
        "name": "scom-map",
        "category": "micro-dapps",
        "disableClicked": true,
        "shownBackdrop": true
      },
      {
        "title": "Dune Blocks",
        "name": "scom-dune",
        "category": "project-micro-dapps"
      }
    ]
  }

  onGetData() {
    console.log(this.pageBuilder.getData()?.sections)
  }

  private async onFetchComponentsFn(options: IOnFetchComponentsOptions) {
    const { category, pageNumber, pageSize, keyword = '' } = options;
    let filteredComponents = [...this._components];
    let total  = 0;
    if (category) {
      filteredComponents = filteredComponents.filter(cp => cp.category === category);
    }
    if (keyword) {
      filteredComponents = filteredComponents.filter(cp => cp.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    total = filteredComponents.length;
    if (pageSize && pageNumber) {
      const itemStart = (pageNumber - 1) * pageSize;
      const itemEnd = itemStart + pageSize;
      filteredComponents = filteredComponents.slice(itemStart, itemEnd);
    }
    return { items: filteredComponents, total };
  }

  init() {
    super.init();

    const data: any = {
      "sections": [
        {
          "id": "6876b0ab-a29c-4ed8-905e-51cd515fa26c",
          "row": 1,
          "elements": [
            {
              "id": "ff69df4f-ebb0-4446-adde-9bcb8a07f25d",
              "column": 1,
              "columnSpan": 12,
              "type": "composite",
              "properties": {
                "url": "https://placehold.co/600x400.png",
                "showHeader": false,
                "showFooter": false
              },
              "module": {},
              "tag": {
                "width": 257,
                "height": 257
              },
              "elements": [
                {
                  "id": "da140da9-9701-4928-b0fd-c5af250d5817",
                  "column": 1,
                  "columnSpan": 8,
                  "type": "primitive",
                  "properties": {
                    "url": "https://placehold.co/600x400.png",
                    "showHeader": false,
                    "showFooter": false
                  },
                  "module": {
                    "title": "Image",
                    "name": "scom-image",
                    "category": "composables",
                    "disableClicked": true
                  },
                  "tag": {
                    "width": 708,
                    "height": 269
                  }
                },
                {
                  "id": "cd074331-8ffb-444d-8159-d662d7b0e424",
                  "column": 4,
                  "columnSpan": 9,
                  "type": "primitive",
                  "properties": {
                    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac est sit amet urna consectetur semper. Curabitur posuere justo et nibh gravida, non tristique urna fringilla. Vestibulum id velit sed nisl tincidunt aliquet. Morbi viverra sapien eu purus venenatis, vitae vestibulum odio bibendum. Fusce volutpat gravida velit, id efficitur erat luctus id. Nullam malesuada hendrerit orci, a pretium tortor facilisis non. Sed euismod euismod felis. Nunc rhoncus diam in mi placerat efficitur. Aenean pulvinar neque ac nisl consequat, non lacinia lectus dapibus. Phasellus sagittis sagittis massa a luctus. Etiam auctor semper ullamcorper. Suspendisse potenti."
                  },
                  "module": {
                    "title": "Text Box",
                    "name": "scom-markdown-editor",
                    "category": "composables"
                  },
                  "tag": {
                    "width": 803,
                    "height": 257
                  }
                }
              ]
            }
          ]
        }
      ],
      "footer": {
        "image": "",
        "elements": []
      }
    }
    this.pageBuilder.setData(data);
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-button
          caption="Get data"
          margin={{top: '1rem', left: '1rem', bottom: '1rem'}}
          padding={{top: '0.5rem', left: '1rem', bottom: '0.5rem', right: '1rem'}}
          font={{color: '#fff'}}
          onClick={() => this.onGetData()}
        ></i-button>
        <i-scom-page-builder
          id="pageBuilder"
          onFetchComponents={this.onFetchComponentsFn.bind(this)}
        ></i-scom-page-builder>
      </i-panel>
    )
  }
}