import React from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile/useProfile';

export default function GuestRoute() {
  const { data: profile } = useProfile();
  const [searchParams] = useSearchParams();

  return (
    <>
      {profile?.data ? (
        <Navigate to={searchParams.get('redirect') ?? '/'} replace />
      ) : (
        <Outlet />
      )}
    </>
  );
}
