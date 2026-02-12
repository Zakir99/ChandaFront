import { useEffect, useState } from "react";
import FamilyForm from "../../components/FamilyForm";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";

const EditFamilyForm = () => {
  const [family, setFamily] = useState(null); // ← Change this from {} to null
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchFamily = async () => {
      const response = await axios.get(`${Config.apiUrl}families/${id}`);
      setFamily(response.data.family);
    };
    fetchFamily();
  }, [id]);

  const handleBack = () => {
    navigate("/family");
  };

  const handleSave = async (familyData) => {
    try {
      const response = await axios.put(
        `${Config.apiUrl}families/${id}`,
        familyData,
      );
      if (response.status === 200) {
        navigate("/family");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Optional: Show loading state while fetching
  if (!family) {
    return <div>Loading...</div>;
  }

  return <FamilyForm onBack={handleBack} onSave={handleSave} family={family} />;
};
export default EditFamilyForm;
