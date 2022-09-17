import type { User } from './info';

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../../utils/token';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  const { username, password, usertype } = await req.body;
  try {
    const token = await getToken(username, password, usertype);
    
    if (token === null) {
      res.status(401).json({ message: '用户名或密码错误' });
    } else {
      const user = {
        isLoggedIn: true,
        name: username,
        userType: usertype,
        token: token
      } as User;
      req.session.user = user;
      await req.session.save();

      res.json(user);
    }
  } catch (e) {
    res.status(500).json({ message: (e as Error).message })
  }

}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
