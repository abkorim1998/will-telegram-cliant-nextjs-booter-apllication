import { sendBooterRequest } from "booterAndUpDownApi/booterApi";

export default async function handler(req, res) {
    const booterInfo = await sendBooterRequest({
        apikey: req.body.apikey,
        host: req.body.host,
        port: req.body.port? parseInt(req.body.port) : 80,
        method: req.body.method,
        time: req.body.expiresIn? parseInt(req.body.expiresIn) : 60,
      });
    res.status(200).json(booterInfo);
}