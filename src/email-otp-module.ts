import crypto from 'crypto';
import validator from 'validator';

// Assume this function is implemented elsewhere
declare function send_email(email: string, body: string): Promise<boolean>;

// Constants
const STATUS_EMAIL_OK = 'STATUS_EMAIL_OK';
const STATUS_EMAIL_FAIL = 'STATUS_EMAIL_FAIL';
const STATUS_EMAIL_INVALID = 'STATUS_EMAIL_INVALID';

const STATUS_OTP_OK = 'STATUS_OTP_OK';
const STATUS_OTP_FAIL = 'STATUS_OTP_FAIL';
const STATUS_OTP_TIMEOUT = 'STATUS_OTP_TIMEOUT';

interface IOStream {
  readOTP(): Promise<string>;
}

interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

export class EmailOTPModule {
  private otpStore: Map<string, OTPEntry>;
  public latestOtp?: string; // for test 

  constructor() {
    this.otpStore = new Map();
  }

  start(): void {
    console.log('OTP module started.');
  }

  close(): void {
    this.otpStore.clear();
    console.log('OTP module shut down.');
  }

  async generate_OTP_email(userEmail: string): Promise<string> {
    // Validate email
    if (!validator.isEmail(userEmail)) {
      return STATUS_EMAIL_INVALID;
    }

    if (!userEmail.endsWith('@dso.org.sg')) {
      return STATUS_EMAIL_INVALID;
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    this.latestOtp = otpCode;

    // Store OTP with 1 min expiry and reset attempts
    const expiresAt = Date.now() + 60 * 1000;
    this.otpStore.set(userEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0,
    });

    // Send email
    const body = `Your OTP Code is ${otpCode}. The code is valid for 1 minute.`;
    try {
      const success = await send_email(userEmail, body);
      return success ? STATUS_EMAIL_OK : STATUS_EMAIL_FAIL;
    } catch (e) {
      return STATUS_EMAIL_FAIL;
    }
  }

  async check_OTP(userEmail: string, input: IOStream): Promise<string> {
    const record = this.otpStore.get(userEmail);
    if (!record) return STATUS_OTP_FAIL;

    const timeout = record.expiresAt - Date.now();
    if (timeout <= 0) return STATUS_OTP_TIMEOUT;

    let resolved = false;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(STATUS_OTP_TIMEOUT);
        }
      }, timeout);

      const attemptRead = async () => {
        while (record.attempts < 10 && Date.now() < record.expiresAt) {
          const userInput = await input.readOTP();

          if (userInput === record.code) {
            clearTimeout(timer);
            resolved = true;
            this.otpStore.delete(userEmail);
            return resolve(STATUS_OTP_OK);
          } else {
            record.attempts += 1;
          }
        }

        if (!resolved) {
          clearTimeout(timer);
          resolved = true;
          resolve(STATUS_OTP_FAIL);
        }
      };

      attemptRead();
    });
  }
}
