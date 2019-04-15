
import { Player } from './app/player';
import { IStation } from './app/station';

import { DOCUMENT } from './app/utils';

const bootstrap = async () => {
  const response = await fetch('data.json');
  const data = await response.json() as { stations: IStation[] };

  return new Player(DOCUMENT.body, data.stations);
};

bootstrap();
