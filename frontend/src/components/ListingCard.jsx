export default function ListingCard({
  listing,
  isOwner,
  onEdit,
  onDelete,
  onSelectForRequest
}) {
  const statusLabels = {
    available: 'disponible',
    reserved: 'reserve',
    swapped: 'echange'
  };

  const conditionLabels = {
    new: 'neuf',
    good: 'bon',
    fair: 'moyen'
  };

  return (
    <article className="panel card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{listing.category}</p>
          <h3>{listing.title}</h3>
        </div>
        <span className={`status-pill status-${listing.status}`}>
          {statusLabels[listing.status] || listing.status}
        </span>
      </div>

      <p>{listing.description}</p>
      <p className="muted">
        Etat : {conditionLabels[listing.condition] || listing.condition} | Recuperation : {listing.campusLocation}
      </p>
      <p className="muted">
        Publie par {listing.owner?.name} {listing.owner?.program ? `(${listing.owner.program})` : ''}
      </p>

      <div className="button-row">
        {isOwner ? (
          <>
            <button className="ghost-button" onClick={() => onEdit(listing)}>
              Modifier
            </button>
            <button className="danger-button" onClick={() => onDelete(listing._id)}>
              Supprimer
            </button>
          </>
        ) : (
          <button className="primary-button" onClick={() => onSelectForRequest(listing)}>
            Demander cet objet
          </button>
        )}
      </div>
    </article>
  );
}
