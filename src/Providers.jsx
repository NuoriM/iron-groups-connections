// Providers.jsx
import { PrimeReactProvider } from 'primereact/api';

export default function Providers({ children }) {
  return (
    <PrimeReactProvider>
      {children}
    </PrimeReactProvider>
  );
}