import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';

function AdminGuard({ children }) {
    const { account } = useContext(DataContext);
    const location = useLocation();

    if (!account) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (account.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default AdminGuard;
