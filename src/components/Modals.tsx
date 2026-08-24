import React, { useState } from 'react';

// Contact Support Modal
export const ContactSupportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback & Questions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#c1c6d7] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#555f6b] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#F8FAFC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#eff4ff] text-[#0059bb] rounded-full">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Contact Support</h3>
            <p className="text-xs text-[#555f6b]">We respond within 24 business hours</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-[#006b24] text-5xl mb-2">
              check_circle
            </span>
            <h4 className="text-base font-bold text-[#0b1c30]">Message Sent!</h4>
            <p className="text-xs text-[#555f6b] mt-1">
              Thank you for reaching out. Our support team will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full px-3 py-2 text-sm border border-[#c1c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059bb]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#c1c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059bb]"
              >
                <option value="Feedback & Questions">Feedback &amp; Questions</option>
                <option value="Report Processing Issue">Report Processing Issue</option>
                <option value="Privacy & Data Question">Privacy &amp; Data Question</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you understand your medical reports?"
                className="w-full px-3 py-2 text-sm border border-[#c1c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059bb] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#555f6b] hover:bg-[#F8FAFC] rounded-lg border border-[#c1c6d7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-[#0059bb] rounded-lg shadow-xs"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Doctor Questions Modal
export const DoctorQuestionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  questions: string[];
  reportName: string;
}> = ({ isOpen, onClose, questions, reportName }) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [allQuestions, setAllQuestions] = useState<string[]>(questions);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setAllQuestions(questions);
  }, [questions]);

  if (!isOpen) return null;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      setAllQuestions([...allQuestions, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const toggleCheck = (index: number) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const handleCopyAll = () => {
    const text = `Questions for my doctor regarding ${reportName}:\n` +
      allQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#c1c6d7] max-w-xl w-full p-6 shadow-xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#555f6b] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#F8FAFC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#eff4ff] text-[#0059bb] rounded-full">
            <span className="material-symbols-outlined">question_answer</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">
              Questions For Your Doctor
            </h3>
            <p className="text-xs text-[#555f6b]">
              Tailored talking points based on your report: {reportName}
            </p>
          </div>
        </div>

        {/* Questions list */}
        <div className="overflow-y-auto flex-grow space-y-2.5 my-2 pr-1">
          {allQuestions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                checkedItems[idx]
                  ? 'bg-[#e6f4ea]/40 border-[#66df75]'
                  : 'bg-[#F8FAFC] border-[#e5eeff] hover:bg-[#eff4ff]/50'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedItems[idx]}
                onChange={() => {}}
                className="mt-0.5 rounded text-[#0059bb] focus:ring-[#0059bb]"
              />
              <span
                className={`text-sm leading-relaxed ${
                  checkedItems[idx]
                    ? 'line-through text-[#555f6b]'
                    : 'text-[#0b1c30] font-medium'
                }`}
              >
                {q}
              </span>
            </div>
          ))}
        </div>

        {/* Add custom question */}
        <form onSubmit={handleAddQuestion} className="flex gap-2 pt-3 border-t border-[#e5eeff]">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Add your own custom question..."
            className="flex-grow px-3 py-2 text-xs border border-[#c1c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059bb]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[#eff4ff] text-[#0059bb] font-semibold text-xs rounded-lg border border-[#adc7ff] hover:bg-[#d8e2ff]"
          >
            Add
          </button>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#c1c6d7]">
          <span className="text-xs text-[#555f6b]">
            Check items off as you discuss with your provider.
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-[#007BFF] hover:bg-[#0059bb] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy All Questions'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Modal
export const AboutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#c1c6d7] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#555f6b] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#F8FAFC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#eff4ff] text-[#0059bb] rounded-full">
            <span className="material-symbols-outlined">clinical_notes</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">About ClarifyHealth</h3>
            <p className="text-xs text-[#555f6b]">Clinical Clarity for Every Patient</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-[#414754] leading-relaxed">
          <p>
            <strong>ClarifyHealth</strong> was founded on a simple principle: every individual
            deserves to understand what their medical tests, laboratory results, and clinical
            reports mean without confusion or unnecessary anxiety.
          </p>
          <p>
            By combining state-of-the-art <strong>Google Gemini AI</strong> models with rigorous
            clinical data safeguards, ClarifyHealth translates complex medical terminology into
            plain-English summaries with actionable questions for your doctor.
          </p>
          <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#d8e2ff] text-xs">
            <strong className="text-[#004493] block mb-1">Strict Medical Disclaimer</strong>
            ClarifyHealth is an educational clarity tool and does not offer diagnostic or
            treatment decisions. Always consult a licensed healthcare professional for clinical
            advice.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-[#0059bb] rounded-lg shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// HIPAA Compliance Modal
export const HipaaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#c1c6d7] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#555f6b] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#F8FAFC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#eff4ff] text-[#006b24] rounded-full">
            <span className="material-symbols-outlined">health_and_safety</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">HIPAA Compliance Standard</h3>
            <p className="text-xs text-[#555f6b]">Zero-Retention Architecture</p>
          </div>
        </div>

        <div className="space-y-3 text-xs md:text-sm text-[#414754] leading-relaxed">
          <p>
            ClarifyHealth adheres to rigorous health privacy guidelines by employing a{' '}
            <strong>zero-persistence runtime</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>No PHI Storage:</strong> Protected Health Information is never saved to
              persistent storage or relational databases.
            </li>
            <li>
              <strong>Ephemeral Processing:</strong> All file bytebuffers exist solely in volatile
              memory during document parsing and are immediately garbage-collected.
            </li>
            <li>
              <strong>TLS 1.3 Encryption:</strong> All transport connections use high-grade modern
              cryptographic protocols.
            </li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-[#0059bb] rounded-lg shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

// Terms of Service Modal
export const TermsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#c1c6d7] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#555f6b] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#F8FAFC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#eff4ff] text-[#0059bb] rounded-full">
            <span className="material-symbols-outlined">gavel</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Terms of Service</h3>
            <p className="text-xs text-[#555f6b]">Patient Educational Usage Agreement</p>
          </div>
        </div>

        <div className="space-y-3 text-xs md:text-sm text-[#414754] leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <p>
            By using ClarifyHealth, you acknowledge that this tool is provided for educational and
            informational clarity purposes only.
          </p>
          <p>
            1. <strong>Not Medical Advice:</strong> ClarifyHealth is not a healthcare provider and
            does not render clinical diagnosis, medical evaluation, or treatment plans.
          </p>
          <p>
            2. <strong>Consult Your Provider:</strong> Always present your lab reports and medical
            findings to your licensed physician before altering medications, diet, or treatment.
          </p>
          <p>
            3. <strong>Emergency Protocol:</strong> If you are experiencing a medical emergency,
            call 911 or visit the nearest emergency facility immediately.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-[#0059bb] rounded-lg shadow-xs"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};
