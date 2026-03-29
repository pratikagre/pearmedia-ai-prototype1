import React, { useState, useRef } from 'react';
import { analyzeImage, generateImage } from '../utils/apiHelpers';
import ImageCard from './ImageCard';
import { Upload, RefreshCw, Layers, Edit2, AlertCircle } from 'lucide-react';

const WorkflowImage = () => {
  const [sourceImage, setSourceImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  const [analysisResult, setAnalysisResult] = useState("");
  const [variationPrompt, setVariationPrompt] = useState("");
  const [finalImage, setFinalImage] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
    }

    setSourceImage(URL.createObjectURL(file));
    setError(null);
    setAnalysisResult("");
    setVariationPrompt("");
    setFinalImage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setBase64Image(event.target.result);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(base64Image, mimeType);
      setAnalysisResult(result);
      // Auto-construct a variation prompt from analysis
      setVariationPrompt(`A stylistic variation of: ${result}. Make it high quality, masterful artwork.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!variationPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setFinalImage(null);

    try {
      const imageUrl = await generateImage(variationPrompt);
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
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Style Lab</h2>
            <p className="mt-2 text-sm text-gray-500">
              Upload an image to reverse-engineer its visual DNA and create new, inspired variations.
            </p>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
        )}

        {/* Step 1: Upload */}
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step 1: Upload Source Image
          </label>
          
          {!sourceImage ? (
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-indigo-400 bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative font-medium text-indigo-600 hover:text-indigo-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
          ) : (
              <div className="mt-4 flex flex-col items-center gap-4">
                  <img src={sourceImage} alt="Uploaded source" className="max-h-64 object-contain rounded-lg shadow-sm" />
                  <div className="flex gap-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-gray-500 underline hover:text-indigo-600"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                      >
                        {isAnalyzing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Layers className="mr-2 h-4 w-4" />}
                        Analyze Image
                      </button>
                  </div>
              </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            hidden
            accept="image/*"
          />
        </div>

        {/* Step 2: Analysis Results */}
        {analysisResult && (
            <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Step 2: AI Visual Analysis</label>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-800 whitespace-pre-line">
                    {analysisResult}
                </div>
                
                <div className="mt-6">
                    <label htmlFor="variation" className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
                      <span>Step 3: Variation Prompt</span>
                      <Edit2 className="h-4 w-4 text-gray-400" />
                    </label>
                    <textarea
                      id="variation"
                      rows={4}
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3"
                      value={variationPrompt}
                      onChange={(e) => setVariationPrompt(e.target.value)}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !variationPrompt.trim()}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <SparklesIcon className="mr-2 h-5 w-5" />}
                        Generate Variation
                    </button>
                </div>
            </div>
        )}

      </div>

      {isGenerating && (
        <div className="mt-8 flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Reimagining your image...</p>
        </div>
      )}

      {!isGenerating && finalImage && (
        <div className="mt-8">
          <ImageCard src={finalImage} alt="Generated Variation" title="Style Variation" />
        </div>
      )}

    </div>
  );
};

function SparklesIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      </svg>
    );
}

export default WorkflowImage;
