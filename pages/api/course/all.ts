import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, statusCode, successResponse } from "../../../utils/api";
import { sessionOptions } from "../../../utils/session";
import { getCourses } from "../../../utils/course";

export async function allRoute(req: NextApiRequest, res: NextApiResponse) {
  const result = await getCourses();
  if (result) {
    res.json(successResponse(result))
  } else {
    res.json(failResponse(statusCode.NUL_QUERY_DATA))
  }
  return;
}

export default withIronSessionApiRoute(allRoute, sessionOptions);