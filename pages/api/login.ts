import type { User } from './user';

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../utils/token';

export default async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

  const { username, password, usertype } = await req.body

  res.json(await getToken(username, password, usertype));
}