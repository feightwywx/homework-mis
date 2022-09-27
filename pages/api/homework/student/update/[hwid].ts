import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { updateHomework } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";
import { getId } from "../../../../../utils/user";

async function studentUpdateRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;
  const { content } = await req.body;

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

  const id = await getId('student', token);

  if (!id) {
    res.status(401).end();
    return;
  }

  const result = await updateHomework(+hwid, id, content);
  res.json({success: result});
}

export default withIronSessionApiRoute(studentUpdateRoute, sessionOptions)
