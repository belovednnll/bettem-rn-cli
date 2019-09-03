module.exports = {
    "start": "node node_modules/react-native/local-cli/cli.js start",
    "test": "jest",
    "prettier": "prettier --write --single-quote --no-semi --trailing-comma es5 --print-width 80 \"app/**/*.js\"",
    "lint": "eslint app",
    "optimize": "node bettem.update.nodemodules.js",
    "bundle-ios": "node node_modules/react-native/local-cli/cli.js bundle --entry-file index.js  --platform ios --dev false --bundle-output ./ios/bundle/bettemrn.jsbundle --assets-dest ./ios/bundle",
    "build-android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/out/index.bettemrn.android.bundle --assets-dest android/out/"
}