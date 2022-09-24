import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { updateJudge } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";
import { getId } from "../../../../../utils/user";

async function teacherJudgeRoute(req: NextApiRequest, res: NextApiResponse) {
  const { cid } = req.query;
  const { score, comment } = await req.body;

  if (!cid) {
    res.status(500).end();
    return;
  };

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
  };

  const result = await updateJudge(+cid, +score, comment);
  res.json({success: result});
}

export default withIronSessionApiRoute(teacherJudgeRoute, sessionOptions)
