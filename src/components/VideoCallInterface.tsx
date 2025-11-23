import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle,
  Settings,
  Monitor,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Therapist } from '../types/therapist';
import { toast } from 'sonner';

interface VideoCallInterfaceProps {
  therapist: Therapist;
  onEnd: () => void;
}

export function VideoCallInterface({ therapist, onEnd }: VideoCallInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    toast.success('Call ended. Thank you for your session!');
    onEnd();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Video Grid */}
      <div className="relative w-full h-full">
        {/* Therapist Video (Main) */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex items-center justify-center">
            {/* Placeholder - In real app, this would be video stream */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-9xl mb-4">{therapist.avatar}</div>
              <h2 className="text-white text-3xl mb-2">{therapist.name}</h2>
              <p className="text-purple-200">{therapist.title}</p>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500/20 blur-3xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-500/20 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>

          {/* Therapist Name Tag */}
          <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg text-white">
            <p className="font-semibold">{therapist.name}</p>
          </div>
        </div>

        {/* User Video (Picture-in-Picture) */}
        <motion.div
          initial={{ scale: 0, x: 100, y: -100 }}
          animate={{ scale: 1, x: 0, y: 0 }}
          className="absolute top-6 right-6 w-64 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <div className="text-6xl mb-2">👤</div>
                <p className="text-white text-sm">You</p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="w-12 h-12 text-white mb-2 mx-auto" />
                <p className="text-white text-sm">Camera Off</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Bar - Call Info */}
        <div className="absolute top-6 left-6 right-80 flex items-center justify-between">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-6 py-3 bg-black/50 backdrop-blur-md rounded-2xl text-white"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-semibold">LIVE</span>
              </div>
              <div className="text-lg font-mono">{formatDuration(callDuration)}</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Control Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <Card className="p-4 bg-black/50 backdrop-blur-md border-white/20">
            <div className="flex items-center gap-3">
              {/* Video Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`w-14 h-14 rounded-full ${
                    isVideoOn
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>
              </motion.div>

              {/* Audio Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`w-14 h-14 rounded-full ${
                    isAudioOn
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>
              </motion.div>

              {/* Screen Share */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`w-14 h-14 rounded-full ${
                    isScreenSharing
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Monitor className="w-6 h-6" />
                </Button>
              </motion.div>

              {/* Speaker Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </Button>
              </motion.div>

              {/* Chat */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => setShowChat(!showChat)}
                  className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>
              </motion.div>

              {/* Settings */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="w-px h-10 bg-white/20 mx-2" />

              {/* End Call */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <Phone className="w-7 h-7 rotate-135" />
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-0 right-0 bottom-0 w-96 bg-white shadow-2xl"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Session Chat</h3>
                    <Button
                      onClick={() => setShowChat(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="text-center text-gray-500 text-sm">
                    Chat during your session...
                  </div>
                </div>
                <div className="p-4 border-t bg-white">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Quality Indicator */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-6 left-6 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-lg text-white text-sm flex items-center gap-2"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-white"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          Excellent Connection
        </motion.div>
      </div>
    </div>
  );
}
