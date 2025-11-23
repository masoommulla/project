import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  DollarSign, 
  Video, 
  MessageCircle,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PageTransition3D } from './3DGraphics';
import { TherapistProfile } from './TherapistProfile';
import { BookingModal } from './BookingModal';
import { ProgressTracker } from './ProgressTracker';
import { SessionManager } from './SessionManager';
import { VideoCallInterface } from './VideoCallInterface';
import { TherapistChat } from './TherapistChat';
import { therapistsData } from '../data/therapists';
import { Therapist } from '../types/therapist';
import { SupportiveCharacter } from './AnimeCharacters';
import { useNavigate } from 'react-router-dom';

interface TherapistDashboardProps {
  onBack: () => void;
}

type ViewMode = 'browse' | 'profile' | 'booking' | 'sessions' | 'progress' | 'video' | 'chat';

export function TherapistDashboard({ onBack }: TherapistDashboardProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'cost'>('rating');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');

  const handleHome = () => {
    navigate('/dashboard');
  };

  // Filter and sort therapists
  const filteredTherapists = therapistsData
    .filter(therapist => {
      const matchesSearch = 
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesAvailability = 
        filterAvailability === 'all' || 
        therapist.availability.toLowerCase() === filterAvailability.toLowerCase();
      
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'cost':
          return a.costPerSession - b.costPerSession;
        default:
          return 0;
      }
    });

  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setViewMode('profile');
  };

  const handleBookSession = () => {
    setViewMode('booking');
  };

  const handleStartVideo = () => {
    setViewMode('video');
  };

  const handleStartChat = () => {
    setViewMode('chat');
  };

  const stats = [
    {
      icon: Calendar,
      label: 'Upcoming Sessions',
      value: '3',
      color: 'from-blue-500 to-cyan-500',
      trend: '+1 this week'
    },
    {
      icon: TrendingUp,
      label: 'Progress Score',
      value: '85%',
      color: 'from-green-500 to-emerald-500',
      trend: '+12% this month'
    },
    {
      icon: MessageCircle,
      label: 'Active Chats',
      value: '2',
      color: 'from-purple-500 to-pink-500',
      trend: '1 unread'
    },
    {
      icon: Award,
      label: 'Milestones',
      value: '8',
      color: 'from-yellow-500 to-orange-500',
      trend: '2 new'
    }
  ];

  // Render different views
  if (viewMode === 'profile' && selectedTherapist) {
    return (
      <TherapistProfile
        therapist={selectedTherapist}
        onBack={() => setViewMode('browse')}
        onBookSession={handleBookSession}
        onStartChat={handleStartChat}
        onStartVideo={handleStartVideo}
      />
    );
  }

  if (viewMode === 'booking' && selectedTherapist) {
    return (
      <BookingModal
        therapist={selectedTherapist}
        onBack={() => setViewMode('profile')}
        onConfirm={() => {
          // Navigate to appointments section after successful booking
          navigate('/dashboard/appointments');
        }}
      />
    );
  }

  if (viewMode === 'sessions') {
    return (
      <SessionManager
        onBack={() => setViewMode('browse')}
        onStartVideo={handleStartVideo}
        onStartChat={handleStartChat}
      />
    );
  }

  if (viewMode === 'progress') {
    return (
      <ProgressTracker
        onBack={() => setViewMode('browse')}
      />
    );
  }

  if (viewMode === 'video' && selectedTherapist) {
    return (
      <VideoCallInterface
        therapist={selectedTherapist}
        onEnd={() => setViewMode('sessions')}
      />
    );
  }

  if (viewMode === 'chat' && selectedTherapist) {
    return (
      <TherapistChat
        therapist={selectedTherapist}
        onBack={() => setViewMode('profile')}
      />
    );
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-8 pb-8 overflow-hidden">
        {/* Home Button - Top Left */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHome}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          title="Back to Dashboard"
        >
          <Home className="w-6 h-6" />
        </motion.button>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Find Your Perfect Therapist
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with licensed mental health professionals who understand teen challenges
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden border-2 border-transparent hover:border-purple-200 transition-all cursor-pointer shadow-lg"
                  onClick={() => {
                    if (stat.label === 'Upcoming Sessions') setViewMode('sessions');
                    if (stat.label === 'Progress Score') setViewMode('progress');
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.trend}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-2 border-purple-100">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search by name or specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Highest Rated
                        </div>
                      </SelectItem>
                      <SelectItem value="experience">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Most Experienced
                        </div>
                      </SelectItem>
                      <SelectItem value="cost">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Lowest Cost
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Availability */}
                  <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Availability..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Therapists</SelectItem>
                      <SelectItem value="available">Available Now</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-gray-600"
          >
            Showing {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''}
          </motion.div>

          {/* Therapist Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTherapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card 
                    className="relative overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all cursor-pointer h-full shadow-lg"
                    onClick={() => handleSelectTherapist(therapist)}
                  >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-5xl">{therapist.avatar}</div>
                          <Badge 
                            variant={therapist.availability === 'Available' ? 'default' : 'secondary'}
                            className={
                              therapist.availability === 'Available' 
                                ? 'bg-green-100 text-green-700 border-green-300' 
                                : therapist.availability === 'Busy'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }
                          >
                            {therapist.availability}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-1">{therapist.name}</CardTitle>
                        <p className="text-sm text-gray-600">{therapist.title}</p>
                      </CardHeader>

                      <CardContent>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{therapist.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({therapist.reviewCount} reviews)
                          </span>
                        </div>

                        {/* Experience & Cost */}
                        <div className="flex items-center gap-4 mb-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{therapist.experience} years</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>${therapist.costPerSession}/session</span>
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {therapist.specializations.slice(0, 3).map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs border-purple-200 text-purple-700">
                              {spec}
                            </Badge>
                          ))}
                          {therapist.specializations.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                              +{therapist.specializations.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTherapist(therapist);
                            }}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>

                        {/* Next Available */}
                        {therapist.nextAvailable && therapist.availability === 'Available' && (
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Next: {therapist.nextAvailable}
                          </p>
                        )}
                      </CardContent>

                      {/* Gradient border effect */}
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 pointer-events-none"
                        whileHover={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
                        }}
                      />
                    </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredTherapists.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 mx-auto mb-6">
                <SupportiveCharacter />
              </div>
              <h3 className="text-xl mb-2 text-gray-700">No therapists found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterAvailability('all');
                }}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition3D>
  );
}