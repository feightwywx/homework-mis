import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { teacherRejectRoute } from './[hwid]';
import type { JsonResponse } from '../../../../../utils/types';
import { initTestDatabase } from '../../../../../test/utils/initTestDatabase';
import { statusCode } from '../../../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/homework/teacher/reject endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0';

  function mockRequestResponse(token?: string, hwid?: number, studentName?: string) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token,
        studentName
      },
    })

    req.query = {
      hwid: hwid ? hwid.toString() : undefined
    }

    return { req, res }
  }

  it('returns ROUTER_PARAM_REQUIRED if !hwid', async () => {
    const { req, res } = mockRequestResponse(token, undefined);
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.ROUTER_PARAM_REQUIRED);
  })

  it('returns BODY_PARAM_REQUIRED if !studentName', async () => {
    const { req, res } = mockRequestResponse(token, 1);
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
  })

  it('returns NUL_QUERY_PARAM if studentName invalid', async () => {
    const { req, res } = mockRequestResponse(token, 1, 'invalid name');
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.NUL_QUERY_PARAM);
  })

  it('returns TOKEN_INVALID if !token', async () => {
    const { req, res } = mockRequestResponse(undefined, 1, '.direwolf');
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('if invalid hwid', async () => {
    const { req, res } = mockRequestResponse(token, -1, '.direwolf');
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.NUL_QUERY_DATA);
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(token, 1, '.direwolf');
    await teacherRejectRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})