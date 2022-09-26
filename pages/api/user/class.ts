import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../utils/session";
import { getAllClasses, getId } from "../../../utils/user";

async function classRoute(req: NextApiRequest, res: NextApiResponse) {
  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }
  const id = await getId('teacher', token);

  if (id) {
    res.json(await getAllClasses())
  } else {
    res.status(401).end();
  }

}

export default withIronSessionApiRoute(classRoute, sessionOptions);
