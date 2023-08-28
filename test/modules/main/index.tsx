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
        "name": "Text box",
        "path": "scom-markdown-editor",
        "category": "widgets"
      },
      {
        "name": "Image",
        "path": "scom-image",
        "category": "widgets",
        "disableClicked": true
      },
      {
        "name": "Carousel",
        "path": "scom-carousel",
        "category": "widgets"
      },
      {
        "name": "Banner",
        "path": "scom-banner",
        "category": "widgets"
      },
      {
        "name": "Blog",
        "path": "scom-blog",
        "category": "widgets",
        "disableClicked": true
      },
      {
        "name": "NFT Minter DApp",
        "path": "scom-nft-minter",
        "category": "micro-dapps"
      },
      {
        "name": "Gem Token DApp",
        "path": "scom-gem-token",
        "category": "micro-dapps"
      },
      {
        "name": "Randomizer",
        "path": "scom-randomizer",
        "category": "micro-dapps"
      },
      {
        "name": "Video",
        "path": "scom-video",
        "category": "micro-dapps",
        "disableClicked": true,
        "shownBackdrop": true
      },
      {
        "name": "Map",
        "path": "scom-map",
        "category": "micro-dapps",
        "disableClicked": true,
        "shownBackdrop": true
      },
      {
        "name": "Table",
        "path": "scom-table",
        "category": "charts"
      },
      {
        "name": "Counter",
        "path": "scom-counter",
        "category": "charts"
      },
      {
        "name": "Pie Chart",
        "path": "scom-pie-chart",
        "category": "charts"
      },
      {
        "name": "Bar Chart",
        "path": "scom-bar-chart",
        "category": "charts"
      },
      {
        "name": "Line Chart",
        "path": "scom-line-chart",
        "category": "charts"
      },
      {
        "name": "Area Chart",
        "path": "scom-area-chart",
        "category": "charts"
      },
      {
        "name": "Scatter Chart",
        "path": "scom-scatter-chart",
        "category": "charts"
      },
      {
        "name": "Mixed Chart",
        "path": "scom-mixed-chart",
        "category": "charts"
      }
    ]
  }

  onGetData() {
    console.log(this.pageBuilder.getData())
  }

  private async onFetchComponentsFn(options: IOnFetchComponentsOptions) {
    const { category, pageNumber, pageSize, keyword = '' } = options;
    let filteredComponents = [...this._components];
    let total = 0;
    if (category) {
      filteredComponents = filteredComponents.filter(cp => cp.category === category);
    }
    if (keyword) {
      filteredComponents = filteredComponents.filter(cp => cp.name.toLowerCase().includes(keyword.toLowerCase()));
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
          "row": 0,
          "name": "First section",
          "elements": []
        }
      ],
      "footer": {
        "image": "",
        "elements": []
      },
      config: {
        sectionWidth: 1000
      }
    }
    this.pageBuilder.setData(data);
  }

  render() {
    return (
      <i-panel width="100%" height="100%">
        <i-button
          visible={true}
          position="fixed"
          caption="Get data"
          right="24px"
          margin={{ top: '1rem', left: '1rem' }}
          padding={{ top: '0.5rem', left: '1rem', bottom: '0.5rem', right: '1rem' }}
          font={{ color: '#fff' }}
          zIndex={999}
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
