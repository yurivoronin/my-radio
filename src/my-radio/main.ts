
import { Player } from './app/player';
import { IStation } from './app/station';

import { getElementById } from './app/utils';

const bootstrap = async () => {
  const audio = getElementById('audio') as HTMLAudioElement;
  const list = getElementById('list') as HTMLUListElement;
  const response = await fetch('data.json');
  const data = await response.json() as { stations: IStation[] };
  return new Player(audio, list, data.stations);
};

bootstrap();
