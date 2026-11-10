// Photos for the scrolling column on the home page (files in public/home/).
// Order rotates: MAD Fashion (Madrid) -> Pull&Bear -> NYU FBA show.

export type Panel =
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "text"; big: string; small: string; place: string; color: string };

export const PANELS: Panel[] = [
  { type: "image", src: "/home/mg-2502.jpg", alt: "MAD Fashion show, Madrid: model in an oversized black leather jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-14.jpg", alt: "Pull&Bear: back view of a white jacket on fit", width: 1200, height: 1600 },
  { type: "image", src: "/home/img-0447.jpg", alt: "NYU FBA fashion show: model seated on a leather sofa in an olive jacket", width: 1067, height: 1600 },

  { type: "image", src: "/home/mg-2693.jpg", alt: "MAD Fashion show, Madrid: model in a cropped sage green jacket", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-08.jpg", alt: "Pull&Bear: brown zip jacket with contrast collar and hang tag", width: 1200, height: 1600 },
  { type: "image", src: "/home/img-0485.jpg", alt: "NYU FBA fashion show: close up of a washed gray denim jacket", width: 1067, height: 1600 },

  { type: "image", src: "/home/mg-2780.jpg", alt: "MAD Fashion show, Madrid: four models standing together", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-20.jpg", alt: "Pull&Bear: rust textured shirt with hang tag", width: 1200, height: 1600 },
  { type: "image", src: "/home/img-0594.jpg", alt: "NYU FBA fashion show: black jacket with embroidered calligraphy", width: 1067, height: 1600 },

  { type: "image", src: "/home/mg-2799.jpg", alt: "MAD Fashion show, Madrid: two models in washed denim", width: 1200, height: 1600 },
  { type: "image", src: "/home/pullbear-16.jpg", alt: "Pull&Bear: brown trousers with hang tag", width: 1200, height: 1600 },
];
