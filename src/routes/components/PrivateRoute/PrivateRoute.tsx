import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile/useProfile';

interface IPrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({
  allowedRoles = [],
}: IPrivateRouteProps) {
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
      ) : // Check if user has role
      allowedRoles.length > 0 && !allowedRoles.includes(profile.role.name) ? (
        <Navigate to="/not-found" replace />
      ) : (
        <Outlet />
      )}
    </>
  );
}
