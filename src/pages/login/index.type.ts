export enum StatusEnum {
    /** 注册账号 */
    register,
    /** 手机号登录 */
    phoneLogin,
    /** 密码登录 */
    pwLogin,
}

export interface PhoneLogin {
    /** 手机号 */
    phone?: number;
    /** 图形验证码 */
    picCode?: string;
    /** 验证码 */
    code?: number;
}

export interface Registor extends PhoneLogin {
    /** 密码 */
    password?: string;
}

export type PwLogin = Omit<PhoneLogin, 'code'> & { password: string };