// Xcode 27 (iOS 27 SDK) aborts launch unless the app adopts the UIScene life cycle.
// expo@57 ships ExpoAppSceneDelegate but its prebuild template doesn't wire it up;
// this applies the same changes as the SDK 58 template.
// ponytail: delete this plugin when upgrading to SDK 58 — the template does it natively.
const fs = require('fs');
const path = require('path');
const { IOSConfig, withAppDelegate, withInfoPlist, withXcodeProject } = require('expo/config-plugins');

const SCENE_DELEGATE = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

module.exports = function withSceneLifecycle(config) {
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return cfg;
  });

  config = withAppDelegate(config, (cfg) => {
    cfg.modResults.contents = cfg.modResults.contents
      .replace(
        'class AppDelegate: ExpoAppDelegate {',
        'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {',
      )
      // The scene delegate creates the window and starts React Native.
      .replace(/#if os\(iOS\) \|\| os\(tvOS\)\s*window = UIWindow[\s\S]*?#endif\n/, '');
    return cfg;
  });

  return withXcodeProject(config, (cfg) => {
    const projectName = IOSConfig.XcodeUtils.getProjectName(cfg.modRequest.projectRoot);
    const filepath = path.join(projectName, 'SceneDelegate.swift');
    fs.writeFileSync(path.join(cfg.modRequest.platformProjectRoot, filepath), SCENE_DELEGATE);
    if (!cfg.modResults.hasFile(filepath)) {
      IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
        filepath,
        groupName: projectName,
        project: cfg.modResults,
      });
    }
    return cfg;
  });
};
