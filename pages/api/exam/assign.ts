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
} from "../../../utils/exam";
import { ExamAssginRequestBody } from "../../../utils/types";
import { getCourseStudents } from "../../../utils/course";

export async function examScoreRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, location, time, endtime, courseID }: ExamAssginRequestBody =
    await req.body;

  if (!title) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "title required"));
    return;
  }
  if (!location) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "location required"));
    return;
  }
  if (!time) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "time required"));
    return;
  }
  if (!endtime) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "endtime required"));
    return;
  }
  if (!courseID) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, "courseID required"));
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
    const eid = await insertExamAssign(
      courseID,
      title,
      location,
      time,
      endtime
    );
    const target = await getCourseStudents(+courseID);

    if (!eid) {
      res.json(failResponse(statusCode.BAD_UPDATE));
      return;
    }

    let result = 0;
    await Promise.all(
      target.map(async (studentID) => {
        result += await insertExamTarget(studentID, eid);
      })
    );

    if (result) {
      res.json(successResponse(result));
    } else {
      res.json(failResponse(statusCode.NUL_QUERY_DATA));
    }
  }

  return;
}

export default withIronSessionApiRoute(examScoreRoute, sessionOptions);
