import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getUserProfile } from './store/slices/authSlice';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ToastContainer } from './components/common/Toast/ToastContainer';

function App() {
  const dispatch = useAppDispatch();
  const { accessToken, user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    if (accessToken && !user && status === 'idle') {
      dispatch(getUserProfile());
    }
  }, [accessToken, user, status, dispatch]);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;