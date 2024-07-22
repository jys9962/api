import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../application/member.service';
import { SignUpDto } from '../application/dto/sign-up.dto';
import { SignInDto } from '@/feature/member/application/dto/sign-in.dto';

@ApiTags('')
@Controller('members')
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
  ) {}

  @Post('sign-in')
  @ApiOperation({
    summary: '로그인',
  })
  async signIn(
    @Body() dto: SignInDto,
  ) {
    await this.memberService.signIn(dto);

  }

  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입',
  })
  async signUp(
    @Body() dto: SignUpDto,
  ) {
    const memberId = await this.memberService.signUp(dto);
    return { id: memberId };
  }
}
