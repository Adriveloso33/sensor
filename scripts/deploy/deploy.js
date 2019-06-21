/**
 * Available commands
 * --file Json File with steps to do the deploy
 */

/*eslint-disable */
const commandRunner = require('./runner');

const { commandFactory } = commandRunner;

const args = require('minimist')(process.argv.slice(2));
if (!args['file']) throw new Error('Not input file specified');

const config = require(args['file']);
const commands = config.commands;

async function execute() {
  console.log('Starting');

  const { length } = commands;
  for (let i = 0; i < length; i++) {
    const { type, options } = commands[i];
    await commandFactory(type, options);

    let completePercent = ((i + 1) * 100) / length;
    console.log(`${completePercent.toFixed(0)}% DONE`);
  }
  console.log('DONE!!!');
}

execute();
