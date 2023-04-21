import axios from 'axios';
import { RpcResponse, RpcHeader, RpcBase, RpcCallOption } from 'lite-ts-rpc';

const timeout = 20_000;
RpcBase.header[RpcHeader.timeout] = timeout + '';

export class AxiosRpc extends RpcBase {
    public constructor(
        private m_BaseUrl: string,
    ) {
        super();
    }

    protected async onCall<T>(opt: RpcCallOption) {
        if (!opt?.route)
            throw new Error(`${AxiosRpc.name}.send: 无效路由`);

        const routeParts = opt.route.split('/');
        if (routeParts.length == 3)
            routeParts.splice(2, 0, 'bg');
        const url = this.m_BaseUrl + routeParts.join('/');
        const { data: res } = await axios.post(url, opt.body?.constructor == FormData ? opt.body : {
            ...AxiosRpc.body,
            ...opt.body,
        }, {
            headers: {
                ...AxiosRpc.header,
                ...opt.header,
            },
            timeout,
        });
        return res as RpcResponse<T>;
    }
}
