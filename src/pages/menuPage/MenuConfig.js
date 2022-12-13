import { lazy } from "react"
import Loadable from 'components/Loadable/Loadable';

const MenuPage = Loadable(lazy(() => import("./MenuPage")));

const menuRoutes = [
    {
        path: "/store/:storeid/menu",
        element: <MenuPage />
    }
]

export default menuRoutes