import Installation from './Installation.js';
import { glob } from 'glob';
import { spawn } from './helpers.js';
import path from 'node:path';
import program from './program.js';

export default class InstallationExtensions {
    inst;

    /** 
     * @param {Installation} inst The installation.
     */
    constructor(inst) {
        this.inst = inst;
    }

    
    async getDirs() {
        const files = await glob('*/package.json', { cwd: this.inst.getExtensionsDir(), absolute: true });
        return files.map(file => path.dirname(file));
    }

    async installAll() {
        const dirs = await this.getDirs();
        await Promise.all(dirs.map(dir => this.install(dir)));
    }

    async buildAll() {
        const dirs = await this.getDirs();
        await Promise.all(dirs.map(dir => this.build(dir)));
    }

    async install(dir) {
        const id = this.getExtensionId(dir);
        program.log(`Installing dependencies for extension '${id}'...`);
        await spawn('yarn install', dir);
    }

    async build(dir) {
        const id = this.getExtensionId(dir);
        program.log(`Building extension '${id}'...`);
        await spawn('yarn build', dir);
    }

    getExtensionId(dir) {
        return path.basename(dir);
    }
}