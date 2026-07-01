import { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { apiClient } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import ListingForm from '../components/ListingForm';
import ListingCard from '../components/ListingCard';
import RequestForm from '../components/RequestForm';
import RequestCard from '../components/RequestCard';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export default function DashboardPage() {
  const { auth, logout } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeListing, setActiveListing] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [liveMessage, setLiveMessage] = useState('Les mises a jour en temps reel vont apparaitre ici.');
  const [errorMessage, setErrorMessage] = useState('');
  const socketRef = useRef(null);

  const loadData = async () => {
    try {
      const [listingData, myRequestData, incomingRequestData] = await Promise.all([
        apiClient.get('/listings'),
        apiClient.get('/requests', auth.token),
        apiClient.get('/requests/incoming', auth.token)
      ]);

      setListings(listingData);
      setMyRequests(myRequestData);
      setIncomingRequests(incomingRequestData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket']
    });

    socketRef.current = socket;
    socket.emit('user:join', auth.user?.id || auth.user?._id);

    socket.on('listing:created', (listing) => {
      setListings((current) => [listing, ...current]);
      setLiveMessage(`Nouvelle annonce publiee : ${listing.title}`);
    });

    socket.on('listing:updated', (listing) => {
      setListings((current) => current.map((item) => (item._id === listing._id ? listing : item)));
      setLiveMessage(`Annonce modifiee : ${listing.title}`);
    });

    socket.on('listing:deleted', ({ listingId }) => {
      setListings((current) => current.filter((item) => item._id !== listingId));
      setLiveMessage('Une annonce a ete supprimee.');
    });

    socket.on('request:created', () => {
      loadData();
      setLiveMessage('Une nouvelle demande d’echange vient d’arriver.');
    });

    socket.on('request:updated', () => {
      loadData();
      setLiveMessage('Une demande d’echange a change de statut.');
    });

    socket.on('request:deleted', () => {
      loadData();
      setLiveMessage('Une demande d’echange a ete supprimee.');
    });

    socket.on('notification:new', (payload) => {
      setLiveMessage(payload.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.user]);

  const handleListingSubmit = async (formData) => {
    try {
      if (activeListing) {
        await apiClient.put(`/listings/${activeListing._id}`, formData, auth.token);
        setActiveListing(null);
      } else {
        await apiClient.post('/listings', formData, auth.token);
      }
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await apiClient.delete(`/listings/${listingId}`, auth.token);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRequestSubmit = async (formData) => {
    try {
      if (activeRequest) {
        await apiClient.put(`/requests/${activeRequest._id}`, formData, auth.token);
        setActiveRequest(null);
      } else {
        await apiClient.post(
          '/requests',
          {
            ...formData,
            listing: selectedListing._id
          },
          auth.token
        );
        setSelectedListing(null);
      }
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await apiClient.delete(`/requests/${requestId}`, auth.token);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      await apiClient.put(`/requests/${requestId}`, { status }, auth.token);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const myListings = listings.filter((listing) => listing.owner?._id === (auth.user?.id || auth.user?._id));

  return (
    <div className="page-shell">
      <header className="hero-banner">
        <div>
          <p className="eyebrow">Tableau de bord SwapSpot</p>
          <h1>Echangez des objets utiles avec d’autres etudiants</h1>
          <p className="muted">
            Bienvenue, {auth.user?.name}. Ce tableau de bord couvre l’authentification, le CRUD et
            les evenements en temps reel pour votre demonstration.
          </p>
        </div>
        <div className="hero-actions">
          <div className="live-feed">{liveMessage}</div>
          <button className="ghost-button" onClick={logout}>
            Deconnexion
          </button>
        </div>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <section className="stats-grid">
        <div className="panel stat-card">
          <h2>{listings.length}</h2>
          <p>Total des annonces</p>
        </div>
        <div className="panel stat-card">
          <h2>{myRequests.length}</h2>
          <p>Mes demandes</p>
        </div>
        <div className="panel stat-card">
          <h2>{incomingRequests.length}</h2>
          <p>Demandes recues</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="column">
          <ListingForm
            activeListing={activeListing}
            onSubmit={handleListingSubmit}
            onCancel={() => setActiveListing(null)}
          />

          <div className="panel stacked-form">
            <div className="section-heading">
              <h2>{activeRequest ? 'Modifier une demande' : 'Zone de demande'}</h2>
            </div>
            {selectedListing && !activeRequest && (
              <p className="muted">Envoi d’une demande pour : {selectedListing.title}</p>
            )}
            {!selectedListing && !activeRequest && (
              <p className="muted">Choisissez une annonce pour creer une demande.</p>
            )}
            {(selectedListing || activeRequest) && (
              <RequestForm
                activeRequest={activeRequest}
                onSubmit={handleRequestSubmit}
                onCancel={() => {
                  setActiveRequest(null);
                  setSelectedListing(null);
                }}
              />
            )}
          </div>
        </div>

        <div className="column">
          <section>
            <div className="section-heading">
              <h2>Annonces du marche</h2>
              <p className="muted">{myListings.length} annonces vous appartiennent.</p>
            </div>
            <div className="card-grid">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  isOwner={listing.owner?._id === (auth.user?.id || auth.user?._id)}
                  onEdit={setActiveListing}
                  onDelete={handleDeleteListing}
                  onSelectForRequest={setSelectedListing}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <h2>Mes demandes d’echange</h2>
            </div>
            <div className="card-grid">
              {myRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  mode="mine"
                  onEdit={(requestItem) => {
                    setActiveRequest(requestItem);
                    setSelectedListing(requestItem.listing);
                  }}
                  onDelete={handleDeleteRequest}
                  onStatusChange={handleRequestStatus}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <h2>Demandes recues sur mes annonces</h2>
            </div>
            <div className="card-grid">
              {incomingRequests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  mode="incoming"
                  onStatusChange={handleRequestStatus}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
