import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../utils/api";
import { sessionOptions } from "../../../../utils/session";
import { getStudentDetail, getTeacherDetail } from "../../../../utils/user";
import { JsonResponse, TeacherUserDetail } from "../../../../utils/types";

export async function studentDetailRoute(req: NextApiRequest, res: NextApiResponse) {
  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await getTeacherDetail(id)
  if (result) {
    console.log(result)
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(studentDetailRoute, sessionOptions);
