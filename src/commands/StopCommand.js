import Command from '../utils/Command.js';
import { spawn } from '../utils/helpers.js';
import { PM2_APP_NAME } from '../utils/constants.js';

export class StopCommand extends Command {
    static name = 'stop';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Stop the home webserver.')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();

        await spawn(`yarn pm2 stop "${PM2_APP_NAME}"`, inst.getServerDir());
        await spawn(`yarn pm2 update`, inst.getServerDir(), { stdio: null });
    }
}