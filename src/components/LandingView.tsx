import React from 'react';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { SampleReport } from '../types';

interface LandingViewProps {
  onOpenUpload: () => void;
  onSelectSample: (sample: SampleReport) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenUpload,
  onSelectSample,
}) => {
  const defaultSample = SAMPLE_REPORTS[0];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center py-12 md:py-20 overflow-hidden">
        <span
          className="material-symbols-outlined text-[#dce9ff] text-[100px] absolute -top-4 opacity-40 select-none pointer-events-none -z-10"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          medical_services
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#0b1c30] mb-4 max-w-3xl leading-[1.2] tracking-tight">
          Understand Your Medical Reports in Seconds
        </h1>

        <p className="text-base md:text-lg text-[#414754] max-w-2xl mb-8 leading-relaxed">
          Google Gemini AI simplifies complex medical jargon into patient-friendly language,
          helping you take control of your health journey with clarity and confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
          <button
            onClick={onOpenUpload}
            className="bg-[#007BFF] hover:bg-[#0059bb] text-white px-8 py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-xl">upload_file</span>
            <span>Upload Your Report</span>
          </button>

          <button
            onClick={() => onSelectSample(defaultSample)}
            className="border border-[#0059bb] text-[#0059bb] hover:bg-[#eff4ff] px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            See Example
          </button>
        </div>

        <p className="text-xs text-[#555f6b] mt-4 flex items-center justify-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-sm text-[#006b24]">lock</span>
          <span>Secure &amp; Private. Files deleted instantly.</span>
        </p>
      </section>

      {/* How It Works Section (Bento Grid) */}
      <section className="py-12 border-t border-[#c1c6d7]">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">
            How it Works
          </h2>
          <p className="text-sm md:text-base text-[#414754] mt-2">
            Three simple steps to clinical clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#c1c6d7] rounded-xl p-6 relative overflow-hidden group shadow-xs hover:border-[#0059bb] transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0EA5E9] opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#eff4ff] text-[#0059bb] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 1
              </span>
              <span className="material-symbols-outlined text-[#717786]">
                description
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              Upload Report
            </h3>
            <p className="text-sm text-[#414754] leading-relaxed">
              Securely upload your medical report in PDF or image format (PNG, JPG, WEBP).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#c1c6d7] rounded-xl p-6 relative overflow-hidden group shadow-xs hover:border-[#0059bb] transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0059bb] opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#eff4ff] text-[#0059bb] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 2
              </span>
              <span className="material-symbols-outlined text-[#717786]">
                psychology
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              AI Processing
            </h3>
            <p className="text-sm text-[#414754] leading-relaxed">
              Our system extracts the text and uses advanced AI to decode complex jargon into plain terms.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#c1c6d7] rounded-xl p-6 relative overflow-hidden group shadow-xs hover:border-[#0059bb] transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006b24] opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#eff4ff] text-[#0059bb] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Step 3
              </span>
              <span className="material-symbols-outlined text-[#717786]">
                fact_check
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-2">
              Get Summary
            </h3>
            <p className="text-sm text-[#414754] leading-relaxed">
              Receive a clear, patient-friendly summary explaining your results, status flags, and doctor questions.
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Privacy Section */}
      <section className="py-10 bg-[#F8FAFC] rounded-2xl px-6 md:px-10 my-8 border border-[#c1c6d7] flex flex-col md:flex-row items-center gap-8 shadow-xs">
        <div className="md:w-1/3 flex justify-center shrink-0">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center border-4 border-[#dce9ff] relative shadow-xs">
            <span
              className="material-symbols-outlined text-[#0059bb] text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              health_and_safety
            </span>
            <div className="absolute -bottom-1 -right-1 bg-[#006b24] text-white rounded-full p-1.5 border-2 border-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-base">check</span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">
            Privacy First, Always.
          </h2>
          <p className="text-sm md:text-base text-[#414754] mb-5 leading-relaxed">
            Your health data is highly sensitive. We guarantee that all uploaded files are processed
            temporarily and <strong>deleted immediately</strong> after the summary is generated.
            No databases, no tracking.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#c1c6d7] px-3 py-1.5 rounded-full text-xs font-semibold text-[#555f6b]">
              <span className="material-symbols-outlined text-sm text-[#ba1a1a]">
                delete_forever
              </span>
              Auto-Deletion
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#c1c6d7] px-3 py-1.5 rounded-full text-xs font-semibold text-[#555f6b]">
              <span className="material-symbols-outlined text-sm text-[#0059bb]">
                no_accounts
              </span>
              No Account Needed
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#c1c6d7] px-3 py-1.5 rounded-full text-xs font-semibold text-[#555f6b]">
              <span className="material-symbols-outlined text-sm text-[#006b24]">
                encrypted
              </span>
              Secure Transfer
            </span>
          </div>
        </div>
      </section>

      {/* Instant Examples Gallery */}
      <section className="py-8 text-center">
        <h3 className="text-sm font-bold text-[#555f6b] uppercase tracking-wider mb-4">
          Explore Interactive Sample Reports
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLE_REPORTS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSample(item)}
              className="bg-white border border-[#c1c6d7] rounded-xl p-5 text-left cursor-pointer hover:border-[#0059bb] hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#0059bb] bg-[#eff4ff] px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="material-symbols-outlined text-sm text-[#717786] group-hover:text-[#0059bb] transition-colors">
                  arrow_forward
                </span>
              </div>
              <h4 className="text-base font-bold text-[#0b1c30] group-hover:text-[#0059bb] transition-colors mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-[#555f6b] line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
