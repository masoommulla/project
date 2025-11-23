import { motion } from 'motion/react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChatbotMascot, HappyCharacter, CalmCharacter } from './AnimeCharacters';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-20">
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg text-sm sm:text-base"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              <span className="text-purple-700">AI-Powered Mental Wellness</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-4 sm:mb-6"
            >
              <span className="block text-gray-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Welcome to</span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                ZEN-MIND
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-600 mb-4 sm:mb-8 text-lg sm:text-xl md:text-2xl"
            >
              Your Mind, Your Friend.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-gray-600 mb-6 sm:mb-10 max-w-lg mx-auto lg:mx-0 text-sm sm:text-base md:text-lg px-4 sm:px-0"
            >
              A safe space where teens can explore their emotions, find support, and grow mentally stronger with AI-powered companionship.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full overflow-hidden group text-sm sm:text-base"
              onClick={onGetStarted}
            >
              <span className="relative z-10 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Your Journey
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50" />
            </motion.button>
          </motion.div>

          {/* Right Side - Character Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative w-full max-w-lg mx-auto px-4 sm:px-0">
              {/* Chatbot Bubble */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
                className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-2 sm:py-4 shadow-2xl border-2 border-purple-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                  <span className="text-gray-700 ml-1 sm:ml-2 text-xs sm:text-base">I'm here for you!</span>
                </div>
              </motion.div>

              {/* Characters Container */}
              <div className="relative bg-gradient-to-br from-purple-200/40 via-pink-200/40 to-blue-200/40 rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 backdrop-blur-sm mt-8 sm:mt-0">
                {/* Anime Characters Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-full h-20 sm:h-32">
                    <HappyCharacter />
                  </div>
                  <div className="w-full h-20 sm:h-32">
                    <ChatbotMascot />
                  </div>
                  <div className="w-full h-20 sm:h-32">
                    <CalmCharacter />
                  </div>
                </div>
                
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1629459347138-b34fcc7603cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuJTIwaWxsdXN0cmF0aW9uJTIwY2FydG9vbnxlbnwxfHx8fDE3NjIwNjk1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Teen characters"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl sm:rounded-[3rem] blur-2xl sm:blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
