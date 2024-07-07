import { Navigate, Outlet } from 'umi';

export default ({ children }) => {
    //   const { isLogin } = useAuth();
    const isLogin = window.localStorage.getItem('isLogin');
    // console.log('no', props);
    if (isLogin) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}