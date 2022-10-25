import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse as OrigNextApiResp } from 'next';
import { teacherAssignRoute } from './assign';
import type { JsonResponse } from '../../../../utils/types';
import { initTestDatabase } from '../../../../test/utils/initTestDatabase';
import { statusCode } from '../../../../utils/api';

interface NextApiResponse<T = any> extends OrigNextApiResp<T> {
  _getJSONData: () => T;
}

describe('/api/homework/teacher/assign endpoint', () => {
  beforeAll(async () => {
    return initTestDatabase()
  })

  const token = '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0';

  function mockRequestResponse(token?: string, title?: string, assignment?: string, deadline?: string, target?: number[]) {
    // @ts-expect-error
    const { req, res }: { req: NextApiRequest, res: NextApiResponse<JsonResponse> } = createMocks({
      method: 'GET',
      body: {
        token,
        title,
        assignment,
        deadline,
        target
      },
    })

    return { req, res }
  }

  it('if !title', async () => {
    const { req, res } = mockRequestResponse(token);
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
    expect(res._getJSONData().result).toEqual('title required');
  })

  it('if !title', async () => {
    const { req, res } = mockRequestResponse(token, 'title');
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
    expect(res._getJSONData().result).toEqual('assignment required');
  })

  it('if !deadline', async () => {
    const { req, res } = mockRequestResponse(token, 'title', 'assignment');
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
    expect(res._getJSONData().result).toEqual('deadline required');
  })

  it('if !target', async () => {
    const { req, res } = mockRequestResponse(token, 'title', 'assignment', 'deadline');
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.BODY_PARAM_REQUIRED);
    expect(res._getJSONData().result).toEqual('target required');
  })

  it('returns TOKEN_INVALID if !token', async () => {
    const { req, res } = mockRequestResponse(undefined, 'title', 'assignment', 'deadline', []);
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().code).toEqual(statusCode.TOKEN_INVALID);
  })

  it('if ok', async () => {
    const { req, res } = mockRequestResponse(token, 'title', 'assignment', '2023-10-25 22:50:02', [1]);
    await teacherAssignRoute(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toMatchSnapshot();
  })
})