module.exports = {
    map: false,
    plugins: {
        'postcss-preset-env': {
            stage: 0,
            importFrom: [
                './src/library/css/global.css',
                './src/library/css/variables.css'
            ],
            preserve: false
        }
    }
};