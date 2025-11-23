import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  specialties: [{
    type: String,
    required: true
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  credentials: {
    degree: String,
    license: String,
    certifications: [String],
    yearsOfExperience: Number
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: { type: Boolean, default: true }
    }]
  }],
  languages: [{
    type: String
  }],
  approaches: [{
    type: String
  }],
  ageGroups: [{
    type: String,
    enum: ['children', 'teens', 'adults', 'seniors']
  }],
  pricing: {
    sessionRate: Number,
    currency: { type: String, default: 'USD' },
    acceptsInsurance: { type: Boolean, default: false }
  },
  videoCallLink: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '24 hours'
  }
}, {
  timestamps: true
});

// Index for searching
therapistSchema.index({ specialties: 1 });
therapistSchema.index({ rating: -1 });
therapistSchema.index({ isActive: 1, isVerified: 1 });

// Calculate average rating from reviews
therapistSchema.methods.updateRating = async function() {
  const Appointment = mongoose.model('Appointment');
  const appointments = await Appointment.find({
    therapistId: this._id,
    'review.rating': { $exists: true }
  });
  
  if (appointments.length > 0) {
    const totalRating = appointments.reduce((sum, apt) => sum + apt.review.rating, 0);
    this.rating = (totalRating / appointments.length).toFixed(1);
    this.reviewCount = appointments.length;
    await this.save();
  }
};

const Therapist = mongoose.model('Therapist', therapistSchema);

export default Therapist;
