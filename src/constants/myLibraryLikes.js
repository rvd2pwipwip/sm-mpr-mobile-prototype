/** Full grid for liked music channels or radio stations (`/my-library/likes/:kind`). */

/** @param {'music' | 'radio'} kind */
export function myLibraryLikesMorePath(kind) {
  return `/my-library/likes/${kind}`;
}
