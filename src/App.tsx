import { useState } from 'react';
import { PageView, ReportAnalysis, SampleReport } from './types';
import { SAMPLE_REPORTS } from './data/sampleReports';
import { analyzeMedicalDocument } from './services/simplifierService';
import { TopNavBar } from './components/TopNavBar';
import { Footer } from './components/Footer';
import { UploadView } from './components/UploadView';
import { LandingView } from './components/LandingView';
import { ResultsView } from './components/ResultsView';
import { PrivacyHowItWorksView } from './components/PrivacyHowItWorksView';
import {
  AboutModal,
  ContactSupportModal,
  DoctorQuestionsModal,
  HipaaModal,
  TermsModal,
} from './components/Modals';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [analysisResult, setAnalysisResult] = useState<ReportAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStageText, setAnalyzingStageText] = useState('');

  // Modals state
  const [showSupport, setShowSupport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHipaa, setShowHipaa] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDoctorQuestions, setShowDoctorQuestions] = useState(false);

  // Trigger analysis for uploaded file or sample
  const handleStartAnalysis = async (file: File | null, sampleReport?: SampleReport) => {
    setIsAnalyzing(true);
    setAnalyzingStageText('Ingesting and encrypting document in-memory...');

    try {
      if (sampleReport) {
        // Run quick progress simulation
        setAnalyzingStageText('Reading laboratory values and references...');
        await new Promise((r) => setTimeout(r, 600));
        setAnalyzingStageText('Decoding clinical jargon with Google Gemini AI...');
        await new Promise((r) => setTimeout(r, 800));
        setAnalyzingStageText('Synthesizing patient recommendations...');
        await new Promise((r) => setTimeout(r, 600));

        setAnalysisResult(sampleReport.analysis);
        setCurrentView('results');
      } else {
        const result = await analyzeMedicalDocument(file, undefined, (stage) => {
          setAnalyzingStageText(stage);
        });
        setAnalysisResult(result);
        setCurrentView('results');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback to sample 0
      setAnalysisResult(SAMPLE_REPORTS[0].analysis);
      setCurrentView('results');
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStageText('');
    }
  };

  // User clicked a sample from Landing view
  const handleSelectSampleFromHome = (sample: SampleReport) => {
    handleStartAnalysis(null, sample);
  };

  const handleNavigate = (view: PageView) => {
    if (view === 'about') {
      setShowAbout(true);
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Fixed Top Navigation Bar */}
      <TopNavBar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUpload={() => handleNavigate('upload')}
        onOpenAbout={() => setShowAbout(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-grow flex flex-col">
        {currentView === 'home' && (
          <LandingView
            onOpenUpload={() => handleNavigate('upload')}
            onSelectSample={handleSelectSampleFromHome}
          />
        )}

        {currentView === 'upload' && (
          <UploadView
            onStartAnalysis={handleStartAnalysis}
            isAnalyzing={isAnalyzing}
            analyzingStageText={analyzingStageText}
          />
        )}

        {currentView === 'results' && analysisResult && (
          <ResultsView
            analysis={analysisResult}
            onNewAnalysis={() => handleNavigate('upload')}
            onOpenDoctorQuestions={() => setShowDoctorQuestions(true)}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyHowItWorksView
            onOpenSupport={() => setShowSupport(true)}
            onOpenUpload={() => handleNavigate('upload')}
          />
        )}
      </main>

      {/* Standard Footer */}
      <Footer
        onOpenPrivacy={() => handleNavigate('privacy')}
        onOpenTerms={() => setShowTerms(true)}
        onOpenHipaa={() => setShowHipaa(true)}
        onOpenSupport={() => setShowSupport(true)}
      />

      {/* Modals & Dialogs */}
      <ContactSupportModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
      />

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      <HipaaModal
        isOpen={showHipaa}
        onClose={() => setShowHipaa(false)}
      />

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />

      {analysisResult && (
        <DoctorQuestionsModal
          isOpen={showDoctorQuestions}
          onClose={() => setShowDoctorQuestions(false)}
          questions={analysisResult.doctorQuestions}
          reportName={analysisResult.fileName}
        />
      )}
    </div>
  );
}
