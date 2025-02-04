import cp from 'child_process';
import path from 'node:path';

export function spawn(cmd, cwd, opts = {}) {
    if (typeof cmd !== 'string') throw new Error('Argument `cmd` must be a string.');
    if (typeof cwd !== 'string') throw new Error('Argument `cwd` must be a string.');

    return new Promise((resolve, reject) => {
        const process = cp.spawn(cmd, { cwd, stdio: 'inherit', shell: true, ...opts });

        process.on('exit', code => resolve(code))
        process.on('error', err => reject(err));
    })
}

export function formatPath(filepath) {
    // Remove \\?\ from beginning of filepath
    return path.resolve(filepath.replace(/^\\\\\?\\/, ''));
}

export function isSubdir(dir, parentDir) {
    dir = formatPath(dir);
    parentDir = formatPath(parentDir);

    if (dir === parentDir) return false;
    if (dir.indexOf(parentDir) > -1) return true;
    return false;
}
