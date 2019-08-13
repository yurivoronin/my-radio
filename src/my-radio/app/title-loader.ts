import { ITitleData } from './title-data';
import { ITitle } from './title';

export class TitleLoader {
  load = ({ url, artist, song, alt }: ITitleData): Promise<ITitle> =>
    fetch(url, { mode: 'cors' })
      .then(response => response.json())
      .then(data => {
        if (!data) { return null; }

        let title = this.get(data, artist);
        let subtitle = this.get(data, song);

        if (!(title && subtitle)) {
          const value = this.get(data, alt);
          const values = (value || '').split(' - ');

          [title, subtitle] = values.length === 2 ? values : [value, null];
        }

        return { title, subtitle };
      })
      .catch(_ => null)

  private get(data: object, path: string) {
    let value: object | string = data;

    for (const part of path.split('.')) {
      value = value[part];

      if (!value) { return null; }
    }

    return value as string;
  }
}
