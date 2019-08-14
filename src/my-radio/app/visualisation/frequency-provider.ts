const FFT_SIZE = 128;

export class FrequencyProvider {
    private analyser: AnalyserNode;
    private data: Uint8Array;

    private onChangeActions: ((data: Uint8Array) => void)[] = [];

    constructor(private audio: HTMLAudioElement) { }

    init() {
        if (this.analyser) { return; }

        const context = new AudioContext();
        const src = context.createMediaElementSource(this.audio);
        const analyser = context.createAnalyser();

        this.analyser = analyser;

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = FFT_SIZE;

        const frequencyBinCount = analyser.frequencyBinCount;
        this.data = new Uint8Array(frequencyBinCount);

        this.requestData();
    }

    onChange = (action: (data: Uint8Array) => void) => this.onChangeActions.push(action);

    private requestData() {
        this.analyser.getByteFrequencyData(this.data);

        this.onChangeActions.forEach(action => action(this.data));

        requestAnimationFrame(this.requestData.bind(this));
    }

}
