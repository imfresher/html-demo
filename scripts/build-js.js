import fs from 'fs';
import path from 'path';
import * as babel from "@babel/core";
import { fileURLToPath } from 'url';
import log from './log';
import { IS_PRODUCTION } from './config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = __dirname + '/../src';
const outputPath = __dirname + '/../public';

const assets = [
  {
    input: inputPath + '/js/backend/app.js',
    output: outputPath + '/js/backend/app.js'
  },
  {
    input: inputPath + '/js/backend/user.js',
    output: outputPath + '/js/backend/user.js'
  }
];

assets.map(function (item) {
  if (! fs.existsSync(item.input)) {
    log.error(`Input path not exist: ${item.input}`);

    return;
  }

  let outputDir = path.dirname(item.output);

  if (! fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }, err => {
      log.error(`Can not mkdir: ${outputDir}`);
    })
  }

  const source = fs.readFileSync(item.input, "utf8");

  // console.log(path.relative(item.output, path.basename(item.output)));

  // Load and compile file normally, but skip code generation.
  const { ast } = babel.transformSync(source, {
    filename: path.basename(item.output),
    ast: true,
    code: false,
  });

  const out = babel.transformFromAstSync(ast, source, {
    filename: path.basename(item.output),
    presets: IS_PRODUCTION ? ["minify"] : [],
    babelrc: false,
    configFile: false,
  });

  if (out === null || ! out.code) {
    log.error(`Unable to transpile ${item.input} to ${item.output}`, 4);
  } else {
    fs.writeFileSync(item.output, out.code);
  }
});
