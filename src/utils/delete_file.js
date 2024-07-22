const fs = require('fs');

const deleteFile = (path) => {
    // Check if the file exists
    fs.stat(path, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            } else {
                return res.status(500).send('Internal server error');
            }
        }

        // Delete the file
        fs.unlink(path, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Internal server error');
        }

        });
    });
}

export default deleteFile;
