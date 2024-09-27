import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage from "./component/pages/Home/home_page";
import Root_page from "./component/pages/Root_Page/root_page";
import SchoolHistory from "./component/pages/School_History/School_History";
import PersonnelPage from "./component/pages/Personnel_Page/Personnel_Page";
import ActivityPage from "./component/pages/Activity_Page/Activity_Page";
import DetailAct_Page from "./component/pages/Activity_Page/Detail_Act_Page";
import AddData_Page from "./component/pages/Add_Data/addData_page";
import AddPersonalPage from "./component/pages/Add_Data/add_personal";

const routers = createBrowserRouter([
  {
    path: "",
    element: <Root_page />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "/school_history",
        element: <SchoolHistory />
      },
      { path: "/personnel/:departmentName", element: <PersonnelPage /> },
      { path: "/show_activity/:activity", element: <ActivityPage /> },
      { path: "/activity/:id", element: <DetailAct_Page /> },
      { path: "/add_data", element: <AddData_Page /> },
      { path: "/addpersonal", element: <AddPersonalPage /> },
    ],
  }
]);

function App() {
  return <RouterProvider router={routers} />;
}


export default App;
