import Command from '../utils/Command.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { APP_GIT_URL, CORE_GIT_URL } from '../utils/constants.js';
import { program } from 'commander';
import jsonfile from 'jsonfile';
import Installation from '../utils/Installation.js';
import { spawn } from '../utils/helpers.js';

export class DevCommand extends Command {
    static name = 'dev';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Start the home in development mode.')
            .option('--host [host]', 'Whether to expose Vite over the network.')
        })
    }

    static async run(opts) {
        const inst = this.getInstallation();

        program.log('Launching server in development mode...');
        spawn('yarn dev', inst.getServerDir());

        program.log('Launching client in development mode...');
        spawn(`yarn dev ${process.argv.slice(3).join(' ')}`, inst.getClientDir());
    }
}