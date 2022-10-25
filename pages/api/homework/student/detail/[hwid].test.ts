import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { studentDetailRoute } from './[hwid]';
import type { JsonResponse } from '../../../../../utils/types';
import { initTestDatabase } from '../../../../../test/utils/initTestDatabase';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/homework/student/detail endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009';

  function mockRequestResponse(loggedIn = false, hwid?: number) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: loggedIn ? { token } : {},
    })

    if (typeof hwid === 'number') {
      req.query = { hwid: hwid.toString() };
    }
    return { req, res }
  }

  it('returns 100 if !hwid', async () => {
    const { req, res } = mockRequestResponse();
    await studentDetailRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(100);
  })

  it('returns 200 if !hwid', async () => {
    const { req, res } = mockRequestResponse(false, 1);
    await studentDetailRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(200);
  })

  it('returns homework detail', async () => {
    const { req, res } = mockRequestResponse(true, 1);
    await studentDetailRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })

  it('returns 300 if homework does not exist', async () => {
    const { req, res } = mockRequestResponse(true, -1);
    await studentDetailRoute(req, res);

    expect(res.statusCode).toBe(200);
    // @ts-ignore
    expect(res._getJSONData().code).toEqual(300);
  })
})