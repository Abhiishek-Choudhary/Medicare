import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCart } from '../services/api';
import { DataContext } from './DataProvider';

export const CartContext = createContext({
    cart: null,
    itemCount: 0,
    loading: false,
    refresh: () => {},
    clearLocal: () => {},
});

const CartProvider = ({ children }) => {
    const { account, role } = useContext(DataContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!account || role !== 'patient') {
            setCart(null);
            return;
        }
        setLoading(true);
        try {
            const { data } = await getCart();
            setCart(data);
        } catch (e) {
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, [account, role]);

    useEffect(() => { refresh(); }, [refresh]);

    const clearLocal = () => setCart(null);

    return (
        <CartContext.Provider value={{
            cart,
            itemCount: cart?.itemCount || 0,
            loading,
            refresh,
            clearLocal,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
