import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';


/**
 * API 전체 관리 모듈
 * 회원 / 컨텐츠 / 신고 등 모든 API 모듈 의존성 관리
 * -> AppModule에 연결
 */
@Module({
  imports: [UserModule],
})
export class WwwModule {}
