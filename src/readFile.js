import fs from 'fs';
import readline from 'readline';

// Replace 'yourfile.txt' with the path to your file
const filePath = './sample_urls.txt';

// Create a readable stream for the file
const fileStream = fs.createReadStream(filePath);

// Create a readline interface
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity // Recognize all instances of CR LF ('\r\n') as a single line break
});

// Event listener for each line
rl.on('line', (line) => {
  console.log(`Read line: ${line}`);
});

// Event listener for the end of the file
rl.on('close', () => {
  console.log('End of file reached.');
});
