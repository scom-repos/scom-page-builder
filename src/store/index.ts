import { Styles, application } from "@ijstech/components";
import { IPageHeader, IPageSection, IPageFooter, IPageElement, IPageBlockData, IElementConfig, IOnFetchComponentsResult, IOnFetchComponentsOptions, ICategory, ThemeType, IPageConfig } from "../interface/index";
import { EVENT } from '../const/index';

const lightTheme = Styles.Theme.defaultTheme;
const darkTheme = Styles.Theme.darkTheme;
const MAX_COLUMN = 12;

export class PageObject {
  private _header: IPageHeader = {
    headerType: 'banner' as any,
    image: "",
    elements: []
  };
  private _sections: IPageSection[] = []; // Map<string, IPageSection> = new Map();
  private _footer: IPageFooter = {
    image: "",
    elements: []
  };
  private _config: IPageConfig;

  set header(value: IPageHeader) {
    this._header = value;
  }
  get header() {
    return this._header;
  }

  set sections(value: IPageSection[]) {
    this._sections = value || [];
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }
  get sections(): IPageSection[] {
    return this._sections || [];
  }

  set footer(value: IPageFooter) {
    this._footer = value;
  }
  get footer() {
    return this._footer;
  }

  set config(value: IPageConfig) {
    this._config = value;
  }
  get config() {
    return this._config;
  }

  getNonNullSections(): IPageSection[] {
    const hasData = (el: IPageElement) => Object.keys(el.module || {}).length || el.elements?.length;
      return this._sections.filter(section => {
        const hasElements = !!section.elements?.length;
        if (hasElements) {
            const elements = [...section.elements].filter(hasData);
            section.elements = elements;
        }
        return !!section.elements.length;
      })
  }

  addSection(value: IPageSection, index?: number) {
    if (typeof index === 'number' && index >= 0)
      this._sections.splice(index, 0, value);
    else
      this._sections.push(value);
      application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  removeSection(id: string) {
    const sectionIndex = this._sections.findIndex(section => section.id === id);
    if (sectionIndex !== -1) this._sections.splice(sectionIndex, 1);
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  getSection(id: string) {
    return this._sections.find(section => section.id === id);
  }

  updateSection(id: string, data: any) {
    const section = this.getRow(id);
    console.log('[index.ts] updateSection', section, id, data);
    if (!section) return;
    if (data?.config) section.config = data.config;
    // const oldColumnsNumber = this.getColumnsNumber(id);
    // const elements = this.getRow(id)?.elements || [];
    // const newColumnsNumber = this.getColumnsNumberFn(section);
    // if (oldColumnsNumber !== newColumnsNumber) {
    //   for (let element of elements) {
    //     const oldColumnSpan = element.columnSpan;
    //     const oldColumn = element.column;
    //     const newColumnSpan = Math.floor(newColumnsNumber / oldColumnsNumber * oldColumnSpan);
    //     const newColumn = Math.ceil(newColumnsNumber / oldColumnsNumber * oldColumn);
    //     this.setElement(id, element.id, { column: newColumn, columnSpan: newColumnSpan });
    //   }
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
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
      application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  addRow(data: any, id?: string, index?: number) {
    if (id === 'header')
      this.header = data;
    else if (id === 'footer')
      this.footer = data;
    else
      this.addSection(data, index);
      application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  setRow(data: any, rowId: string) {
    const currData = pageObject.getRow(rowId);
    pageObject.removeRow((currData as IPageSection).id);
    pageObject.addRow(data, data.id, data.row);
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  private findElement(elements: IPageElement[], elementId: string, findLeafOnly: boolean = false) {
    if (!elements || !elements.length) return null;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element && element.id === elementId) {
        if (findLeafOnly && element.elements){
          const elm = this.findElement(element.elements, elementId, findLeafOnly);
          if (elm) return elm;
        } else
          return element;
      } else if (element?.elements?.length) {
        const elm = this.findElement(element.elements, elementId, findLeafOnly);
        if (elm) return elm;
      }
    }
    return null;
  }

  getElement(sectionId: string, elementId: string, getLeafOnly: boolean = false) {
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
    const elm = this.findElement(section.elements, elementId, getLeafOnly);
    return elm
  }

  setElement(sectionId: string, elementId: string, value: any) {
    let elm = this.getElement(sectionId, elementId);
    if (!elm) return;
    if (value.properties !== undefined) elm.properties = value.properties;
    if (value.columnSpan !== undefined  && value.columnSpan !== elm.columnSpan)
      elm.columnSpan = value.columnSpan;
    if (value.tag !== undefined) elm.tag = value.tag;
    // if (value.type !== undefined && elm.type !== value.type) {
    //   if (value.dropId) this.removeElement(sectionId, value.dropId);
    //   if (value.type === 'primitive') {
    //     elm.type = value.type;
    //     elm.module = value.elements?.[0] || {};
    //     elm.elements = [];
    //   } else if (value.type === 'composite') {
    //     const oldValue = JSON.parse(JSON.stringify(elm));
    //     // oldValue.id = generateUUID();
    //     elm.elements = [oldValue];
    //     elm.module = {};
    //     elm.type = value.type;
    //   }
    // }
    if (value.dropId) this.removeElement(sectionId, value.dropId, true);
    if (value.module !== undefined) {
      elm.module = value.module;
      // if (Object.keys(value.module).length && elm.elements)
      //   elm.elements = [];
    }
    if (value.elements !== undefined) {
      elm.elements = value.elements;
      if (value.elements?.length) elm.module = {};
    }
    if (value.column !== undefined && value.column !== elm.column) {
      elm.column = value.column;
      // For automatic
      // const section = this.getRow(sectionId);
      // if (section?.elements) section.elements = this.sortFn([...section.elements]);
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  private sortFn(elements: IPageElement[]) {
    return [...elements].sort((a: IPageElement, b: IPageElement) => Number(a.column) - Number(b.column));
  }

  private removeElementFn(elements: IPageElement[], elementId: string, removeLeafOnly: boolean = false) {
    if (!elements || !elements.length) return;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element && element.id === elementId) {
        if (removeLeafOnly && element?.elements?.length)
          this.removeElementFn(element.elements, elementId, removeLeafOnly);
        else {
          elements = elements.splice(i, 1);
          break;
        }
      } else if (element?.elements?.length) {
        this.removeElementFn(element.elements, elementId, removeLeafOnly);
      }
    }
  }

  removeElement(sectionId: string, elementId: string, removeLeafOnly: boolean = false) {
    let elements = [];
    if (sectionId === 'header') {
      elements = this._header.elements;
    } else if (sectionId === 'footer') {
      elements = this._footer.elements;
    } else {
      const section = this.getSection(sectionId);
      elements = section?.elements || [];
    }
    this.removeElementFn(elements, elementId, removeLeafOnly);
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
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
        section.elements = this.sortFn([...section.elements]);
      } else {
        const parentElement = section.elements.find(elm => elm.id === parentElmId);
        if (parentElement) {
          if (typeof elementIndex === 'number' && elementIndex !== -1) {
            parentElement.elements.splice(elementIndex, 0, value);
          }
          else
            parentElement.elements.push(value);
        }
      }
    }
    application.EventBus.dispatch(EVENT.ON_UPDATE_MENU);
  }

  getRowConfig(sectionId: string) {
    const section = this.getRow(sectionId);
    return section?.config;
  }

  getColumnsNumber(sectionId: string) {
    return MAX_COLUMN
    // if (!sectionId) return MAX_COLUMN;
    // const section = this.getRow(sectionId);
    // return this.getColumnsNumberFn(section);
  }

  // private getColumnsNumberFn(section: IPageSection|IPageFooter) {
  //   if (!section) return MAX_COLUMN;
  //   const { columnsNumber, columnLayout } = section?.config || {};
  //   return (columnLayout === 'Fixed' && columnsNumber) ? columnsNumber : MAX_COLUMN;
  // }
}

export const pageObject = new PageObject();

const defaultSearchOptions = {
  category: undefined,
  pageNumber: undefined,
  pageSize: undefined
}

const defaultPageConfig = {
  backgroundColor: '',
  margin: {x: 'auto', y: '0'},
  sectionWidth: 1024
}

export const state = {
  pageBlocks: [],
  rootDir: '',
  dragData: null,
  searchData: {
    items: [],
    total: 0
  } as IOnFetchComponentsResult,
  searchOptions: defaultSearchOptions as IOnFetchComponentsOptions,
  categories: [
    {
      id: 'widgets',
      title: 'Widgets',
      icon: 'shapes'
    },
    {
      id: 'micro-dapps',
      title: 'MicroDApps',
      icon: 'window-maximize'
    },
    {
      id: 'charts',
      title: 'Charts',
      icon: 'chart-pie'
    },
    {
      id: 'project-widgets',
      title: 'Project Widgets',
      icon: 'hashtag'
    }
  ] as ICategory[],
  theme: 'light' as ThemeType,
  defaultPageConfig: null
}

export const setPageBlocks = (value: IPageBlockData[]) => {
  state.pageBlocks = value || [];
}

export const getPageBlocks = () => {
  return state.pageBlocks || [];
}

export const addPageBlock = (value: IPageBlockData) => {
  const hasPageblock = state.pageBlocks.find(item => item.path === value.path);
  if (!hasPageblock) state.pageBlocks.push(value);
}

export const setRootDir = (value: string) => {
  state.rootDir = value || '';
}

export const getRootDir = () => {
  return state.rootDir;
}

export const setDragData = (value: IElementConfig | null) => {
  state.dragData = value;
}

export const getDragData = () => {
  return state.dragData || null;
}

export const setSearchData = (value: IOnFetchComponentsResult) => {
  state.searchData = value;
}

export const getSearchData = () => {
  return state.searchData || {};
}

export const setSearchOptions = (value: IOnFetchComponentsOptions) => {
  state.searchOptions = value || defaultSearchOptions;
}

export const getSearchOptions = () => {
  return state.searchOptions || defaultSearchOptions;
}

export const getCategories = () => {
  return state.categories || [];
}

export const setCategories = (value: ICategory[]) => {
  state.categories = value || [];
}

export const setTheme = (value: ThemeType) => {
  state.theme = value ?? 'light';
}

export const getTheme = (): ThemeType => {
  return state.theme ?? 'light';
}

export const getBackgroundColor = (theme?: ThemeType) => {
  theme = theme ?? getTheme();
  return theme === 'light' ? lightTheme.background.main : darkTheme.background.main;
}

export const getFontColor = (theme?: ThemeType) => {
  theme = theme ?? getTheme();
  return theme === 'light' ? lightTheme.text.primary : darkTheme.text.primary;
}

export const getDivider = (theme?: ThemeType) => {
  theme = theme ?? getTheme();
  return theme === 'light' ? lightTheme.divider : darkTheme.divider;
}

export const setDefaultPageConfig = (value: IPageConfig) => {
  state.defaultPageConfig = {...defaultPageConfig, backgroundColor: getBackgroundColor(), textColor: getFontColor(), ...(value || {})};
}

export const getDefaultPageConfig = (): IPageConfig => {
  const defaultValue = {...defaultPageConfig, backgroundColor: getBackgroundColor(), textColor: getFontColor() };
  return state.defaultPageConfig || defaultValue;
}

export const getPageConfig = () => {
  const defaultConfig = getDefaultPageConfig();
  const pageConfig = pageObject?.config || {};
  pageConfig.margin = {...defaultConfig.margin, ...pageConfig.margin};
  return {...defaultConfig, ...pageConfig};
}

export const getMargin = (margin: { x?: number|string, y?: number|string }) => {
  const { margin: defaultMargin } = getDefaultPageConfig();
  let { x, y } = margin || {};
  x = x ?? defaultMargin.x;
  y = y ?? defaultMargin.y;
  const xNumber = Number(x);
  const yNumber = Number(y);
  x = isNaN(xNumber) ? x : xNumber + 'px';
  y = isNaN(yNumber) ? y : yNumber + 'px';
  return {
    top: y,
    left: x,
    right: x,
    bottom: y
  }
}

