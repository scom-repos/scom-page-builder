import {IMenu, INetwork, IRoute, ITheme, ISCConfig, IBreakpoints} from './core';

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
  TEXTBOX = "Text box",
  IMAGE = "Image",
  NFT = "NFT Minter Dapp",
  GEM_TOKEN = "Gem Token Dapp",
  RANDOMIZER = "Randomizer",
  VIDEO = "Video",
  CAROUSEL = "Carousel",
  MAP = "Map"
}
