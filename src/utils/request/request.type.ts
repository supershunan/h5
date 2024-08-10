export enum RequstStatusEnum {
    success = 10001
}

/**
 * 将 fetch 中的 body 的类型进行自定义修改
 */
export interface CustomRequestInit extends Omit<RequestInit, 'body'> {
    body?: Object | null;
    timeout?: number;
} 
