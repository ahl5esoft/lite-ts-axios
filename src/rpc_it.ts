import { strictEqual } from 'assert';

import { AxiosRpc as Self } from './rpc';

describe('src/rpc.ts', () => {
    describe('.callWithoutThrow<T>(opt: RpcCallOption)', () => {
        it('ok', async () => {
            const res = await new Self('http://127.0.0.1:30000').callWithoutThrow<any>({
                route: '/aa/bb'
            });
            strictEqual(res.err, 501);
        });
    });
});