import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';
import log from './log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = __dirname + '/../src';
const outputPath = __dirname + '/../public';
const npmPath = __dirname + '/../node_modules';

const statics = [
    { from: inputPath + '/images/', to: outputPath + '/images' },
    { from: npmPath + '/bootstrap-icons/font/fonts/', to: outputPath + '/css/backend/fonts' },
    // { from: npmPath + '/jquery/dist', to: assetPath + '/vendor/jquery' },
    // { from: npmPath + '/jquery-migrate/dist', to: assetPath + '/vendor/jquery-migrate' },
    // { from: npmPath + '/jquery-hoverintent/jquery.hoverintent.js', to: assetPath + '/vendor/jquery-hoverintent/jquery.hoverintent.js' },
    // { from: npmPath + '/jquery-hoverintent/jquery.hoverintent.min.js', to: assetPath + '/vendor/jquery-hoverintent/jquery.hoverintent.min.js' },
    // { from: npmPath + '/bootstrap/dist', to: assetPath + '/vendor/bootstrap' },
    // { from: npmPath + '/bootstrap/scss', to: assetPath + '/sass/99-vendors/bootstrap' },
    // { from: npmPath + '/bootstrap-icons/font', to: assetPath + '/vendor/bootstrap-icons' },
    // { from: npmPath + '/swiper/swiper-bundle.min.js', to: assetPath + '/vendor/swiper/swiper-bundle.min.js' },
    // { from: npmPath + '/swiper/swiper-bundle.min.css', to: assetPath + '/vendor/swiper/swiper-bundle.min.css' },
];

// path.resolve(__dirname, './views/test.ejs')

statics.map(function (item) {
    // To copy a folder or file
    fse.copySync(item.from, item.to, { overwrite: true }, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Copy -from: ' + item.from + ' -to: ' + item.to + ' successfully.');
        }
    });
});
