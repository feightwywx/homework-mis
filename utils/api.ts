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

export async function parseIdFromReqest(req: NextApiRequest, userType: UserType) {
  let token = undefined;
  if (req.session.user?.token) {
    token = req.session.user?.token
  } else {
    token = await req.body.token;
  }

  return await getId(userType, token);
}

export const statusCode = {
  ROUTER_PARAM_REQUIRED: 100,
  ROUTER_PARAM_INVALID: 1001,
  BODY_PARAM_REQUIRED: 101,
  URL_PARAM_REQUIRED: 102,
  TOKEN_INVALID: 200,
  NUL_QUERY_DATA: 300,
  NUL_QUERY_PARAM: 301,
  BAD_UPDATE: 400
}
