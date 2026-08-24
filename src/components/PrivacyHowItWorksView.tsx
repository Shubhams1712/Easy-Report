import React, { useState } from 'react';

interface PrivacyHowItWorksViewProps {
  onOpenSupport: () => void;
  onOpenUpload: () => void;
}

export const PrivacyHowItWorksView: React.FC<PrivacyHowItWorksViewProps> = ({
  onOpenSupport,
  onOpenUpload,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is my health data safe?',
      a: 'Yes. All uploaded files are strictly processed in volatile runtime memory and immediately discarded. No databases, persistent disks, or tracking logs retain your reports.',
    },
    {
      q: 'What file types are supported?',
      a: 'ClarifyHealth supports PDF documents as well as common digital image formats (PNG, JPG, JPEG, WEBP) and plain text exports up to 10MB.',
    },
    {
      q: 'Who is this for?',
      a: 'Patients and caregivers looking to better understand complex medical jargon, laboratory values, and discharge notes in clear, non-intimidating language before their appointments.',
    },
    {
      q: 'Can ClarifyHealth replace my doctor?',
      a: 'No. ClarifyHealth provides educational translation of clinical jargon and does not diagnose, treat, or replace professional clinical judgment. Always review your results with your physician.',
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-24 pb-16">
      {/* Hero Section */}
      <section className="text-center py-10 border-b border-[#c1c6d7] mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#0059bb] mb-3 tracking-tight">
          Privacy &amp; How it Works
        </h1>
        <p className="text-base md:text-lg text-[#414754] max-w-2xl mx-auto leading-relaxed">
          Understanding how ClarifyHealth securely translates your medical reports into plain English.
        </p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security and Privacy Card (2 cols) */}
        <div className="md:col-span-2 bg-white rounded-xl border border-[#c1c6d7] p-6 md:p-8 shadow-xs relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0059bb]" />

          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#0059bb] text-3xl">
              shield_lock
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c30]">
              Security and Privacy
            </h2>
          </div>

          <p className="text-sm md:text-base text-[#414754] mb-4 leading-relaxed">
            Your privacy is our absolute priority. We adhere to a strict{' '}
            <strong className="text-[#0b1c30]">no-storage policy</strong>.
          </p>

          <ul className="list-disc pl-5 text-sm md:text-base text-[#414754] space-y-2.5">
            <li>
              Uploaded files are <strong className="text-[#0b1c30]">deleted immediately</strong> after processing.
            </li>
            <li>We do not store your medical data on our servers or databases.</li>
            <li>No databases are used to retain user profiles or clinical reports.</li>
            <li>All transmissions use TLS 1.3 end-to-end encryption.</li>
          </ul>

          <div className="mt-6 pt-4 border-t border-[#e5eeff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b24] text-lg">
              verified
            </span>
            <span className="text-xs text-[#555f6b] font-medium">
              Compliant with patient privacy protection best practices
            </span>
          </div>
        </div>

        {/* Technology Card (1 col) */}
        <div className="bg-white rounded-xl border border-[#c1c6d7] p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0EA5E9]" />

          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[#0EA5E9] text-3xl">
              memory
            </span>
            <h2 className="text-xl font-bold text-[#0b1c30]">Technology</h2>
          </div>

          <p className="text-sm text-[#414754] mb-4 leading-relaxed">
            We leverage cutting-edge AI to provide clinical clarity.
          </p>

          <div className="space-y-3">
            <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-[#c1c6d7]">
              <strong className="text-sm text-[#0b1c30] block mb-0.5">
                Google Gemini AI
              </strong>
              <p className="text-xs text-[#414754]">
                Powers the contextual medical simplification engine.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-[#c1c6d7]">
              <strong className="text-sm text-[#0b1c30] block mb-0.5">
                OCR &amp; Document Parsing
              </strong>
              <p className="text-xs text-[#414754]">
                Extracts clinical text from images and PDF structures securely.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section (3 cols) */}
        <div className="md:col-span-3 bg-white rounded-xl border border-[#c1c6d7] p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006b24]" />

          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#006b24] text-3xl">
              help_center
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0b1c30]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d8e2ff]">
              <h3 className="text-sm font-bold text-[#0b1c30] mb-1.5">
                Is my data safe?
              </h3>
              <p className="text-xs text-[#414754] leading-relaxed">
                Yes. Files are processed in memory and immediately discarded. Nothing is saved permanently.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d8e2ff]">
              <h3 className="text-sm font-bold text-[#0b1c30] mb-1.5">
                What file types are supported?
              </h3>
              <p className="text-xs text-[#414754] leading-relaxed">
                We support PDF documents as well as image formats (PNG, JPG, WEBP) up to 10MB.
              </p>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-lg border border-[#d8e2ff]">
              <h3 className="text-sm font-bold text-[#0b1c30] mb-1.5">
                Who is this for?
              </h3>
              <p className="text-xs text-[#414754] leading-relaxed">
                Patients looking to better understand complex medical jargon in their lab results or doctors' notes.
              </p>
            </div>
          </div>

          {/* Interactive Extra FAQs */}
          <div className="mt-6 pt-6 border-t border-[#e5eeff] space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[#e5eeff] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-4 py-3 text-left font-medium text-sm text-[#0b1c30] flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-base text-[#555f6b]">
                    {activeFaq === index ? 'remove' : 'add'}
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="px-4 py-3 bg-[#F8FAFC] text-xs md:text-sm text-[#414754] border-t border-[#e5eeff] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions? Support Callout */}
        <div className="md:col-span-3 text-center py-10 bg-[#F8FAFC] rounded-xl border border-[#c1c6d7] shadow-xs">
          <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] mb-1.5">
            Still have questions?
          </h3>
          <p className="text-sm text-[#414754] mb-5">
            Our support and patient advocacy team is here to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenSupport}
              className="inline-flex items-center px-6 py-2.5 border border-[#0059bb] text-[#0059bb] bg-white hover:bg-[#eff4ff] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-lg">mail</span>
              <span>Contact Support</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center px-6 py-2.5 bg-[#007BFF] hover:bg-[#0059bb] text-white text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-lg">upload_file</span>
              <span>Simplify a Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
