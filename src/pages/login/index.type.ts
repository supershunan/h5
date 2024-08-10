export enum StatusEnum {
    /** 注册账号 */
    register,
    /** 手机号登录 */
    phoneLogin,
    /** 密码登录 */
    pwLogin,
}

export enum LoginTypeEnum {
    /** 密码登录 */
    pwLogin,
    /** 手机号登录 */
    phoneLogin
}

export interface PhoneLogin {
    /** 手机号 */
    account?: number;
    /** 验证码 */
    smsCode?: number;
}

export interface Registor extends PhoneLogin {
    /** 密码 */
    password?: string;
}

export type PwLogin = Omit<PhoneLogin, 'smsCode'> & { password: string };