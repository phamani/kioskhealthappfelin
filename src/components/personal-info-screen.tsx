/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserData } from "./home-screen";
import { AlertCircle } from "lucide-react";
import { UserResponse } from "@/types/user-response-type";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; 
import AgreementModal from "./agreementModal";
import Cookies from 'js-cookie';
import CountrySelector from "@/components/ui/country-selector";
import { useTranslation } from "@/hooks/useTranslation";


interface PersonalInfoScreenProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PersonalInfoScreen({
  userData,
  updateUserData,
  onNext,
  onPrev,
}: PersonalInfoScreenProps) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(
    userData.personalInfo?.fullName || ""
  );
  const [email, setEmail] = useState(userData.personalInfo?.email || "");
  const [phone, setPhone] = useState(userData.personalInfo?.phone || "");
  const [nationalityId, setNationalityId] = useState<string | number>(userData.personalInfo?.nationalityId || "");
  const [consent, setConsent] = useState(
    userData.personalInfo?.consent || false
  );
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    consent: "",
    agree: "",
    nationalityId: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  const validateEmail = (email: string) => {
    if (!email) return true; // Empty is valid since it's optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Empty is valid since it's optional
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleNext = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Reset errors
    setErrors({
      fullName: "",
      email: "",
      phone: "",
      consent: "",
      agree: "",
      nationalityId: ""
    });

    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      consent: "",
      agree: "",
      nationalityId: ""
    };

    if (!fullName) {
      newErrors.fullName = t('personalInfo.errors.fullNameRequired');
      isValid = false;
    }

    if (!email) {
      newErrors.email = t('personalInfo.errors.emailRequired');
      isValid = false;
    }

    if (!nationalityId) {
      newErrors.nationalityId = t('personalInfo.errors.nationalityRequired');
      isValid = false;
    }

    if (email && !validateEmail(email)) {
      newErrors.email = t('personalInfo.errors.invalidEmail');
      isValid = false;
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = t('personalInfo.errors.invalidPhone');
      isValid = false;
    }

    // Check consent if any information is provided
    if (!consent) {
      newErrors.consent = t('personalInfo.errors.consentRequired');
      isValid = false;
    }
    if (!agree) {
      newErrors.agree = t('personalInfo.errors.agreementRequired');
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    console.log({ fullName, email, phone, consent, nationalityId }, "personal information");

    // Save data and proceed
    updateUserData({
      personalInfo: {
        fullName,
        email,
        phone,
        consent,
        agree,
        nationalityId
      },
    });

    try {
      setIsLoading(true);
      // Make a POST request to the API
      const response = await fetch(`${apiUrl}/client/AddOrUpdateClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username: fullName.replaceAll(" ", "").toLocaleLowerCase(),
          email,
          phone,
          password: "123456",
          nationalityId: nationalityId
        }),
      });

      const responseJson = await response.json();
      if (!responseJson.IsSuccess) {
        await Swal.fire({
          icon: "error",
          title: t('common.error'),
          text: t('common.somethingWentWrong'),
          confirmButtonColor: "#dc2626",
        });
        return;
      }

      const data: UserResponse = responseJson;  
      Cookies.set('userId', data.Result.Id, { expires: 1 }); 
      onNext();  
    } catch (error) {
      console.error("Error saving personal information:", error);
      await Swal.fire({
          icon: "error",
          title: t('common.error'),
          text: t('common.somethingWentWrong'),
          confirmButtonColor: "#dc2626",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true); // Function to open modal
  const closeModal = () => setIsModalOpen(false); // Function to close modal

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          {t('personalInfo.title')}
        </h2>
        <p className="text-xl text-gray-600">
          {t('personalInfo.subtitle')}
        </p>
      </div>

      <div className="space-y-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xl">
            {t('personalInfo.fullName')}
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('personalInfo.fullName')}
            className="text-xl py-6"
          />
          {errors.fullName && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xl">
            {t('personalInfo.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('personalInfo.email')}
            className="text-xl py-6"
          />
          {errors.email && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xl">
            {t('personalInfo.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('personalInfo.phone')}
            className="text-xl py-6"
          />
          {errors.phone && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalityId" className="text-xl">
            {t('personalInfo.nationality')}
          </Label>
          <CountrySelector language={i18n.language as "en" | "ar"} onSelect={(id) => setNationalityId(id ?? "")} />
          {errors.nationalityId && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.nationalityId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className={`flex items-start gap-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="w-6 h-6 mt-1 flex-shrink-0"
            />
            <Label htmlFor="consent" className={`text-lg font-normal ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('personalInfo.consent')}
            </Label>
          </div>
          {errors.consent && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.consent}
            </p>
          )}
        </div>
         
        <div className="space-y-2">
          <div className={`flex items-start gap-3 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Checkbox
              id="agree"
              checked={agree}
              onCheckedChange={(checked) => setAgree(checked === true)}
              className="w-6 h-6 mt-1 flex-shrink-0"
            />
            <Label
              htmlFor="agree"
              className={`text-lg font-normal cursor-pointer ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
              onClick={openModal}
            >
              {t('personalInfo.agreement')}{" "}
              <span className="text-blue-600 no-underline">
                {t('personalInfo.viewAgreement')}
              </span>
            </Label>
          </div>
          {errors.agree && (
            <p className={`text-red-500 flex items-center gap-1 ${i18n.language === 'ar' ? 'justify-end flex-row-reverse' : ''}`}>
              <AlertCircle size={16} /> {errors.agree}
            </p>
          )}
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
          onClick={handleNext}
          className="text-xl py-6 px-10 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? t('common.loading') : t('buttons.next')}
        </Button>
      </div>

      <AgreementModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
