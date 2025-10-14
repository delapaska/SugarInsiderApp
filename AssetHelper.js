/**
 * AssetHelper - Unified asset loading for both development and production
 * Handles the difference between Metro bundler and static assets
 */

import { Image } from 'react-native';

// Asset registry for production builds
const ASSET_REGISTRY = {
  // Onboarding assets
  'assets/Onboarding/Parts/logo.png': require('./assets/Onboarding/Parts/logo.png'),
  'assets/Onboarding/Parts/group67.png': require('./assets/Onboarding/Parts/group67.png'),
  'assets/Onboarding/Parts/group1.png': require('./assets/Onboarding/Parts/group1.png'),
  'assets/Onboarding/Parts/sugar-control-text.png': require('./assets/Onboarding/Parts/sugar-control-text.png'),

  // Diary assets
  'assets/Diary/Parts/AddButton.png': require('./assets/Diary/Parts/AddButton.png'),
  'assets/Diary/Parts/Background.png': require('./assets/Diary/Parts/Background.png'),
  'assets/Diary/Parts/cake.png': require('./assets/Diary/Parts/cake.png'),
  'assets/Diary/Parts/candies.png': require('./assets/Diary/Parts/candies.png'),
  'assets/Diary/Parts/chevron.right.png': require('./assets/Diary/Parts/chevron.right.png'),
  'assets/Diary/Parts/chocolate.png': require('./assets/Diary/Parts/chocolate.png'),
  'assets/Diary/Parts/Diary.png': require('./assets/Diary/Parts/Diary.png'),
  'assets/Diary/Parts/icecream.png': require('./assets/Diary/Parts/icecream.png'),
  'assets/Diary/Parts/notepad1.png': require('./assets/Diary/Parts/notepad1.png'),
  'assets/Diary/Parts/Pencil.png': require('./assets/Diary/Parts/Pencil.png'),
  'assets/Diary/Parts/pro-1.png': require('./assets/Diary/Parts/pro-1.png'),
  'assets/Diary/Parts/prof.png': require('./assets/Diary/Parts/prof.png'),
  'assets/Diary/Parts/Statistics.png': require('./assets/Diary/Parts/Statistics.png'),
  'assets/Diary/Parts/Summary.png': require('./assets/Diary/Parts/Summary.png'),

  // Profile assets
  'assets/Profile/settings.png': require('./assets/Profile/settings.png'),
  'assets/Profile/arrow.png': require('./assets/Profile/arrow.png'),
  'assets/Profile/Background.png': require('./assets/Profile/Background.png'),
  'assets/Profile/photo.png': require('./assets/Profile/photo.png'),
  'assets/Profile/Avatar.png': require('./assets/Profile/Avatar.png'),
  'assets/Profile/arrowGrey.png': require('./assets/Profile/arrowGrey.png'),

  // Settings assets
  'assets/Settings/arrow.png': require('./assets/Settings/arrow.png'),
  'assets/Settings/background.png': require('./assets/Settings/background.png'),
  'assets/Settings/arrowGrey.png': require('./assets/Settings/arrowGrey.png'),

  // Search assets
  'assets/Search/zoom.png': require('./assets/Search/zoom.png'),
  'assets/Search/Background.png': require('./assets/Search/Background.png'),

  // Pro assets
  'assets/Pro/background.png': require('./assets/Pro/background.png'),
  'assets/Pro/photo.png': require('./assets/Pro/photo.png'),
};

/**
 * Get asset source for Image component
 * Works in both development and production
 * @param {string} assetPath - Path to asset relative to project root
 * @returns {object} Asset source object for Image component
 */
export const getAssetSource = (assetPath) => {
  // Normalize path (remove leading ./ if present)
  const normalizedPath = assetPath.startsWith('./') ? assetPath.substring(2) : assetPath;

  // Try to get from registry first (for production builds)
  if (ASSET_REGISTRY[normalizedPath]) {
    console.log(`✅ [AssetHelper] Found asset in registry: ${normalizedPath}`);
    return ASSET_REGISTRY[normalizedPath];
  }

  // Fallback: try to require dynamically (for development)
  try {
    const dynamicAsset = require(`./${normalizedPath}`);
    console.log(`✅ [AssetHelper] Dynamically loaded: ${normalizedPath}`);
    return dynamicAsset;
  } catch (error) {
    console.warn(`⚠️ [AssetHelper] Could not load asset: ${normalizedPath}`, error.message);

    // Return a placeholder or the original path as fallback
    return { uri: normalizedPath };
  }
};

/**
 * Preload all assets for better performance
 * Call this in App.js componentDidMount or useEffect
 */
export const preloadAssets = async () => {
  console.log('📦 [AssetHelper] Preloading assets...');

  const assetPromises = Object.values(ASSET_REGISTRY).map(asset =>
    Image.prefetch(Image.resolveAssetSource(asset).uri)
  );

  try {
    await Promise.all(assetPromises);
    console.log(`✅ [AssetHelper] Preloaded ${assetPromises.length} assets`);
  } catch (error) {
    console.warn('⚠️ [AssetHelper] Some assets failed to preload:', error);
  }
};

/**
 * Get all available asset paths for debugging
 */
export const getAvailableAssets = () => {
  return Object.keys(ASSET_REGISTRY);
};

export default {
  getAssetSource,
  preloadAssets,
  getAvailableAssets,
};