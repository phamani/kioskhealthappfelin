declare global {
  interface Window {
    shenai?: any;
    onFastScanComplete?: (results: any) => void;
    onFastScanError?: (error: string) => void;
    setReactLoading?: (loading: boolean) => void;
    fastScanSdkInitialized?: boolean;
    resetFastScanSdk?: () => void;
  }
}

export {}; 