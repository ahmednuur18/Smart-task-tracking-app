import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const USERS_KEY = 'APP_USERS';
export const CURRENT_USER = 'CURRENT_USER';

export type User = {
  username: string;
  email: string;
  avatar?: string; // e.g., 'male1', 'female1'
};

type ProfileContextType = {
  profile: User | null;
  setProfile: (user: User) => void;
  loadProfile: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  loadProfile: async () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<User | null>(null);

  const loadProfile = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return;
    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    const found = users.find(u => u.email === email);
    if (found) setProfileState(found);
  };

  const setProfile = async (user: User) => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    const updatedUsers = users.map(u =>
      u.email === user.email ? user : u
    );
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    setProfileState(user);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
