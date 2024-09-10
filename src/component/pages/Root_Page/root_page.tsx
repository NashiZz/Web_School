import { Outlet } from "react-router-dom";
import Header from "../../header_footer/Header";
import Footer from "../../header_footer/Footer";


function Root_page() {
    return (
      <>
          <Header />
          <Outlet />
          <Footer />
      </>
    );
  }
  
  export default Root_page;