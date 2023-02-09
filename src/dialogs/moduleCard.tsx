import {
    Module,
    Panel,
    Label,
    customElements,
    ControlElement
} from '@ijstech/components';
import "./moduleCard.css"
import {assignAttr} from "../utility/index";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-module-card']: ModuleCardElement;
        }
    }
}

export interface ModuleCardElement extends ControlElement {
    data: IPageBlockData;
}

export interface IPageBlockData {
    name: string;
    description: string;
    ipfscid: string;
    imgUrl: string;
    category: {
        icon: string;
        idx: string;
        name: string;
    }[];
    chainId: number;
    packageId: number;
    projectId: number;
    local?: boolean;
    localPath?: string;
    dependencies?: any;
}

@customElements('scpage-module-card')
export class ModuleCard extends Module {
    private pnlModuleCard: Panel;
    private lbModuleName: Label;
    private lbDescription: Label;
    data: IPageBlockData;
    ipfscid: string;

    async init() {
        super.init();
        assignAttr(this);
        if(this.data) {
            this.lbModuleName.caption = this.data.name;
            this.lbDescription.caption = this.data.description;
            this.ipfscid = this.data.ipfscid;
        }
    }

    render() {
        return (
            <i-panel id={"pnlModuleCard"} class={"module-card pointer"} margin={{bottom: 15}}>
                <i-panel class={"module-card-header"}>
                    <i-panel class={"module-card-header-title"}>
                        <i-label id={"lbModuleName"} font={{bold: true}}></i-label>
                    </i-panel>
                </i-panel>
                <i-panel class={"module-card-body"}>
                    <i-label id={"lbDescription"}></i-label>
                </i-panel>
            </i-panel>
        );
    }
}
