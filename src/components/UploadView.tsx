import React, { useState, useRef } from 'react';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { SampleReport } from '../types';

interface UploadViewProps {
  onStartAnalysis: (file: File | null, sampleReport?: SampleReport) => void;
  isAnalyzing: boolean;
  analyzingStageText: string;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onStartAnalysis,
  isAnalyzing,
  analyzingStageText,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedSample(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setSelectedSample(null);
    }
  };

  const handleSelectSample = (sample: SampleReport) => {
    setSelectedSample(sample);
    setSelectedFile(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedSample) {
      onStartAnalysis(null, selectedSample);
    } else if (selectedFile) {
      onStartAnalysis(selectedFile);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-6 medical-cross-bg overflow-hidden">
      {/* Background Subtle Medical Accents */}
      <div className="fixed top-20 right-8 opacity-10 pointer-events-none z-0 hidden md:block">
        <span className="material-symbols-outlined text-[130px] text-[#0059bb]">
          stethoscope
        </span>
      </div>
      <div className="fixed bottom-16 left-8 opacity-10 pointer-events-none z-0 hidden md:block">
        <span className="material-symbols-outlined text-[150px] text-[#0059bb]">
          monitor_heart
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto flex flex-col items-center">
        {/* Header Title & Subtitle */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0059bb] mb-3 tracking-tight">
            Medical Report Simplifier
          </h1>
          <p className="text-base md:text-lg text-[#555f6b] leading-relaxed">
            Upload your complex medical documents (PDF, PNG, JPG) and let our AI translate
            them into clear, human-centric language you can actually understand.
          </p>
        </div>

        {/* Upload Container Card */}
        <div className="w-full bg-white rounded-xl border border-[#c1c6d7] shadow-sm overflow-hidden flex flex-col transition-all">
          {/* Blue Accent Stripe */}
          <div className="h-1.5 w-full bg-[#0059bb]" />

          <div className="p-6 md:p-10 flex flex-col items-center">
            {isAnalyzing ? (
              /* Analyzing State */
              <div className="w-full py-10 flex flex-col items-center justify-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-6xl text-[#0059bb] animate-pulse-gentle"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    medical_services
                  </span>
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-2xl font-semibold text-[#0059bb] mb-2">
                    Analyzing Report...
                  </h3>
                  <p className="text-sm text-[#555f6b] min-h-[20px]">
                    {analyzingStageText || 'Extracting data and simplifying medical terminology.'}
                  </p>
                </div>

                {/* Medical Indeterminate Progress Bar */}
                <div className="w-full max-w-md h-2.5 bg-[#e5eeff] rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-[#0059bb] rounded-full animate-indeterminate" />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#555f6b] mt-2">
                  <span className="material-symbols-outlined text-sm text-[#006b24]">
                    verified_user
                  </span>
                  <span>HIPAA-aligned zero retention processing</span>
                </div>
              </div>
            ) : selectedFile || selectedSample ? (
              /* Selected File Preview State */
              <div className="w-full flex flex-col gap-5">
                <div className="flex items-center justify-between p-4 border border-[#c1c6d7] rounded-lg bg-white shadow-xs">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#ffdad6] text-[#ba1a1a] w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        picture_as_pdf
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#0b1c30]">
                        {selectedFile ? selectedFile.name : selectedSample?.fileName}
                      </p>
                      <p className="text-xs text-[#555f6b] mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                          : selectedSample?.fileSize}{' '}
                        • Ready for instant simplification
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-[#555f6b] hover:text-[#ba1a1a] p-2 rounded-full hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    aria-label="Remove selected file"
                    title="Remove file"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Sample summary hint */}
                {selectedSample && (
                  <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#d8e2ff] text-xs text-[#004493] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>
                      Loaded demo: <strong>{selectedSample.title}</strong> ({selectedSample.category})
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#007BFF] hover:bg-[#0059bb] text-white text-base font-semibold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-99"
                >
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  <span>Simplify Now</span>
                </button>
              </div>
            ) : (
              /* Drag & Drop Default State */
              <div className="w-full flex flex-col items-center">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-10 md:p-14 flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
                    dragOver
                      ? 'border-[#0059bb] bg-[#eff4ff]'
                      : 'border-[#c1c6d7] bg-[#F8FAFC] hover:bg-[#eff4ff]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf, .png, .jpg, .jpeg, .webp, .txt"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Upload medical report"
                  />

                  <div className="bg-[#d3e4fe] text-[#0059bb] w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    <span className="material-symbols-outlined text-3xl">
                      cloud_upload
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] mb-1.5 text-center">
                    Drag &amp; drop your report here
                  </h3>
                  <p className="text-sm text-[#555f6b] text-center mb-5">
                    or click to browse your files
                  </p>

                  <div className="bg-[#eff4ff] text-[#555f6b] px-4 py-1.5 rounded-full text-xs font-medium border border-[#c1c6d7] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#0059bb]">
                      info
                    </span>
                    <span>Supports PDF, PNG, JPG (Max 10MB)</span>
                  </div>
                </div>

                {/* Instant Sample Reports Bar */}
                <div className="w-full mt-6 pt-5 border-t border-[#e5eeff] flex flex-col items-center">
                  <p className="text-xs font-semibold text-[#555f6b] uppercase tracking-wider mb-3">
                    Don&apos;t have a document ready? Try a verified sample:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SAMPLE_REPORTS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#0059bb] rounded-full border border-[#adc7ff] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">
                          lab_profile
                        </span>
                        <span>{sample.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="bg-[#e5eeff] px-6 py-3.5 border-t border-[#c1c6d7] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#006b24] text-base">
              lock
            </span>
            <p className="text-xs text-[#555f6b] text-center">
              <strong>Privacy Note:</strong> Your file is processed securely in-memory and deleted instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
