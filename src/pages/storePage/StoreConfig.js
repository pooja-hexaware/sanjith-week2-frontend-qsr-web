import React, { lazy } from 'react'
import Loadable from 'components/Loadable/Loadable';

const Stores = Loadable(lazy(() => import("./StorePage")));

const storeRoutes = [
    {
        path: '/stores',
        element: <Stores />,
    },
]

export default storeRoutes
