import { User } from "../../../utils/types";

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../utils/token';
import { failResponse, statusCode, successResponse } from "../../../utils/api";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  const { username, password, usertype } = await req.body;
  try {
    const token = await getToken(username, password, usertype);
    if (token === null) {
      res.json(failResponse(statusCode.TOKEN_INVALID));
      return;
    } else {
      const user = {
        isLoggedIn: true,
        name: username,
        actual_id: username,
        userType: usertype,
        token: token
      } as User;
      console.log(user)
      req.session.user = user;
      await req.session.save();

      res.json(successResponse(user));
      return;
    }
  } catch (e) {
    res.json(failResponse(-1, (e as Error).message));
    return;
  }

}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
