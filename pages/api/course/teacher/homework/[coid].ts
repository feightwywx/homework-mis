import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { getTeacherHomeworks } from "../../../../../utils/homework";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../../utils/api";
import { sessionOptions } from "../../../../../utils/session";

export async function courseTeacherHomeworkRoute(req: NextApiRequest, res: NextApiResponse) {
  const { coid } = req.query;

  if (!coid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'coid required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await getTeacherHomeworks(id, +coid);
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(courseTeacherHomeworkRoute, sessionOptions)
