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
import { updateExamScore } from "../../../../utils/exam";

export async function examScoreRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { erid } = req.query;

  if (!erid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, "erid required"));
    return;
  }

  const { score } = await req.body;

  if (!score) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "score required"));
    return;
  }

  const id = await parseIdFromReqest(req);
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const userType = await parseUserTypeFromRequest(req);
  if (!userType || userType === "student") {
    res.json(failResponse(statusCode.USER_TYPE_NOT_SUPPORTED));
    return;
  }

  if (userType === "teacher") {
    const result = await updateExamScore(+erid, score);
    if (result > 0) {
      
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  }

  return;
}

export default withIronSessionApiRoute(examScoreRoute, sessionOptions);
