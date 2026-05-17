import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
import ReusableForm from "../../components/forms/ReusableForm";

const CreateRegisterForm = () => {
  const onSuccessRedirect = "/Admin/register";
  const months = [
    { id: 1, name: "January", value: "january" },
    { id: 2, name: "February", value: "february" },
    { id: 3, name: "March", value: "march" },
    { id: 4, name: "April", value: "april" },
    { id: 5, name: "May", value: "may" },
    { id: 6, name: "June", value: "june" },
    { id: 7, name: "July", value: "july" },
    { id: 8, name: "August", value: "august" },
    { id: 9, name: "September", value: "september" },
    { id: 10, name: "October", value: "october" },
    { id: 11, name: "November", value: "november" },
    { id: 12, name: "December", value: "december" },
  ];

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: (currentYear + i).toString(),
    value: currentYear + i,
  }));

  const inputs = [
    {
      name: "month",
      label: "Month",
      type: "select",
      options: months.map((month) => ({
        label: month.name,
        value: month.value,
      })),
      placeholder: "Enter month",
      required: true,
    },
    {
      name: "year",
      label: "Year",
      type: "select",
      options: years.map((year) => ({
        label: year.name,
        value: year.value,
      })),
      placeholder: "Enter year",
      required: true,
    },
    {
      name: "date",
      label: "Created Date",
      type: "date",
      placeholder: "Enter date",
      required: true,
    },
    {
      name: "amount_per_family",
      label: "Amount",
      type: "number",
      placeholder: "Enter amount per Family",
      required: true,
    },
  ];

  const validationRules = {
    month: {
      required: true,
    },

    year: {
      required: true,
    },

    date: {
      required: true,
    },
  };

  const handleBack = () => {
    navigate("/register");
  };

  const onSubmitSuccess = () => {
    toast.success("Register Created Successfully");
  };

  return (
    <div>
      <ReusableForm
        onCancel={handleBack}
        inputs={inputs}
        title={"Create Register"}
        apiEndpoint={"registers"}
        size="lg"
        layout="horizontal"
        validationRules={validationRules}
        onSuccessRedirect={onSuccessRedirect}
        onSubmitSuccess={onSubmitSuccess}
      />
    </div>
  );
};

export default CreateRegisterForm;
