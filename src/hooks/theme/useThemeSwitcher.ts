import { RootState } from '@/store/store';
import { toggleTheme } from '@/store/themeSlice/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

export const useThemeSwitch = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return { theme, toggleTheme: handleToggleTheme };
};