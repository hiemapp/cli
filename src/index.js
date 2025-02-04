#!/usr/bin/env node

import program from './utils/program.js';
import * as commands from './commands/index.js';

function registerCommand(command) {
    command.register(program);
}

// register the commands
Object.values(commands).forEach(registerCommand)

program.parse(process.argv);