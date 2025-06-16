/* eslint-disable @typescript-eslint/no-unused-vars */ 
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import QRCode from "react-qr-code";
import { ClientModel } from "@/payload-types";
import { useEffect, useState } from "react";
import { HealthData } from "@/types/health-data";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Cookies from 'js-cookie';

// interface SuggestedCare {
//   level?: string;
//   message?: string;
//   timestamp?: number;
// }
interface HealthSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: ClientModel;
  //recommendation: SuggestedCare | null
}

export default function HealthSummaryModal({
  isOpen,
  onClose,
  userData,
  //recommendation
}: HealthSummaryModalProps) { 
  const [latestResult, setLatestResult] = useState<HealthData | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_DOMAIN;
  const userId = Cookies.get('userId');

  useEffect(() => {
    const fetcherResults = async () => {  
      const allResults = await fetch(`${apiUrl}/ScanResult/GetClientLatestScanResult?clientId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }); 

      const jsonData = await allResults.json();
      const data: HealthData = jsonData.Result;

      setLatestResult(data); 
    };

    fetcherResults();

    const now = new Date();
    setCurrentDate(now.toLocaleDateString()); // Format as MM/DD/YYYY or based on locale
    setCurrentTime(now.toLocaleTimeString()); // Format as HH:MM:SS AM/PM or based on locale
  }, []);
 
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  
  const sendSummaryByEmail = async () => {
    try { 
      const response = await fetch(`${apiUrl}/email/SendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: userData.Email,
          subject: "Health Assessment Summary",
          text: `
            Date: ${currentDate}
            Time: ${currentTime}
            Name: ${userData.UserName}
            Age: ${userData.Age}
            Gender: ${userData.Gender}
            
            Vital Signs:
            - Heart Rate: ${latestResult?.HeartRate10s ?? "N/A"} bpm
            - Blood Pressure: ${latestResult ? `${latestResult.SystolicBloodPressureMmhg}/${latestResult.DiastolicBloodPressureMmhg}` : "N/A"} mmHg
            - Heart Rate Variability: ${latestResult?.HrvSdnnMs ?? "N/A"} ms
            - Breathing Rate: ${latestResult?.BreathingRate ?? "N/A"} pbs
            
            Reported Symptoms:
            - ${userData.HealthConcern}
            
            Important Notice:
            This is an automated health assessment summary. It is not a medical diagnosis. Please consult with a healthcare provider for proper evaluation and treatment.`,
        }),
      });

      const responseJson = await response.json();

      if (responseJson.IsSuccess) {
          Swal.fire({
            icon: "success",
            title: "Summary sent via email!",
            showConfirmButton: false,
            timer: 1500, 
          });
      } else {
        console.error("Failed to send email");
        alert("Failed to send email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending email");
    }
  };
  console.log('result:',latestResult);
  //console.log('recomend:',recommendation);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto print:shadow-none print:border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
            Health Assessment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full sm:w-auto">
            <p className="text-sm sm:text-base text-gray-600">Date: {currentDate}</p>
            <p className="text-sm sm:text-base text-gray-600">Time: {currentTime}</p>
            {userData.UserName && (
              <p className="text-sm sm:text-base text-gray-600 mt-2">Name: {userData.UserName}</p>
            )}
            <p className="text-sm sm:text-base text-gray-600">Age: {userData.Age}</p>
            <p className="text-sm sm:text-base text-gray-600">Gender: {userData.Gender}</p>
          </div>

          <div className="w-full sm:w-auto text-center sm:text-right">
            <div className="inline-flex flex-col items-center bg-blue-100 p-2 rounded-lg">
              <QRCode
                size={window.innerWidth < 400 ? 100 : 120}
                value={`${hostUrl}/health-summary?clientId=${userId}`}
              />
              <p className="text-xs text-gray-600 mt-1">
                Scan to view on mobile
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2 sm:mb-3">
              Vital Signs
            </h3>
            <p className="text-sm sm:text-base mb-2">
              Heart Rate: {!latestResult ? "..." : latestResult.HeartRate10s}
              bpm
            </p>
            <p className="text-sm sm:text-base mb-2">
              Blood Pressure:{" "}
              {!latestResult
                ? "..."
                : `${latestResult.SystolicBloodPressureMmhg}/${latestResult.DiastolicBloodPressureMmhg}`}
              mmHg
            </p>
            <p className="text-sm sm:text-base mb-2">
              Heart Rate Variability:{" "}
              {!latestResult ? "..." : latestResult.HrvSdnnMs}
              ms
            </p>
            <p className="text-sm sm:text-base mb-2">
              Breathing Rate:{" "}
              {!latestResult ? "..." : latestResult.BreathingRate}pbs
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2 sm:mb-3">
              Reported Symptoms
            </h3>
            <ul className="list-disc pl-5 text-sm sm:text-base">
              {/* <li className="mb-1">{userData.reportedsymptoms}</li> */}
                {/* {additionalSymptoms.map((symptom, index) => (
                  <li key={index} className="mb-1">
                    {symptom}
                  </li>
                ))} */}

              <li className="mb-1">{userData.HealthConcern}</li>
            </ul>
          </div>
        </div>

        {/* <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Suggested Care
            </h3>
            
            {recommendation ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold text-lg">{recommendation.level}</p>
                <p>{recommendation.message}</p>
              </div>
            ) : (
              <p className="text-gray-500">No recommendation available.</p>
            )}
          </div> */}

          {/* <div className="mt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Possible Causes
            </h3>
            <div className="space-y-2">
              {possibleCauses.map((cause, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>{cause.condition}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      cause.likelihood === "common"
                        ? "bg-red-100 text-red-800"
                        : cause.likelihood === "rare"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cause.likelihood}
                  </span>
                </div>
              ))}
            </div>
          </div> */}

        <div className="mt-4 md:mt-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2">
            Important Notice
          </h3>
          <p className="text-sm sm:text-base text-gray-700">
            This is an automated health assessment summary. It is not a medical
            diagnosis. Please consult with a healthcare provider for proper
            medical evaluation and treatment.
          </p>
        </div>

        <DialogFooter className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button
            onClick={() => {
              sendSummaryByEmail();
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ); 
}
