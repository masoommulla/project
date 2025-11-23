import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Smile, MoreVertical, Video, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { FloatingBackButton } from './FloatingBackButton';
import { Animated3DBackground, PageTransition3D } from './3DGraphics';
import { Therapist, ChatMessage } from '../types/therapist';

interface TherapistChatProps {
  therapist: Therapist;
  onBack: () => void;
}

export function TherapistChat({ therapist, onBack }: TherapistChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: therapist.id,
      senderName: therapist.name,
      message: `Hi! I'm ${therapist.name}. How are you feeling today?`,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      message: 'Hi! I\'ve been feeling a bit anxious lately.',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true
    },
    {
      id: '3',
      senderId: therapist.id,
      senderName: therapist.name,
      message: 'I understand. Anxiety can be challenging. Would you like to talk about what\'s been causing these feelings?',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate therapist typing and response
    setIsTyping(true);
    setTimeout(() => {
      const therapistMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: therapist.id,
        senderName: therapist.name,
        message: 'Thank you for sharing that with me. Let\'s explore this together.',
        timestamp: new Date().toISOString(),
        read: true
      };
      setMessages(prev => [...prev, therapistMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
        <Animated3DBackground />
        <FloatingBackButton onBack={onBack} label="Back to Profile" />

        <div className="container mx-auto px-6 py-20 max-w-5xl relative z-10 h-screen flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4"
          >
            <Card className="border-2 border-purple-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{therapist.avatar}</div>
                  <div>
                    <h2 className="text-xl font-semibold">{therapist.name}</h2>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm text-gray-600">{therapist.availability}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Messages Area */}
          <Card className="flex-1 border-2 border-purple-100 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => {
                    const isUser = message.senderId === 'user';
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
                          {!isUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600">{message.senderName}</span>
                            </div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-2xl p-4 ${
                              isUser
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none'
                                : 'bg-white border-2 border-purple-100 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{message.message}</p>
                          </motion.div>
                          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isUser && message.read && <span>✓✓</span>}
                          </div>
                        </div>

                        {!isUser && (
                          <div className="text-2xl ml-2 order-1">{therapist.avatar}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="text-2xl">{therapist.avatar}</div>
                    <div className="bg-white border-2 border-purple-100 rounded-2xl rounded-tl-none p-4">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 rounded-full bg-purple-500"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t-2 border-purple-100 bg-white">
              <div className="flex items-end gap-3">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </Button>

                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="resize-none min-h-[60px] max-h-[120px] pr-12 border-2 border-purple-100 focus:border-purple-300"
                    rows={2}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 bottom-2"
                    onClick={() => {
                      // Emoji picker would go here
                    }}
                  >
                    <Smile className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Quick Responses */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['I need support', 'Feeling anxious', 'Can we schedule?', 'Thank you'].map((quick) => (
                  <motion.button
                    key={quick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNewMessage(quick)}
                    className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                  >
                    {quick}
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>

          {/* Privacy Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-500 mt-2"
          >
            🔒 All conversations are encrypted and confidential
          </motion.p>
        </div>
      </div>
    </PageTransition3D>
  );
}
