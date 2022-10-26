import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { classRoute } from './[cname]';
import type { JsonResponse } from '../../../../utils/types';
import { initTestDatabase } from '../../../../test/utils/initTestDatabase';
import { statusCode } from '../../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/user/student/class endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0';

  function mockRequestResponse(token?: string, cname?: string) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token
      },
    })

    req.query = {
      cname: cname ? cname.toString() : undefined
    }

    return { req, res }
  }

  it('returns ROUTER_PARAM_REQUIRED if !cname', async () => {
    const { req, res } = mockRequestResponse(token, undefined);
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.ROUTER_PARAM_REQUIRED);
  })

  it('returns TOKEN_INVALID if !token', async () => {
    const { req, res } = mockRequestResponse(undefined, 'className');
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('returns NUL_QUERY_DATA if !token', async () => {
    const { req, res } = mockRequestResponse(token, 'invalid-class-name');
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.NUL_QUERY_DATA)
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(token, '测试班级');
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})