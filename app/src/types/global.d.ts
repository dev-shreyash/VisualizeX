// src/types/global.d.ts
declare namespace NodeJS {
    interface Global {
      _fetchServerStatusInitialized?: boolean;
    }
  }
  
  declare const global: NodeJS.Global;
  