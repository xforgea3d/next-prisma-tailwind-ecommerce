const fs = require('fs');
const originalUtimesSync = fs.utimesSync;
fs.utimesSync = function (path, atime, mtime) {
    try {
        originalUtimesSync(path, atime, mtime);
    } catch (e) {
        if (e.code === 'EPERM') {
            // Ignore EPERM when Prisma tries to update ~/.cache/prisma files it doesn't own
        } else {
            throw e;
        }
    }
};
