export enum ItemOperateEnum {
    setting,
    startPromotion,
    overPromotion,
    delete
}

export enum PromotionEnum {
    /** 结束推广 */
    end,
    /** 开启推广 */
    start
}

export interface AddFolderParams {
    title: string;
    coverImg: string;
    /** 推广链接 */
    promotionUrl: string;
    /** 是否开启推广  0否 1是 */
    enablePromotion: 0 | 1;
}

export interface CollectionItem {
    page: number;
    rows: number;
    id: number;
    code: string;
    title: string;
    info: unknown;
    content: unknown;
    coverImg: string;
    bgImg: unknown;
    playCount: number;
    playBuy: number;
    playTime: unknown;
    playUrl: unknown;
    collNum: unknown;
    type: string;
    pid: unknown;
    idIndex: string;
    num: number;
    useTime: unknown;
    money: unknown;
    sort: unknown;
    status: number;
    state: number;
    createTime: number;
    createBy: string;
    updateTime: unknown;
    updateBy: unknown;
    expert: unknown;
    createName: unknown;
    buyStatus: unknown;
    labelId: unknown;
    incomeData: unknown;
    labelList: Array<any>;
    labelDataList: Array<any>;
    dianZanNum: unknown;
    shouCangNum: unknown;
    avatar: unknown;
    focusStatus: unknown;
    collStatus: unknown;
    likeStatus: unknown;
    promotionUrl: string;
    enablePromotion: number;
}