import { RouterProvider, createBrowserRouter } from "react-router-dom"
import HomePage from "./component/pages/Home/home_page";
import Root_page from "./component/pages/Root_Page/root_page";
import SchoolHistory from "./component/pages/School_History/School_History";
import People from "./component/pages/People_Page/people_page";

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
      {
        path: "/people",
        element: <People />
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={routers} />;
}


export default App;
