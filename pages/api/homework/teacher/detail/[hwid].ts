import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { getTeacherHomeworkDetail } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";
import { getId } from "../../../../../utils/user";

async function teacherDetailRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;

  if (!hwid) {
    res.status(500).end();
    return;
  }

  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }

  const id = await getId('teacher', token);

  if (!id) {
    res.status(401).end();
    return;
  }

  const result = await getTeacherHomeworkDetail(+hwid, id);
  res.json(result);
}

export default withIronSessionApiRoute(teacherDetailRoute, sessionOptions)
