import React, { useState } from 'react';
import { getEnhancedPrompt, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';
import { RefreshCw, Wand2, CheckCircle2, AlertCircle } from 'lucide-react';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [finalImage, setFinalImage] = useState(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!userPrompt.trim()) return;
    setIsEnhancing(true);
    setError(null);
    setFinalImage(null);
    
    try {
      const result = await getEnhancedPrompt(userPrompt);
      setEnhancedPrompt(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateImage(enhancedPrompt);
      setFinalImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-xl p-6 sm:p-8 space-y-8 border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Creative Studio</h2>
          <p className="mt-2 text-sm text-gray-500">
            Start with a simple idea. Let AI turn it into a descriptive masterpiece, then generate the corresponding artwork.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: User Input */}
        <div className="pt-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Step 1: Your Idea
          </label>
          <div className="mt-1 relative rounded-md shadow-sm flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
             <input
              type="text"
              name="prompt"
              id="prompt"
              className="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border bg-gray-50"
              placeholder="e.g., A cyber dog on mars..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing || !userPrompt.trim()}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isEnhancing ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-5 w-5 mr-2" />
              )}
              Enhance
            </button>
          </div>
        </div>

        {/* Step 2: Approval/Edit */}
        {enhancedPrompt && (
          <div className="pt-4 border-t border-gray-200 fade-in">
            <label htmlFor="enhanced" className="flex items-center text-sm font-medium text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Step 2: Review & Approve
            </label>
            <p className="text-xs text-gray-400 mt-1 mb-3">You can edit the enhanced prompt before generating the final image.</p>
            <textarea
              id="enhanced"
              rows={4}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-indigo-200 rounded-lg p-3 bg-indigo-50 text-indigo-900"
              value={enhancedPrompt}
              onChange={(e) => setEnhancedPrompt(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !enhancedPrompt.trim()}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <SparklesIcon className="h-5 w-5 mr-2" />
                )}
                Generate Image
              </button>
            </div>
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="mt-8 flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Painting your masterpiece...</p>
        </div>
      )}

      {!isGenerating && finalImage && (
        <div className="mt-8 scale-in">
          <ImageCard src={finalImage} alt="Final AI Output" title="Your Masterpiece" />
        </div>
      )}
    </div>
  );
};

// Quick inline icon since we didn't import Sparkles specifically above
function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

export default WorkflowText;
