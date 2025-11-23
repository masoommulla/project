import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Video, MessageCircle, Phone, Check, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Animated3DBackground, PageTransition3D } from './3DGraphics';
import { PaymentModal } from './PaymentModal';
import { Therapist } from '../types/therapist';
import { toast } from 'sonner';
import { appointmentAPI } from '../services/api';

interface BookingModalProps {
  therapist: Therapist;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingModal({ therapist, onBack, onConfirm }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState<'video' | 'chat' | 'phone'>('video');
  const [notes, setNotes] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Save to database via API
      const response = await appointmentAPI.create({
        therapistId: therapist.id,
        therapistName: therapist.name,
        therapistAvatar: therapist.avatar,
        date: selectedDate!.toISOString(),
        startTime: selectedTime,
        endTime: '', // Will be calculated on backend
        type: sessionType,
        status: 'scheduled',
        notes,
        cost: therapist.costPerSession,
        paymentStatus: 'paid',
        paymentDate: new Date().toISOString()
      });

      if (response.success) {
        setShowPayment(false);
        toast.success('Session booked successfully! 🎉');
        onConfirm();
      } else {
        toast.error('Failed to book session. Please try again.');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book session');
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        <Animated3DBackground />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Book a Session
            </h1>
            <p className="text-gray-600">with {therapist.name}</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center gap-2">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= num
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                  animate={step === num ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: step === num ? Infinity : 0, repeatDelay: 1 }}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </motion.div>
                {num < 3 && (
                  <div className={`w-16 h-1 rounded ${step > num ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>

          <Card className="border-2 border-purple-100">
            <CardContent className="p-8">
              {/* Step 1: Date & Time */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl mb-6 text-center">Select Date & Time</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <Label className="mb-3 block">Choose a Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                        className="rounded-lg border-2 border-purple-100 p-3"
                      />
                    </div>

                    {/* Time Slots */}
                    <div>
                      <Label className="mb-3 block">Choose a Time</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {timeSlots.map(time => (
                          <motion.button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedTime === time
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <Clock className="w-4 h-4 mx-auto mb-1" />
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      Next: Session Type
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Session Type */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl mb-6 text-center">Choose Session Type</h2>

                  <RadioGroup value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                    <div className="space-y-4">
                      {/* Video */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          sessionType === 'video'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSessionType('video')}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value="video" id="video" />
                          <div className="flex-1">
                            <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer mb-2">
                              <Video className="w-5 h-5 text-blue-500" />
                              <span className="text-lg">Video Call</span>
                            </Label>
                            <p className="text-sm text-gray-600">
                              Face-to-face session via secure video call. Most recommended for building connection.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Chat */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          sessionType === 'chat'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSessionType('chat')}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value="chat" id="chat" />
                          <div className="flex-1">
                            <Label htmlFor="chat" className="flex items-center gap-2 cursor-pointer mb-2">
                              <MessageCircle className="w-5 h-5 text-green-500" />
                              <span className="text-lg">Text Chat</span>
                            </Label>
                            <p className="text-sm text-gray-600">
                              Real-time text messaging. Great for those who prefer writing over speaking.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          sessionType === 'phone'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSessionType('phone')}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value="phone" id="phone" />
                          <div className="flex-1">
                            <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer mb-2">
                              <Phone className="w-5 h-5 text-orange-500" />
                              <span className="text-lg">Phone Call</span>
                            </Label>
                            <p className="text-sm text-gray-600">
                              Voice-only session. Perfect when you need privacy or are on the go.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    >
                      Next: Add Notes
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Notes & Confirm */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl mb-6 text-center">Session Details</h2>

                  {/* Summary */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100">
                    <h3 className="font-semibold mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Therapist:</span>
                        <span className="font-semibold">{therapist.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">60 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold capitalize">{sessionType}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-purple-200">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-semibold text-lg">${therapist.costPerSession}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <Label htmlFor="notes" className="mb-2 block">
                      Any specific topics or concerns? (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Let your therapist know what you'd like to focus on in this session..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Modal */}
        {showPayment && selectedDate && (
          <PaymentModal
            therapist={therapist}
            sessionDetails={{
              date: selectedDate.toISOString(),
              time: selectedTime,
              type: sessionType,
              notes
            }}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        )}
      </div>
    </PageTransition3D>
  );
}