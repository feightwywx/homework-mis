import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { studentMyRoute } from './my';
import type { JsonResponse } from '../../../../utils/types';
import { initTestDatabase } from '../../../../test/utils/initTestDatabase';
import { statusCode } from '../../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/homework/student/my endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009';

  function mockRequestResponse(token?: string) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token: token
      },
    })

    return { req, res }
  }

  it('returns TOKEN_INVALID if !token', async () => {
    const { req, res } = mockRequestResponse();
    await studentMyRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(token);
    await studentMyRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})