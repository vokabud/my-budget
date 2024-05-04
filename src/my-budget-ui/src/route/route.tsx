import { createBrowserRouter } from 'react-router-dom';

import MonoReport from 'pages/MonoReport';
import RulesConfigurator from 'pages/RulesConfigurator';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MonoReport />,
  },
  {
    path: '/rules',
    element: <RulesConfigurator />,
  },
]);

export default router;
