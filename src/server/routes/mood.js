import express from 'express';
import Mood from '../models/Mood.js';
import { protect } from '../middleware/auth.js';
import { validateMood, validateMongoId } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Helper function to generate mood-based suggestions
const generateSuggestion = (mood, intensity, emotions) => {
  const suggestions = {
    sad: [
      { type: 'activity', title: 'Take a Walk', description: 'A 15-minute walk can boost your mood and clear your mind.', icon: '🚶' },
      { type: 'book', title: 'The Happiness Project', description: 'An inspiring read about finding joy in everyday life.', icon: '📚' },
      { type: 'song', title: 'Here Comes the Sun - The Beatles', description: 'An uplifting classic to brighten your day.', icon: '🎵' },
      { type: 'coping', title: 'Breathing Exercise', description: 'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.', icon: '🧘' }
    ],
    anxious: [
      { type: 'activity', title: 'Meditation', description: 'Try a 10-minute guided meditation on YouTube or a meditation app.', icon: '🧘' },
      { type: 'coping', title: 'Grounding Technique', description: '5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.', icon: '🌟' },
      { type: 'game', title: 'Stardew Valley', description: 'A calming farming simulator to help you relax.', icon: '🎮' },
      { type: 'song', title: 'Weightless - Marconi Union', description: 'Scientifically proven to reduce anxiety.', icon: '🎵' }
    ],
    stressed: [
      { type: 'activity', title: 'Journaling', description: 'Write down your thoughts and worries to process them better.', icon: '📝' },
      { type: 'coping', title: 'Progressive Muscle Relaxation', description: 'Tense and relax each muscle group from toes to head.', icon: '💪' },
      { type: 'game', title: 'Animal Crossing', description: 'A peaceful game to help you unwind and de-stress.', icon: '🎮' },
      { type: 'song', title: 'Clair de Lune - Debussy', description: 'Beautiful classical music for relaxation.', icon: '🎵' }
    ],
    angry: [
      { type: 'activity', title: 'Physical Exercise', description: 'Channel your energy with a workout or run.', icon: '🏃' },
      { type: 'coping', title: 'Count to 10', description: 'Take deep breaths and count slowly to calm down before reacting.', icon: '🔢' },
      { type: 'book', title: 'The Anger Control Workbook', description: 'Practical techniques for managing anger.', icon: '📚' },
      { type: 'activity', title: 'Art Therapy', description: 'Express your feelings through drawing or painting.', icon: '🎨' }
    ],
    okay: [
      { type: 'activity', title: 'Try Something New', description: 'Learn a new skill or hobby to add excitement to your day.', icon: '✨' },
      { type: 'game', title: 'Celeste', description: 'A challenging but rewarding platformer with mental health themes.', icon: '🎮' },
      { type: 'book', title: 'Atomic Habits', description: 'Build better habits for a more fulfilling life.', icon: '📚' },
      { type: 'song', title: 'Good Vibrations - The Beach Boys', description: 'Feel-good music to lift your spirits.', icon: '🎵' }
    ],
    good: [
      { type: 'activity', title: 'Share Your Joy', description: 'Reach out to a friend and spread your positive energy!', icon: '💬' },
      { type: 'coping', title: 'Gratitude Practice', description: 'Write down 3 things you\'re grateful for today.', icon: '🙏' },
      { type: 'song', title: 'Happy - Pharrell Williams', description: 'Celebrate your good mood with upbeat music!', icon: '🎵' },
      { type: 'activity', title: 'Help Someone', description: 'Your positive mood is perfect for brightening someone else\'s day.', icon: '🤝' }
    ],
    amazing: [
      { type: 'activity', title: 'Capture the Moment', description: 'Take photos or journal about what makes today special.', icon: '📸' },
      { type: 'coping', title: 'Savor This Feeling', description: 'Take a mindful moment to fully experience and remember this happiness.', icon: '✨' },
      { type: 'song', title: 'Don\'t Stop Me Now - Queen', description: 'Match your amazing energy with this epic song!', icon: '🎵' },
      { type: 'activity', title: 'Set New Goals', description: 'Use this positive momentum to plan your next achievements.', icon: '🎯' }
    ]
  };

  // Get suggestions for the mood, or default to 'okay' if mood not found
  const moodSuggestions = suggestions[mood] || suggestions['okay'];
  
  // Return a random suggestion from the array
  return moodSuggestions[Math.floor(Math.random() * moodSuggestions.length)];
};

// @route   POST /api/moods
// @desc    Create a new mood entry
// @access  Private
router.post('/', validateMood, async (req, res) => {
  try {
    const moodData = {
      ...req.body,
      userId: req.user.id
    };

    // Generate suggestion based on mood
    const suggestion = generateSuggestion(
      req.body.mood,
      req.body.intensity,
      req.body.emotions || []
    );
    moodData.suggestion = suggestion;

    const mood = await Mood.create(moodData);

    res.status(201).json({
      success: true,
      message: 'Mood entry created successfully',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating mood entry',
      error: error.message
    });
  }
});

// @route   GET /api/moods
// @desc    Get all mood entries for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { limit = 30, sort = '-date' } = req.query;

    const moods = await Mood.find({ userId: req.user.id })
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
});

// @route   GET /api/moods/stats
// @desc    Get mood statistics for current user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const stats = await Mood.getUserStats(req.user.id, parseInt(days));

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood statistics',
      error: error.message
    });
  }
});

// @route   GET /api/moods/:id
// @desc    Get single mood entry
// @access  Private
router.get('/:id', validateMongoId, async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entry',
      error: error.message
    });
  }
});

// @route   PUT /api/moods/:id
// @desc    Update mood entry
// @access  Private
router.put('/:id', validateMongoId, async (req, res) => {
  try {
    let mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    mood = await Mood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Mood entry updated successfully',
      data: mood
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating mood entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/moods/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', validateMongoId, async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found'
      });
    }

    await Mood.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mood entry',
      error: error.message
    });
  }
});

// @route   GET /api/moods/range/:startDate/:endDate
// @desc    Get mood entries within date range
// @access  Private
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const moods = await Mood.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mood entries',
      error: error.message
    });
  }
});

export default router;