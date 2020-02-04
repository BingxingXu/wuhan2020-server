import { Module, HttpModule } from '@nestjs/common';
import { WeixinController } from './weixin.controller';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [WeixinController],
})
export class WeixinModule { }
