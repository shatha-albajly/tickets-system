import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {

  DashboardTickets,
  Error,
  HomeLayout,
  Login,
  Register,

} from './pages';

import { ErrorElement } from './components';

// actions
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { store } from './store';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <DashboardTickets />,
        errorElement: <ErrorElement />,
      },

      {
        path: '/tickets',
        element: <DashboardTickets />,
        errorElement: <Error />,
      },
      {
        path: '/create-ticket',
        element: <CreateTicket />,
        errorElement: <Error />,
      },
      {
        path: '/ticket/:id',
        element: <TicketDetails />,
        errorElement: <Error />,
      },


    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default App;
