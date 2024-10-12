import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Logo2 from "../../assets/logo2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { departmentModel } from "../../model/department";
import { CircularProgress } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";

type DropdownMenu = "about" | "humen" | "activity" | "";

function Header() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<DropdownMenu>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const departmentRef = collection(db, "department");
  const department = useRef<departmentModel[]>([]);
  const ActivitiesoOrWorks = ["กิจกรรม", "ผลงาน", "ข่าวสาร"];
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // เก็บข้อมูลผู้ใช้
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async (uid: string) => {
    const querySnapshot = await getDocs(
      query(collection(db, "admin"), where("uid", "==", uid))
    );

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("isAdmin", "true");
        checkAdminStatus(user.uid);
      } else {
        localStorage.setItem("isAdmin", "false");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDropdownMouseEnter = (menu: DropdownMenu) => {
    setDropdownOpen(menu);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen("");
  };

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // ตั้งค่าผู้ใช้ถ้ามีการเข้าสู่ระบบ
      } else {
        setUser(null); // ตั้งค่าเป็น null ถ้าไม่มีการเข้าสู่ระบบ
      }
    });

    return () => unsubscribe(); // ยกเลิก listener เมื่อคอมโพเนนต์ถูกทำลาย
  }, []);

  // ลงชื่อออก
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.setItem("isAdmin", "false");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const loadData = onSnapshot(departmentRef, async (snapshot) => {
      try {
        if (!snapshot.empty) {
          const departmentData = await getDocs(
            query(departmentRef, orderBy("did", "asc"))
          );
          const newData = departmentData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as departmentModel[];
          department.current = newData;
        }
      } catch (error) {
        console.log(error);
      } finally {
        console.log("getDepartment");
        setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 50.0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <header
          className={`bg-header shadow-md sticky top-0 z-50 transition-all duration-300 ${
            isScrolled ? "py-1" : "py-2"
          }`}
        >
          <div className="container mx-auto px-4 flex flex-wrap items-center justify-between relative">
            <div className="flex items-center w-full md:w-auto">
              <img
                src={Logo}
                alt="Logo"
                className={`mr-3 transition-all duration-300 my-3 ${
                  isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
                } object-contain`}
                style={{ maxWidth: "100px" }}
              />

              <div className="block">
                <h1 className="text-gray-700 text-xl md:text-2xl font-bold transition-opacity duration-300">
                  โรงเรียนคลองขามวิทยาคาร
                </h1>
                {!isScrolled && (
                  <>
                    <h5 className="text-gray-500 text-xs md:text-lg mb-1">
                      Klongkhamwittayakan School
                    </h5>
                    <h5 className="text-gray-500 text-xs md:text-sm mb-1">
                      สังกัดองค์การบริหารส่วนจังหวัดกาฬสินธุ์
                    </h5>
                  </>
                )}
              </div>

              <img
                src={Logo2}
                alt="Logo2"
                className={`ml-3 transition-all duration-300 my-3 ${
                  isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
                } object-contain`}
                style={{ maxWidth: "100px" }}
              />
            </div>

            <button
              className="md:hidden text-gray-700 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="h-6 w-6"
              />
            </button>

            <nav
              className={`md:flex ${
                isScrolled ? "md:space-x-4" : "md:space-x-6"
              } ${
                isMobileMenuOpen ? "block" : "hidden"
              } w-full md:w-auto transition-all duration-300`}
            >
              <Link
                to="/"
                className="block text-gray-700 hover:text-white py-2"
              >
                หน้าแรก
              </Link>
              {/* <div
                className="relative"
                onMouseEnter={() => handleDropdownMouseEnter("about")}
              >
                <button className="block text-gray-700 hover:text-white py-2 items-center">
                  เกี่ยวกับโรงเรียน
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button> */}
              {/* {dropdownOpen === "about" && (
                  <div
                    className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 z-20"
                    onMouseLeave={handleDropdownMouseLeave}
                  > */}
              <Link
                to="/school_history"
                className="block text-gray-700 hover:text-white py-2"
              >
                ประวัติโรงเรียน
              </Link>
              {/* </div> */}
              {/* )} */}
              {/* </div> */}
              {localStorage.getItem("isAdmin") == "true" ? (
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownMouseEnter("humen")}
                >
                  <button
                    className="block text-gray-700 hover:text-white py-2 items-center"
                    onClick={() => navigate("/show_all_personal")}
                  >
                    จัดการบุคลากรโรงเรียนทั้งหมด
                  </button>
                </div>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownMouseEnter("humen")}
                >
                  <button className="block text-gray-700 hover:text-white py-2 items-center">
                    บุคลากรโรงเรียน
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </button>
                  {dropdownOpen === "humen" && (
                    <div
                      className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-96 z-20"
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      {department.current.map((dept, index) => (
                        <Link
                          key={index}
                          to={`/personnel/${dept.name}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {dept.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className="relative"
                onMouseEnter={() => handleDropdownMouseEnter("activity")}
              >
                <button className="block text-gray-700 hover:text-white py-2 items-center">
                  กิจกรรม/ผลงาน
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {dropdownOpen === "activity" && (
                  <div
                    className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-96 z-20"
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    {ActivitiesoOrWorks.map((dept, index) => (
                      <Link
                        key={index}
                        to={`/show_activity/${dept}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {dept}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-white py-2"
              >
                ติดต่อ
              </Link>
            </nav>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              {showSearch && (
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="ml-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 w-full md:w-64"
                />
              )}
              <button
                className="text-gray-700 hover:text-white"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
              </button>

              {user ? (
                <button
                  className="block text-gray-700 hover:text-white py-2"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-white py-2"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
