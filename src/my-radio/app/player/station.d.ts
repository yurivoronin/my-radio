import { IMetadataSource } from './metadata-source';

export interface IStation {
  
  name: string;

  url: string;
  
  title: IMetadataSource;
}
