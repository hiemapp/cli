import Command from '../utils/Command.js';
import { spawn } from '../utils/helpers.js';
import { PM2_APP_NAME } from '../utils/constants.js';

export class StartCommand extends Command {
    static name = 'start';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('hoi!')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();

        await spawn(`yarn pm2 start "${PM2_APP_NAME}"`, inst.getServerDir());
        await spawn('yarn pm2 update', inst.getServerDir(), { stdio: null });
    }
}