import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { apiClient } from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (formData) => {
    try {
      const result = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      setAuth(result);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-layout">
      <AuthForm mode="login" onSubmit={handleLogin} errorMessage={errorMessage} />
      <p className="auth-switch">
        Pas encore de compte ? <Link to="/signup">Creez-en un ici</Link>
      </p>
    </div>
  );
}
