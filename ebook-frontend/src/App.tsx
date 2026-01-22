
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider } from './context/authContext';


const AppContent = () => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">
          Kütüphane Hazırlanıyor...
        </p>
      </div>
    );
  }

  return <LoginPage />;
};


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;