import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import getName from '../../../utils/user'

export type User = {
  isLoggedIn: boolean
  name: string
  userType: UserType
  token: string
}

export type UserType = 'student' | 'teacher'

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  console.log('user route: ', req.session)
  if (req.session.user) {
    const user = req.session.user
    const name = await getName(user.userType, user.token)
    const resJson = {
      ...user,
      isLoggedIn: true,
    }
    
    
    if (name !== null) {    // 如果获取到name，则写入到返回体中
      req.session.user = {...user, name};
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
