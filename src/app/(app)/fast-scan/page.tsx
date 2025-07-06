'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import FastScanScanner from '@/components/FastScanScanner';

export default function FastScanPage() {
  const router = useRouter();
  const [scanResults, setScanResults] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScanComplete = (results: any) => {
    console.log('Scan completed with results:', results);
    setScanResults(results);
    setIsScanning(false);
    setErrorMessage('');
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    setErrorMessage(error);
    setIsScanning(false);
  };

  const handleStartNewScan = () => {
    setScanResults(null);
    setErrorMessage('');
    setIsScanning(true);
    
    // Reset the SDK to measurement screen without re-initializing
    if (window.shenai && window.shenai.isInitialized()) {
      try {
        // Go back to measurement screen to start new scan
        window.shenai.setScreen(window.shenai.Screen.MEASUREMENT);
        console.log('SDK reset to measurement screen for new scan');
      } catch (error) {
        console.warn('Could not reset SDK screen:', error);
      }
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Fast Scan
              </h1>
              <p className="text-lg text-gray-600">
                Pure Shen.AI SDK experience - Complete health assessment using Full UX Flow with all parameters displayed in embedded UI
              </p>
            </div>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {scanResults && (
                     <Alert className="mb-6 border-green-200 bg-green-50">
             <CheckCircle className="h-4 w-4 text-green-600" />
             <AlertDescription className="text-green-800">
               Scan completed successfully! Pure SDK results captured with comprehensive health analysis.
             </AlertDescription>
           </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Face Scanner - Full UX Flow
                </h2>
                <p className="text-gray-600">
                  Pure Shen.AI SDK implementation using Full UX Flow. Complete embedded UI shows all parameter values in real-time 
                  without external API calls. The SDK handles everything: instructions, camera feedback, positioning hints, 
                  measurement processing, and comprehensive health metrics display.
                </p>
              </div>
              
              <FastScanScanner 
                onScanComplete={handleScanComplete}
                onError={handleScanError}
              />
              
              {scanResults && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleStartNewScan}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start New Scan
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Information & Results Section */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Full UX Flow Guide
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">1.</span>
                  The SDK will show step-by-step instructions automatically
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">2.</span>
                  Follow face positioning overlay and hints
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">3.</span>
                  Watch real-time parameter values during measurement
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">4.</span>
                  View signal quality indicators and visual warnings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">5.</span>
                  Complete summary screen shows all health metrics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">6.</span>
                  Health risk assessment is included in results
                </li>
              </ul>
            </Card>

            {/* Results Card */}
            {scanResults && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Scan Results
                </h3>
                                 <div className="space-y-3 max-h-96 overflow-y-auto">
                   {/* Primary Vitals */}
                   {scanResults.realtimeHeartRate && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Heart Rate:</span>
                       <span className="font-semibold">{scanResults.realtimeHeartRate} BPM</span>
                     </div>
                   )}
                   {scanResults.systolicBloodPressureMmhg && scanResults.diastolicBloodPressureMmhg && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Blood Pressure:</span>
                       <span className="font-semibold">
                         {scanResults.systolicBloodPressureMmhg}/{scanResults.diastolicBloodPressureMmhg} mmHg
                       </span>
                     </div>
                   )}
                   {scanResults.breathingRate && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Breathing Rate:</span>
                       <span className="font-semibold">{scanResults.breathingRate} BPM</span>
                     </div>
                   )}
                   
                   {/* Heart Rate Variability */}
                   {scanResults.hrvSdnnMs && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">HRV SDNN:</span>
                       <span className="font-semibold">{scanResults.hrvSdnnMs} ms</span>
                     </div>
                   )}
                   {scanResults.hrvLnrmssdMs && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">HRV LNRMSSD:</span>
                       <span className="font-semibold">{scanResults.hrvLnrmssdMs} ms</span>
                     </div>
                   )}
                   
                   {/* Stress & Autonomic Metrics */}
                   {scanResults.cardiacStress && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Cardiac Stress:</span>
                       <span className="font-semibold">{scanResults.cardiacStress}</span>
                     </div>
                   )}
                   {scanResults.stressIndex && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Stress Index:</span>
                       <span className="font-semibold">{scanResults.stressIndex}</span>
                     </div>
                   )}
                   {scanResults.parasympatheticActivity && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Parasympathetic Activity:</span>
                       <span className="font-semibold">{scanResults.parasympatheticActivity}</span>
                     </div>
                   )}
                   
                   {/* Cardiac Performance */}
                   {scanResults.cardiacWorkload && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Cardiac Workload:</span>
                       <span className="font-semibold">{scanResults.cardiacWorkload} mmHg/sec</span>
                     </div>
                   )}
                   
                   {/* Body Metrics */}
                   {scanResults.ageYears && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Estimated Age:</span>
                       <span className="font-semibold">{scanResults.ageYears} years</span>
                     </div>
                   )}
                   {scanResults.bmiKgPerM2 && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">BMI:</span>
                       <span className="font-semibold">{scanResults.bmiKgPerM2} kg/m²</span>
                     </div>
                   )}
                   {scanResults.weightKg && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Estimated Weight:</span>
                       <span className="font-semibold">{scanResults.weightKg} kg</span>
                     </div>
                   )}
                   {scanResults.heightCm && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Estimated Height:</span>
                       <span className="font-semibold">{scanResults.heightCm} cm</span>
                     </div>
                   )}
                   
                   {/* Health Indices */}
                   {scanResults.wellnessScore && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Wellness Score:</span>
                       <span className="font-semibold">{scanResults.wellnessScore}/100</span>
                     </div>
                   )}
                   {scanResults.vascularAge && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Vascular Age:</span>
                       <span className="font-semibold">{scanResults.vascularAge} years</span>
                     </div>
                   )}
                   {scanResults.waistToHeightRatio && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Waist-to-Height Ratio:</span>
                       <span className="font-semibold">{scanResults.waistToHeightRatio.toFixed(3)}</span>
                     </div>
                   )}
                   {scanResults.bodyFatPercentage && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Body Fat Percentage:</span>
                       <span className="font-semibold">{scanResults.bodyFatPercentage.toFixed(1)}%</span>
                     </div>
                   )}
                   {scanResults.basalMetabolicRate && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Basal Metabolic Rate:</span>
                       <span className="font-semibold">{scanResults.basalMetabolicRate} cal/day</span>
                     </div>
                   )}
                   {scanResults.totalDailyEnergyExpenditure && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Total Daily Energy Expenditure:</span>
                       <span className="font-semibold">{scanResults.totalDailyEnergyExpenditure} cal/day</span>
                     </div>
                   )}
                   {scanResults.hypertensionRisk && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Hypertension Risk:</span>
                       <span className="font-semibold">{(scanResults.hypertensionRisk * 100).toFixed(1)}%</span>
                     </div>
                   )}
                   {scanResults.diabetesRisk && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Diabetes Risk:</span>
                       <span className="font-semibold">{(scanResults.diabetesRisk * 100).toFixed(1)}%</span>
                     </div>
                   )}
                   
                   {/* Signal Quality */}
                   {scanResults.averageSignalQuality && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Average Signal Quality:</span>
                       <span className="font-semibold">{(scanResults.averageSignalQuality * 100).toFixed(1)}%</span>
                     </div>
                   )}
                   {scanResults.totalBadSignalSeconds && (
                     <div className="flex justify-between">
                       <span className="text-gray-600">Bad Signal Duration:</span>
                       <span className="font-semibold">{scanResults.totalBadSignalSeconds}s</span>
                     </div>
                   )}
                 </div>
              </Card>
            )}

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Full UX Features
              </h3>
              <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <strong>Pure SDK Implementation:</strong> No external API calls - everything handled by Shen.AI SDK. 
                Complete health assessment with real-time metrics, health indices (Wellness Score, Vascular Age, etc.), 
                chronic disease risks, and body composition analysis all in embedded UI.
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Complete embedded user interface with all metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Real-time parameter value display
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Face positioning overlay with guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Visual warnings and step-by-step instructions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Camera swap capability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Blood flow visualization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Signal quality indicators and tiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Comprehensive health risk assessment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Complete summary screen with all results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Trial metric labels and out-of-range indicators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Wellness Score (comprehensive well-being assessment)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Vascular Age and cardiovascular disease risk
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Body composition indices (BMI, body fat %, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Metabolic assessment (BMR, TDEE)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Chronic disease risk prediction (diabetes, hypertension)
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 