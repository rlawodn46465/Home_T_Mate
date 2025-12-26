import GenderSelector from "../../components/ui/Onboarding/GenderSelector";
import NicknameInput from "../../components/ui/Onboarding/NicknameInput";
import PersonalDataForm from "../../components/ui/Onboarding/PersonalDataForm";

import styles from "./OnboardingPage.module.css";

const OnboardingPage = () => {
  return (
    <div className={styles.onboardingContainer}>
      <NicknameInput />
      <GenderSelector />
      <PersonalDataForm />
    </div>
  );
};

export default OnboardingPage;
