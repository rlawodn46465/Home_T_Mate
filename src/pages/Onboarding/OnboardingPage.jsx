// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

import GenderSelector from "../../components/ui/Onboarding/GenderSelector";
import NicknameInput from "../../components/ui/Onboarding/NicknameInput";
import PersonalDataForm from "../../components/ui/Onboarding/PersonalDataForm";

import "./OnboardingPage.css";

const OnboardingPage = () => {
  // const navigate = useNavigate();

  // const [formData, setFromData] = useState({
  //   nickname: '',
  //   gender: null,
  //   birthYear: '',
  //   height: '',
  //   weight: '',
  // });

  // const [jwtToken, setJwtToken] = useState(null);
  // const [isNicknameValid, setIsNicknameValid] = useState(false);

  // useEffect(()=>{
  //   const urlParams = new URLSearchParams(window.location.search);
  // })

  return (
    <div className="onboarding-container">
      <NicknameInput />
      <GenderSelector />
      <PersonalDataForm />
    </div>
  );
};

export default OnboardingPage;
