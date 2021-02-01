import { IStation } from './player/station';
import { createHTMLElement, createSVGElement } from './utils';
import { IMetadata } from './player/metadata';
import { IState } from './player/state';

const LIST_CLASS = 'list';
const STATION_NAME_CLASS = 'station';
const TITLE_CLASS = 'title';
const SONG_CLASS = 'song';
const ARTIST_CLASS = 'artist';
const EQUALIZER_CONTAINER_CLASS = 'equalizer-container';
const EQUALIZER_CLASS = 'equalizer';

const ACTIVE_CLASS = 'active';

const A_TAG = 'a';
const AUDIO_TAG = 'audio';
const DIV_TAG = 'div';
const LI_TAG = 'li';
const SPAN_TAG = 'span';
const SVG_TAG = 'svg';
const UL_TAG = 'ul';

export class AppView {
    readonly audio = createHTMLElement<HTMLAudioElement>(AUDIO_TAG, null, { crossorigin: 'anonymous' });

    readonly equalizerContainer: HTMLDivElement;
    readonly equalizer: SVGElement;

    private list = createHTMLElement<HTMLUListElement>(UL_TAG, null, { class: LIST_CLASS });

    private ids = [];
    private items: { [key: number]: HTMLLIElement } = {};
    private meta: { [key: number]: { song: HTMLSpanElement, artist: HTMLSpanElement } } = {};

    private onItemClick: (id: number) => void = () => { };

    constructor(stations: IStation[], equalizer: boolean) {
        stations.forEach((station, id) => this.list.appendChild(this.createItem(station, id)));

        if (equalizer) {
            this.equalizerContainer = createHTMLElement<HTMLDivElement>(DIV_TAG, null, { class: EQUALIZER_CONTAINER_CLASS });
            this.equalizer = createSVGElement(SVG_TAG, null, { class: EQUALIZER_CLASS });
            this.equalizerContainer.appendChild(this.equalizer);
        }
    }

    render(container: HTMLElement) {
        container.appendChild(this.audio);

        if (this.equalizerContainer) {
            container.appendChild(this.equalizerContainer);
        }

        container.appendChild(this.list);
    }

    onToggle(action: (id: number) => void) {
        this.onItemClick = action;
    }

    setState({ current, playing }: IState): void {
        this.ids.forEach(id => {
            const item = this.items[id];

            if (playing && current === id) {
                item.classList.add(ACTIVE_CLASS);
            } else {
                item.classList.remove(ACTIVE_CLASS);
            }
        });
    }

    setMetadata(metadata: { [key: number]: IMetadata; }): void {
        this.ids.forEach(id => {
            const data = metadata[id] || {} as IMetadata;
            const meta = this.meta[id];

            this.setMeta(meta.song, data.song);
            this.setMeta(meta.artist, data.artist);
        });
    }

    private setMeta($element: HTMLSpanElement, value: string) {
        if (value) {
            $element.classList.add(ACTIVE_CLASS);
        } else {
            $element.classList.remove(ACTIVE_CLASS);
        }

        $element.textContent = value;
    }

    private createItem(station: IStation, id: number): HTMLLIElement {
        const item = createHTMLElement<HTMLLIElement>(LI_TAG);
        const link = createHTMLElement<HTMLAnchorElement>(A_TAG, item);
        const name = createHTMLElement<HTMLSpanElement>(SPAN_TAG, link, { class: STATION_NAME_CLASS });
        const title = createHTMLElement<HTMLSpanElement>(SPAN_TAG, link, { class: TITLE_CLASS });
        const song = createHTMLElement<HTMLSpanElement>(SPAN_TAG, title, { class: SONG_CLASS });
        const artist = createHTMLElement<HTMLSpanElement>(SPAN_TAG, title, { class: ARTIST_CLASS });

        name.textContent = station.name;

        this.ids.push(id);
        this.items[id] = item;
        this.meta[id] = { song, artist };

        link.addEventListener('click', () => this.onItemClick(id));

        return item;
    }
}
