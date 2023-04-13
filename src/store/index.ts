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
    value.forEach(val => this._sections.set(val.id, val));
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
    this._sections.delete(id);
  }

  getSection(id: string) {
    return this._sections.get(id) || null;
  }

  updateSection(id: string, data: any) {
    const section = this.getSection(id);
    if (section) {
      if (data.backgroundColor !== undefined) section.backgroundColor = data.backgroundColor;
    }
  }

  getRow(rowId: string) {
    if (rowId === 'header')
      return this.header;
    if (rowId === 'footer')
      return this.footer;
    return rowId ? this.getSection(rowId) : null;
  }

  removeRow(id: string) {
    if (id === 'header')
      this._header.elements = [];
    else if (id === 'footer')
      this._footer.elements = [];
    else
      this.removeSection(id);
  }

  addRow(data: any, id?: string) {
    if (id === 'header')
      this.header = data;
    else if (id === 'footer')
      this.footer = data;
    else
      this.addSection(data);
  }

  private findElement(elements: IPageElement[], elementId: string) {
    if (!elements || !elements.length) return null;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element && element.id === elementId) {
        return element;
      } else if (element && element.type === 'composite') {
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
    if (!elm) return;
    console.log('set elm', sectionId, elementId, value)
    if (value.properties !== undefined) elm.properties = value.properties;
    if (value.column !== undefined) elm.column = value.column;
    if (value.columnSpan !== undefined) elm.columnSpan = value.columnSpan;
    if (value.tag !== undefined) elm.tag = value.tag;
    if (value.type !== undefined && elm.type !== value.type) {
      if (value.type === 'primitive') {
        elm.type = value.type;
        elm.module = value.elements?.[0] || {};
        elm.elements = [];
      } else if (value.type === 'composite') {
        const oldValue = JSON.parse(JSON.stringify(elm));
        oldValue.id = generateUUID();
        elm.elements = [oldValue];
        elm.module = {};
        elm.type = value.type;
      }
    }
    if (value.module !== undefined) elm.module = value.module;
    if (value.elements !== undefined) elm.elements = value.elements;
  }

  private removeElementFn(elements: IPageElement[], elementId: string) {
    if (!elements || !elements.length) return;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element && element.id === elementId) {
        elements.splice(i, 1);
        break;
      } else if (element && element.type === 'composite') {
        this.removeElementFn(element.elements, elementId);
      }
    }
  }

  removeElement(sectionId: string, elementId: string) {
    let elements = [];
    if (sectionId === 'header') {
      elements = this._header.elements;
    } else if (sectionId === 'footer') {
      elements = this._footer.elements;
    } else {
      const section = this.getSection(sectionId);
      elements = section?.elements || [];
    }
    this.removeElementFn(elements, elementId);
  }

  addElement(sectionId: string, value: IPageElement, parentElmId = '', elementIndex?: number) {
    if (sectionId === 'header') {
      this._header.elements.push(value);
    } else if (sectionId === 'footer') {
      this._footer.elements.push(value);
    } else {
      const section = this.getSection(sectionId);
      if (!section) return;
      if (!parentElmId || parentElmId === value.id) {
        section.elements.push(value);
      } else {
        const parentElement = section.elements.find(elm => elm.id === parentElmId);
        if (parentElement) {
          if (typeof elementIndex === 'number' && elementIndex !== -1)
            parentElement.elements.splice(elementIndex, 0, value);
          else
            parentElement.elements.push(value);
        }
      }
    }
  }
}

export const pageObject = new PageObject();

export const state = {
  pageBlocks: [],
  rootDir: ''
}

export const setPageBlocks = (value: IPageBlockData[]) => {
  state.pageBlocks = value || [];
}

export const getPageBlocks = () => {
  return state.pageBlocks || [];
}

export const getDappContainer = () => {
  return (state.pageBlocks || []).find(pageblock => pageblock.path === 'scom-dapp-container');
}

export const setRootDir = (value: string) => {
  state.rootDir = value || '';
}

export const getRootDir = () => {
  return state.rootDir;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
