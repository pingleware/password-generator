"use strict"

const fs = require('fs');
const path = require('path');
const os = require('os');

const PROTECT = false;
let LOCATION = path.join(os.homedir(),'passwords.json');

if (PROTECT) {
	LOCATION = '~/password.json';
}

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv))
.option('length', {
    type: 'number',
    description: 'Length of password to generate',
    default: 10,
    required: false
})
.option('numbers', {
    type: 'boolean',
    description: 'include numbers in the password to generate',
    default: true,
    required: false
})
.option('symbols', {
    type: 'boolean',
    description: 'include symbols in the password to generate',
    default: false,
    required: false
})
.option('lowercase', {
    type: 'boolean',
    description: 'put lowercase in the password to generate',
    default: true,
    required: false
})
.option('uppercase', {
    type: 'boolean',
    description: 'put uppercase in the password to generate',
    default: true,
    required: false
})
.option('similar', {
    type: 'boolean',
    description: 'exclude similar characters (like "i" and "I") in the password to generate',
    default: false,
    required: false
})
.option('strict', {
    type: 'boolean',
    description: 'password must include at least one character from each pool in the password to generate',
    default: false,
    required: false
})
.option('exclude', {
    type: 'string',
    description: 'characters to be excluded in the password to generate',
    default: '',
    required: false
})
.option('location', {
    type: 'string',
    description: 'full path of the JSON server data file',
    default: `${LOCATION}`,
    required: false
})
.option('provider', {
    type: 'string',
    description: 'provider name, url or identifier for the password',
    default: `provider_${Math.random()}`,
    required: false
})
.option('support', {
    type: 'boolean',
    description: 'launches default browser to support website',
    default: false,
    required: false
})
.parse()

if (argv.support) {
    const { exec } = require('child_process');

    // URL to open
    const url = 'https://pingleware.support';
    
    // Command to open default browser with URL
    let command;
    switch (process.platform) {
      case 'darwin': // macOS
        command = `open "${url}"`;
        break;
      case 'win32': // Windows
        command = `start "" "${url}"`;
        break;
      default: // Linux
        command = `xdg-open "${url}"`;
    }
    
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error opening browser: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
      }
      console.log(`Opened default browser to ${url}`);
    });    
} else {
    var generator = require('generate-password');


    var password = generator.generate({
        length: argv.length,
        numbers: argv.numbers,
        symbols: argv.symbols,
        lowercase: argv.lowercase,
        uppercase: argv.uppercase,
        excludeSimilarCharacters: argv.similar,
        exclude: argv.exclude,
        strict: argv.strict
    });
    
    var data = {};
    if (fs.existsSync(argv.location)) {
        data = JSON.parse(fs.readFileSync(argv.location));
    }
    
    data[argv.provider] = password;
    fs.writeFileSync(argv.location,JSON.stringify(data));
    
    // 'uEyMTw32v9'
    console.log(password);    
}