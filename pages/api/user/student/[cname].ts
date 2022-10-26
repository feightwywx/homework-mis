import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../utils/api";
import { sessionOptions } from "../../../../utils/session";
import { getStudentByClass } from "../../../../utils/user";

export async function classRoute(req: NextApiRequest, res: NextApiResponse) {
  const { cname } = req.query;

  if (!cname) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'cname required'));
    return;
  }
  if (!(typeof cname === 'string')) {
    res.json(failResponse(statusCode.ROUTER_PARAM_INVALID, 'cname invalid'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await getStudentByClass(cname);
  if (result && result.length !== 0) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(classRoute, sessionOptions);