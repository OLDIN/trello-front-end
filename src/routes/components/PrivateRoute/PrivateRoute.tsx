import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile/useProfile';

export default function PrivateRoute() {
  const { data: profile } = useProfile();

  return <>{!profile?.data ? <Navigate to="/" replace /> : <Outlet />}</>;
}
