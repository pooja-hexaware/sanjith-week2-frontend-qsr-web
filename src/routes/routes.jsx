import NotFound from 'views/sessions/NotFound'
import sessionRoutes from 'views/sessions/SessionRoutes'
import MatxLayout from '../components/MatxLayout/MatxLayout'
import homeRoutes from 'views/home/HomeRoutes'
import { Navigate } from 'react-router-dom'
import storeRoutes from 'pages/storePage/StoreConfig'
import menuRoutes from 'pages/menuPage/MenuConfig'

export const AllPages = () => {
    const all_routes = [
        {
            element: <MatxLayout />,
            children: [...homeRoutes, ...storeRoutes, ...menuRoutes],
        },
        ...sessionRoutes,
        {
            path: '/',
            element: <Navigate to="stores" />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]
    return all_routes
}
