import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { classRoute } from './class';
import type { JsonResponse } from '../../../utils/types';
import { initTestDatabase } from '../../../test/utils/initTestDatabase';
import { statusCode } from '../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/user/class endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0';

  function mockRequestResponse(token?: string) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token
      },
    })

    return { req, res }
  }

  it('returns TOKEN_INVALID if !token', async () => {
    const { req, res } = mockRequestResponse(undefined);
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(token);
    await classRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})