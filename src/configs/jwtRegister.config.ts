import { registerAs } from '@nestjs/config';

export default registerAs('jwtRegister', () => ({
  global: true,
  secret: process.env.SECRET_JWT || 'nothing',
  signOptions: { expiresIn: '2h' },
}));
