import FamilyForm from "../../components/FamilyForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
const createFamilyForm = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/family");
  };

  const handleSave = async (family) => {
    try {
      const response = await axios.post(`${Config.apiUrl}families`, family);

      toast.success("Family created successfully");

      navigate("/family", {
        state: {
          family: response.data,
        },
      });
    } catch (error) {
      toast.error("Failed to create family");
      console.error(error);
    }
  };

  return <FamilyForm onBack={handleBack} onSave={handleSave} />;
};

export default createFamilyForm;
