const fs = require('fs');
const http = require('http');  // Change this to use the correct protocol


const serverUrl = 'http://localhost:3000/challenges'; // Adjust if needed
const localFilePath = 'src/app/data/challenges.json';

// Fetch data from the server
http.get(serverUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    fs.writeFileSync(localFilePath, data, 'utf8');
    console.log('✅ Challenges data updated successfully!');
  });
}).on('error', (err) => {
  console.error('❌ Failed to fetch challenges:', err.message);
});
