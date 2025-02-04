import Command from '../utils/Command.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { APP_GIT_URL, CORE_GIT_URL } from '../utils/constants.js';
import program from '../utils/program.js';
import jsonfile from 'jsonfile';
import Installation from '../utils/Installation.js';
import { spawn } from '../utils/helpers.js';

export class UpdateCommand extends Command {
    static name = 'update';

    static register(program) {
        return this.handleRegister(program, command => {
            command.description('Update the home.')
        })
    }

    /**
     * Clone a repository into a temporary directory.
     */
    static async run_cloneRepository(tmpDir, repoUrl) {
        const name = path.basename(repoUrl, '.git');

        program.log(`Cloning ${name} repository...`);
        await spawn(`git clone ${repoUrl}`, tmpDir);

        return path.join(tmpDir, name);
    }

    static async run_installYarn(tmpDir) {         
        // Install yarn
        program.log('Installing yarn...')
        await spawn('npm install --global yarn', tmpDir)
    }
    
    static async run_installCore(coreDir) {
        program.log('Installing core dependencies...');
        await spawn('yarn install', coreDir);

        program.log('Building core...');
        await spawn('yarn build', coreDir);
    }

    static async run_linkCore(inst, coreDir) {
        program.log('Linking core package...');

        // Create core link
        await spawn('yarn unlink', coreDir);
        await spawn('yarn link', coreDir);

        // Read "name" from package.json
        const pkgjsonPath = path.join(coreDir, './package.json');
        const { name } = jsonfile.readFileSync(pkgjsonPath);

        // Link package in client and server
        await spawn(`yarn link "${name}"`, inst.getClientDir());
        await spawn(`yarn link "${name}"`, inst.getServerDir());
    }
    
    /**
     * Install app dependencies using yarn.
     */ 
    static async run_installApp(inst) {       

    }

    static run(...args) {
        const oldInst = this.getInstallation();
        
        fs.mkdtemp(path.join(os.tmpdir(), 'home-cli-'), async (err, tmpDir) => {
            if(err) program.error('Failed to create temporary directory.');
            program.log(`Installing in temporary directory (${tmpDir}).`);

            const [ appDir, coreDir ] = await Promise.all([
                this.run_cloneRepository(tmpDir, APP_GIT_URL),
                this.run_cloneRepository(tmpDir, CORE_GIT_URL),
                this.run_installYarn(tmpDir)
            ]);
            
            const newInst = new Installation(appDir);

            await this.run_installCore(newInst);
            await this.run_linkCore(newInst, coreDir);

            await newInst.install();
            await newInst.build();
            await newInst.copyStorageFrom(oldInst);

            await newInst.extensions.installAll();
            await newInst.extensions.buildAll();
        })
    }
}