export default function RequestCard({
  request,
  mode,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const statusLabels = {
    pending: 'en attente',
    approved: 'acceptee',
    rejected: 'refusee',
    cancelled: 'annulee'
  };

  return (
    <article className="panel card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{mode === 'incoming' ? 'Demande recue' : 'Ma demande'}</p>
          <h3>{request.listing?.title}</h3>
        </div>
        <span className={`status-pill status-${request.status}`}>
          {statusLabels[request.status] || request.status}
        </span>
      </div>

      <p>
        <strong>Objet offert :</strong> {request.offeredItem}
      </p>
      <p>{request.message}</p>
      <p className="muted">
        Rencontre : {request.meetupPreference || 'Non precise'} | Etudiant :{' '}
        {request.requester?.name}
      </p>

      <div className="button-row">
        {mode === 'mine' && (
          <>
            <button className="ghost-button" onClick={() => onEdit(request)}>
              Modifier
            </button>
            <button className="danger-button" onClick={() => onDelete(request._id)}>
              Supprimer
            </button>
            {request.status === 'pending' && (
              <button className="ghost-button" onClick={() => onStatusChange(request._id, 'cancelled')}>
                Annuler la demande
              </button>
            )}
          </>
        )}

        {mode === 'incoming' && request.status === 'pending' && (
          <>
            <button className="primary-button" onClick={() => onStatusChange(request._id, 'approved')}>
              Accepter
            </button>
            <button className="danger-button" onClick={() => onStatusChange(request._id, 'rejected')}>
              Refuser
            </button>
          </>
        )}
      </div>
    </article>
  );
}
