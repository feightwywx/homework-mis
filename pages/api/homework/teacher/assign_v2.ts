import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { failResponse, parseIdFromReqest, statusCode, successResponse } from "../../../../utils/api";
import { insertAssign_v2, insertTarget } from "../../../../utils/homework";
import { sessionOptions } from "../../../../utils/session";
import { getCourseStudents } from "../../../../utils/course";

export async function teacherAssignRoute(req: NextApiRequest, res: NextApiResponse) {
  const { title, assignment, deadline, courseID } = await req.body;

  if (!title) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'title required'));
    return;
  }
  if (!assignment) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'assignment required'));
    return;
  }
  if (!deadline) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'deadline required'));
    return;
  }

  if (!courseID) {
    res.json(failResponse(statusCode.BODY_PARAM_REQUIRED, 'courseID required'));
    return;
  }

  const id = await parseIdFromReqest(req, 'teacher');
  if (!id) {
    res.json(failResponse(statusCode.TOKEN_INVALID));
    return;
  }

  const hwid = await insertAssign_v2(+id, +courseID, title, assignment, deadline);
  const target = await getCourseStudents(+courseID);
  if (!hwid) {
    res.json(failResponse(statusCode.BAD_UPDATE))
    return;
  } else {
    let result = 0;
    await Promise.all(
      target.map(async value => {
        result += await insertTarget(hwid, value)
      })
    );

    if (result) {
      res.json(successResponse({ affected: result }));
    } else {
      res.json(failResponse(statusCode.BAD_UPDATE));
    }
    return;
  }

}

export default withIronSessionApiRoute(teacherAssignRoute, sessionOptions)
