import { createBrowserRouter } from "react-router-dom";
import React from "react";

import MonoReport from "../pages/MonoReport";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MonoReport />,
    },
]);

export default router;