import Command from '../utils/Command.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { APP_GIT_URL, CORE_GIT_URL } from '../utils/constants.js';
import program from '../utils/program.js';
import jsonfile from 'jsonfile';
import Installation from '../utils/Installation.js';
import { spawn } from '../utils/helpers.js';

export class BuildCommand extends Command {
    static name = 'build';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('hoi!')
        })
    }

    static async run(...args) {
        const inst = this.getInstallation();

        await inst.build();
        await inst.extensions.buildAll();
    }
}