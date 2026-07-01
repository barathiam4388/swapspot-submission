import Listing from '../models/Listing.js';
import SwapRequest from '../models/SwapRequest.js';
import { emitEvent } from '../utils/socket.js';

export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      owner: req.user._id
    });

    const populatedListing = await listing.populate('owner', 'name email program');
    emitEvent('listing:created', populatedListing);

    return res.status(201).json(populatedListing);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de creer l’annonce.', error: error.message });
  }
};

export const getListings = async (_req, res) => {
  try {
    const listings = await Listing.find()
      .populate('owner', 'name email program')
      .sort({ createdAt: -1 });

    return res.json(listings);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de recuperer les annonces.', error: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email program');

    if (!listing) {
      return res.status(404).json({ message: 'Annonce introuvable.' });
    }

    return res.json(listing);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de recuperer l’annonce.', error: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Annonce introuvable.' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Seul le proprietaire peut modifier cette annonce.' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    const populatedListing = await listing.populate('owner', 'name email program');
    emitEvent('listing:updated', populatedListing);

    return res.json(populatedListing);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de modifier l’annonce.', error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Annonce introuvable.' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Seul le proprietaire peut supprimer cette annonce.' });
    }

    await SwapRequest.deleteMany({ listing: listing._id });
    await listing.deleteOne();

    emitEvent('listing:deleted', { listingId: req.params.id });

    return res.json({ message: 'Annonce supprimee avec succes.' });
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de supprimer l’annonce.', error: error.message });
  }
};
