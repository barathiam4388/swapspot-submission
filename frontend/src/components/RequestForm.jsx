import { useEffect, useState } from 'react';

const emptyRequest = {
  offeredItem: '',
  message: '',
  meetupPreference: ''
};

export default function RequestForm({ activeRequest, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(emptyRequest);

  useEffect(() => {
    setFormData(
      activeRequest
        ? {
            offeredItem: activeRequest.offeredItem,
            message: activeRequest.message,
            meetupPreference: activeRequest.meetupPreference || ''
          }
        : emptyRequest
    );
  }, [activeRequest]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    if (!activeRequest) {
      setFormData(emptyRequest);
    }
  };

  return (
    <form className="panel stacked-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{activeRequest ? 'Modifier votre demande' : 'Envoyer une demande d’echange'}</h2>
        {activeRequest && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Annuler la modification
          </button>
        )}
      </div>

      <label>
        Objet offert
        <input name="offeredItem" value={formData.offeredItem} onChange={handleChange} required />
      </label>
      <label>
        Message
        <textarea name="message" value={formData.message} onChange={handleChange} required />
      </label>
      <label>
        Preference de rencontre
        <input
          name="meetupPreference"
          value={formData.meetupPreference}
          onChange={handleChange}
          placeholder="Exemple : entree de la bibliotheque apres le cours"
        />
      </label>

      <button className="primary-button" type="submit">
        {activeRequest ? 'Mettre a jour la demande' : 'Envoyer la demande'}
      </button>
    </form>
  );
}
