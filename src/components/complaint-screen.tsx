/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  const toggleComplaint = (complaintValue: string) => {
    setSelectedComplaints(prev => {
      if (prev.includes(complaintValue)) {
        return prev.filter(item => item !== complaintValue);
      } else {
        return [...prev, complaintValue];
      }
    });
  };

  const handleNext = async () => {
    const userId = Cookies.get('userId');
    const complaintsString = selectedComplaints.join(", ");

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
    const complaintsString = selectedComplaints.join(", ");
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
          setSelectedComplaints(data.HealthConcern.split(',').map(s => s.trim()));
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
          disabled={!selectedComplaints || selectedComplaints.length === 0 || isLoading}
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