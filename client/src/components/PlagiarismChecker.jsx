import React from 'react';
import { Shield, ArrowRight, FileCheck, Zap } from 'lucide-react';

export default function PlagiarismChecker() {
  const handleCheckerClick = () => {
    // This would link to your plagiarism checker website/tool
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-8">
      <div className="max-w-8xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-400 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Plagiarism Checker</h2>
            </div>
            <p className="text-purple-100">
              Ensure originality and academic integrity in your work
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Feature Card 1 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="bg-gray-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Deep Content Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Advanced scanning technology detects similarities across billions of sources
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
                <div className="bg-gray-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Instant Results
                </h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive plagiarism reports in seconds with highlighted matches
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
              <div className="flex gap-3">
                <div className="text-emerald-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-1">How it works</h4>
                  <p className="text-emerald-800 text-sm">
                    Paste your text to check for plagiarism. Our system compares your content against academic papers, websites, and publications to identify any potential matches and provide a detailed similarity report.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={handleCheckerClick}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-black text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg">Launch Checker</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Opens in a new window
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
     
      </div>
    </div>
  );
}