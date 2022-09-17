import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../utils/session";
import { User } from "../../../utils/types";

async function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({
    isLoggedIn: false,
    name: '',
    userType: 'student',
    token: ''
  })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
