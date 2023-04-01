import axios from 'axios';
import { ApiResponse, Header, RpcBase, RpcCallOption } from 'lite-ts-rpc';

const timeout = 20_000;
RpcBase.header[Header.timeout] = timeout + '';

export class AxiosRpc extends RpcBase {
    public constructor(
        private m_BaseUrl: string,
    ) {
        super();
    }

    public async callWithoutThrow<T>(opt: RpcCallOption) {
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
        return res as ApiResponse<T>;
    }
}
