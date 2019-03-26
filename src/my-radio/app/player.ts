import { IStation } from './station';

import { createElement } from './utils';

const ACTIVE_CLASS = 'active';

export class Player {

  private $current = null;
  private url = null;

  constructor(private $audio: HTMLAudioElement, $list: HTMLUListElement, stations: IStation[]) {

    $list.addEventListener('click', (event) => this.onElementClick(event), false);

    for (const { name, url } of stations) {
      const item = createElement('li');
      item.textContent = name;
      item.dataset.url = url;
      $list.appendChild(item);
    }
  }

  private onElementClick(event: MouseEvent): void {
    const $audio = this.$audio;
    const $target = event.target as HTMLLIElement;
    const url = $target.dataset.url;

    if (!url) { return; }

    if (url === this.url) {
      $target.classList.remove(ACTIVE_CLASS);
      this.$current = null;
      this.url = null;

      $audio.pause();
    } else {
      if (this.$current) {
        this.$current.classList.remove(ACTIVE_CLASS);
      }

      $target.classList.add(ACTIVE_CLASS);
      this.$current = $target;
      this.url = url;

      $audio.src = this.url;
      $audio.load();
      $audio.play();
    }
  }
}
