import { IStation } from './station';

import { createElement } from './utils';
import { ITitleData } from './title-data';
import { TitleLoader } from './title-loader';

const ACTIVE_CLASS = 'active';
const TITLES_CLASS = 'titles';
const TITLE_CLASS = 'title';
const SUBTITLE_CLASS = 'subtitle';
const LI_TAG = 'li';
const A_TAG = 'a';
const SPAN_TAG = 'span';

export class Player {

  private $current = null;
  private url = null;

  private titleLoader = new TitleLoader();
  private titleTimer;
  private titles = new Map<string, { $title, $subtitle }>();

  constructor(private $audio: HTMLAudioElement, $list: HTMLUListElement, stations: IStation[]) {
    stations.forEach(station => $list.appendChild(this.createItem(station)));
  }

  private createItem(station: IStation): HTMLLIElement {
    const $item = createElement(LI_TAG) as HTMLLIElement;
    const $link = createElement(A_TAG) as HTMLAnchorElement;
    const $name = createElement(SPAN_TAG) as HTMLSpanElement;
    const $titles = createElement(SPAN_TAG) as HTMLSpanElement;
    const $title = createElement(SPAN_TAG) as HTMLSpanElement;
    const $subtitle = createElement(SPAN_TAG) as HTMLSpanElement;

    $name.textContent = station.name;
    $titles.className = TITLES_CLASS;
    $title.className = TITLE_CLASS;
    $subtitle.className = SUBTITLE_CLASS;

    $item.appendChild($link);
    $link.appendChild($name);
    $link.appendChild($titles);
    $titles.appendChild($title);
    $titles.appendChild($subtitle);

    this.titles.set(station.url, { $title, $subtitle });

    $link.addEventListener('click', () => this.onClick($item, station));

    return $item;
  }

  private onClick($item: HTMLLIElement, { url, title }: IStation): void {
    if (!url) { return; }

    const play = url !== this.url;

    this.stop();

    if (play) {
      this.play($item, url, title);
    }
  }

  private stop() {
    if (this.$current) {
      this.$current.classList.remove(ACTIVE_CLASS);
      this.$current = null;
      this.url = null;

      this.$audio.pause();

      this.unloadTitle();
    }
  }

  private play($item: HTMLLIElement, url: string, title: ITitleData) {
    const $audio = this.$audio;

    $item.classList.add(ACTIVE_CLASS);
    this.$current = $item;
    this.url = url;

    $audio.src = this.url;
    $audio.load();
    $audio.play();

    if (title) {
      this.loadTitle(url, title);
    }
  }

  private unloadTitle() {
    if (this.titleTimer) {
      clearTimeout(this.titleTimer);
      this.titleTimer = null;
    }
  }

  private loadTitle(url: string, title: ITitleData) {
    let timer = this.titleTimer;
    this.titleLoader.load(title).then(data => {
      if (timer && timer !== this.titleTimer) { return; }

      const { $title, $subtitle } = this.titles.get(url);

      data = data || { title: null, subtitle: null };

      $title.textContent = data.title;
      $subtitle.textContent = data.subtitle;

      this.titleTimer = timer = setTimeout(() => this.loadTitle(url, title), 5e3);
    });
  }
}

