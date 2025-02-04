import { program } from 'commander';
import chalk from 'chalk';

program
    .version("1.0.0")
    .description("My Node CLI")
    .configureOutput({
        // Highlight errors in color.
        outputError: (str, write) => write(chalk.red('error ')+chalk.reset(str))
    });

program.log = function(...args) {
    console.log(chalk.blue('info'), ...args);
}

export default program;
