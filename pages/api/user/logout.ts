import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { successResponse } from "../../../utils/api";
import { sessionOptions } from "../../../utils/session";
import { JsonResponse, User } from "../../../utils/types";

async function logoutRoute(req: NextApiRequest, res: NextApiResponse<JsonResponse<User>>) {
  req.session.destroy();
  res.json(successResponse({
    isLoggedIn: false,
    name: '',
    userType: 'student',
    token: ''
  }))
  return;
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
