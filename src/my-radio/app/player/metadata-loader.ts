import { IMetadataSource } from './metadata-source';
import { IMetadata } from './metadata';

const getObjectValue = (data: object, path: string) => {
  let value: object | string = data;

  for (const part of path.split('.')) {
    value = value[part];

    if (!value) { return null; }
  }

  return value as string;
};

const parseMetadata = (source: IMetadataSource) =>
  (data: object): IMetadata => {
    if (!data) { return null; }

    let artist = getObjectValue(data, source.artist);
    let song = getObjectValue(data, source.song);

    if (!(artist && song)) {
      const value = getObjectValue(data, source.alt);
      const values = (value || '').split(' - ');

      [artist, song] = values.length === 2 ? values : [value, null];
    }

    return { artist, song };
  };

export interface IMetadataLoader {
  onLoad(action: (metadata: IMetadata, url: string) => void): void;
  start(source: IMetadataSource): void;
  stop(): void;
}

export class MetadataLoader implements IMetadataLoader {
  private onLoadAction: (metadata: any, url: any) => void;
  private timer;

  onLoad = (action: (metadata: any, url: any) => void) => this.onLoadAction = action;

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  async start(source: IMetadataSource) {
    this.stop();
    await this.load(source);
  }

  private get = (source: IMetadataSource): Promise<IMetadata> =>
    fetch(`${source.url}?t=${Date.now()}`)
      .then(response => response.json())
      .then(parseMetadata(source))
      .catch(_ => null)

  private async load(source: IMetadataSource) {
    let timer = this.timer;

    const metadata = await this.get(source) || { artist: null, song: null };

    if (timer && timer !== this.timer) { return; }

    this.onLoadAction(metadata, source.url);

    this.timer = timer = setTimeout(() => this.load(source), 4e3);
  }
}
