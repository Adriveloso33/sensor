const { execSync } = require('child_process');
const path = require('path');

const params = process.argv[2];
if (!params) {
  throw new Error(
    `Please provide arguments in this format [enviroment-operator-server [others]]
     example: dev-att-development debugger`
  );
}

const [enviroment, operator, server] = params.split('-');
if (!enviroment || !operator || !server) {
  throw new Error('Invalid arguments');
}

const exec = (command, options = {}) => {
  execSync(command, { stdio: 'inherit', ...options });
};

process.env.enviroment = enviroment;
process.env.operator = operator;
process.env.server = server;

const enableDebugger = process.argv[3] === 'debugger';

switch (enviroment) {
  case 'dev':
    exec(
      `${path.resolve(
        './node_modules/.bin/webpack-dev-server'
      )} --hot --config webpack.config.js --progress --env.debugger ${enableDebugger}`
    );
    break;

  case 'build':
    exec(`${path.resolve('./node_modules/.bin/webpack')} --config webpack.config.js --progress`);
    break;

  case 'deploy':
    exec(`cd ./scripts/deploy; node deploy.js --file ./configs/${operator}/${server}.js`);
    break;

  case 'analyzer':
    exec(`${path.resolve('./node_modules/.bin/webpack')} --config webpack.config.js --progress --env.analyzer true`);
    break;

  default:
    throw new Error('Invalid enviroment, [dev, build] required');
}
