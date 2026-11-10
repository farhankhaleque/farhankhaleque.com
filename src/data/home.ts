// Photos for the scrolling column on the home page (files in public/home/).
// Order rotates: MAD Fashion (Madrid) -> Pull&Bear editorial -> NYU FBA show.
// All photos are cropped 3:4 with the subject centered, except IMG_0447.

export type Panel =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "text"; big: string; small: string; place: string; color: string };

export const PANELS: Panel[] = [
  { type: "image", src: "/home/mg-2502.jpg", alt: "MAD Fashion show, Madrid: model in an oversized black leather jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-25.jpg", alt: "Pull&Bear editorial: tan washed jacket with wide leg jeans", width: 1015, height: 1354 },
  { type: "image", src: "/home/img-0447.jpg", alt: "NYU FBA fashion show: model seated on a leather sofa in an olive jacket", width: 1067, height: 1600 },

  { type: "image", src: "/home/mg-2693.jpg", alt: "MAD Fashion show, Madrid: model in a cropped sage green jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-34.jpg", alt: "Pull&Bear editorial: pink cropped jacket and mini skirt set", width: 1008, height: 1344 },
  { type: "image", src: "/home/img-0485.jpg", alt: "NYU FBA fashion show: close up of a model in a washed gray denim jacket", width: 1200, height: 1600 },

  { type: "image", src: "/home/mg-2780.jpg", alt: "MAD Fashion show, Madrid: four models standing together", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-164.jpg", alt: "Pull&Bear editorial: brown hooded jacket with black cargo trousers", width: 1098, height: 1464 },
  { type: "image", src: "/home/img-0594.jpg", alt: "NYU FBA fashion show: black jacket with embroidered calligraphy", width: 1200, height: 1600 },

  { type: "image", src: "/home/mg-2799.jpg", alt: "MAD Fashion show, Madrid: two models in washed denim", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-41.jpg", alt: "Pull&Bear editorial: washed gray overshirt with matching shorts", width: 1045, height: 1392 },
];
