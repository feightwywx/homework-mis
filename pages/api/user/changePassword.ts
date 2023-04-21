import { User } from "../../../utils/types";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/session";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "../../../utils/token";
import {
  failResponse,
  parseIdFromReqest,
  statusCode,
  successResponse,
} from "../../../utils/api";
import { updateStudentPassword, updateTeacherPassword } from "../../../utils/user";

async function verifyRoute(req: NextApiRequest, res: NextApiResponse) {
  const { password, usertype } = await req.body;

  const id = await parseIdFromReqest(req, usertype);

  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  if (usertype === "student") {
    const result = await updateStudentPassword(id, password);
    if (result) {
      console.log(result);
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  } else {
    const result = await updateTeacherPassword(id, password);
    if (result) {
      console.log(result);
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  }

  return;
}

export default withIronSessionApiRoute(verifyRoute, sessionOptions);
