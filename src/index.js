#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import * as commands from './commands/index.js';

function registerCommand(command) {
    command.register(program);
}

// register the commands
Object.values(commands).forEach(registerCommand)

// Add log method
program.log = function(...args) {
    console.log(chalk.blue('info'), ...args);
}

// Create program
program
    .version("1.0.0")
    .description("My Node CLI")
    .configureOutput({
        // Highlight errors in color.
        outputError: (str, write) => write(chalk.red('error ')+chalk.reset(str))
    })
    .parse(process.argv);
