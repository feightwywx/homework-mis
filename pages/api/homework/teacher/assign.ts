import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { insertAssign, insertTarget } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";
import { getId } from "../../../../utils/user";

async function teacherAssignRoute(req: NextApiRequest, res: NextApiResponse) {
  const { title, assignment, deadline, target } = await req.body;

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

  const hwid = await insertAssign(+id, title, assignment, deadline);
  if (hwid) {
    let result = 0;
    (target as number[]).forEach(async value => {
      result += await insertTarget(hwid, value)
    })
    res.json({ success: result });
  } else {
    res.status(500).end();
  }
  
}

export default withIronSessionApiRoute(teacherAssignRoute, sessionOptions)
