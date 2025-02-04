import Command from '../utils/Command.js';
import { CLI_GIT_URL } from '../utils/constants.js';
import { spawn } from '../utils/helpers.js';

export class UpdateCliCommand extends Command {
    static name = 'update-cli';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('hoi!')
        })
    }

    static run(...args) {
        program.log('Updating CLI...');
        spawn(`yarn global add ${CLI_GIT_URL}`, process.cwd());
    }
}