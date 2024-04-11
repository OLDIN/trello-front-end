import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile/useProfile';

export default function GuestRoute() {
  const { data: profile } = useProfile();
  const location = useLocation();

  const url = new URLSearchParams(location.search.slice(1));

  return (
    <>
      {profile ? (
        <Navigate to={url.get('redirect') ?? '/'} replace />
      ) : (
        <Outlet />
      )}
    </>
  );
}
