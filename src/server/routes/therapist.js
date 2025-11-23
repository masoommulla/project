import express from 'express';
import Therapist from '../models/Therapist.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/therapists
// @desc    Get all therapists with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      specialty,
      language,
      minRating,
      ageGroup,
      sort = '-rating',
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = { isActive: true, isVerified: true };
    
    if (specialty) {
      query.specialties = { $in: specialty.split(',') };
    }
    
    if (language) {
      query.languages = { $in: language.split(',') };
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    if (ageGroup) {
      query.ageGroups = { $in: ageGroup.split(',') };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const therapists = await Therapist.find(query)
      .populate('userId', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Therapist.countDocuments(query);

    res.status(200).json({
      success: true,
      count: therapists.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: therapists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapists',
      error: error.message
    });
  }
});

// @route   GET /api/therapists/featured
// @desc    Get featured therapists (top rated)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const therapists = await Therapist.find({
      isActive: true,
      isVerified: true,
      rating: { $gte: 4.5 }
    })
    .populate('userId', 'name email')
    .sort('-rating -reviewCount')
    .limit(6);

    res.status(200).json({
      success: true,
      count: therapists.length,
      data: therapists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured therapists',
      error: error.message
    });
  }
});

// @route   GET /api/therapists/search
// @desc    Search therapists by name or specialty
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const therapists = await Therapist.find({
      isActive: true,
      isVerified: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { specialties: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('userId', 'name email')
    .sort('-rating');

    res.status(200).json({
      success: true,
      count: therapists.length,
      data: therapists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching therapists',
      error: error.message
    });
  }
});

// @route   GET /api/therapists/:id
// @desc    Get single therapist by ID
// @access  Public
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id)
      .populate('userId', 'name email avatar');

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapist',
      error: error.message
    });
  }
});

// @route   POST /api/therapists
// @desc    Create therapist profile
// @access  Private (Therapist role)
router.post('/', protect, authorize('therapist', 'admin'), async (req, res) => {
  try {
    const therapistData = {
      ...req.body,
      userId: req.user.id
    };

    // Check if therapist profile already exists
    const existingTherapist = await Therapist.findOne({ userId: req.user.id });
    if (existingTherapist) {
      return res.status(400).json({
        success: false,
        message: 'Therapist profile already exists'
      });
    }

    const therapist = await Therapist.create(therapistData);

    res.status(201).json({
      success: true,
      message: 'Therapist profile created successfully',
      data: therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating therapist profile',
      error: error.message
    });
  }
});

// @route   PUT /api/therapists/:id
// @desc    Update therapist profile
// @access  Private (Owner or Admin)
router.put('/:id', protect, validateMongoId, async (req, res) => {
  try {
    let therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Check ownership
    if (therapist.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Therapist profile updated successfully',
      data: therapist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating therapist profile',
      error: error.message
    });
  }
});

// @route   DELETE /api/therapists/:id
// @desc    Delete therapist profile
// @access  Private (Owner or Admin)
router.delete('/:id', protect, validateMongoId, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Check ownership
    if (therapist.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this profile'
      });
    }

    await Therapist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Therapist profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting therapist profile',
      error: error.message
    });
  }
});

// @route   GET /api/therapists/:id/availability
// @desc    Get therapist availability
// @access  Public
router.get('/:id/availability', validateMongoId, async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    res.status(200).json({
      success: true,
      data: therapist.availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
});

export default router;
