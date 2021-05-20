import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export function handleCheckLoggedIn(req: Request, res: Response) {
    const authHeaders = req.headers.authorization
    const token = authHeaders && authHeaders.split(' ')[1]

    console.log('token: ', token)

    if (!token || token.includes('object')) {
      return res.json({loggedIn: false});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) {
            console.log(err)
            return res.json({ loggedIn: false });
        }

        console.log('user: ', user);
        return res.json({loggedIn: true});
    })
}