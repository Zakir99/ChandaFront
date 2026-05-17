import ReusebleEdit from '../../components/forms/ReusableEdit';
import { useParams } from 'react-router-dom';
const DeathSupportEdit = () => {
  const { id } = useParams();
  const inputs = [
    {
      name: "deceased_name",
      label: "Deceased Name",
      type: "text",
      required: true,
    },
    {
      name: "relationship",
      label: "Relationship",
      type: "text",
      required: false,
    },
    {
      name: "death_type",
      label: "Death Type",
      type: "select",
      options: [
        { label: "Local", value: "local" },
        { label: "External", value: "external" },
      ],
      required: true,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      required: false,
    }

  ];

  const validateRule = {
    family_id: {
      required: true,
    },
    deceased_name: {
      required: true,
    },
    death_type: {
      required: true,
      options: ["local", "external"],
    },
    amount_per_family: {
      required: false,
    },
    pay_from_account: {
      required: false,
    },
    notes: {
      required: false,
    },
   };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <ReusebleEdit
        title="Edit Death Support Record"
        fetchEndpoint="supports/edit"
        updateEndpoint="supports"
        id={id}
        method="PUT"
        onUpdateSuccess={() => {
          toast.success("Death support record updated successfully!");
        }}
        layout="horizontal"
        size="md"
        inputs={inputs}
        validationRules={validateRule}

      />
    </div>
  );
};

export default DeathSupportEdit;
