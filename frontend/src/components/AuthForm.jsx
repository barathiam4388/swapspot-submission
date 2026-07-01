import { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  password: '',
  program: ''
};

export default function AuthForm({ mode = 'login', onSubmit, errorMessage }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Application d’echange sur le campus</p>
        <h1>{mode === 'signup' ? 'Creez votre compte' : 'Bon retour'}</h1>
        <p className="muted">
          {mode === 'signup'
            ? 'Rejoignez SwapSpot et echangez des objets utiles avec d’autres etudiants.'
            : 'Connectez-vous pour gerer les annonces, les demandes et les mises a jour en temps reel.'}
        </p>
      </div>

      {mode === 'signup' && (
        <>
          <label>
            Nom complet
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Programme
            <input name="program" value={formData.program} onChange={handleChange} />
          </label>
        </>
      )}

      <label>
        Email
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Mot de passe
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          required
        />
      </label>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="primary-button" type="submit">
        {mode === 'signup' ? 'Creer un compte' : 'Connexion'}
      </button>
    </form>
  );
}
