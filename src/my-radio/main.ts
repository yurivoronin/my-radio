
import { IStation } from './app/player/station';

import { DOCUMENT, isMobile } from './app/utils';
import { App } from './app/app';

const loadData = async () => {
  const response = await fetch('data.json');
  const data = await response.json() as { stations: IStation[] };

  return data;
};

const bootstrap = async () => {
  const equalizer = !isMobile();

  const { stations } = await loadData();

  const app = new App(DOCUMENT.body, { stations, equalizer });

  app.init();
};

bootstrap();
