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
    src: 'assets/home/history-soldier.jpg',
    alt: 'Engraving of a colonial militiaman standing on a rocky outcrop with a musket',
    credit: 'Public domain',
  },

  /* The Capitol, used on the "full course view" card. */
  capitol: {
    src: 'assets/home/course-capitol.jpg',
    alt: 'The United States Capitol dome framed by cherry blossoms',
    credit: 'Public domain',
  },
};

/** Thumbnails for the five founding-story chapters, keyed by chapter id. */
export const CHAPTER_IMAGES = {
  colonies: {
    src: 'assets/journey-icons/colonies.jpg',
    alt: 'A tall ship under sail approaching the American coast',
  },
  declaration: {
    src: 'assets/journey-icons/declaration.jpg',
    alt: 'The printed Declaration of Independence',
  },
  articles: {
    src: 'assets/journey-icons/articles.jpg',
    alt: 'An eighteenth-century street scene in a young American city',
  },
  convention: {
    // NEEDS-ART: convention.jpg was a duplicate of the hero and was removed.
    src: 'assets/home/hero-signing.jpg',
    alt: 'Delegates debating at the Constitutional Convention of 1787',
  },
  'constitution-rights': {
    src: 'assets/journey-icons/constitution-rights.jpg',
    alt: 'A neoclassical public building representing the new federal government',
  },
};

/** Every distinct file above, for the smoke test to verify on disk. */
export const ALL_IMAGE_PATHS = [
  ...Object.values(IMAGES).map((i) => i.src),
  ...Object.values(CHAPTER_IMAGES).map((i) => i.src),
];
