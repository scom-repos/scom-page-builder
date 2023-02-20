import { IPageHeader, IPageSection, IPageFooter, IPageElement, IPageBlockData } from "../interface/index";

export class PageObject {
  private _header: IPageHeader = {
    headerType: 'banner' as any,
    image: "",
    elements: []
  };
  private _sections: Map<string, IPageSection> = new Map();
  private _footer: IPageFooter = {
    image: "",
    elements: []
  };

  set header(value: IPageHeader) {
    this._header = value;
  }
  get header() {
    return this._header;
  }

  set sections(value: IPageSection[]) {
    this._sections.clear();
    value.forEach(val => {
      this._sections.set(val.id, val)
    })
  }
  get sections(): IPageSection[] {
    return Array.from(this._sections.values());
  }

  set footer(value: IPageFooter) {
    this._footer = value;
  }
  get footer() {
    return this._footer;
  }

  addSection(value: IPageSection) {
    this._sections.set(value.id, value);
  }

  removeSection(id: string) {
    if (id === 'header')
      this._header.elements = [];
    else if (id === 'footer')
      this._footer.elements = [];
    else
      this._sections.delete(id);
  }

  getSection(id: string) {
    return this._sections.get(id) || null;
  }

  updateSection(id: string, data: any) {
    const section = this.getSection(id);
    if (section) {
      const newRow = data.row ?? section.row;
      section.row = Number(newRow);
    }
  }

  private findElement(elements: IPageElement[], elementId: string) {
    if (!elements || !elements.length) return null;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.id === elementId) {
        return element;
      } else if (element.type === 'composite') {
        const elm = this.findElement(element.elements, elementId);
        if (elm) return elm;
      }
    }
    return null;
  }

  getElement(sectionId: string, elementId: string) {
    if (sectionId === 'header') {
      const elements = pageObject.header?.elements || [];
      return elements[0] || null;
    }
    if (sectionId === 'footer') {
      const elements = pageObject.footer?.elements || [];
      return elements[0] || null;
    }
    const section = this.getSection(sectionId);
    if (!section) return null;
    const elm = this.findElement(section.elements, elementId);
    return elm
  }

  setElement(sectionId: string, elementId: string, value: any) {
    let elm = this.getElement(sectionId, elementId);
    console.log('set elm', sectionId, elementId, value)
    if (elm && value.properties) elm.properties = value.properties;
    if (elm && value.column) elm.column = value.column;
    if (elm && value.columnSpan) elm.columnSpan = value.columnSpan;
    if (elm && value.tag) elm.tag = value.tag;
  }

  removeElement(sectionId: string, elementId: string) {
    if (sectionId === 'header') {
      this._header.elements = [];
    }
    if (sectionId === 'footer') {
      this._footer.elements = [];
    }
    const section = this.getSection(sectionId);
    if (!section) return;
    // TODO: check with composite
    const elementIndex = section.elements.findIndex(elm => elm.id === elementId);
    if (elementIndex !== -1) {
      section.elements.splice(elementIndex, 1);
    }
  }

  addElement(sectionId: string, value: IPageElement) {
    if (sectionId === 'header') {
      this._header.elements = [value];
    }
    if (sectionId === 'footer') {
      this._footer.elements = [value];
    }
    const section = this.getSection(sectionId);
    if (!section) return;
    section.elements.push(value);
  }
}

export const pageObject = new PageObject();

export const state = {
  pageBlocks: []
}

export const setPageBlocks = (value: IPageBlockData[]) => {
  state.pageBlocks = value || [];
}

export const getPageBlocks = () => {
  return state.pageBlocks || [];
}
