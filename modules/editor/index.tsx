import { customModule, Container, Module, Styles } from '@ijstech/components';
import { PageHeader, PageRow, PageRows } from '@page/page';
import './index.css';

const Theme = Styles.Theme.ThemeVars;

@customModule
export class Editor extends Module {
    private pageHeader: PageHeader;
    private pageRows: PageRows;

    private renderDefault() {
        this.pageRows.clearInnerHTML();
        const row = new PageRow();
        row.classList.add('page-header');
        row.setData({
            config: {
                width: '100%',
                height: '340px',
                backgroundImageUrl: 'https://ssl.gstatic.com/atari/images/simple-header-blended.png'
            },
            sections: []
        })
        this.pageRows.appendChild(row);
    }

    init() {
        super.init();
        this.renderDefault();
    }

    render() {
        return (
            <i-panel id="editor" width={'100%'} height={'100%'}>
                <ide-header
                    id={'pageHeader'}
                    dock={'top'}
                    border={{ bottom: { width: 1, style: 'solid', color: '#dadce0' } }}
                ></ide-header>
                <i-grid-layout
                    templateColumns={['auto', '400px']}
                    autoFillInHoles={true}
                    dock="fill"
                    height="100%"
                >
                    <i-panel
                        class="main-content"
                        height="100%"
                        overflow={{ y: 'auto' }}
                        background={{ color: Theme.background.default }}
                        border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}
                    >
                        <i-panel
                            id="pageContent"
                            maxWidth={1400}
                            margin={{ left: 'auto', right: 'auto' }}
                            width="100%"
                        >
                            <ide-rows
                                id="pageRows"
                                maxWidth={1280}
                                margin={{top: 8, bottom: 8, left: 60, right: 60}}
                                class="pnl-editor-wrapper"
                            ></ide-rows>
                        </i-panel>
                    </i-panel>
                    <i-panel class="main-sidebar" height="100%" overflow={{ y: 'hidden' }}>
                        <ide-sidebar id={'pageSidebar'} width="100%"></ide-sidebar>
                    </i-panel>
                </i-grid-layout>
            </i-panel>
        );
    }
}
