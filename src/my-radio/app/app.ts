import { IStation } from './player/station';
import { MetadataLoader } from './player/metadata-loader';
import { Player } from './player/player';
import { FrequencyProvider } from './visualisation/frequency-provider';

import { AppView } from './app.vew';
import { Equalizer } from './visualisation/equalizer';

export class App {
    private player: Player;
    private view: AppView;
    private frequencyProvider: FrequencyProvider;
    private equalizer: Equalizer;

    constructor(private container: HTMLElement, stations: IStation[]) {
        this.view = new AppView(stations);

        const metadataLoader = new MetadataLoader();
        this.player = new Player(this.view.audio, stations, metadataLoader);

        this.frequencyProvider = new FrequencyProvider(this.view.audio);

        this.equalizer = new Equalizer(this.view.equalizer, this.frequencyProvider);
    }

    init() {
        this.view.render(this.container);

        this.view.onToggle(id => this.player.toggle(id));

        this.player.onStateChanged(state => this.view.setState(state));
        this.player.onStateChanged(state => this.frequencyProvider.init());
        this.player.onMetadataChanged(metadata => this.view.setMetadata(metadata));
    }
}
