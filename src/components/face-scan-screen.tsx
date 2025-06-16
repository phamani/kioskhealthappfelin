/* eslint-disable @typescript-eslint/no-unused-vars */ 
/* eslint-disable react/no-unescaped-entities */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CircleIcon as CircleNotch, Check } from "lucide-react" 
import ShenaiScanner  from "@/components/ShenaiScanner"; 

interface FaceScanScreenProps { 
  onPrev: () => void;
  onNext: () => void;
}

export default function FaceScanScreen({ onPrev, onNext }: FaceScanScreenProps) {
  const [scanning, setScanning] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [scanComplete, setScanComplete] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [vitals, setVitals] = useState({
    heartRate: 0,
    bloodPressure: "",
    temperature: 0,
    oxygenSaturation: 0,
  })

  useEffect(() => {
    if (scanning && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (scanning && countdown === 0) {

      setScanComplete(true)
      setScanning(false)

      // Generate sample readings
      const sampleVitals = {
        heartRate: Math.floor(Math.random() * (100 - 60) + 60),
        bloodPressure: `${Math.floor(Math.random() * (140 - 110) + 110)}/${Math.floor(Math.random() * (90 - 70) + 70)}`,
        temperature: Number.parseFloat((Math.random() * (37.5 - 36.5) + 36.5).toFixed(1)),
        oxygenSaturation: Math.floor(Math.random() * (100 - 95) + 95),
      }

      setVitals(sampleVitals)

      // Show results after a short delay
      const timer = setTimeout(() => {
        setShowResults(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [scanning, countdown])

  const startScan = () => {
    setScanning(true)
  }

  const handleContinue = () => {
    onNext()
  }

  if (showResults) {
    return (
      <div className="flex flex-col space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Scan Complete</h2>
          <p className="text-xl text-gray-600 mb-8">Here are your vital signs captured from the face scan:</p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <Card className="p-6 bg-blue-50">
              <p className="text-lg text-gray-600">Heart Rate</p>
              <p className="text-3xl font-bold text-blue-700">
                {vitals.heartRate} <span className="text-lg">BPM</span>
              </p>
            </Card>
            <Card className="p-6 bg-blue-50">
              <p className="text-lg text-gray-600">Blood Pressure</p>
              <p className="text-3xl font-bold text-blue-700">{vitals.bloodPressure}</p>
            </Card>
            <Card className="p-6 bg-blue-50">
              <p className="text-lg text-gray-600">Temperature</p>
              <p className="text-3xl font-bold text-blue-700">{vitals.temperature}°C</p>
            </Card>
            <Card className="p-6 bg-blue-50">
              <p className="text-lg text-gray-600">Oxygen</p>
              <p className="text-3xl font-bold text-blue-700">{vitals.oxygenSaturation}%</p>
            </Card>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button onClick={onPrev} className="text-xl py-6 px-10 bg-gray-200 text-gray-800 hover:bg-gray-300">
            Back
          </Button>
          <Button onClick={handleContinue} className="text-xl py-6 px-10 bg-blue-600 hover:bg-blue-700">
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-blue-700">Face Scan</h2>
        <p className="text-xl text-gray-600 max-w-3xl">
          Please stand still and look directly at the screen. We'll capture your vital signs through our camera.
        </p>
      </div>

      {/* <div className="relative w-80 h-80 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300 my-8">
        {scanning ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-700">{countdown}</span>
              </div>
            </div>
          </div>
        ) : scanComplete ? (
          <div className="text-green-500">
            <Check size={100} />
          </div>
        ) : (
          <div className="text-center space-y-4"> 
            <ShenaiScanner /> 
          </div>
        )}
      </div> */}

      <div className="relative w-80 flex items-center justify-center my-8">
        <ShenaiScanner /> 
      </div>

      {/* <div className="space-y-4 text-center">
        {!scanning && !scanComplete && (
          <>
            <p className="text-lg text-gray-600">Position your face in the center and press the button to begin.</p>
            <Button onClick={startScan} className="text-xl py-6 px-10 bg-blue-600 hover:bg-blue-700">
              Start Face Scan
            </Button>
          </>
        )}

        {scanning && (
          <div className="flex items-center justify-center space-x-2">
            <CircleNotch className="animate-spin" size={24} />
            <span className="text-xl">Scanning in progress...</span>
          </div>
        )}

        {scanComplete && !showResults && (
          <div className="flex items-center justify-center space-x-2">
            <CircleNotch className="animate-spin" size={24} />
            <span className="text-xl">Processing results...</span>
          </div>
        )}
        {scanComplete && !showResults && (
          <div className="mt-4">
            <Button onClick={() => setShowResults(true)} className="text-xl py-4 px-8 bg-blue-600 hover:bg-blue-700">
              View Results
            </Button>
          </div>
        )}
      </div> */}

      <div className="flex justify-between w-full pt-6">
        <Button
          onClick={onPrev}
          disabled={scanning}
          className="text-xl py-6 px-10 bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </Button>
      </div>
    </div>
  )
}

