import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenHipaa: () => void;
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenHipaa,
  onOpenSupport,
}) => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#c1c6d7] w-full py-8 px-6 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-[#0b1c30] block mb-0.5">
            EasyReport
          </span>
          <p className="text-xs text-[#555f6b]">
            © 2026 EasyReport AI. Clinical Clarity for Patients.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <button
            onClick={onOpenPrivacy}
            className="text-[#0059bb] hover:underline font-medium cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenTerms}
            className="text-[#555f6b] hover:text-[#0059bb] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenHipaa}
            className="text-[#555f6b] hover:text-[#0059bb] transition-colors cursor-pointer"
          >
            HIPAA Compliance
          </button>
          <button
            onClick={onOpenSupport}
            className="text-[#555f6b] hover:text-[#0059bb] transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </nav>
      </div>
    </footer>
  );
};
