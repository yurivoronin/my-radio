import { IStation } from './station';
import { IMetadata } from './metadata';
import { IMetadataLoader } from './metadata-loader';
import { IState } from './state';

const STATE_CHANGED_EVENT = 'player_state_changed';
const METADATA_CHANGED_EVENT = 'player_metadata_changed';

export class Player {
    private current: number = null;
    private playing = false;

    private metadata: { [key: number]: IMetadata } = {};
    private metadataMap: { [key: string]: number } = {};

    constructor(
        private audioElement: HTMLAudioElement,
        private stations: IStation[],
        private metadataLoader: IMetadataLoader
    ) {
        audioElement.addEventListener('pause', () => this.pauseInternal());
        audioElement.addEventListener('play', () => this.playInternal());

        stations.map((station, id) => { if (station.title) { this.metadataMap[station.title.url] = id; } });

        metadataLoader.onLoad((metadata, url) => this.updateMetadata(metadata, url));
    }

    play(id: number) {
        if (this.playing) {
            this.audioElement.pause();
        }

        if (this.current !== id) {
            this.audioElement.src = this.stations[id].url;
            this.current = id;
        }

        this.audioElement.load();
        this.audioElement.play();
    }

    stop() {
        this.audioElement.pause();
    }

    toggle(id: number) {
        console.log('toggle', this.current, id);
        if (!this.playing || this.current !== id) {
            this.play(id);
        } else {
            this.stop();
        }
    }

    onStateChanged = (action: (state: IState) => void) => this.subscribe(STATE_CHANGED_EVENT, action);

    onMetadataChanged = (action: (metadata: { [key: number]: IMetadata }) => void) => this.subscribe(METADATA_CHANGED_EVENT, action);

    private playInternal() {
        this.playing = true;

        const { current, playing } = this;

        const metadataSource = this.stations[current].title;

        if (metadataSource) {
            this.metadataLoader.start(metadataSource);
        } else {
            this.metadataLoader.stop();
        }

        this.notice<IState>(STATE_CHANGED_EVENT, { current, playing });
    }

    private pauseInternal() {
        this.playing = false;
        this.metadataLoader.stop();

        const { current, playing } = this;

        this.notice<IState>(STATE_CHANGED_EVENT, { current, playing });
    }

    private updateMetadata(metadata: IMetadata, url: string) {
        this.metadata = { ...this.metadata, [this.metadataMap[url]] : metadata };

        this.notice(METADATA_CHANGED_EVENT, this.metadata);
    }

    private subscribe<T>(type: string, action: (data: T) => void) {
        this.audioElement.addEventListener(type, (e: CustomEvent<T>) => action(e.detail));
    }

    private notice<T>(type: string, detail: T = null) {
        const event = new CustomEvent<T>(type, { detail });
        this.audioElement.dispatchEvent(event);
    }
}

