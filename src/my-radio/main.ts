
import { IStation } from './app/player/station';

import { DOCUMENT } from './app/utils';
import { App } from './app/app';

const loadData = async () => {
  const response = await fetch('data.json');
  const data = await response.json() as { stations: IStation[] };

  return data;
};

const bootstrap = async () => {
  const { stations } = await loadData();

  const app = new App(DOCUMENT.body, stations);

  app.init();
};

bootstrap();
