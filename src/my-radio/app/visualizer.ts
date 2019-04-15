import { createSVGElement } from './utils';

const MAX_FREQUENCY_VALUE = 256;
const WIDTH = 320;
const HEIGHT = 52;
const PADDING = 4;
const FFT_SIZE = 128;
const LINE_WIDTH = 1.5;

const FREQUENCY_RATE = (HEIGHT / 2 - Math.ceil(LINE_WIDTH)) / MAX_FREQUENCY_VALUE;

const SVG_TAG = 'svg';
const DEFS_TAG = 'defs';
const FE_GAUSSIAN_BLUR_TAG = 'feGaussianBlur';
const FEMERGE_TAG = 'femerge';
const FEMERGE_NODE_TAG = 'femergenode';
const PATH_TAG = 'path';

export class Visualizer {
    private analyser: AnalyserNode;
    private data: Uint8Array;
    private count: number;

    private path: SVGPathElement;
    private pathGlow: SVGPathElement;
    private step: number;
    private middle: number;

    private frame: number;

    public container: SVGElement;

    constructor(
        private $audio: HTMLAudioElement) {
        this.createSVG();
    }

    public play() {
        if (!this.analyser) { this.init(); }

        this.render();
    }

    public stop() {
        cancelAnimationFrame(this.frame);
    }

    private init() {
        const context = new AudioContext();
        const src = context.createMediaElementSource(this.$audio);
        const analyser = context.createAnalyser();

        this.analyser = analyser;

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = FFT_SIZE;

        this.count = analyser.frequencyBinCount;
        this.data = new Uint8Array(this.count);

        this.step = WIDTH / this.count;
        this.middle = PADDING + HEIGHT / 2;
    }

    private createSVG() {
        const svg = createSVGElement(SVG_TAG, null, {
            class: 'visualization',
            viewBox: '0 0 320 60'
        });

        const defs = createSVGElement<SVGDefsElement>(DEFS_TAG, svg);
        const glowFilter = createSVGElement<SVGFilterElement>('filter', defs, { id: 'glow' });

        createSVGElement<SVGFEGaussianBlurElement>(FE_GAUSSIAN_BLUR_TAG, glowFilter, {
            class: 'blur',
            result: 'coloredBlur',
            stdDeviation: '4'
        });

        const femerge = createSVGElement<SVGFEMergeElement>(FEMERGE_TAG, glowFilter);
        for (let index = 0; index < 3; index++) {
            createSVGElement<SVGFEMergeNodeElement>(FEMERGE_NODE_TAG, femerge, { in: 'coloredBlur' });
        }
        createSVGElement<SVGFEMergeNodeElement>(FEMERGE_NODE_TAG, femerge, { in: 'SourceGraphic' });

        const pathAttributes = {
            fill: 'transparent',
            'stroke-width': '1.5',
            'stroke-linecap': 'square',
            'stroke-linejoin': 'arcs'
        };

        this.pathGlow = createSVGElement<SVGPathElement>(PATH_TAG, svg, Object.assign({
            filter: 'url(#glow)',
            class: 'path-glow'
        }, pathAttributes));

        this.path = createSVGElement<SVGPathElement>(PATH_TAG, svg, Object.assign({
            class: 'path'
        }, pathAttributes));

        this.container = svg;
    }

    private render() {
        this.frame = requestAnimationFrame(this.render.bind(this));

        this.analyser.getByteFrequencyData(this.data);

        const paths = [`M0,${this.middle}`];
        let sign = 1;

        for (let i = 0; i < this.count; i++) {
            sign *= -1;
            paths.push(`L${(i + .5) * this.step},${this.middle + sign * this.data[i] * FREQUENCY_RATE}`);
        }

        const path = paths.join(' ');
        this.path.setAttribute('d', path);
        this.pathGlow.setAttribute('d', path);
    }
}
