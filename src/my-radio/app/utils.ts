
const addAttributes = <T extends HTMLElement | SVGElement>(attributes: { [key: string]: string | number; }, element: T) => {
  if (attributes) {
    Object.keys(attributes).forEach(key => element.setAttribute(key, `${attributes[key]}`));
  }
};

const appendTo = <T extends HTMLElement | SVGElement>(element: T, parent: HTMLElement | SVGElement) => {
  if (parent) {
    parent.appendChild(element);
  }
};

export const DOCUMENT = document;

export const createHTMLElement = <T extends HTMLElement>(
  name: string,
  parent: HTMLElement = null,
  attributes: { [key: string]: string | number } = null) => {
  const element = DOCUMENT.createElement(name) as T;

  addAttributes<T>(attributes, element);
  appendTo<T>(element, parent);

  return element;
};

export const createSVGElement = <T extends SVGElement>(
  name: string,
  parent: SVGElement = null,
  attributes: { [key: string]: string | number } = null) => {
  const element = DOCUMENT.createElementNS('http://www.w3.org/2000/svg', name) as T;

  addAttributes<T>(attributes, element);
  appendTo<T>(element, parent);

  return element;
};
