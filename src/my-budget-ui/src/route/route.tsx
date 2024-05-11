import { createBrowserRouter } from 'react-router-dom';

import MonoReport from 'pages/MonoReport';
import RulesConfiguration from 'pages/RulesConfiguration';
import MCC from 'pages/Mcc';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MonoReport />,
  },
  {
    path: '/rules',
    element: <RulesConfiguration />,
  },
  {
    path: '/mcc',
    element: <MCC />,
  },
]);

export default router;
