module.exports = {
    map: false,
    plugins: {
        'postcss-preset-env': {
            stage: 0,
            importFrom: [
                './client/library/css/variables.css'
            ],
            features: {
                'custom-properties': {
                    preserve: false
                }
            }
        }
    }
};