import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  failResponse,
  parseIdFromReqest,
  parseUserTypeFromRequest,
  statusCode,
  successResponse,
} from "../../../../utils/api";
import { sessionOptions } from "../../../../utils/session";
import { getScoresByCourse, getTotalHomeworkScoresByCourse } from "../../../../utils/homework";

export async function courseGradeRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { coid } = req.query;

  if (!coid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, "coid required"));
    return;
  }

  const id = await parseIdFromReqest(req);
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const userType = await parseUserTypeFromRequest(req);
  if (!userType) {
    res.json(failResponse(statusCode.USER_TYPE_NOT_SUPPORTED));
    return;
  }

  if (userType === "student") {
    const result = await getScoresByCourse(id, +coid);

    if (result) {
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
    return;
  } else if (userType === 'teacher') {
    const result = await getTotalHomeworkScoresByCourse(+coid);

    if (result) {
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
    return;
  }
  return;
}

export default withIronSessionApiRoute(courseGradeRoute, sessionOptions);
