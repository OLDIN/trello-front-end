import { IProfile } from '../../types/Profile';

export const getPersistUser = (): IProfile | null => {
  const persistUser = localStorage.getItem('user');

  if (!persistUser) {
    return null;
  }

  try {
    return JSON.parse(persistUser);
  } catch (error) {
    return null;
  }
};

export const setPersistUser = (user: IProfile | null) => {
  if (!user) {
    localStorage.removeItem('user');
    return;
  }

  localStorage.setItem('user', JSON.stringify(user));
};
