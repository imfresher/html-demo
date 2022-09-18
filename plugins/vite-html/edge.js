import fs from 'fs';
import { Edge } from 'edge.js';
import path from 'path';
import html from 'html';
import log from '../_utils/log';

let edge;

const toHtml = async (input, output, data) => {
  let templatePath = path.resolve(input);
  const htmlPure = await edge.render(templatePath, data);
  const prettyHtml = html.prettyPrint(htmlPure, { indent_size: 4 });

  fs.writeFile(output, prettyHtml, function(err) {
    if (err) {
      log.error(err);
      return false;
    }

    log.success(`Build success: ${output}`);

    return true;
  });
}

export default function renderHtml(templateDir, templates, id) {
  var templates = templates || [];
  let avaiableTemplates = [];

  edge = new Edge({ cache: false });
  edge.mount(templateDir);

  if (id) {
    var templateFinded = templates.find(template => template.input === id);
    avaiableTemplates = templateFinded ? [templateFinded] : [];
  } else {
    avaiableTemplates = templates;
  }

  log.title('Build:Html');

  for (let template of avaiableTemplates) {
    if (! path.extname(template.input)) {
      template.input = template.input + '.edge';
    }

    if (! fs.existsSync(template.input)) {
      log.error(`Input path not exist: ${template.input}`);

      continue;
    }

    let outputDir = path.dirname(template.output);
    if (! fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }, err => {
        log.error(`Can not mkdir: ${outputDir}`);
      })
    }

    toHtml(template.input, template.output, template.data || null);
  }
}
