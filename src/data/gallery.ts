// Lookbook photos: editorial shots from MAD Fashion (Madrid), Pull&Bear, and the NYU FBA show.
// Files live in public/lookbook/. The three sources are interleaved so they spread evenly.
// To add a photo: put it in public/lookbook/ and add an entry with its pixel width and height.

export type Photo = {
  source: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const PHOTOS: Photo[] = [
  { source: "MAD Fashion", src: "/lookbook/mad-2502.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-002.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0374.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2535.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-009.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0425.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2547.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-012.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2552.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0442.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2595.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-016.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2693.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0447.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-024.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2698.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0485.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2699.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-034.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2714.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0502.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-040.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2732.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0569.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-041.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2741.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2755.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-068.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0594.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2780.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-080.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0608.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2787.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-098.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2799.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0711.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2812.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-118.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2863.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0737.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-120.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2942.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0764.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-2987.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-132.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-3061.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
  { source: "NYU FBA", src: "/lookbook/fba-0771.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-164.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-3069.jpg", alt: "MAD Fashion show, Madrid", width: 1400, height: 933 },
  { source: "NYU FBA", src: "/lookbook/fba-0826.jpg", alt: "NYU FBA fashion show", width: 933, height: 1400 },
  { source: "Pull&Bear", src: "/lookbook/pb-190.jpg", alt: "Pull&Bear editorial", width: 933, height: 1400 },
  { source: "MAD Fashion", src: "/lookbook/mad-3073.jpg", alt: "MAD Fashion show, Madrid", width: 1050, height: 1400 },
];
