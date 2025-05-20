import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [formData, setFormDataState] = useState(() => {
    const stored = localStorage.getItem("onboardingFormData");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("onboardingFormData", JSON.stringify(formData));
  }, [formData]);

  const setFormData = (updater) => {
    setFormDataState((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  };

  return (
    <OnboardingContext.Provider value={{ formData, setFormData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
