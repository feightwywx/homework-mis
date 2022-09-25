import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { getTeacherHomeworks } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";
import { getId } from "../../../../utils/user";

async function teacherMyRoute(req: NextApiRequest, res: NextApiResponse) {
  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }
  const id = await getId('teacher', token);

  if (id) {
    res.json(await getTeacherHomeworks(id))
  } else {
    res.status(401).end();
  }

}

export default withIronSessionApiRoute(teacherMyRoute, sessionOptions);