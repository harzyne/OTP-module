export {};

declare global {
  function send_email(email: string, body: string): Promise<boolean>;
}
