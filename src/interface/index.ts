import {IMenu, INetwork, IRoute, ITheme, ISCConfig, IBreakpoints} from './core';
import { IPageBlockData } from './pageBlock';

export {
  IMenu,
  INetwork,
  IRoute,
  ITheme,
  ISCConfig,
  IBreakpoints
};

export * from './pageBlock';
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
  // type: ElementType;
  prependId?: string;
  appendId?: string;
}
export const TEXTBOX_PATH = 'scom-markdown-editor';
export const IMAGE_PATH = 'scom-image';
export const GAP_WIDTH = 15;
export const MAX_COLUMN = 12;
export const MIN_COLUMN = 2;
export const PAGE_SIZE = 6;
export type ThemeType = 'dark' | 'light';
