// postcss.config.js
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    plugins: [
        // Добавляет vendor-prefix'ы для кросс-браузерной совместимости
        autoprefixer,
        // Минифицирует CSS (удаляет пробелы, комментарии и т.д.)
        cssnano({ preset: 'default' }),
    ],
};