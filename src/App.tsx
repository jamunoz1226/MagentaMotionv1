import { useMemo } from 'react';
import { Theme } from './settings/types';
import { ErrorBoundary } from './ErrorBoundary';
import PerformanceTrackerApp from './components/generated/PerformanceTrackerApp';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
  return (
    <ErrorBoundary>
      <PerformanceTrackerApp />
    </ErrorBoundary>
  );
}

export default App;
