/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Country } from "@/payload-types";

type Props = {
    language: "en" | "ar";
    value?: string | number;  // Accept the ID value from parent
    onSelect: (id: string | number | null) => void; // Return just the ID
};

interface DropDownOption {
    value: string | number;
    label: string;
    data: Country;
}

const CountrySelector = ({ language, value, onSelect }: Props) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const isArabic = language === "ar";

    const options: DropDownOption[] = countries.map((country) => ({
        value: country.Id,
        label: isArabic ? country.ArabicName : country.EnglishName,
        data: country, 
    }));

    // Find the currently selected option based on the value prop
    const selectedOption = options.find(option => option.value === value);

    const customStyles = {
        control: (base: any) => ({
            ...base,
            direction: isArabic ? "rtl" : "ltr",
        }),
        menu: (base: any) => ({
            ...base,
            direction: isArabic ? "rtl" : "ltr",
        }),
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${apiUrl}/Common/GetCountries`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                const responseJson = await response.json();
                if (!responseJson.IsSuccess) throw new Error("Failed to fetch data");
                 
                setCountries(responseJson.Result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return (
        <div className="">
            <Select
                options={options}
                isRtl={isArabic}
                styles={customStyles}
                onChange={(option: SingleValue<DropDownOption>) => {
                    onSelect(option?.value ?? null); // Send just the ID back to parent
                }}
                value={selectedOption} // Controlled by the value prop
                placeholder={isArabic ? "اختر دولة..." : "Select a country..."}
                isSearchable
                isLoading={isLoading}
                formatOptionLabel={(option: DropDownOption) => (
                    <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                        <i className={`${option.data.Flag} w-5 h-5`} />
                        <span>{option.label}</span>
                    </div>
                )}
            />
        </div>
    );
};

export default CountrySelector;