import { motion } from 'motion/react';
import CountUp from './CountUp';
import { HappyCharacter, CalmCharacter, SupportiveCharacter } from './AnimeCharacters';
import { SparkleEffect, HeartPulse } from './DecorativeElements';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            <div className="text-4xl">✨</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', damping: 10 }}
          className="mb-12"
        >
          <motion.h1
            className="text-6xl md:text-8xl text-white mb-4"
            animate={{
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ZEN-MIND
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-xl md:text-2xl"
          >
            Your Mental Wellness Journey Begins
          </motion.p>
        </motion.div>

        {/* Animated Characters */}
        <div className="flex justify-center gap-8 mb-12">
          {[
            { Character: HappyCharacter, delay: 0 },
            { Character: CalmCharacter, delay: 0.2 },
            { Character: SupportiveCharacter, delay: 0.4 },
          ].map(({ Character, delay }, index) => (
            <motion.div
              key={index}
              className="w-20 h-20 md:w-28 md:h-28"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                delay: 0.5 + delay,
                type: 'spring',
                damping: 8,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                <Character />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', damping: 10 }}
          className="relative"
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-white/50 rounded-full scale-150" />
          </motion.div>

          {/* Counter Display */}
          <div className="relative bg-white/20 backdrop-blur-md rounded-3xl px-12 py-8 md:px-16 md:py-12 border-4 border-white/30 shadow-2xl">
            <motion.div
              className="text-8xl md:text-9xl text-white drop-shadow-2xl"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <CountUp
                from={0}
                to={100}
                duration={2.5}
                className="tabular-nums"
                onEnd={onLoadingComplete}
              />
              <span className="text-6xl md:text-7xl">%</span>
            </motion.div>
            <motion.p
              className="text-white/90 text-lg md:text-xl mt-4"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading your safe space...
            </motion.p>
          </div>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-white via-pink-200 to-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Fun Loading Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <motion.p
            className="text-white/80 text-sm md:text-base"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟 Preparing your personalized experience...
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Corner Elements */}
      <SparkleEffect className="absolute top-10 left-10 w-20 opacity-50" />
      <SparkleEffect className="absolute bottom-10 right-10 w-20 opacity-50" />
      <HeartPulse className="absolute top-10 right-10 w-24 opacity-40" />
      <HeartPulse className="absolute bottom-10 left-10 w-24 opacity-40" />

      {/* Rotating Border Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
