import * as crypto from 'crypto';

export class UserDto {
  username: string;
  password: string;

  async encryptPassword() {
    crypto.pbkdf2(this.password, '디지몬', 981204, 3, 'sha512', (err, key) => {
      this.password = key.toString('base64');
    });
  }
}
