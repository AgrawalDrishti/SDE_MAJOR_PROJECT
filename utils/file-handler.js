const fs = require('fs');
const path = require('path');

function create_message_file(dir, fileName, content = '') {
    const filePath = path.join(dir, fileName);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(`Error creating file: ${err}`);
            throw err;
        } else {
            console.log(`File created successfully at ${filePath}`);
        }
    });
}

function read_message_file(dir, fileName, startpos) {
    const filePath = path.join(dir, fileName);
    fs.open(filePath, 'r', (err, fd) => {
        if (err) {
            console.error(`Error opening file: ${err}`);
            throw err;
        }

        const buffer = Buffer.alloc(1024);
        fs.read(fd, buffer, 0, buffer.length, startpos, (err, bytesRead, buffer) => {
            if (err) {
                console.error(`Error reading file: ${err}`);
                return;
            }

            let content = buffer.toString('utf8', 0, bytesRead);
            let stopIndex = content.indexOf('\n'); // Change '\n' to the character you want to stop at
            if (stopIndex !== -1) {
                content = content.substring(0, stopIndex);
            } else {
                stopIndex = bytesRead;
            }

            console.log(`File content: ${content}`);
            fs.close(fd, (err) => {
                if (err) {
                    console.error(`Error closing file: ${err}`);
                }
            });

            return;
        });
    });
}

function create_message_directory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`Directory created at ${dir}`);
    } else {
        console.log(`Directory already exists at ${dir}`);
    }
}

function add_message_to_file(dir, fileName, content) {
    const filePath = path.join(dir, fileName);
    fs.appendFile(filePath, content+"\n", (err) => {
        if (err) {
            console.error(`Error appending to file: ${err}`);
            throw err;
        }
    });
}

module.exports = { create_message_file , read_message_file , add_message_to_file , create_message_directory }