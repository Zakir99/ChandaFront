import "./App.css";
import { Routes, Route } from "react-router-dom";
import ChandaAdminLayour from "./protectedLayout/ChandaAdminLayout";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "leaflet/dist/leaflet.css";

import SuperAdminLayout from "./protectedLayout/SuperAdminLayout";

import UsersTable from "./pages/superAdmin/users/Index";
import UserForm from "./pages/superAdmin/users/Create";
import UserEditForm from "./pages/superAdmin/users/Edit";

import CommunityTable from "./pages/superAdmin/communities/Index";
import CreateCommunity from "./pages/superAdmin/communities/Create";
import EditCommunity from "./pages/superAdmin/communities/Edit";
import CommunityView from "./pages/superAdmin/communities/View";

import Login from "./pages/Authentication/Login";

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

import CreateRegisterForm from "./pages/register/create";
import MonthlyRegisters from "./pages/register/index";
import MonthlyRegistersView from "./pages/register/view";
import PaymentTracker from "./pages/register/main";

import DeathSupportIndex from "./pages/support/index";
import DeathSupportCreate from "./pages/support/create";
import DeathSupportView from "./pages/support/view";
import DeathSupportEdit from "./pages/support/edit";

import WhatsAppMessenger from "./pages/Messages/Main";

import MessageNotificationPage from "./pages/Admin/Message/Index";

import Dashboard from "./pages/Dashboard/Dashboard";
import SuperAdminDashboard from "./pages/superAdmin/Dashboard/Main";
import Test from "./components/Test";
import FamilyProtectedLayout from "./protectedLayout/FamilyLayout";

import LoginPage from "./pages/Authentication/FamilyLogin";

import FamilyDashboard from "./pages/Family/Dashboard/Dashboard";

import MeetingTable from "./pages/Family/meeting/Index";

import EventTable from "./pages/Family/event/Index";

import Notification from "./pages/Family/notification/Index";


import CreateUserAdmin from './pages/Admin/users/Create';
import IndexUserAdmin from './pages/Admin/users/Index';
import EditUserAdmin from './pages/Admin/users/Edit';

const App = () => {
  const dark = useSelector((state) => state.auth.theme);

  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [dark]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ fontSize: "14px" }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/familylogin" element={<LoginPage />} />
        <Route element={<SuperAdminLayout />}>
          <Route path="SuperAdmin">
            <Route path="dashboard" element={<SuperAdminDashboard />} />

            <Route path="users">
              <Route index element={<UsersTable />} />
              <Route path="create" element={<UserForm />} />
              <Route path=":id/edit" element={<UserEditForm />} />
            </Route>

            <Route path="communities">
              <Route index element={<CommunityTable />} />
              <Route path="create" element={<CreateCommunity />} />
              <Route path=":id/edit" element={<EditCommunity />} />
              <Route path=":id" element={<CommunityView />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ChandaAdminLayour />}>
          <Route path="Admin">
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="Dash" element={<Dashboard />} />
            <Route path="unpaid" element={<UnpaidListView />} />

            <Route path="user">
              <Route index element={<IndexUserAdmin />} />
              <Route path="create" element={<CreateUserAdmin />} />
              <Route path=":id/edit" element={<EditUserAdmin />} />
              {/* <Route path=":id" element={<UserView />} /> */}
            </Route>

            <Route path="family">
              <Route index element={<FamilyTable />} />
              <Route path="create" element={<CreateFamily />} />
              <Route path=":id/edit" element={<EditFamilyForm />} />
              <Route path=":id" element={<FamilyView />} />
            </Route>

            {/* <Route path="member">
              <Route index element={<Members />} />
              <Route path="create" element={<CreateMember />} />
              <Route path=":id/edit" element={<EditMember />} />
              <Route path=":id" element={<ViewMember />} />
            </Route> */}

            <Route path="register">
              <Route index element={<MonthlyRegisters />} />
              <Route path="create" element={<CreateRegisterForm />} />
              <Route path=":id" element={<MonthlyRegistersView />} />
              <Route path="yearly/:year" element={<PaymentTracker />} />
            </Route>

            <Route path="support">
              <Route index element={<DeathSupportIndex />} />
              <Route path="create" element={<DeathSupportCreate />} />
              <Route path=":id/edit" element={<DeathSupportEdit />} />
              <Route path=":id" element={<DeathSupportView />} />
            </Route>

            <Route path="sendMessage" element={<MessageNotificationPage />} />

            <Route path="message" element={<WhatsAppMessenger />} />
          </Route>
        </Route>

        <Route element={<FamilyProtectedLayout />}>
          <Route path="Family">
            <Route path="dashboard" element={<FamilyDashboard />} />

            <Route path="meeting" element={<MeetingTable />} />

            <Route path="event" element={<EventTable />} />

            <Route path="message" element={<Notification />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
};

export default App;
