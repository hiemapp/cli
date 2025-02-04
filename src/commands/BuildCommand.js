import Command from '../utils/Command.js';

export class BuildCommand extends Command {
    static name = 'build';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Build source code of the home and extensions.')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();

        await inst.build();
        await inst.extensions.buildAll();
    }
}