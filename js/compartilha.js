const fs = require('fs');
const crypto = require('crypto');

// Function to save and share name and contact
async function saveAndShareData(name, contact) {
    const apiUrl = getApiUrlFromFile(); // Get API URL from dadus.json
    const data = { name, contact };

    // Save the data encrypted in a JSON file
    saveEncryptedDataToFile(data);

    // Share the data with the API
    await shareDataWithAPI(data, apiUrl);
}

// Function to get API URL from dadus.json
function getApiUrlFromFile() {
    try {
        const rawData = fs.readFileSync('dadus.json', 'utf8');
        const config = JSON.parse(rawData);
        return config.apiUrl; // Assumes dadus.json has a key "apiUrl"
    } catch (error) {
        console.error('Error reading API URL from dadus.json:', error);
        process.exit(1); // Exit if the file cannot be read
    }
}

// Function to save encrypted data to a JSON file
function saveEncryptedDataToFile(data) {
    const encryptionKey = 'your-encryption-key'; // Replace with a secure key
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = {
        iv: iv.toString('hex'),
        content: encrypted,
    };

    fs.writeFileSync('data.json', JSON.stringify(encryptedData, null, 2));
    console.log('Data saved encrypted to data.json');
}

// Function to share data with an API
async function shareDataWithAPI(data, apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Data shared successfully!');
        } else {
            console.error('Failed to share data:', response.statusText);
        }
    } catch (error) {
        console.error('Error sharing data:', error);
    }
}

// Example usage
saveAndShareData('John Doe', 'john.doe@example.com');
