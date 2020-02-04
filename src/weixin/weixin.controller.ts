import { Controller, Get, HttpService, OnModuleInit, Req, Request, Query } from '@nestjs/common';
import { ApiConfig, ApiConfigKit, WeChat } from 'tnwx';

const APPID = 'wx9ed52ed8359d7f25';
const APPSECRET = '0676cb20d3176bf5afe8523ce51cd049';
const Token = 'test';
const config = new ApiConfig(APPID, APPSECRET, Token, false);

@Controller('weixin')
export class WeixinController implements OnModuleInit {
    constructor(private readonly httpService: HttpService) { }

    onModuleInit() {
        ApiConfigKit.putApiConfig(config);
        ApiConfigKit.devMode = true;
    }

    @Get('config')
    async getToken() {
        try {
            const timestamp = new Date().getTime() / 1000;
            const nonceStr = 'random';
            const url = 'https://wuhan.90hub.com/';
            const signature = await WeChat.jssdkSignature(nonceStr, `${timestamp}`, url);
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
