/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserData } from "./home-screen";
import Cookies from 'js-cookie';
import { ClientModel } from "@/payload-types";
import HealthSummaryModal from "./health-summary-modal";
import { useTranslation } from "@/hooks/useTranslation";


interface ComplaintScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrev: () => void;
  apiData?: ClientModel | null; // Made optional
  setApiData?: React.Dispatch<React.SetStateAction<ClientModel | null>>; // Made optional
}

export default function ComplaintScreen({
  userData,
  updateUserData,
  onNext,
  onPrev,
  apiData = null, // Default value
  setApiData = () => {}, // Default empty function
}: ComplaintScreenProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); 
  const [showSummary, setShowSummary] = useState(false);
  const [localApiData, setLocalApiData] = useState<ClientModel | null>(apiData); // Local state fallback
  const [isError, setIsError] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>(
    userData.complaint ? userData.complaint.split(',').map(s => s.trim()) : []
  );
  
  // New state for "Other" functionality
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherComplaint, setOtherComplaint] = useState("");
  const [otherComplaintError, setOtherComplaintError] = useState("");

  const commonComplaints = [
    { key: 'headache', value: 'Headache' },
    { key: 'fever', value: 'Fever' },
    { key: 'cough', value: 'Cough' },
    { key: 'soreThroat', value: 'Sore Throat' },
    { key: 'stomachPain', value: 'Stomach Pain' },
    { key: 'backPain', value: 'Back Pain' },
    { key: 'dizziness', value: 'Dizziness' },
    { key: 'fatigue', value: 'Fatigue' },
    { key: 'nausea', value: 'Nausea' },
    { key: 'shortnessOfBreath', value: 'Shortness of Breath' },
    { key: 'chestPain', value: 'Chest Pain' },
    { key: 'other', value: 'Other' },
    { key: 'nothing', value: 'Nothing' }
  ];
  
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Unified function to update API data
  const updateApiData = (data: ClientModel | null) => {
    if (setApiData) {
      setApiData(data);
    }
    setLocalApiData(data);
  };

  // Updated toggleComplaint function to handle "Other" specially
  const toggleComplaint = (complaintValue: string) => {
    if (complaintValue === "Other") {
      if (selectedComplaints.includes("Other")) {
        // Remove "Other" and hide input
        setSelectedComplaints(prev => prev.filter(item => item !== "Other"));
        setShowOtherInput(false);
        setOtherComplaint("");
        setOtherComplaintError("");
      } else {
        // Add "Other" and show input
        setSelectedComplaints(prev => [...prev, "Other"]);
        setShowOtherInput(true);
      }
    } else {
      setSelectedComplaints(prev => {
        if (prev.includes(complaintValue)) {
          return prev.filter(item => item !== complaintValue);
        } else {
          return [...prev, complaintValue];
        }
      });
    }
  };

  // Validation function for "Other" input
  const validateOtherComplaint = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length > 10) {
      setOtherComplaintError(t('complaint.validation.maxWords'));
      return false;
    }
    setOtherComplaintError("");
    return true;
  };

  // Handle "Other" input change
  const handleOtherComplaintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherComplaint(value);
    validateOtherComplaint(value);
  };

  // Get final complaints list including custom "Other" text
  const getFinalComplaintsList = () => {
    const complaints = selectedComplaints.filter(item => item !== "Other");
    if (selectedComplaints.includes("Other") && otherComplaint.trim()) {
      complaints.push(otherComplaint.trim());
    }
    return complaints;
  };

  const handleNext = async () => {
    const userId = Cookies.get('userId');
    
    // Validate "Other" input if it's selected
    if (selectedComplaints.includes("Other") && !validateOtherComplaint(otherComplaint)) {
      return;
    }
    
    if (selectedComplaints.includes("Other") && !otherComplaint.trim()) {
      setOtherComplaintError(t('complaint.validation.required'));
      return;
    }

    const complaintsString = getFinalComplaintsList().join(", ");

    try {
      setIsLoading(true); 
      await submitSymptoms(complaintsString);
      onNext();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowSummary = async () => {
    // Validate "Other" input if it's selected
    if (selectedComplaints.includes("Other") && !validateOtherComplaint(otherComplaint)) {
      return;
    }
    
    if (selectedComplaints.includes("Other") && !otherComplaint.trim()) {
      setOtherComplaintError(t('complaint.validation.required'));
      return;
    }

    const complaintsString = getFinalComplaintsList().join(", ");
    await submitSymptoms(complaintsString);
    setShowSummary(true);
  };

  const submitSymptoms = async (complaintsString: string) => {
    const userId = Cookies.get('userId');

    try {
      setIsLoading(true); 
      updateUserData({ complaint: complaintsString });

      // Update both local and parent state
      const updatedData = {
        ...(localApiData || {}),
        HealthConcern: complaintsString
      } as ClientModel;
      
      updateApiData(updatedData);

      const req = await fetch(`${apiUrl}/client/EditClientHealthConcern`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          healthConcern: complaintsString,
        }),
      }); 
      
      if (!req.ok) {
        throw new Error("Failed to update health concerns");
      }
    } catch (err) {
      console.error(err);
      throw err; // Re-throw to handle in calling functions
    } finally {
      setIsLoading(false);
    } 
  };

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const userId = Cookies.get('userId');

        const response = await fetch(`${apiUrl}/client/GetClient?id=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const responseJson = await response.json();
        if (!responseJson.IsSuccess) {
          throw new Error("Failed to fetch data");
        }
 
        const data: ClientModel = responseJson.Result;

        updateApiData(data);
        setIsError(false);

        if (data.HealthConcern) {
          const complaints = data.HealthConcern.split(',').map(s => s.trim());
          // Check if there's a custom complaint that's not in the predefined list
          const predefinedValues = commonComplaints.map(c => c.value);
          const customComplaints = complaints.filter(c => !predefinedValues.includes(c));
          
          if (customComplaints.length > 0) {
            // If there are custom complaints, add "Other" to selection and set the first custom complaint
            setSelectedComplaints([...complaints.filter(c => predefinedValues.includes(c)), "Other"]);
            setOtherComplaint(customComplaints[0]);
            setShowOtherInput(true);
          } else {
            setSelectedComplaints(complaints);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!localApiData) { // Only fetch if we don't have data
      fetchData();
    }
  }, [apiUrl]); // Removed setApiData from dependencies

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          {t('complaint.title')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('complaint.subtitle')}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {commonComplaints.map((complaint) => (
            <Card
              key={complaint.key}
              className={`p-6 cursor-pointer transition-all ${
                selectedComplaints.includes(complaint.value)
                  ? "bg-blue-100 border-blue-500 border-2"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => toggleComplaint(complaint.value)}
            >
              <p className="text-xl text-center">{t(`complaint.symptoms.${complaint.key}`)}</p>
            </Card>
          ))}
        </div>
        
        {/* "Other" input field */}
        {showOtherInput && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              {t('complaint.other.label')}
            </label>
            <Input
              type="text"
              value={otherComplaint}
              onChange={handleOtherComplaintChange}
              placeholder={t('complaint.other.placeholder')}
              className={`text-lg p-3 ${otherComplaintError ? 'border-red-500' : ''}`}
              maxLength={100} // Character limit to help enforce word limit
            />
            {otherComplaintError && (
              <p className="text-red-500 text-sm mt-1">{otherComplaintError}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {t('complaint.other.hint')}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrev}
          className="text-xl py-6 px-10 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {t('buttons.back')}
        </Button>
        <Button 
          onClick={handleShowSummary} 
          disabled={!selectedComplaints || selectedComplaints.length === 0 || isLoading || 
                   (selectedComplaints.includes("Other") && (!otherComplaint.trim() || !!otherComplaintError))}
          className="text-xl py-6 px-10 bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? t('common.loading') : t('buttons.submit')}
        </Button>
      </div>

      {!isError && !isLoading && localApiData && (
        <HealthSummaryModal
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          userData={localApiData}
        />
      )}
    </div>
  );
}