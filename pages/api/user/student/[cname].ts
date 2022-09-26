import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../../utils/session";
import { getId, getStudentByClass } from "../../../../utils/user";

async function classRoute(req: NextApiRequest, res: NextApiResponse) {
  const { cname } = req.query;
  if (!(typeof cname === 'string')) { res.status(404).end(); return; }

  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }
  const id = await getId('teacher', token);
  if (id) {
    res.json(await getStudentByClass(cname))
  } else {
    res.status(401).end();
  }

}

export default withIronSessionApiRoute(classRoute, sessionOptions);