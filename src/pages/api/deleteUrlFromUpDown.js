import { deleteUpDownItem } from "booterAndUpDownApi/upDown";

export default async function handler(req, res) {
    const data = await deleteUpDownItem(req.body.apikey, req.body.token);
    res.status(200).json(data);
}