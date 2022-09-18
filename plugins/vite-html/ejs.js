import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import log from '../_utils/log';

ejs.compileFile = function(filePath, options) {
  let templatePath = filePath;
  if (options && options.root) templatePath = path.resolve(options.root, templatePath);
  const templateStr = ejs.fileLoader(templatePath, 'utf8');
  options = Object.assign({ filename: templatePath }, options);
  return ejs.compile(templateStr, options);
};

const ejs2html = async (input, output, data) => {
  const template = ejs.compileFile(input, {
    delimiter: '', // by default '%'
    openDelimiter: '{{', // by default '<'
    closeDelimiter: '}}', // by default '>'
  });
  var html = template(data);

  fs.writeFile(output, html, function(err) {
    if (err) {
      log.error(err);
      return false;
    }

    log.success(`Build success: ${output}`);

    return true;
  });
}

export default function renderHtml(pages, templateDir, id) {
  var pages = pages || [];
  let needPages = [];
  log.title('Build:Html');

  if (id) {
    var pageFinded = pages.find(page => page.input === id);
    needPages = pageFinded ? [pageFinded] : [];
  } else {
    needPages = pages;
  }

  for (let page of needPages) {
    if (! fs.existsSync(page.input)) {
      log.error(`Input path not exist: ${page.input}`);

      continue;
    }

    let outputDir = path.dirname(page.output);

    if (! fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }, err => {
        log.error(`Can not mkdir: ${outputDir}`);
      })
    }

    ejs2html(page.input, page.output, page.data || null);
  }
}
