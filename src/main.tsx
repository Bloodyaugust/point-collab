import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import Team from './Team/Team.tsx';
import Teams from './Teams/Teams.tsx';
import Welcome from './Welcome/Welcome.tsx';
import './index.css';
import queryClient from './lib/QueryClient.ts';
import Root from './root.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'team/:teamID',
        element: <Team />,
      },
      {
        path: 'teams',
        element: <Teams />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
