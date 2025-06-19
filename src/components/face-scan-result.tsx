/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { useState, useEffect } from "react"
import Cookies from 'js-cookie';

import { HealthData } from "@/types/health-data";
import type { UserData } from "./home-screen";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClientModel } from '@/payload-types';
import { useTranslation } from "@/hooks/useTranslation";


interface FaceScanResultProps { 
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
    onPrev: () => void;
    onNext: () => void;
};

export default function FaceScanResult({
  userData,
  updateUserData,
  onNext,
  onPrev
}: FaceScanResultProps){
    const { t, i18n } = useTranslation();
    const [latestResult, setLatestResult] = useState<HealthData | null>(null);
    const [isFetching, setIsFetching] = useState<Boolean>(false);
    
    // Ensure language is preserved on component mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (savedLanguage && i18n.language !== savedLanguage) {
            console.log('Face scan result: Restoring language to:', savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);
     
    useEffect(() => {
        console.log("FaceScan Result UserData: " + JSON.stringify(userData));
        
        const fetcherResults = async () => {
            setIsFetching(true);
            const userId = Cookies.get('userId');
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 

            const getClientResponse = await fetch(`${apiUrl}/client/GetClient?id=${userId}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                },
            });
     
            const getClientResponseJson = await getClientResponse.json(); 
            const client: ClientModel = getClientResponseJson.Result;   

            const allResults = await fetch(`${apiUrl}/ScanResult/GetClientLatestScanResult?clientId=${userId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "ngrok-skip-browser-warning": "true",
                },
              }); 

            const jsonData = await allResults.json();
            const data: HealthData = jsonData.Result;

            updateUserData({
                id: client?.Id,
                age: client?.Age,
                gender: client?.Gender,
                complaint: client?.HealthConcern,
                personalInfo:{
                    fullName: client?.FullName,
                    email: client?.Email,
                    phone: client?.Phone,
                    agree: true,
                    consent: true,
                    nationalityId: client.NationalityId
                },
                vitals: {
                    heartRate: data?.RealTimeHeartRate,
                    bloodPressure: data?.SystolicBloodPressureMmhg + "/" + data?.DiastolicBloodPressureMmhg,
                    breathingRate: data?.BreathingRate,
                    hrvSdnnMs: data?.HrvSdnnMs,
                    diastolicBP: data?.DiastolicBloodPressureMmhg,
                    systolicBP : data?.SystolicBloodPressureMmhg,
                    oxygenSaturation: 0,
                    temperature: 0
                }
            });

            setLatestResult(data);
            setIsFetching(false);
        };

        fetcherResults();
    }, []);

    return (
        <div className="flex flex-col space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-blue-700 mb-4">{t('faceScan.scanComplete')}</h2>
                <p className="text-xl text-gray-600 mb-8">{t('faceScan.scanCompleteSubtitle')}</p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <Card className="p-6 bg-blue-50">
                        <p className="text-lg text-gray-600">{t('faceScan.vitals.heartRate')}</p>
                        <p className="text-3xl font-bold text-blue-700">
                            {latestResult?.RealTimeHeartRate} <span className="text-lg">{t('faceScan.vitals.bpm')}</span>
                        </p>
                    </Card>
                    <Card className="p-6 bg-blue-50">
                        <p className="text-lg text-gray-600">{t('faceScan.vitals.heartRateVariability')}</p>
                        <p className="text-3xl font-bold text-blue-700">{latestResult?.HrvSdnnMs}</p>
                    </Card>
                    <Card className="p-6 bg-blue-50">
                        <p className="text-lg text-gray-600">{t('faceScan.vitals.respirationRate')}</p>
                        <p className="text-3xl font-bold text-blue-700">{latestResult?.BreathingRate}</p>
                    </Card>
                    <Card className="p-6 bg-blue-50">
                        <p className="text-lg text-gray-600">{t('faceScan.vitals.bloodPressure')}</p>
                        <p className="text-2xl font-bold text-blue-700">{latestResult?.SystolicBloodPressureMmhg}/{latestResult?.DiastolicBloodPressureMmhg}</p>
                    </Card> 
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button onClick={onPrev} className="text-xl py-6 px-10 bg-gray-200 text-gray-800 hover:bg-gray-300">
                    {t('buttons.back')}
                </Button>
                <Button onClick={onNext} className="text-xl py-6 px-10 bg-blue-600 hover:bg-blue-700">
                    {t('buttons.continue')}
                </Button>
            </div>
        </div>
    );
}; 