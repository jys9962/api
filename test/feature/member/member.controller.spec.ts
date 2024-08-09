import { INestApplication } from '@nestjs/common';
import { moduleFixture } from '../../fixture/module.fixture';
import * as request from 'supertest';
import { MemberEntity } from '@/global/mysql/entities/member.entity';
import { MemberPassword } from '@/feature/member/domain/value-object/member-password';
import { IOrm } from '@/libs/mysql/interface/i.orm';
import { MysqlUtil } from '@/libs/mysql/util/mysql.util';

describe('MemberController', () => {
  let app: INestApplication;
  let memberRepository: IOrm<MemberEntity>;

  beforeAll(async () => {
    const moduleFixture = await moduleFixture();
    app = moduleFixture.createNestApplication();
    await app.init();

    memberRepository = moduleFixture.get<IOrm<MemberEntity>>(MysqlUtil.getName('default', MemberEntity));
  });

  beforeEach(async () => {
    await memberRepository.insertOrUpdate({
      id: '1',
      name: 'jys',
      password: MemberPassword.fromText('jys9962').value,
      email: 'jys9962@kakao.com',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await memberRepository.delete({
      email: 'jys9962@kakao.com',
    });
  });

  it('최초엔 비로그인', async function() {
    request(app.getHttpServer())
      .get('/members/')
      .expect(200)
      .expect({
        isLoggedIn: false,
      });
  });

  it('회원가입', async function() {
    await request(app.getHttpServer())
      .post('/members/sign-up')
      .send({
        name: 'jys',
        password: 'jys9962',
        email: 'new_jys9962@kakao.com',
      })
      .expect(201);

    const member = await memberRepository.findOne({
      where: {
        email: 'new_jys9962@kakao.com',
      },
    });

    expect(member).toBeDefined();
    expect(member?.name).toBe('jys');
    expect(MemberPassword.fromHash(member!.password).isMatch('jys9962')).toBeTruthy();

    await memberRepository.delete({
      email: 'new_jys9962@kakao.com',
    });
  });

  it('로그인 - 실패', async function() {
    request(app.getHttpServer())
      .post('/members/sign-in')
      .send({
        email: 'jys9962@kakao.com',
        password: 'invalidPassword',
      })
      .expect(400);
  });

  it('로그인 - 성공', async function() {
    request(app.getHttpServer())
      .post('/members/sign-in')
      .send({
        email: 'jys9962@kakao.com',
        password: 'jys9962',
      })
      .expect(201);
    // todo token

  });
});
