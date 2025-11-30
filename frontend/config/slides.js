/**
 * Centralized Slide Configuration
 * Single source of truth for all slide types and their data files
 */

export const SLIDE_CONFIG = {
  case_studies: {
    displayName: 'Case Studies',
    dataFile: 'slides/case_studies.txt'
  },
  pnl: {
    displayName: 'PnL',
    dataFile: 'slides/pnl.txt'
  },
  angles: {
    displayName: 'Angles',
    dataFile: 'slides/angles.txt'
  }
};

export const SLIDE_TYPES = Object.keys(SLIDE_CONFIG);
export const SLIDE_NAMES = SLIDE_TYPES.map(key => SLIDE_CONFIG[key].displayName);

/**
 * Get slide config by display name (case-insensitive)
 */
export function getSlideConfig(displayName) {
  const key = SLIDE_TYPES.find(k =>
    SLIDE_CONFIG[k].displayName.toLowerCase() === displayName.toLowerCase()
  );
  return key ? { key, ...SLIDE_CONFIG[key] } : null;
}
