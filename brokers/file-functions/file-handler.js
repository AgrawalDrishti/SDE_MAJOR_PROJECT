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

async function read_message_file (dir, fileName, startpos) {
    const filePath = path.join(dir, fileName);
    let result;

    try {
        const fd = await fs.promises.open(filePath, 'r');
        const buffer = Buffer.alloc(1024);
        const { bytesRead } = await fd.read(buffer, 0, buffer.length, parseInt(startpos));
        
        let content = buffer.toString('utf8', 0, bytesRead);
        let stopIndex = content.indexOf('\n');

        if (stopIndex !== -1) {
            content = content.substring(0, stopIndex);
        } else {
            stopIndex = bytesRead;
        }
        
        result = content;
        await fd.close();
    } catch (err) {
        console.error(`Error handling file: ${err}`);
        throw err;
    }
    console.log("Result:", result);
    return result;
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