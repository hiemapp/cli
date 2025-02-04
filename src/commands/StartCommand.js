import Command from '../utils/Command.js';
import { spawn } from '../utils/helpers.js';
import { PM2_APP_NAME } from '../utils/constants.js';

export class StartCommand extends Command {
    static name = 'start';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Start the home webserver using PM2.')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();

        await spawn(`yarn pm2 start ./dist/app.js --name "${PM2_APP_NAME}"`, inst.getServerDir());
        await spawn('yarn pm2 save', inst.getServerDir());
    }
}