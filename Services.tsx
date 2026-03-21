import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { qualifyLead } from '../lib/gemini';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. AI Qualification
      const aiAnalysis = await qualifyLead(formData.name, formData.company, formData.message);
      
      // 2. Save to Firestore
      await addDoc(collection(db, 'leads'), {
        ...formData,
        intentScore: aiAnalysis.intentScore || 50,
        aiSummary: aiAnalysis.aiSummary || 'Failed to generate summary.',
        status: 'new',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-serif font-bold mb-2">Thank you!</h3>
        <p className="text-stone-600 mb-8">Your request has been received and analyzed by our AI system. We'll be in touch shortly.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-sm font-medium text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-stone-700 mb-2">Company (Optional)</label>
        <input
          type="text"
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Project Details</label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 resize-none"
          placeholder="Tell us about your goals..."
        ></textarea>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors flex justify-center items-center disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Analyzing & Submitting...
          </>
        ) : (
          'Send Request'
        )}
      </button>
      <p className="text-xs text-stone-500 text-center mt-4">
        By submitting this form, you agree to our Privacy Policy and GDPR terms.
      </p>
    </form>
  );
}
