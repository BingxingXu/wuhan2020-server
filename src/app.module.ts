import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BannerModule } from './banner/banner.module';
import { NewsModule } from './news/news.module';
import { CountModule } from './count/count.module';
import { ScienceModule } from './science/science.module';
import { WeixinModule } from './weixin/weixin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    BannerModule,
    NewsModule,
    CountModule,
    ScienceModule,
    WeixinModule,
  ],
})
export class AppModule { }
