import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getNameByToken } from '../../../utils/user'
import { User } from '../../../utils/types'

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    const user = req.session.user
    const name = await getNameByToken(user.userType, user.token)
    const resJson = {
      ...user,
      isLoggedIn: true,
    }


    if (name !== null) {    // 如果获取到name，则写入到返回体中
      req.session.user = { ...user, name };
      await req.session.save();
      res.json({
        ...resJson,
        name
      })
    } else {
      res.json(resJson);
    }

  } else {
    res.json({
      isLoggedIn: false,
      name: '',
      userType: 'student',
      token: ''
    })
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
