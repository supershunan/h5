import { history } from 'umi'
import { CustomRequestInit } from './request.type';
import { Toast } from 'antd-mobile';

const BASE_URL = 'https://ksys.qfyingshi.cn';

export default async function request(path: string, options?: CustomRequestInit): Promise<T> {
    const Token = localStorage.getItem('Token') || '';
    // 请求拦截
    if (!options?.skipAuth) {
        if (!Token) {
            history.push('/login');
            return Promise.reject(new Error('No token found, redirecting to login.'));
        }
    }

    // 重置 headers
    const headers: HeadersInit = {
        ...options?.headers,
        "Content-Type": 'application/json',
        "Authorization": Token,
    }

    const updateOptions: RequestInit = {
        ...options,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    }

    const fetchPromise = await fetch(BASE_URL + path, updateOptions);

    // 超时时间
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), options?.timeout || 5000)
    );

    try {
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!(response instanceof Response)) {
            throw new Error('Failed to fetch data.');
        }

        if (!response.ok) {
            if (response.status === 401) {
                history.push('/login');
                return Promise.reject(new Error('Unauthorized, redirecting to login.'));
            }

            const errorText = await response.text();
            Toast.show({
                icon: 'error',
                content: errorText
            })
            return Promise.reject(new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`));
        }

        const data = (await response.json()) as T;
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return Promise.reject(error);
    }
}