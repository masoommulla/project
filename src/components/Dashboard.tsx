import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Users,
  Sparkles,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChatbotMascot } from './AnimeCharacters';
import { SparkleEffect } from './DecorativeElements';
import { PageTransition3D } from './3DGraphics';
import { useAuth } from '../contexts/AuthContext';
import { moodAPI, journalAPI, appointmentAPI } from '../services/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    streak: 0,
    avgMood: 'N/A',
    chatSessions: 0,
    nextSession: 'N/A'
  });
  const [loading, setLoading] = useState(true);

  // Fetch user-specific stats on mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Fetch mood stats
      const moodResponse = await moodAPI.getStats();
      const moodData = moodResponse.data || {};
      
      // Fetch upcoming appointments
      const appointmentResponse = await appointmentAPI.getUpcoming();
      const appointments = appointmentResponse.data || [];
      
      // Fetch journal stats
      const journalResponse = await journalAPI.getStats();
      const journalData = journalResponse.data || {};

      // Calculate streak (from mood data)
      const streak = user?.streakCount || moodData.streak || 0;
      
      // Get average mood
      const avgMood = moodData.averageMood ? moodData.averageMood.toFixed(1) : 'N/A';
      
      // Get next appointment
      const nextAppointment = appointments.length > 0 
        ? new Date(appointments[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'None scheduled';

      setStats({
        streak,
        avgMood,
        chatSessions: journalData.totalEntries || 0,
        nextSession: nextAppointment
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default values on error
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Day Streak',
      value: `${stats.streak}`,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      emoji: '🔥'
    },
    {
      title: 'Average Mood',
      value: stats.avgMood,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      emoji: '💖'
    },
    {
      title: 'Journal Entries',
      value: stats.chatSessions,
      icon: MessageCircle,
      color: 'from-purple-500 to-blue-500',
      emoji: '📝'
    },
    {
      title: 'Next Session',
      value: stats.nextSession,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      emoji: '📅'
    }
  ];

  const quickActions = [
    { icon: MessageCircle, label: 'Chat with AI', path: '/dashboard/chat', color: 'from-purple-500 to-pink-500' },
    { icon: Heart, label: 'Log Mood', path: '/dashboard/mood', color: 'from-pink-500 to-rose-500' },
    { icon: BookOpen, label: 'Journal', path: '/dashboard/journal', color: 'from-blue-500 to-purple-500' },
    { icon: Users, label: 'Find Therapist', path: '/dashboard/therapists', color: 'from-green-500 to-teal-500' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments', color: 'from-orange-500 to-yellow-500' },
    { icon: TrendingUp, label: 'Resources', path: '/dashboard/resources', color: 'from-cyan-500 to-blue-500' }
  ];

  if (!user) {
    return null;
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="mb-2">
                  Welcome back, {user.name}! 
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </h1>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {/* Chatbot Mascot */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                className="w-24 h-24"
              >
                <ChatbotMascot />
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1, type: 'spring' }}
              >
                <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 bg-white/90 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl">{loading ? '...' : stat.value}</div>
                      <span className="text-2xl">{stat.emoji}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate(action.path)}
                    className={`w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br ${action.color} hover:opacity-90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <action.icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white overflow-hidden">
              {/* SparkleEffect removed as requested - no more rotating stars/circles */}
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="w-6 h-6" />
                  Your Wellness Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-4">
                  You're making great progress on your mental wellness journey. Keep up the amazing work! 💪
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate('/dashboard/mood')}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    Track Mood
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard/chat')}
                    variant="outline"
                    className="border-white text-white hover:bg-white/20"
                  >
                    Chat with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition3D>
  );
}