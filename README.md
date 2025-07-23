#  Email OTP Module (Node.js + TypeScript)

This project implements a simulation of an Email OTP (One-Time Password) module designed for enterprise-grade use cases. It follows the specification to:
- Validate email domains
- Generate 6-digit OTPs
- Simulate sending via email
- Validate user-entered OTPs with retries and timeout

---

##  Project Structure
/src
├── email-otp-module.ts # Core OTP module logic
└── test.ts # Simulated test using mock email and user input

##  Features

- Sends **6-digit** OTPs to `@dso.org.sg` domain emails.
- Simulated email delivery using a mock `send_email()` function.
- OTP expires in **1 minute**.
- Users can make up to **10 attempts** to enter the correct OTP.
- Fully written in **TypeScript** and runs using `ts-node`.

## Run test 
npx ts-node src/test.ts

##  Assumptions Made

 Only email addresses ending in @dso.org.sg are accepted as valid.
 The email sending mechanism is mocked using a fake send_email() function.
 OTPs expire exactly 1 minute after generation.
 Up to 10 user attempts are allowed for each OTP.
 Testing is done using simulated input (MockInput) rather than real user I/O.
 OTPs are stored in-memory using Map, not persisted across sessions.
 The module does not handle concurrency or production-grade security concerns (e.g., rate limiting, replay protection).
 The test file uses the latestOtp property only for testing; this wouldn't exist in a secure real-world version.


## Example Output
OTP module started.
Mock email sent to userABC@dso.org.sg: Your OTP Code is 123456. The code is valid for 1 minute.
Generate OTP: STATUS_EMAIL_OK
OTP Check: STATUS_OTP_OK
OTP module shut down.


##  Future Improvements
 Integrate real email delivery using Nodemailer
 Add unit testing with Jest
 Build frontend component (Angular/React) to collect OTP from users
