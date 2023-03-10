import axios from 'axios';
import { ApiResponse, Header, RpcBase, RpcCallOption } from 'lite-ts-rpc';

export class AxiosRpc extends RpcBase {
    public static body = {};
    public static header = {
        [Header.timeout]: 20000,
    };

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
        const { data: res } = await axios.post(url, {
            ...AxiosRpc.body,
            ...opt.body,
        }, {
            timeout: AxiosRpc.header[Header.timeout],
            headers: {
                ...AxiosRpc.header,
                ...opt.header,
            },
        });
        return res as ApiResponse<T>;
    }
}
