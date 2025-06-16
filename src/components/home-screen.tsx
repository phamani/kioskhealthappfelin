/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import WelcomeScreen from "@/components/welcome-screen";
import PersonalInfoScreen from "@/components/personal-info-screen";
import UserInfoScreen from "@/components/user-info-screen";
import FaceScanScreen from "@/components/face-scan-screen";
import FaceScanResult from "@/components/face-scan-result";
import ComplaintScreen from "@/components/complaint-screen";
import ClientAssessment from "@/components/client-assessment"; 
import KioskLayout from "@/components/kiosk-layout";
//import UserData 

export type UserData = {
  id: number,
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    consent: boolean;
    agree:boolean;
    nationalityId: string | number;
  } | null;
  age: string;
  gender: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    hrvSdnnMs: number;
    breathingRate: number; 
    temperature: number;
    oxygenSaturation: number;
    systolicBP: number;
    diastolicBP: number;
  } | null;
  complaint: string;
};

export default function HomeScreen() {
  const searchParams = useSearchParams(); 
  const isChecked = searchParams.get("ischecked") === "true"; 
  const stepParam = searchParams.get("step");

  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    personalInfo: null,
    age: "",
    gender: "",
    vitals: null,
    complaint: "",
  });

  // Set initial step to 4 if isChecked is true
  useEffect(() => {
    if (isChecked) { 
      setStep(4);
    }

    if(stepParam)
      setStep(parseInt(stepParam));

  }, [isChecked, stepParam]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData({ ...userData, ...data });
  }; 

  const renderStep = () => { 
    switch (step) {
      case 0:
        return <WelcomeScreen onNext={nextStep} />;
      case 1:
        return (
          <PersonalInfoScreen
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <UserInfoScreen
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <FaceScanScreen 
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <FaceScanResult 
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <ClientAssessment onNext={nextStep}  onPrev={prevStep}/>
      );
      case 6:
        return (
          <ComplaintScreen
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      // case 6:
      //   return <ChatbotScreen userData={userData} onReset={() => setStep(0)} />;
      default:
        return <WelcomeScreen onNext={nextStep} />;
    }
  };

  return (
    <KioskLayout currentStep={step} totalSteps={7}>
      {renderStep()}
    </KioskLayout>
  );
}
