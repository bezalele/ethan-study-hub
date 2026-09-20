/* ---------------------------------------------------------------------------
   assets.js — every image the site uses, in one place.

   Pages never hard-code an image path. They reference a slot here. That makes
   "which images do we still need?" a question you can answer by reading one
   file, and it lets tests/smoke.cjs verify every slot points at a real,
   structurally valid image.

   Audit of 2026-09-20 found, on main:
     - 07-colonial-soldier.png, 08-capitol-cherry-blossoms.png and
       09-mountain-footer.png were not PNG files at all (no PNG signature,
       ~15KB of random bytes). Removed.
     - journey-icons/convention.jpg was a byte-identical copy of
       hero-signing.jpg (1.7MB, 3000x1933) used as a 100px thumbnail. Removed.
     - home/footer-landscape.jpg was a byte-identical copy of
       home/course-capitol.jpg. Removed.

   2026-09-20, second pass: the five timeline icons and the two card images
   were replaced with art supplied by the user. They are small (icons ~72x104,
   cards ~250x275), sized for the layout below but soft on high-DPI screens.
   Larger originals would be an improvement.
     - home/10-book-logo.png was referenced but never existed. The brand mark
       is now inline SVG in layout.js and cannot 404.

   Slots marked NEEDS-ART reuse an existing image because no distinct art
   exists yet. They are correct, just not ideal.
   --------------------------------------------------------------------------- */

export const IMAGES = {
  /* Full-bleed hero on the home page. John Trumbull-style signing scene. */
  heroSigning: {
    src: 'assets/home/hero-signing.jpg',
    alt: 'Delegates gathered in Independence Hall at the signing of the Declaration of Independence',
    credit: 'After John Trumbull · public domain',
  },

  /* Colonial militiaman, used on the "History first" card. */
  soldier: {
    src: 'assets/home/history-soldier.png',
    alt: 'Engraving of a colonial militiaman standing on a rocky outcrop with a musket',
    credit: 'Public domain',
  },

  /* The Capitol, used on the "full course view" card. */
  capitol: {
    src: 'assets/home/course-capitol.png',
    alt: 'The United States Capitol dome framed by cherry blossoms',
    credit: 'Public domain',
  },
};

/** Thumbnails for the five founding-story chapters, keyed by chapter id. */
export const CHAPTER_IMAGES = {
  colonies: {
    src: 'assets/journey/colonies.png',
    alt: 'A tall ship under sail off the American coast',
  },
  declaration: {
    src: 'assets/journey/declaration.png',
    alt: 'The printed Declaration of Independence',
  },
  articles: {
    src: 'assets/journey/articles.png',
    alt: 'An eighteenth-century street in a young American city',
  },
  convention: {
    src: 'assets/journey/convention.png',
    alt: 'Delegates debating at the Constitutional Convention of 1787',
  },
  'constitution-rights': {
    src: 'assets/journey/constitution-rights.png',
    alt: 'The dome of the United States Capitol',
  },
};

/** Every distinct file above, for the smoke test to verify on disk. */
export const ALL_IMAGE_PATHS = [
  ...Object.values(IMAGES).map((i) => i.src),
  ...Object.values(CHAPTER_IMAGES).map((i) => i.src),
];
