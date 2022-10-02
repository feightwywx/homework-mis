import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getNameByToken } from '../../../utils/user'
import { JsonResponse, User } from '../../../utils/types'
import { successResponse } from '../../../utils/api'

async function userRoute(req: NextApiRequest, res: NextApiResponse<JsonResponse<User>>) {
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
      res.json(successResponse({
        ...resJson,
        name
      }))
    } else {
      res.json(successResponse(resJson));
    }

  } else {
    res.json(successResponse({
      isLoggedIn: false,
      name: '',
      userType: 'student',
      token: ''
    }))
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
