import React from 'react';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";


const Layout = () => {
    return (
        <div>
            <Outlet/>
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <NotFound/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "*",
                element: <NotFound/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/register",
                element: <Register/>
            },
        ]
    },
]);

const App = () => {
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    );
};

export default App;