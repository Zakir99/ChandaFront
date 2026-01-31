import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import AppWithMobileLayout from "./components/Layout";

import { Toaster } from "react-hot-toast";

import DashboardView from "./pages/Dashboard/Main";
import UnpaidListView from "./pages/Dashboard/unpaidFamilies";

import FamilyTable from "./pages/families/Index";
import FamilyView from "./pages/families/view";
import CreateFamily from "./pages/families/create";
import EditFamilyForm from "./pages/families/edit";

import Members from "./pages/members/index";
import ViewMember from "./pages/members/view";
import CreateMember from "./pages/members/create";
import EditMember from "./pages/members/edit";

import MonthlyRegisters from './pages/register/index'
import MonthlyRegistersView from "./pages/register/view";


import DeathSupportIndex from "./pages/support/index";
import DeathSupportCreate from "./pages/support/create"; 
import DeathSupportView from "./pages/support/view";
import DeathSupportEdit from "./pages/support/edit";

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        <Route element={<AppWithMobileLayout />}>

          <Route path="dashboard" element={<DashboardView />} />
          <Route path="unpaid" element={<UnpaidListView />} />

          <Route path="family" element={<FamilyTable />} />
          <Route path="family/:id" element={<FamilyView />} />
          <Route path="family/create" element={<CreateFamily />} />
          <Route path="family/:id/edit" element={<EditFamilyForm />} />

          <Route path="member" element={<Members />} />
          <Route path="member/:id" element={<ViewMember />} />
          <Route path="member/create" element={<CreateMember />} />
          <Route path="member/:id/edit" element={<EditMember />} />

          <Route path="register" element={<MonthlyRegisters />} />
          <Route path="register/:id" element={<MonthlyRegistersView />} />
          
          <Route path="support" element={<DeathSupportIndex />} />
          <Route path="support/create" element={<DeathSupportCreate />} />
          <Route path="support/:id" element={<DeathSupportView />} />
          <Route path="support/:id/edit" element={<DeathSupportEdit />} />


          <Route path="*" element={<div>404</div>} />


        </Route>

      </Routes>
    </>
  );
};

export default App;
