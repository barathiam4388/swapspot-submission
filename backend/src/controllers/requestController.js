import Listing from '../models/Listing.js';
import SwapRequest from '../models/SwapRequest.js';
import { emitEvent, emitToUser } from '../utils/socket.js';

const populateRequest = (query) =>
  query
    .populate('requester', 'name email program')
    .populate({
      path: 'listing',
      populate: {
        path: 'owner',
        select: 'name email program'
      }
    });

export const createSwapRequest = async (req, res) => {
  try {
    const listing = await Listing.findById(req.body.listing);

    if (!listing) {
      return res.status(404).json({ message: 'Annonce introuvable.' });
    }

    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Vous ne pouvez pas faire une demande sur votre propre annonce.' });
    }

    const swapRequest = await SwapRequest.create({
      ...req.body,
      requester: req.user._id
    });

    const populatedRequest = await populateRequest(SwapRequest.findById(swapRequest._id));
    listing.status = 'reserved';
    await listing.save();

    emitEvent('request:created', populatedRequest);
    emitToUser(listing.owner.toString(), 'notification:new', {
      message: `${req.user.name} a envoye une nouvelle demande d’echange pour ${listing.title}.`
    });

    return res.status(201).json(populatedRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de creer la demande.', error: error.message });
  }
};

export const getSwapRequests = async (req, res) => {
  try {
    const swapRequests = await populateRequest(
      SwapRequest.find({
        $or: [{ requester: req.user._id }]
      }).sort({ createdAt: -1 })
    );

    return res.json(swapRequests);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de recuperer vos demandes.', error: error.message });
  }
};

export const getIncomingRequests = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).select('_id');
    const swapRequests = await populateRequest(
      SwapRequest.find({ listing: { $in: listings } }).sort({ createdAt: -1 })
    );

    return res.json(swapRequests);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de recuperer les demandes recues.', error: error.message });
  }
};

export const getSwapRequestById = async (req, res) => {
  try {
    const swapRequest = await populateRequest(SwapRequest.findById(req.params.id));

    if (!swapRequest) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }

    const isRequester = swapRequest.requester._id.toString() === req.user._id.toString();
    const isOwner = swapRequest.listing.owner._id.toString() === req.user._id.toString();

    if (!isRequester && !isOwner) {
      return res.status(403).json({ message: 'Vous n’avez pas acces a cette demande.' });
    }

    return res.json(swapRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de recuperer la demande.', error: error.message });
  }
};

export const updateSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id).populate({
      path: 'listing',
      populate: {
        path: 'owner',
        select: 'name email program'
      }
    });

    if (!swapRequest) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }

    const isRequester = swapRequest.requester.toString() === req.user._id.toString();
    const isOwner = swapRequest.listing.owner._id.toString() === req.user._id.toString();

    if (!isRequester && !isOwner) {
      return res.status(403).json({ message: 'Vous n’avez pas la permission de modifier cette demande.' });
    }

    if (isOwner && req.body.status) {
      swapRequest.status = req.body.status;
      if (req.body.status === 'approved') {
        await Listing.findByIdAndUpdate(swapRequest.listing._id, { status: 'swapped' });
      }
      if (['rejected', 'cancelled'].includes(req.body.status)) {
        await Listing.findByIdAndUpdate(swapRequest.listing._id, { status: 'available' });
      }
    }

    if (isRequester) {
      if (swapRequest.status !== 'pending' && req.body.status && req.body.status !== 'cancelled') {
        return res.status(400).json({ message: 'Seules les demandes en attente peuvent encore etre modifiees.' });
      }

      swapRequest.offeredItem = req.body.offeredItem ?? swapRequest.offeredItem;
      swapRequest.message = req.body.message ?? swapRequest.message;
      swapRequest.meetupPreference = req.body.meetupPreference ?? swapRequest.meetupPreference;

      if (req.body.status === 'cancelled') {
        swapRequest.status = 'cancelled';
        await Listing.findByIdAndUpdate(swapRequest.listing._id, { status: 'available' });
      }
    }

    await swapRequest.save();

    const populatedRequest = await populateRequest(SwapRequest.findById(swapRequest._id));
    emitEvent('request:updated', populatedRequest);
    emitToUser(populatedRequest.requester._id.toString(), 'notification:new', {
      message: `Votre demande pour ${populatedRequest.listing.title} est maintenant ${populatedRequest.status}.`
    });

    return res.json(populatedRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de modifier la demande.', error: error.message });
  }
};

export const deleteSwapRequest = async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id).populate('listing');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }

    if (swapRequest.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Seul le demandeur peut supprimer cette demande.' });
    }

    await swapRequest.deleteOne();
    await Listing.findByIdAndUpdate(swapRequest.listing._id, { status: 'available' });

    emitEvent('request:deleted', { requestId: req.params.id, listingId: swapRequest.listing._id });

    return res.json({ message: 'Demande supprimee avec succes.' });
  } catch (error) {
    return res.status(500).json({ message: 'Impossible de supprimer la demande.', error: error.message });
  }
};
