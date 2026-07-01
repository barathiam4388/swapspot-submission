import { useEffect, useState } from 'react';

const emptyListing = {
  title: '',
  description: '',
  category: '',
  condition: 'good',
  status: 'available',
  campusLocation: ''
};

export default function ListingForm({ activeListing, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(emptyListing);

  useEffect(() => {
    setFormData(activeListing || emptyListing);
  }, [activeListing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData(emptyListing);
  };

  return (
    <form className="panel stacked-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <h2>{activeListing ? 'Modifier une annonce' : 'Creer une annonce'}</h2>
        {activeListing && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Annuler la modification
          </button>
        )}
      </div>

      <label>
        Titre
        <input name="title" value={formData.title} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </label>
      <label>
        Categorie
        <input name="category" value={formData.category} onChange={handleChange} required />
      </label>
      <label>
        Lieu sur le campus
        <input name="campusLocation" value={formData.campusLocation} onChange={handleChange} required />
      </label>
      <label>
        Etat
        <select name="condition" value={formData.condition} onChange={handleChange}>
          <option value="new">Neuf</option>
          <option value="good">Bon</option>
          <option value="fair">Moyen</option>
        </select>
      </label>
      <label>
        Statut
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="available">Disponible</option>
          <option value="reserved">Reserve</option>
          <option value="swapped">Echange</option>
        </select>
      </label>

      <button className="primary-button" type="submit">
        {activeListing ? 'Enregistrer les changements' : 'Publier l’annonce'}
      </button>
    </form>
  );
}
