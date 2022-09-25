import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { getStudentHomeworks } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";
import { getId } from "../../../../utils/user";

async function studentMyRoute(req: NextApiRequest, res: NextApiResponse) {
  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }
  const id = await getId('student', token);

  if (id) {
    res.json(await getStudentHomeworks(id))
  } else {
    res.status(401).end();
  }

}

export default withIronSessionApiRoute(studentMyRoute, sessionOptions);