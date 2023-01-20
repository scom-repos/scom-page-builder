import {
    Module,
    Panel,
    Label,
    Icon,
    customElements,
    ControlElement,
    IconName,
    Styles
} from '@ijstech/components';
import "./moduleCard.css"
import {assignAttr} from "@page/utility";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['scpage-category-card']: CategoryCardElement;
        }
    }
}

export interface CategoryCardElement extends ControlElement {
    data: ICategoryData;
}

export interface ICategoryData {
    name: string;
    idx: string;
    icon: string;
    count: number;
}

const Theme = Styles.Theme.ThemeVars;

@customElements('scpage-category-card')
export class CategoryCard extends Module {
    private pnlCategoryCard: Panel;
    private iconCategory: Icon;
    private lbCategoryName: Label;
    private lbCategoryCount: Label;
    data: ICategoryData;

    async init() {
        super.init();
        assignAttr(this);
        if(this.data) {
            this.iconCategory.name = (this.data.icon as IconName);
            this.lbCategoryName.caption = this.data.name;
            this.lbCategoryCount.caption = this.data.count.toString();
        }
    }

    render() {
        return (
            <i-panel id={"pnlCategoryCard"} class={"category-card pointer"} margin={{bottom: 15}} border={{radius: 5, width: 1, style: "solid", color: "#CCC"}} padding={{top: 5, bottom: 5, left: 5, right: 5}}>
                <i-hstack justifyContent={"space-between"} alignItems={"center"} >
                    <i-icon id={"iconCategory"} width={18} height={18} fill={Theme.text.primary}></i-icon>
                    <i-label id={"lbCategoryName"}></i-label>
                    <i-label id={"lbCategoryCount"} border={{radius: 50}} font={{color: Theme.text.primary}} padding={{top: 5, bottom: 5, left: 9, right: 9}}></i-label>
                </i-hstack>
            </i-panel>
        );
    }
}
