import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../../utils/api";
import { updateJudge } from "../../../../../utils/homework";
import { sessionOptions } from "../../../../../utils/session";

async function teacherJudgeRoute(req: NextApiRequest, res: NextApiResponse) {
  const { cid } = req.query;
  const { score, comment } = await req.body;

  if (!cid) {
    res.json(failResponse(statusCode.ROUTER_PARAM_REQUIRED, 'cid required'));
    return;
  }
  if (!score) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'score required'));
    return;
  }
  if (!comment) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'comment required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const result = await updateJudge(+cid, +score, comment);
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(teacherJudgeRoute, sessionOptions)
