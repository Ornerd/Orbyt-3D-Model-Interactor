import ReactDOM from 'react-dom/client';
import Homepage from './Homepage';
import './index.css'
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';


const appsRouter = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    }, 
    {
        path: 'App/:linkId',
        element: <App/>
    }
])


const rootCode= ReactDOM.createRoot(document.getElementById('root'));
rootCode.render(
<React.StrictMode>
    <RouterProvider router={appsRouter}/>
</React.StrictMode>
);