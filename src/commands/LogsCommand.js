import Command from '../utils/Command.js';
import { spawn } from '../utils/helpers.js';
import { PM2_APP_NAME } from '../utils/constants.js';

export class LogsCommand extends Command {
    static name = 'logs';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('hoi!')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();
        await spawn(`yarn pm2 logs "${PM2_APP_NAME}"`, inst.getServerDir());
    }
}