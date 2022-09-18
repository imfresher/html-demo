import fs from 'fs';
import path from 'path';
import glob from 'glob';
import log from '../_utils/log';
import renderHtml from './edge';

export const getTemplateFiles = (directory, extensionPattern) => {
  let pattern = extensionPattern || '/**/*.{html,ejs,edge}';

  // Ignore all dir and file begin with '_' char.
  const ignorePattern = {
    "ignore":[
      // '/**/_*/**/*.{html,ejs,edge}'
      '/**/_*/**',
      '/**/layouts/**'
    ]
  };

  return glob.sync(directory + pattern, ignorePattern);
};

export default function viteHtml (options) {
  options = options || {};

  let viteConfig;
  let rootDir;
  let publicDir;
  let templateDir;
  let templateDirResolve;
  let templates = [];
  const bodyInjectRE = /<head>/;

  return {
    name: 'vite-html',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      // store the resolved config
      viteConfig = resolvedConfig;
      rootDir = viteConfig.root;
      publicDir = viteConfig.publicDir; // viteConfig.build.outDir

      if (!('templateDir' in options) || options.templateDir === undefined) {
        templateDir = 'src/views';
      } else {
        templateDir = options.templateDir;
      }

      templateDirResolve = path.resolve(rootDir, templateDir);

      if (!('templates' in options) || options.templates === undefined || options.templates.length == 0) {
        let templateFiles = getTemplateFiles(templateDirResolve);
        for (let templateFile of templateFiles) {
          templates.push({
            input: templateFile,
            output: path.join(publicDir, path.relative(templateDirResolve, templateFile)).replace(/\.[^/.]+$/, ".html")
          });
        }
      } else {
        templates = options.templates;
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.originalUrl

        if (path.extname(url) !== '.html') {
          next();
          return;
        }

        try {
          // 1. Read index.html
          var templatePath = path.resolve(rootDir, publicDir + url);
          var templateFinded = templates.find(template => template.output === templatePath);

          if (! templateFinded || ! ('output' in templateFinded) || ! fs.existsSync(templateFinded.output)) {
            next();
            return;
          }

          let template = fs.readFileSync(
            templateFinded.output,
            'utf-8'
          );


          // 5. Inject the app-rendered HTML into the template.
          const html = template.replace(bodyInjectRE, `<head><script type="module" src="/@vite/client"></script>\n`);

          log.title('Rerender HTML:');
          log.success(`Rerender success: ${url}`);

          // 6. Send the rendered HTML back.
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Cache-Control', 'no-cache');
          // res.setHeader('Etag', etag);
          res.statusCode = 200;
          res.end(html);

          return;
        } catch (e) {
          next(e);
        }

        return;
      });
    },
    // transformIndexHtml: {
    //   enforce: 'pre',
    //   async transform(html, ctx) {
    //     return {
    //       html,
    //     };
    //   },
    // },
    async closeBundle() {
      renderHtml(templateDirResolve, templates);
    },
    async handleHotUpdate({ file, timestamp, modules, read, server }) {
      const { ws, config, moduleGraph } = server;
      let templateDirRegex = new RegExp(`^${templateDirResolve}`,"g");

      if (
        file.match(templateDirRegex) &&
        (file.endsWith('.html') || file.endsWith('.ejs') || file.endsWith('.edge'))
      ) {
        renderHtml(templateDirResolve, templates, file);

        await server.restart();
        // ws.send({
        //   type: 'full-reload',
        //   path: config.server.middlewareMode
        //       ? '*'
        //       : '/' + path.relative(config.root, file)
        // });
      }
    }
  };
};
