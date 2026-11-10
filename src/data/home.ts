// Photos for the scrolling column on the home page (files in public/home/).
// To add one: put the file in public/home/ and add an entry below.

export type Panel =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "text"; big: string; small: string; place: string; color: string };

export const PANELS: Panel[] = [
  { type: "image", src: "/home/mg-2502.jpg", alt: "Model in an oversized black leather jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/mg-2693.jpg", alt: "Model in a cropped sage green jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/mg-2780.jpg", alt: "Four models standing together in a studio", width: 1200, height: 1600 },
  { type: "image", src: "/home/mg-2799.jpg", alt: "Two models in washed denim", width: 1200, height: 1600 },
  { type: "image", src: "/home/img-0447.jpg", alt: "Model seated on a leather sofa in an olive jacket", width: 1067, height: 1600 },
  { type: "image", src: "/home/img-0485.jpg", alt: "Close up of a model in a washed gray denim jacket", width: 1067, height: 1600 },
  { type: "image", src: "/home/img-0594.jpg", alt: "Black jacket with embroidered calligraphy", width: 1067, height: 1600 },
];
