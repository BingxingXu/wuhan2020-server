import { Controller, Get, HttpService, OnModuleInit, Req, Request, Query } from '@nestjs/common';
import { createHash } from 'crypto';
import * as cacheManager from 'cache-manager';

const APPID = 'wx0527d65ba3d5b901';
const APPSECRET = '36fb36376da17747ff4243d624e265fe';
const Token = 'test';
const sha1 = (v: string) => {
    const hash = createHash('sha1');
    hash.update(v);
    return hash.digest('hex');
};
const memoryCache = cacheManager.caching({ store: 'memory', ttl: 7000 });

interface Token {
    access_token: string;
    expires_in?: number;
    errcode?: number;
    errmsg?: string;
}

interface Ticket {
    ticket: string;
    errcode: number;
}

@Controller('weixin')
export class WeixinController {
    constructor(private readonly httpService: HttpService) { }

    @Get('config')
    async getConfig(@Query('url') urlI: string) {
        try {
            const timestamp = new Date().getTime() / 1000;
            const nonceStr = 'random';
            const url = urlI ? urlI : 'https://wuhan.90hub.com/';
            const token = await this.getToken();
            const ticket = await this.getTicket(token);

            let signature = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
            signature = sha1(signature);

            return {
                appId: APPID,
                timestamp,
                nonceStr,
                signature,
            };
        } catch (err) {
            console.log('err', err);
        }
    }

    async getToken(): Promise<string> {
        let token = await memoryCache.get('token');
        if (!token) {
            const { data: tokenData } = await this.httpService.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`).toPromise();
            if ((tokenData as Token).errcode) {
                throw new Error(tokenData.errcode);
            }
            token = tokenData.access_token;
            await memoryCache.set('token', token, { ttl: 5000 });
        }
        return token;
    }

    async getTicket(token: string): Promise<string> {
        let ticket = await memoryCache.get('ticket');
        if (!ticket) {
            const { data: ticketData } = await this.httpService.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`).toPromise();
            ticket = (ticketData as Ticket).ticket;
            await memoryCache.set('ticket', ticket, { ttl: 5000 });
        }
        return ticket;
    }
}
