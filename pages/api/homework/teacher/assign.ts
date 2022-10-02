import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../utils/api";
import { insertAssign, insertTarget } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";

async function teacherAssignRoute(req: NextApiRequest, res: NextApiResponse) {
  const { title, assignment, deadline, target } = await req.body;

  if (!title) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'title required'));
    return;
  }
  if (!deadline) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'deadline required'));
    return;
  }
  if (!target) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'target required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const hwid = await insertAssign(+id, title, assignment, deadline);
  if (!hwid) {
    res.json(failResponse(statusCode.BAD_UPDATE))
    return;
  } else {
    let result = 0;
    (target as number[]).forEach(async value => {
      result += await insertTarget(hwid, value)
    })

    if (result) {
      res.json(successResponse({ affected: result }));
    } else {
      res.json(failResponse(statusCode.BAD_UPDATE));
    }
    return;
  }

}

export default withIronSessionApiRoute(teacherAssignRoute, sessionOptions)
