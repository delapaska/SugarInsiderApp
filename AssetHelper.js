/**
 * AssetHelper - Simple asset helper that works with Metro bundler
 * This version uses static require statements to avoid bundling issues
 */

/**
 * Get asset source for Image component
 * Returns the direct require() call for Metro compatibility
 */
const getAssetSource = (assetPath) => {
  // Normalize path
  const normalizedPath = assetPath.startsWith('./') ? assetPath.substring(2) : assetPath;

  console.log(`📱 [AssetHelper] Loading asset: ${normalizedPath}`);

  // Map paths to static require calls (Metro bundler needs static requires)
  switch (normalizedPath) {
    // Onboarding assets
    case 'assets/Onboarding/Parts/logo.png':
      return require('./assets/Onboarding/Parts/logo.png');
    case 'assets/Onboarding/Parts/group67.png':
      return require('./assets/Onboarding/Parts/group67.png');
    case 'assets/Onboarding/Parts/group1.png':
      return require('./assets/Onboarding/Parts/group1.png');
    case 'assets/Onboarding/Parts/sugar-control-text.png':
      return require('./assets/Onboarding/Parts/sugar-control-text.png');

    // Diary assets
    case 'assets/Diary/Parts/AddButton.png':
      return require('./assets/Diary/Parts/AddButton.png');
    case 'assets/Diary/Parts/Background.png':
      return require('./assets/Diary/Parts/Background.png');
    case 'assets/Diary/Parts/cake.png':
      return require('./assets/Diary/Parts/cake.png');
    case 'assets/Diary/Parts/candies.png':
      return require('./assets/Diary/Parts/candies.png');
    case 'assets/Diary/Parts/chevron.right.png':
      return require('./assets/Diary/Parts/chevron.right.png');
    case 'assets/Diary/Parts/chocolate.png':
      return require('./assets/Diary/Parts/chocolate.png');
    case 'assets/Diary/Parts/Diary.png':
      return require('./assets/Diary/Parts/Diary.png');
    case 'assets/Diary/Parts/icecream.png':
      return require('./assets/Diary/Parts/icecream.png');
    case 'assets/Diary/Parts/notepad1.png':
      return require('./assets/Diary/Parts/notepad1.png');
    case 'assets/Diary/Parts/Pencil.png':
      return require('./assets/Diary/Parts/Pencil.png');
    case 'assets/Diary/Parts/pro-1.png':
      return require('./assets/Diary/Parts/pro-1.png');
    case 'assets/Diary/Parts/prof.png':
      return require('./assets/Diary/Parts/prof.png');
    case 'assets/Diary/Parts/Statistics.png':
      return require('./assets/Diary/Parts/Statistics.png');
    case 'assets/Diary/Parts/Summary.png':
      return require('./assets/Diary/Parts/Summary.png');

    // Profile assets
    case 'assets/Profile/settings.png':
      return require('./assets/Profile/settings.png');
    case 'assets/Profile/arrow.png':
      return require('./assets/Profile/arrow.png');
    case 'assets/Profile/Background.png':
      return require('./assets/Profile/Background.png');
    case 'assets/Profile/photo.png':
      return require('./assets/Profile/photo.png');
    case 'assets/Profile/Avatar.png':
      return require('./assets/Profile/Avatar.png');
    case 'assets/Profile/arrowGrey.png':
      return require('./assets/Profile/arrowGrey.png');

    // Settings assets
    case 'assets/Settings/arrow.png':
      return require('./assets/Settings/arrow.png');
    case 'assets/Settings/background.png':
      return require('./assets/Settings/background.png');
    case 'assets/Settings/arrowGrey.png':
      return require('./assets/Settings/arrowGrey.png');

    // Search assets
    case 'assets/Search/zoom.png':
      return require('./assets/Search/zoom.png');
    case 'assets/Search/Background.png':
      return require('./assets/Search/Background.png');

    // Pro assets
    case 'assets/Pro/background.png':
      return require('./assets/Pro/background.png');
    case 'assets/Pro/photo.png':
      return require('./assets/Pro/photo.png');

    default:
      console.warn(`⚠️ [AssetHelper] Asset not found: ${normalizedPath}`);
      // Return fallback - a simple transparent pixel
      return { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' };
  }
};

/**
 * Simple preload function
 */
const preloadAssets = async () => {
  console.log('📦 [AssetHelper] Asset helper ready');
  return Promise.resolve();
};

/**
 * Get list of available assets
 */
const getAvailableAssets = () => {
  return [
    'assets/Onboarding/Parts/logo.png',
    'assets/Onboarding/Parts/group67.png',
    'assets/Onboarding/Parts/group1.png',
    'assets/Onboarding/Parts/sugar-control-text.png',
    'assets/Diary/Parts/AddButton.png',
    'assets/Diary/Parts/Background.png',
    'assets/Diary/Parts/cake.png',
    'assets/Diary/Parts/candies.png',
    'assets/Diary/Parts/chevron.right.png',
    'assets/Diary/Parts/chocolate.png',
    'assets/Diary/Parts/Diary.png',
    'assets/Diary/Parts/icecream.png',
    'assets/Diary/Parts/notepad1.png',
    'assets/Diary/Parts/Pencil.png',
    'assets/Diary/Parts/pro-1.png',
    'assets/Diary/Parts/prof.png',
    'assets/Diary/Parts/Statistics.png',
    'assets/Diary/Parts/Summary.png',
    'assets/Profile/settings.png',
    'assets/Profile/arrow.png',
    'assets/Profile/Background.png',
    'assets/Profile/photo.png',
    'assets/Profile/Avatar.png',
    'assets/Profile/arrowGrey.png',
    'assets/Settings/arrow.png',
    'assets/Settings/background.png',
    'assets/Settings/arrowGrey.png',
    'assets/Search/zoom.png',
    'assets/Search/Background.png',
    'assets/Pro/background.png',
    'assets/Pro/photo.png'
  ];
};

module.exports = {
  getAssetSource,
  preloadAssets,
  getAvailableAssets
};