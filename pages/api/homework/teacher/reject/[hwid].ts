import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { setReject } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";
import { getId } from "../../../../../utils/user";

async function teacherRejectRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;

  if (!hwid) {
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

  const result = await setReject(+hwid);
  res.json({success: result});
}

export default withIronSessionApiRoute(teacherRejectRoute, sessionOptions)
