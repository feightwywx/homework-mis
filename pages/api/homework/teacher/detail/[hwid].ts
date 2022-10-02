import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../../utils/api";
import { getTeacherHomeworkDetail } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";

async function teacherDetailRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;

  if (!hwid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'hwid required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await getTeacherHomeworkDetail(+hwid, id);
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(teacherDetailRoute, sessionOptions)
