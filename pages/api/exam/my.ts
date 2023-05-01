import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import {
  failResponse,
  parseIdFromReqest,
  parseUserTypeFromRequest,
  statusCode,
  successResponse,
} from "../../../utils/api";
import { sessionOptions } from "../../../utils/session";
import {
  getExamByID,
  getStudentExamScore,
  getExamsByCourseID,
  getTeacherExamScore,
  insertExamAssign,
  insertExamTarget,
  getStudentExams,
  getTeacherExams,
} from "../../../utils/exam";
import { ExamAssginRequestBody } from "../../../utils/types";
import { getCourseStudents } from "../../../utils/course";

export async function examScoreRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const result = await getStudentExams(id);

    if (result) {
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  }

  if (userType === "teacher") {
    const result = await getTeacherExams(id);

    if (result) {
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  }

  return;
}

export default withIronSessionApiRoute(examScoreRoute, sessionOptions);
