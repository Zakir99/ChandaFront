import ReusableForm from "../../components/forms/ReusableForm";
import axios from "axios";
import Config from "../../Js/Config";
const DeathSupportCreate = () => {
  const url = Config.apiUrl;
  const config = Config.getConfig();
  const onSuccessRedirect = "/Admin/support";
  const fields = [
    {
      name: "family_id",
      label: "Select Family",
      type: "searchable",
      required: true,
      placeholder: "Search for a family...",
      searchable: {
        api: async (searchTerm) => {
          const response = await axios.get(
            `${url}families/search?search=${searchTerm}`,
            config,
          );
          return response.data;
        },
        minChars: 3,
        debounceTime: 500,
        displayField: "name",
        valueField: "family_id",
        transformResponse: (response) => response.data,
        getItemDisplay: (item) => `${item.name} (${item.login_phone})`,
        getItemValue: (item) => item.uuid,
      },
    },
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
      name: "amount_per_family",
      label: "Amount",
      type: "number",
      showIf: (data) => data.death_type === "local",
    },
    {
      name: "pay_from_account",
      label: "Pay from account balance",
      type: "select",
      options: [
        { label: "Yes", value: "on" },
        { label: "No", value: "off" },
      ],
      showIf: (data) => data.death_type === "external",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      required: false,
    },
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
    <ReusableForm
      title="Create Death Support Record"
      apiEndpoint="supports"
      layout="horizontal"
      size="lg"
      inputs={fields}
      validationRules={validateRule}
      onSuccessRedirect={onSuccessRedirect}
    />
  );
};

export default DeathSupportCreate;
