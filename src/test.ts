import { EmailOTPModule } from './email-otp-module';

(globalThis as any).send_email = async (email: string, body: string) => {
  console.log(`Mock email sent to ${email}: ${body}`);
  return true;
};

class MockInput {
  private values: string[];
  constructor(values: string[]) {
    this.values = values;
  }

  async readOTP(): Promise<string> {
    await new Promise((res) => setTimeout(res, 1000));
    return this.values.shift() ?? '';
  }
}

(async () => {
  const otp = new EmailOTPModule();
  otp.start();

  const email = 'userABC@dso.org.sg';
  const genStatus = await otp.generate_OTP_email(email);
  console.log('Generate OTP:', genStatus);

  const input = new MockInput(['wrongotp', otp.latestOtp ?? '']);

  const checkStatus = await otp.check_OTP(email, input);
  console.log('OTP Check:', checkStatus);

  otp.close();
})();
