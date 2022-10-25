import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { studentUpdateRoute } from './[hwid]';
import type { JsonResponse } from '../../../../../utils/types';
import { initTestDatabase } from '../../../../../test/utils/initTestDatabase';
import { statusCode } from '../../../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/homework/student/update endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009';

  function mockRequestResponse(loggedIn = false, hwid?: number, content?: boolean) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token: loggedIn ? token : undefined,
        content: content ? 'content' : undefined,
      },
    })

    req.query = { hwid: hwid ? hwid.toString() : undefined };


    return { req, res }
  }

  it('returns 100 if !hwid', async () => {
    const { req, res } = mockRequestResponse(true, undefined, true);
    await studentUpdateRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.ROUTER_PARAM_REQUIRED);
  })

  it('returns 200 if !token', async () => {
    const { req, res } = mockRequestResponse(false, 1, true);
    await studentUpdateRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('returns 101 if !content', async () => {
    const { req, res } = mockRequestResponse(true, 1, false);
    await studentUpdateRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
  })

  it('returns NUL_QUERY_DATA if !hwid', async () => {
    const { req, res } = mockRequestResponse(true, -1, true);
    await studentUpdateRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.NUL_QUERY_DATA);
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(true, 1, true);
    await studentUpdateRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})