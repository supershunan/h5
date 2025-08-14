import { Navigate, Outlet } from 'umi';

export default () => {
    const tokenTime = window.localStorage.getItem('TokenTime');
    const currentTime = new Date().getTime();
    
    // 检查token是否小于12小时过期
    const isOverdue = tokenTime ? 
        (currentTime - new Date(tokenTime).getTime()) > (12 * 60 * 60 * 1000) : 
        true;
    
    if (isOverdue) {
        window.localStorage.removeItem('Token');
        window.localStorage.removeItem('TokenTime');
    }
    const isLogin = window.localStorage.getItem('Token');
    if (isLogin && !isOverdue) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}