import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { apiClient } from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (formData) => {
    try {
      const result = await apiClient.post('/auth/signup', formData);
      setAuth(result);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-layout">
      <AuthForm mode="signup" onSubmit={handleSignup} errorMessage={errorMessage} />
      <p className="auth-switch">
        Deja inscrit ? <Link to="/login">Connectez-vous ici</Link>
      </p>
    </div>
  );
}
