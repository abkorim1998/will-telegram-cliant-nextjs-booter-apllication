export default async function handler(req, res) {
    // store all the items in json file
    // if items.json does not exist, create it
    const items = req.body;
    
    // check if items.json exists
    const fs = require('fs');
    if (!fs.existsSync('items.json')) {
        fs.writeFileSync('items.json', JSON.stringify(items));
    }
    // if items.json exists, overwrite it
    else {
        fs.writeFileSync('items.json', JSON.stringify(items));
    }

    res.status(200).json({message: 'success'});
}