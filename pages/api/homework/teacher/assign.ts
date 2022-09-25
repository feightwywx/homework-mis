import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { insertAssign } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";
import { getId } from "../../../../utils/user";

async function teacherAssignRoute(req: NextApiRequest, res: NextApiResponse) {
  const { title, assignment, deadline } = await req.body;

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

  const result = await insertAssign(+id, title, assignment, deadline);
  res.json({ success: result });
}

export default withIronSessionApiRoute(teacherAssignRoute, sessionOptions)
