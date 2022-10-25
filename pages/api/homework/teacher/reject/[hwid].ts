import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../../utils/api";
import { setReject } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";
import { getStudentId } from "../../../../../utils/user";

export async function teacherRejectRoute(req: NextApiRequest, res: NextApiResponse) {
  const { hwid } = req.query;
  const { studentName } = await req.body;
  const stuid = await getStudentId(studentName);

  if (!hwid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'hwid required'));
    return;
  }
  if (!studentName) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'studentName required'));
    return;
  }
  if (!stuid) {
    res.json(failResponse(statusCode.NUL_QUERY_PARAM, 'stuid query error'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await setReject(+hwid, stuid);
  if (result) {
    res.json(successResponse({ affected: result }))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(teacherRejectRoute, sessionOptions)
