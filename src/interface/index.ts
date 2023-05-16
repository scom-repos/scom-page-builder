import {IMenu, INetwork, IRoute, ITheme, ISCConfig, IBreakpoints} from './core';
import { IPageBlockData } from './pageBlock';
import { ElementType } from './siteData';

export {
  IMenu,
  INetwork,
  IRoute,
  ITheme,
  ISCConfig,
  IBreakpoints
};

export * from './pageBlock';
export * from './component';
export * from './siteData';
export * from './jsonSchema';
export enum ELEMENT_NAME {
  TEXTBOX = "Text Box",
  IMAGE = "Image",
  NFT = "NFT Minter Dapp",
  GEM_TOKEN = "Gem Token Dapp",
  RANDOMIZER = "Randomizer",
  VIDEO = "Video",
  CAROUSEL = "Carousel",
  MAP = "Map",
  BANNER = "Banner",
  BLOG = "Blog",
  CONTENT_BLOCK = "Content Block"
}
export interface IElementConfig {
  module: IPageBlockData;
  type: ElementType;
  prependId?: string;
  appendId?: string;
}