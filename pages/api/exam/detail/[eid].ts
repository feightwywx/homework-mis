import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, parseUserTypeFromRequest, statusCode, successResponse } from "../../../../utils/api";
import { sessionOptions } from "../../../../utils/session";
import { getExamByID } from "../../../../utils/exam";

export async function examDetailRoute(req: NextApiRequest, res: NextApiResponse) {
  const { eid } = req.query;

  if (!eid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'eid required'));
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
  
  const result = await getExamByID(+eid);
  
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(examDetailRoute, sessionOptions)
