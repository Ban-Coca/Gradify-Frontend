import { useTheme } from '@/contexts/theme-context'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Badge onClick={toggleTheme} variant={isDark ? 'secondary' : 'primary'} className="ml-2 cursor-pointer">
      {isDark ? '🌙' : '☀️'}
    </Badge>
  );
};