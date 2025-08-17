export enum BenefitsEnum {
    /** 个人收益 */
    persionBenfits,
    /** 团队收益 */
    teamBenfits
}

export enum CustomizeInfoEnum {
    /** 隐私政策 */
    privacyPolicy = 'privacy_policy',
    /** 使用教程 */
    useVideo = 'use_video',
    /** 平台客服 */
    customerService = 'customer_service',
    /** 广告栏 */
    advertisement = 'advertisement',
    /** 用户协议 */
    h5UserProtocol = 'h5_user_protocol',
    /** 工具箱 */
    tools = 'tools',
    /** App 下载 */
    permission = 'permission',
}

export enum MoneyTypeEnum {
    /** 消费 */
    consume = 'consume',
    /** 充值 */
    recharge = 'recharge',
    /** 收益 */
    income = 'income',
    /** 分红 */
    dividend = 'dividend',
    /** 提现 */
    cash = 'cash',
}

/** 作品状态 */
export enum WorkStatusEnum {
    '1' = '正常',
    '2' = '审核中',
    '3' = '打回',
    '4' = '强制下架',
    '5' = '自行下架',
}

/** 审核状态 */
export enum AuditStatusEnum {
    /** 正常 */
    normal = 1,
    /** 审核中 */
    audit = 2,
    /** 打回 */
    reject = 3,
    /** 强制下架 */
    force = 4,
    /** 自行下架 */
    self = 5,
}