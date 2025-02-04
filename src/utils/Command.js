import process from 'node:process';
import findParentDir from 'find-parent-dir';
import { program } from 'commander';
import Installation from './Installation.js';

export default class Command {
    static name;

    /**
     * 
     * @param {import('commander').program} program 
     * @param {(command: import('commander').program) => any} callback
     */
    static handleRegister(program, callback) {
        const command = program.command(this.name);
        command.action(this.run.bind(this));
        return callback(command);
    }

    static run() {
        throw new Error('No method run() implemented.');
    }

    static error(message, exitCode = 1) {
        process.exit(exitCode);
    }

    static findExistingInstallation() {
        try {
            const cwd = process.cwd();
            const dir = findParentDir.sync(cwd, 'app.lock');

            if(typeof dir !== 'string') throw new Error();

            return new Installation(dir);
        } catch(err) {
            return null;
        }
    }

    static createNewInstallation() {
        try {
            const cwd = process.cwd();

            // client/ and server/ should be in the same parent directory
            const dir1 = findParentDir.sync(cwd, 'client/');
            const dir2 = findParentDir.sync(cwd, 'server/');

            if(typeof dir1 !== 'string' || dir1 !== dir2) return null;

            return new Installation(dir1);
        } catch(err) {
            return null;
        }
    }

    static getInstallation() {
        let installation = this.findExistingInstallation();

        if(!installation) {
            installation = this.createNewInstallation();
        }

        if(!installation) {
            program.error("Failed to find installation. Please make sure you're running this command inside an installation directory.");
        }

        return installation;
    }
}