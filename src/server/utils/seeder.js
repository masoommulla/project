import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Resource from '../models/Resource.js';

dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'Test User',
    email: 'user@test.com',
    password: 'password123',
    age: 16,
    role: 'user'
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah@therapist.com',
    password: 'password123',
    age: 35,
    role: 'therapist'
  }
];

const sampleTherapists = [
  {
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Teen Mental Health'],
    bio: 'Dr. Sarah Johnson is a compassionate psychologist with over 10 years of experience working with teenagers. She specializes in cognitive behavioral therapy and mindfulness-based approaches.',
    credentials: {
      degree: 'Ph.D. in Clinical Psychology',
      license: 'CA PSY 12345',
      certifications: ['CBT Certified', 'Adolescent Therapy Specialist'],
      yearsOfExperience: 10
    },
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    rating: 4.9,
    reviewCount: 127,
    languages: ['English', 'Spanish'],
    approaches: ['Cognitive Behavioral Therapy', 'Mindfulness', 'Solution-Focused'],
    ageGroups: ['teens', 'adults'],
    pricing: {
      sessionRate: 120,
      currency: 'USD',
      acceptsInsurance: true
    },
    isVerified: true,
    isActive: true,
    responseTime: '24 hours'
  },
  {
    name: 'Dr. Michael Chen',
    title: 'Teen Counseling Specialist',
    specialties: ['Stress Management', 'Self-Esteem', 'Family Issues'],
    bio: 'Dr. Chen focuses on helping teens navigate life challenges and build resilience. His warm, supportive approach creates a safe space for personal growth.',
    credentials: {
      degree: 'M.A. in Counseling Psychology',
      license: 'CA LMFT 54321',
      certifications: ['Teen Mental Health First Aid', 'Family Therapy'],
      yearsOfExperience: 8
    },
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    rating: 4.8,
    reviewCount: 94,
    languages: ['English', 'Mandarin'],
    approaches: ['Person-Centered', 'Family Systems', 'Narrative Therapy'],
    ageGroups: ['teens'],
    pricing: {
      sessionRate: 100,
      currency: 'USD',
      acceptsInsurance: false
    },
    isVerified: true,
    isActive: true,
    responseTime: '12 hours'
  }
];

const sampleResources = [
  {
    title: 'Understanding Anxiety: A Teen\'s Guide',
    description: 'Learn about anxiety, its symptoms, and practical coping strategies designed specifically for teenagers.',
    category: 'article',
    type: 'anxiety',
    content: 'This comprehensive guide helps teens understand and manage anxiety...',
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
    duration: '10 min read',
    difficulty: 'beginner',
    tags: ['anxiety', 'coping', 'mental health'],
    author: {
      name: 'Dr. Emily Roberts',
      credentials: 'Ph.D. Clinical Psychology'
    },
    isPremium: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 234
  },
  {
    title: 'Guided Meditation for Sleep',
    description: 'A calming 15-minute guided meditation to help you relax and fall asleep peacefully.',
    category: 'audio',
    type: 'sleep',
    url: 'https://example.com/meditation.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    duration: '15 minutes',
    difficulty: 'beginner',
    tags: ['sleep', 'meditation', 'relaxation'],
    author: {
      name: 'Mindful Moments Team'
    },
    isPremium: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 567
  },
  {
    title: 'Stress Relief Breathing Exercises',
    description: 'Simple breathing techniques you can use anytime, anywhere to reduce stress and anxiety.',
    category: 'exercise',
    type: 'stress',
    content: 'Practice these 5 powerful breathing exercises...',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    duration: '5 minutes',
    difficulty: 'beginner',
    tags: ['stress', 'breathing', 'exercises'],
    isPremium: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 189
  },
  {
    title: 'Building Self-Esteem Workbook',
    description: 'Interactive exercises and activities to help you build confidence and develop a positive self-image.',
    category: 'worksheet',
    type: 'self-esteem',
    url: 'https://example.com/workbook.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    duration: '30 minutes',
    difficulty: 'intermediate',
    tags: ['self-esteem', 'confidence', 'worksheets'],
    author: {
      name: 'Dr. James Wilson',
      credentials: 'Licensed Therapist'
    },
    isPremium: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 78
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Therapist.deleteMany();
    await Resource.deleteMany();

    console.log('🗑️  Data cleared');

    // Create users
    const users = await User.create(sampleUsers);
    console.log('✅ Users created');

    // Link therapist to user
    const therapistUser = users.find(u => u.role === 'therapist');
    if (therapistUser) {
      sampleTherapists[0].userId = therapistUser._id;
      sampleTherapists[1].userId = therapistUser._id;
    }

    // Create therapists
    await Therapist.create(sampleTherapists);
    console.log('✅ Therapists created');

    // Create resources
    await Resource.create(sampleResources);
    console.log('✅ Resources created');

    console.log('🎉 All sample data imported successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   User: user@test.com / password123');
    console.log('   Therapist: sarah@therapist.com / password123');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Therapist.deleteMany();
    await Resource.deleteMany();

    console.log('🗑️  All data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('  node utils/seeder.js -i    Import sample data');
  console.log('  node utils/seeder.js -d    Delete all data');
}
