import { FrequencyProvider } from './frequency-provider';
import { createSVGElement } from '../utils';

const LINE_TAG = 'line';

const COUNT = 28;

export class Equalizer {
    frequencies: SVGLineElement[];

    constructor(private svg: SVGElement, private frequencyProvider: FrequencyProvider) {

        this.frequencies = Array(COUNT).fill(0)
            .map((_, index) => this.addFrequencyItem(svg, index));

        this.frequencyProvider.onChange(this.update.bind(this));
    }

    private addFrequencyItem(svg: SVGElement, index: number): SVGLineElement {
        const x = index * 11 + 6;

        return createSVGElement<SVGLineElement>(LINE_TAG, svg, {
            class: 'frequency',
            x1: x, y1: 2, x2: x, y2: 62,
            'stroke-dasharray': '0 60',
            'stroke-dashoffset': -30
        });
    }

    update(data: Uint8Array): void {
        const items = this.frequencies;

        for (let index = 0; index < COUNT; index++) {
            const value = Math.pow((data[index * 2] + data[index * 2 + 1] ) / 510, 3) * 60;
            const inverse = 60 - value;
            const element = items[index];

            element.setAttribute('stroke-dasharray', `${value} ${inverse}`);
            element.setAttribute('stroke-dashoffset', `${-inverse / 2}`);
        }
    }


}
