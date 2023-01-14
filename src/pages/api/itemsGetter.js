export default async function handler(req, res) {
    // get all the items from json file
    const fs = require('fs');
    const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));
    res.status(200).json(items);
}