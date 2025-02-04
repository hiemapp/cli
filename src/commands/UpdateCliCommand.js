import Command from '../utils/Command.js';
import { CLI_GIT_URL } from '../utils/constants.js';
import { spawn } from '../utils/helpers.js';
import program from '../utils/program.js';

export class UpdateCliCommand extends Command {
    static name = 'update-cli';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Update the CLI.')
        })
    }

    static run(...args) {
        program.log('Updating CLI...');
        spawn(`yarn global add ${CLI_GIT_URL}`, process.cwd());
    }
}