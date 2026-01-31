import FamilyForm from "../../components/FamilyForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
const createFamilyForm = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/family");
  };

  const handleSave = (family) => {
    try {
      const response = axios.post(`${Config.apiUrl}families`, family);
      if (response.status === 201) {
        navigate("/family");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <FamilyForm onBack={handleBack} onSave={handleSave} />;
};

export default createFamilyForm;