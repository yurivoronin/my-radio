import { IStation } from './station';

import { createHTMLElement } from './utils';
import { ITitleData } from './title-data';
import { TitleLoader } from './title-loader';
import { Visualizer } from './visualizer';

const LIST_CLASS = 'list';
const ACTIVE_CLASS = 'active';
const STATION_NAME_CLASS = 'station';
const TITLES_CLASS = 'titles';
const TITLE_CLASS = 'title';
const SUBTITLE_CLASS = 'subtitle';

const AUDIO_TAG = 'audio';
const UL_TAG = 'ul';
const LI_TAG = 'li';
const A_TAG = 'a';
const SPAN_TAG = 'span';

export class Player {

  private $audio: HTMLAudioElement;
  private $current = null;
  private url = null;

  private titleLoader = new TitleLoader();
  private titleTimer;
  private titles = new Map<string, { $title: HTMLSpanElement, $subtitle: HTMLSpanElement }>();

  private $background;
  private visualizer: Visualizer;

  constructor($container: HTMLElement, stations: IStation[]) {
    this.$audio = createHTMLElement<HTMLAudioElement>(AUDIO_TAG, $container, { crossorigin: 'anonymous' });
    const $list = createHTMLElement<HTMLUListElement>(UL_TAG, $container, { class: LIST_CLASS });

    stations.forEach(station => $list.appendChild(this.createItem(station)));

    this.visualizer = new Visualizer(this.$audio);
    this.$background = this.visualizer.container;
  }

  private createItem(station: IStation): HTMLLIElement {
    const $item = createHTMLElement<HTMLLIElement>(LI_TAG);
    const $link = createHTMLElement<HTMLAnchorElement>(A_TAG, $item);
    const $name = createHTMLElement<HTMLSpanElement>(SPAN_TAG, $link, { class: STATION_NAME_CLASS });
    const $titles = createHTMLElement<HTMLSpanElement>(SPAN_TAG, $link, { class: TITLES_CLASS });
    const $title = createHTMLElement<HTMLSpanElement>(SPAN_TAG, $titles, { class: TITLE_CLASS });
    const $subtitle = createHTMLElement<HTMLSpanElement>(SPAN_TAG, $titles, { class: SUBTITLE_CLASS });

    $name.textContent = station.name;

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
      this.visualizer.stop();

      this.$current.classList.remove(ACTIVE_CLASS);
      this.$current = null;
      this.url = null;

      this.$audio.pause();

      this.unloadTitle();
    }
  }

  private play($item: HTMLLIElement, url: string, title: ITitleData) {
    $item.prepend(this.$background);
    this.visualizer.play();

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

      this.setTitle($title, data.title);
      this.setTitle($subtitle, data.subtitle);

      this.titleTimer = timer = setTimeout(() => this.loadTitle(url, title), 5e3);
    });
  }

  private setTitle($element: HTMLSpanElement, value: string) {
    if (value) {
      $element.classList.add(ACTIVE_CLASS);
    } else {
      $element.classList.remove(ACTIVE_CLASS);
    }

    $element.textContent = value;
  }
}

