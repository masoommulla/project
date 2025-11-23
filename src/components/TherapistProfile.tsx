import { motion } from 'motion/react';
import { 
  Star, 
  Clock, 
  DollarSign, 
  Video, 
  MessageCircle,
  Calendar,
  Award,
  BookOpen,
  Globe,
  GraduationCap,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Animated3DBackground, PageTransition3D } from './3DGraphics';
import { FloatingSticker } from './DecorativeElements';
import { Therapist } from '../types/therapist';

interface TherapistProfileProps {
  therapist: Therapist;
  onBack: () => void;
  onBookSession: () => void;
  onStartChat: () => void;
  onStartVideo: () => void;
}

export function TherapistProfile({ 
  therapist, 
  onBack, 
  onBookSession,
  onStartChat,
  onStartVideo
}: TherapistProfileProps) {
  const ratingPercentage = (therapist.rating / 5) * 100;

  // Mock reviews data
  const reviews = [
    { id: 1, author: 'Sarah M.', rating: 5, text: 'Dr. Mitchell helped me so much with my anxiety. She really listens and provides practical tools.', date: '2 weeks ago' },
    { id: 2, author: 'Alex T.', rating: 5, text: 'Understanding and professional. Made me feel comfortable from the first session.', date: '1 month ago' },
    { id: 3, author: 'Jordan P.', rating: 4, text: 'Great therapist! Really knows how to connect with teens.', date: '2 months ago' }
  ];

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        {/* 3D Background */}
        <Animated3DBackground />
        
        {/* Decorative elements */}
        <FloatingSticker emoji="💼" className="absolute top-20 right-20" delay={0} />
        <FloatingSticker emoji="⭐" className="absolute bottom-40 left-20" delay={1} />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Therapists</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-6 border-2 border-purple-100">
                <CardContent className="p-6">
                  {/* Avatar & Status */}
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-8xl mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {therapist.avatar}
                    </motion.div>
                    <h2 className="text-2xl mb-1">{therapist.name}</h2>
                    <p className="text-gray-600 mb-3">{therapist.title}</p>
                    <Badge 
                      variant="default"
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

                  <Separator className="my-6" />

                  {/* Quick Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span>Rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{therapist.rating}</span>
                        <span className="text-sm text-gray-500">({therapist.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>Experience</span>
                      </div>
                      <span className="font-semibold">{therapist.experience} years</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5" />
                        <span>Per Session</span>
                      </div>
                      <span className="font-semibold">${therapist.costPerSession}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-5 h-5" />
                        <span>Languages</span>
                      </div>
                      <span className="font-semibold text-sm">{therapist.languages.join(', ')}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                      onClick={onBookSession}
                      disabled={therapist.availability === 'Offline'}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={onStartVideo}
                        disabled={therapist.availability !== 'Available'}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                        onClick={onStartChat}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>

                  {therapist.nextAvailable && therapist.availability === 'Available' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 text-center">
                        <strong>Next Available:</strong><br />
                        {therapist.nextAvailable}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="specializations">Specializations</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about">
                  <Card className="border-2 border-purple-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        About Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-500" />
                          Therapeutic Approach
                        </h3>
                        <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
                          {therapist.approach}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-3">Why Choose Me?</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">Specialized in teen mental health with {therapist.experience} years of experience</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">Evidence-based therapeutic approaches tailored to your needs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">Safe, non-judgmental space to explore your thoughts and feelings</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">Flexible scheduling with video, chat, and phone options</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Specializations Tab */}
                <TabsContent value="specializations">
                  <Card className="border-2 border-purple-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        Areas of Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {therapist.specializations.map(spec => (
                          <motion.div
                            key={spec}
                            whileHover={{ scale: 1.03 }}
                            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all"
                          >
                            <h4 className="font-semibold mb-1 text-purple-700">{spec}</h4>
                            <p className="text-sm text-gray-600">
                              Specialized treatment and support
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                          <strong>Note:</strong> All sessions are confidential and tailored to your unique situation. 
                          We'll work together to develop a treatment plan that works for you.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education">
                  <Card className="border-2 border-purple-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        Education & Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {therapist.education.map((edu, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{edu}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Professional Memberships</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            American Psychological Association
                          </Badge>
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            Licensed Clinical Psychologist
                          </Badge>
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            Teen Mental Health Specialist
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <Card className="border-2 border-purple-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        Client Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Rating Overview */}
                      <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-5xl font-bold text-gray-800">{therapist.rating}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= Math.round(therapist.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Progress value={ratingPercentage} className="h-2 mb-1" />
                            <p className="text-sm text-gray-600">Based on {therapist.reviewCount} reviews</p>
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        {reviews.map(review => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{review.author}</span>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition3D>
  );
}
