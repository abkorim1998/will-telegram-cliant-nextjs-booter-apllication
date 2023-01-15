export default async function handler(req, res) {
    // get all the items from json file
    const request = await fetch(req.body.url);
    const response = await request.text();
    res.status(200).json({
        response,
    });
}