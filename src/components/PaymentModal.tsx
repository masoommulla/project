import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Lock, Check, Calendar, Clock, User, DollarSign, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { Therapist } from '../types/therapist';

interface PaymentModalProps {
  therapist: Therapist;
  sessionDetails: {
    date: string;
    time: string;
    type: string;
    notes?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentModal({ therapist, sessionDetails, onSuccess, onCancel }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return;
    }
    if (!cardName.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }
    if (!expiry || expiry.length < 5) {
      toast.error('Please enter card expiry date');
      return;
    }
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter CVV');
      return;
    }

    // Process payment
    setStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      
      // Wait before calling onSuccess to show success animation
      setTimeout(() => {
        toast.success('Payment successful! 💳', { duration: 3000 });
        onSuccess();
      }, 2000);
    }, 2000);
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-purple-200">
            <CardContent className="p-8 text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl mb-2">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we securely process your payment...</p>
              <div className="mt-6 space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-green-200">
            <CardContent className="p-8 text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl mb-2 text-green-700">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">Your session has been booked and confirmed.</p>
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Secure payment processed</span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl my-8"
      >
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-500" />
              Complete Your Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Therapist</p>
                    <p className="font-semibold">{therapist.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(sessionDetails.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-semibold">{sessionDetails.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-semibold text-lg text-purple-700">${therapist.costPerSession}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                    maxLength={19}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="JOHN DOE"
                    className="pl-10 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="cvv"
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="pl-10"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              {/* Save Card Option */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="saveCard" className="cursor-pointer text-sm">
                  Save card for future payments
                </Label>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800">Secure Payment</p>
                    <p className="text-blue-700 mt-1">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ${therapist.costPerSession}
                </Button>
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
