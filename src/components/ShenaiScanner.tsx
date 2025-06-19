/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const ShenaiScanner = () => {
    const { t } = useTranslation();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const hostUrl = process.env.NEXT_PUBLIC_HOST_DOMAIN; 
    const [isLoading, setIsLoading] = useState(false);

    // Function to expose to the window for the script to call
    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    };

    useEffect(() => {
        // Ensure we are in the browser
        if (typeof window === "undefined") return;

        // Expose setLoading function to the window
        (window as any).setReactLoading = setLoading;

        const script = document.createElement("script");
        script.type = "module";
        script.innerHTML = `
        import CreateShenaiSDK from "/shenai-sdk/index.mjs";  

        const API_KEY = "66b96244e85346c89425c3259feb01f9";
        //const USER_ID = localStorage.getItem("userId"); 
        const USER_ID = document.cookie
        .split('; ')
        .find(row => row.startsWith('userId='))
        ?.split('=')[1]; 
        
        var apiBaseUrl = '${apiUrl}';
        var hostUrl = '${hostUrl}'; 
        var heartbeats = [];

        async function saveScanResults(results) {
          window.setReactLoading(true); // Show loader
          var heartBeatsArray = heartbeats.map(x=> x.duration_ms);

          try {
            const response = await fetch(apiBaseUrl + '/ScanResult/AddScanResult', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clientId: USER_ID,
                heartRate10s: results.heartRate10s,
                heartRate4s: results.heartRate4s,
                realtimeHeartRate: results.realtimeHeartRate,
                hrvSdnn: results.hrvSdnn,
                cardiacStress: results.cardiacStress,
                systolicBloodPressure: results.systolicBp,
                diastolicBloodPressure: results.diastolicBp,
                healthRisks: results.healthRisks,
                breathingRate: results.breathingRate,
                hrvSdnnMs: results.hrvSdnnMs,
                systolicBloodPressureMmhg: results.systolicBloodPressureMmhg,
                diastolicBloodPressureMmhg: results.diastolicBloodPressureMmhg,
                heartRateIntervals: heartBeatsArray
              })
            });

            const responseData = await response.json();
            if (!responseData.IsSuccess) throw new Error('Failed to save scan results');
    
            const arrhythmiaResponse = await fetch(apiBaseUrl + '/Arrhythmia/AddArrhythmiaRequest', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clientId: USER_ID,
                inputs:[heartBeatsArray]
              })
            });

            window.location.href = hostUrl + '/home?ischecked=true';

          } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.style.color = 'red';
            errorDiv.style.padding = '10px';
            errorDiv.textContent = \`Error: \${error.message}\`;
            document.querySelector('.wrapper')?.appendChild(errorDiv);
          } finally {
            window.setReactLoading(false); // Hide loader
          }
        }
         
        const shenaiSDK = await CreateShenaiSDK(); 
        shenaiSDK.initialize(
            API_KEY,
            USER_ID,
            {
              hideShenaiLogo: true,
              measurementPreset: shenaiSDK.MeasurementPreset.CUSTOM,
              eventCallback: async (event) => { 
                if(event === "START_BUTTON_CLICKED"){
                  shenaiSDK.setCustomMeasurementConfig({
                    durationSeconds: 100, 
                    instantMetrics: [shenaiSDK.Metric.HEART_RATE, shenaiSDK.Metric.HRV_SDNN, shenaiSDK.Metric.BREATHING_RATE, shenaiSDK.Metric.SYSTOLIC_BP, shenaiSDK.Metric.DIASTOLIC_BP, shenaiSDK.Metric.CARDIAC_STRESS, shenaiSDK.Metric.PNS_ACTIVITY, shenaiSDK.Metric.CARDIAC_WORKLOAD, shenaiSDK.Metric.AGE, shenaiSDK.Metric.BMI],
                    summaryMetrics: [shenaiSDK.Metric.HEART_RATE, shenaiSDK.Metric.HRV_SDNN, shenaiSDK.Metric.BREATHING_RATE, shenaiSDK.Metric.SYSTOLIC_BP, shenaiSDK.Metric.DIASTOLIC_BP, shenaiSDK.Metric.CARDIAC_STRESS, shenaiSDK.Metric.PNS_ACTIVITY, shenaiSDK.Metric.CARDIAC_WORKLOAD, shenaiSDK.Metric.AGE, shenaiSDK.Metric.BMI],
                  });
                }
                if (event === "MEASUREMENT_FINISHED") {
                  heartbeats = await shenaiSDK.getRealtimeHeartbeats(120);
                  console.log(heartbeats);

                  const results = {
                    heartRate10s: shenaiSDK.getHeartRate10s(),
                    heartRate4s: shenaiSDK.getHeartRate4s(),
                    realtimeHeartRate: shenaiSDK.getRealtimeHeartRate(),
                    hrvSdnn: shenaiSDK.getRealtimeHrvSdnn(),
                    cardiacStress: shenaiSDK.getRealtimeCardiacStress(),
                    healthRisks: shenaiSDK.getHealthRisks(),
                    breathingRate: shenaiSDK.getMeasurementResults()?.breathing_rate_bpm,
                    hrvSdnnMs: shenaiSDK.getMeasurementResults()?.hrv_sdnn_ms,
                    systolicBloodPressureMmhg: shenaiSDK.getMeasurementResults()?.systolic_blood_pressure_mmhg,
                    diastolicBloodPressureMmhg: shenaiSDK.getMeasurementResults()?.diastolic_blood_pressure_mmhg
                  };
                  await saveScanResults(results);
                } 
              },
              onCameraError: (error) => {
                const errorDiv = document.createElement('div');
                errorDiv.style.color = 'red';
                errorDiv.style.padding = '10px';
                errorDiv.textContent = \`Camera Error: \${error || 'Unable to access camera'}\`;
                document.querySelector('.wrapper')?.appendChild(errorDiv);
              }
            },
            (result) => {
              if (result !== shenaiSDK.InitializationResult.OK) {
                alert("Shen.AI license activation error " + result.toString());
              }
            }
          );
   
          window.shenai = shenaiSDK; 
      `;
      document.body.appendChild(script);

      const style = document.createElement("style"); 
      style.innerHTML =`
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .wrapper {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        #mxcanvas {
          aspect-ratio: 480/894;
          max-width: 100%;
          max-height: 70vh;
        }
        #results {
          margin-top: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          width: 100%;
          max-width: 600px;
        }
        #results h2, #results h3 {
          color: #333;
          margin-bottom: 10px;
        }
        #results pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          background: #fff;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .loader-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-aspect-ratio: 480/894) {
          #mxcanvas {
            width: 100%;
            height: auto;
          }
        }
        @media (min-aspect-ratio: 480/894) {
          #mxcanvas {
            height: 70vh;
            width: auto;
          }
        }
      </style>`;
      document.body.appendChild(style);

      return () => {
        document.body.removeChild(script);
        document.body.removeChild(style);
        // Clean up the exposed function
        if (typeof window !== "undefined") {
          (window as any).setReactLoading = undefined;
        }
      };
    }, []);

    return (
      <div className="wrapper">
          {isLoading && (
            <div className="loader">
              <div className="loader-content">
                <div className="spinner"></div>
                <div>{t('assessment.savingResults')}</div>
              </div>
            </div>
          )}
          <canvas id="mxcanvas"></canvas>
      </div>
    );
};

export default ShenaiScanner;