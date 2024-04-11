import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile/useProfile';

export default function PrivateRoute() {
  const { data: profile } = useProfile();
  const location = useLocation();

  const url = new URLSearchParams();
  url.set('redirect', location.pathname + location.search);

  return (
    <>
      {!profile ? (
        <Navigate
          to={{
            pathname: '/login',
            search: url.toString(),
          }}
          replace
        />
      ) : (
        <Outlet />
      )}
    </>
  );
}
