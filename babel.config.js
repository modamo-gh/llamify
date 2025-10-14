// babel.config.js
module.exports = function (api) {
    api.cache(true);

    const plugins = [];

    try {
        if (require.resolve("react-native-reanimated/plugin")) {
            plugins.push("react-native-reanimated/plugin");
        }
    } catch {}

    try {
        if (require.resolve("react-native-worklets/plugin")) {
            plugins.push("react-native-worklets/plugin");
        }
    } catch {}

    return {
        presets: ["babel-preset-expo"],
        plugins,
    };
};
