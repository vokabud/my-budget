import { createBrowserRouter } from 'react-router-dom';

import MonoReport from 'pages/MonoReport';
import RulesConfiguration from 'pages/RulesConfiguration';
import MCC from 'pages/Mcc';
import ExpenseReport from 'pages/ExpenseReport';

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
  {
    path: '/expense-report',
    element: <ExpenseReport />,
  },
]);

export default router;
