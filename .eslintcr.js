module.exports = {
    overrides: [
        {
            files: ['src/workers/**/*.js', 'src/workers/**/*.ts'],
            env: {
                worker: true,  
                browser: false,
                node: false,
            },
        },
    ],
};