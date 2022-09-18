import path from 'path';
import { defineConfig } from 'vite';
import viteHtml from './plugins/vite-html';

const outDir = 'public';
const outDirResolve = path.resolve(__dirname, outDir);
const srcDirResolve = path.resolve(__dirname, 'src');

const src = {
  "js/frontend/app.js": 'js/frontend/app.js',
  "js/backend/app.js": 'js/backend/app.js',
  "js/backend/user.js": 'js/backend/user.js',
  "css/app.css": 'sass/app.scss',
  "css_backend_app": 'sass/backend/app.scss',
  "css/frontend/app.css": 'sass/frontend/app.scss',
};

const resolveInput = (input) => {
  Object.keys(input).forEach(function(key) {
    input[key] = path.resolve(srcDirResolve, input[key]);
  });

  return input;
};

export default defineConfig({
  server: {
    // host: true,
    // host: '0.0.0.0',
    // host: 'localhost',
    // hmr: {
    //     host: 'localhost',
    //     // port: 5173,
    //     // clientPort: 5173,
    // },
  },
  plugins: [
    viteHtml()
  ],
  build: {
    outDir: outDir,
    minify: false,
    rollupOptions: {
      input: resolveInput(src),
      output: {
        assetFileNames: ({ name: filename, type }) => {
          const outPath = path.resolve(outDirResolve, filename);
          console.log('filename: ', filename);

          if (path.extname(filename) === '.css') {
            return `${filename}`.replace("src\/sass\/", "css\/");
          }

          return '';
        },
        entryFileNames: ({ name: filename, facadeModuleId }) => {
          console.log('entry: ', filename);
          if (path.extname(filename) === '.css') {
            return `${filename}`.replace("sass\/", "css\/");
          }

          return `${filename}`;
        },
      }
    },
  }
});
