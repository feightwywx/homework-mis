import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../utils/api";
import { getTeacherHomeworks } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";

async function teacherMyRoute(req: NextApiRequest, res: NextApiResponse) {
  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }
  
  const result = await getTeacherHomeworks(id)
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;

}

export default withIronSessionApiRoute(teacherMyRoute, sessionOptions);