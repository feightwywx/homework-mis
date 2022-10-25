import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../../utils/api";
import { updateHomework } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";

export async function studentUpdateRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;
  const { content } = await req.body;

  if (!hwid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'hwid required'));
    return;
  }
  if (!content) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'content required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'student');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await updateHomework(+hwid, id, content);
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(studentUpdateRoute, sessionOptions)
