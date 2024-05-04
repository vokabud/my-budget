import { createBrowserRouter } from 'react-router-dom';

import MonoReport from 'pages/MonoReport';
import RulesConfiguration from 'pages/RulesConfiguration';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MonoReport />,
  },
  {
    path: '/rules',
    element: <RulesConfiguration />,
  },
]);

export default router;
