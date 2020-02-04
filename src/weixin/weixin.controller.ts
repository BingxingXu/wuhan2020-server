import { Controller, Get, HttpService, OnModuleInit, Req, Request, Query } from '@nestjs/common';
import { createHash } from 'crypto';

const APPID = 'wx0527d65ba3d5b901';
const APPSECRET = '36fb36376da17747ff4243d624e265fe';
const Token = 'test';
const sha1 = (v: string) => {
    const hash = createHash('sha1');
    hash.update(v);
    return hash.digest('hex');
};

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
    async getToken() {
        try {
            const { data: tokenData } = await this.httpService.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`).toPromise();
            if ((tokenData as Token).errcode) {
                throw new Error(tokenData.errcode);
            }
            const { data: ticketData } = await this.httpService.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenData.access_token}&type=jsapi`).toPromise();
            const timestamp = new Date().getTime() / 1000;
            const nonceStr = 'random';
            const url = 'https://wuhan.90hub.com/';
            const ticket = (ticketData as Ticket).ticket;
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
}
