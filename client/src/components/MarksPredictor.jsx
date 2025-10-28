import React from 'react';
import { TrendingUp, ArrowRight, Target, BarChart3 } from 'lucide-react';

export default function MarksPredictor() {
  const handlePredictorClick = () => {
    // This would link to your Python script website
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-8xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Marks Predictor</h2>
            </div>
            <p className="text-blue-100">
              Predict your semester performance based on current progress
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Feature Card 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Accurate Predictions
                </h3>
                <p className="text-gray-600 text-sm">
                  Advanced algorithms analyze your performance patterns to provide reliable grade forecasts
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Visual Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Interactive charts and graphs to visualize your academic trajectory and goals
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex gap-3">
                <div className="text-amber-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">How it works</h4>
                  <p className="text-amber-800 text-sm">
                    The predictor uses your study hours, attendance, mental health, sleep hours and job status to estimate your final marks. Make sure your data is up to date for the most accurate predictions.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={handlePredictorClick}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg">Launch Predictor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Opens in a new window
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-xs text-gray-600 mt-1">Accuracy Rate</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-indigo-600">5+</div>
            <div className="text-xs text-gray-600 mt-1">Factors Analyzed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">Real-time</div>
            <div className="text-xs text-gray-600 mt-1">Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}