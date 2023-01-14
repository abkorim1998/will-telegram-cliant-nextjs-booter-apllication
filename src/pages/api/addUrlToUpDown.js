import { addUrlToUpDown } from "booterAndUpDownApi/upDown";

export default async function handler(req, res) {
    const data = await addUrlToUpDown(req.body.apikey, req.body.url, req.body.period);
    res.status(200).json(data);
}