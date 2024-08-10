import { Navigate, Outlet } from 'umi';

export default () => {
    const isLogin = window.localStorage.getItem('Token');
    if (isLogin) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}