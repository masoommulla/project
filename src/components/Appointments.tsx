import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageCircle, 
  Phone, 
  User,
  XCircle,
  ExternalLink,
  Home,
  Trash2,
  Users
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageTransition3D } from './3DGraphics';
import { HappyCharacter, SupportiveCharacter } from './AnimeCharacters';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';

interface AppointmentsProps {
  onBack: () => void;
  onJoinSession: (sessionId: string) => void;
}

interface TherapySession {
  _id: string;
  therapistId: string;
  therapistName: string;
  therapistAvatar?: string;
  date: string;
  startTime: string;
  duration: number;
  type: 'video' | 'chat' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  payment?: {
    amount: number;
    status: string;
  };
  createdAt: string;
}

export function Appointments({ onBack, onJoinSession }: AppointmentsProps) {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getAll();
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return session.status === 'scheduled' && sessionDate >= today;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return session.status === 'completed' || session.status === 'cancelled' || sessionDate < today;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancelSession = async (sessionId: string) => {
    try {
      const response = await appointmentAPI.cancel(sessionId, 'Cancelled by user');
      if (response.success) {
        setSessions(sessions.map(session =>
          session._id === sessionId
            ? { ...session, status: 'cancelled' as const }
            : session
        ));
        toast.success('Session cancelled successfully');
      }
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast.error(error.message || 'Failed to cancel session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await appointmentAPI.delete(sessionId);
      if (response.success) {
        setSessions(sessions.filter(session => session._id !== sessionId));
        toast.success('Session removed from history');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete session');
    }
  };

  const handleClearPastSessions = async () => {
    try {
      const response = await appointmentAPI.clearPast();
      if (response.success) {
        // Remove past sessions from local state
        setSessions(sessions.filter(session => 
          session.status === 'scheduled' && new Date(session.date) >= new Date()
        ));
        toast.success(response.message || 'Past sessions cleared successfully');
      }
    } catch (error: any) {
      console.error('Clear past error:', error);
      toast.error(error.message || 'Failed to clear past sessions');
    }
  };

  const handleJoinSession = (sessionId: string) => {
    onJoinSession(sessionId);
  };

  const handleFindTherapist = () => {
    navigate('/dashboard/therapists');
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-500 hover:bg-green-600">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isSessionToday = (dateStr: string) => {
    const sessionDate = new Date(dateStr);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
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

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your therapy sessions
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Button
              onClick={() => setActiveTab('upcoming')}
              variant={activeTab === 'upcoming' ? 'default' : 'outline'}
              className={activeTab === 'upcoming' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'border-purple-300 text-purple-700 hover:bg-purple-50'
              }
            >
              Upcoming ({upcomingSessions.length})
            </Button>
            <Button
              onClick={() => setActiveTab('past')}
              variant={activeTab === 'past' ? 'default' : 'outline'}
              className={activeTab === 'past' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'border-purple-300 text-purple-700 hover:bg-purple-50'
              }
            >
              Past Sessions ({pastSessions.length})
            </Button>
          </motion.div>

          {/* Sessions List */}
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {upcomingSessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-32 h-32 mx-auto mb-6">
                      <HappyCharacter />
                    </div>
                    <h3 className="text-xl mb-2 text-gray-700">No Upcoming Sessions</h3>
                    <p className="text-gray-600 mb-6">
                      Ready to book your first session?
                    </p>
                    <Button
                      onClick={handleFindTherapist}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Find a Therapist
                    </Button>
                  </motion.div>
                ) : (
                  upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Therapist Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center overflow-hidden">
                                {session.therapistAvatar ? (
                                  <img 
                                    src={session.therapistAvatar} 
                                    alt={session.therapistName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-purple-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg mb-1">{session.therapistName}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(session.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.startTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {getSessionIcon(session.type)}
                                    <span className="capitalize">{session.type}</span>
                                  </span>
                                </div>
                                {isSessionToday(session.date) && (
                                  <Badge className="mt-2 bg-orange-500 hover:bg-orange-600">
                                    Today's Session
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                onClick={() => handleJoinSession(session._id)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Join Session
                              </Button>
                              <Button
                                onClick={() => handleCancelSession(session._id)}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>

                          {/* Notes */}
                          {session.notes && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Notes:</span> {session.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'past' && (
              <motion.div
                key="past"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {pastSessions.length > 0 && (
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={handleClearPastSessions}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Past Sessions
                    </Button>
                  </div>
                )}

                {pastSessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-32 h-32 mx-auto mb-6">
                      <SupportiveCharacter />
                    </div>
                    <h3 className="text-xl mb-2 text-gray-700">No Past Sessions Yet</h3>
                    <p className="text-gray-600">
                      Your completed and cancelled sessions will appear here
                    </p>
                  </motion.div>
                ) : (
                  pastSessions.map((session, index) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow opacity-90">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Therapist Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                {session.therapistAvatar ? (
                                  <img 
                                    src={session.therapistAvatar} 
                                    alt={session.therapistName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-8 h-8 text-gray-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg">{session.therapistName}</h3>
                                  {getStatusBadge(session.status)}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(session.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.startTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {getSessionIcon(session.type)}
                                    <span className="capitalize">{session.type}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div>
                              <Button
                                onClick={() => handleDeleteSession(session._id)}
                                variant="outline"
                                size="sm"
                                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Notes */}
                          {session.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Notes:</span> {session.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition3D>
  );
}
