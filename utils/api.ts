import { NextApiRequest } from "next";
import { JsonResponse, ResponseResult, UserType } from "./types";
import { getId } from "./user";

export function successResponse<T = ResponseResult>(result?: T) {
  return {
    code: 0, 
    result: result ?? ''
  } as JsonResponse<T>
}

export function failResponse(code: number, result?: ResponseResult) {
  return {
    code, 
    result: result ?? ''
  } as JsonResponse
}

export async function parseIdFromReqest(req: NextApiRequest, userType?: UserType) {
  let token = undefined;
  if (req.session?.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }

  if (userType) {
    return await getId(userType, token);
  } else if (req.session.user?.userType) {
    return await getId(req.session.user.userType, token);
  } else {
    throw new Error('Neither user type in session nor parament')
  }
  
}

export async function parseUserTypeFromRequest(req: NextApiRequest): Promise<UserType | null> {
  const { usertype: bodyUserType } = await req.body;
  if (bodyUserType) {
    if (bodyUserType === 'student' || bodyUserType === 'teacher') {
      return bodyUserType;
    }
  }

  if (req.session.user) {
    return req.session.user.userType;
  }

  return null
}

export const statusCode = {
  ROUTER_PARAM_REQUIRED: 100,
  ROUTER_PARAM_INVALID: 1001,
  BODY_PARAM_REQUIRED: 101,
  URL_PARAM_REQUIRED: 102,
  TOKEN_INVALID: 200,
  USER_TYPE_NOT_SUPPORTED: 201,
  NUL_QUERY_DATA: 300,
  NUL_QUERY_PARAM: 301,
  BAD_UPDATE: 400
}
