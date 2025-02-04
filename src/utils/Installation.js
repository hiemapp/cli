import path from 'node:path';
import jsonfile from 'jsonfile';
import { program } from 'commander';
import { glob } from 'glob';
import { spawn, isSubdir, formatPath } from './helpers.js';
import fs from 'node:fs/promises';
import { minimatch } from 'minimatch';
import InstallationExtensions from './InstallationExtensions.js';

export default class Installation {
    dir;
    lockfilePath;
    extensions;

    /**
     * Manages an installation.
     * @param {string} dir The directory containing the app.lock file.
     */
    constructor(dir) {
        this.dir = dir;
        this.lockfilePath = path.resolve(this.dir, './app.lock');
        this.extensions = new InstallationExtensions(this);

        this.checkLockfile();
    }

    checkLockfile() {
        try {
            const data = this.readLockfile();

            if(data === null) {
                program.log('File app.lock not found, creating...');
            }

            jsonfile.writeFileSync(this.lockfilePath, {});
        } catch(err) {
            program.error('An error ocurred while checking file app.lock: ', err);
        }
    }

    readLockfile() {
        try {
            return jsonfile.readFileSync(this.lockfilePath, { throws: false });
        } catch(err) {
            program.error('An error occured while reading app.lock', err);
        }
    }

    getStorageDir() {
        return path.resolve(this.dir, 'server/storage/');
    }

    getClientDir() {
        return path.resolve(this.dir, 'client/');
    }

    getServerDir() {
        return path.resolve(this.dir, 'server/');
    }

    getExtensionsDir() {
        return path.resolve(this.dir, 'server/storage/extensions/');
    }

    async install() {
        // Install dependencies
        program.log('Installing client dependencies...');
        await spawn('yarn install', this.getClientDir());

        program.log('Installing server dependencies...');
        await spawn('yarn install', this.getServerDir());
    }

    async build() {
        await Promise.all([
            spawn('yarn build', this.getClientDir()),
            spawn('yarn build', this.getServerDir())
        ]);
    }

    /**
     * Copy the storage directory from another installation.
     * @param {Installation} inst The installation to copy from.
     */
    async copyStorageFrom(fromInst) {
        program.log(`Copying storage...`);

        // Create new storage dir if it doesn't exist
        await fs.mkdir(this.getStorageDir(), { recursive: true });

        // Copy the storage directory, excluding extensions dist/ and node_modules/ folders
        await fs.cp(fromInst.getStorageDir(), this.getStorageDir(), { 
            recursive: true,
            filter: (src) => {
                const relativeSrc = path.relative(formatPath(fromInst.getStorageDir()), formatPath(src));
                return !minimatch(relativeSrc, 'extensions/*/+(dist|node_modules)');
            }
        });
        
        // // Copy the storage directory, excluding extensions/.
        // await fs.cp(fromInst.getStorageDir(), this.getStorageDir(), { 
        //     recursive: true,
        //     filter: (src) => !isSubdir(src, fromInst.getExtensionsDir())
        // });

        // // Copy extension package.json and *.lock-files
        // const extensionDirs = await fromInst.getExtensionDirs();
        // await Promise.all(extensionDirs.map(async dir => {
        //     const files = await glob('{package.json,*.lock}', { cwd: dir });

        //     const destDir = path.join(this.getExtensionsDir(), path.basename(dir))
        //     await fs.mkdir(destDir, { recursive: true });

        //     // copy the files
        //     await Promise.all(files.map(file => fs.copyFile(path.join(dir, file), path.join(destDir, file))))
        // }))
    }
}