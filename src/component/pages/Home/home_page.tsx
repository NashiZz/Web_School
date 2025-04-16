import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, storage, auth } from "../../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../../services/upload_img";
import Modal from "../../../services/modal";
import { deleteObject, ref } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { activityModel } from "../../../model/activitys";
import { CircularProgress } from "@mui/material";
import GridContainer from "./components/GridContainer";

const Home = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sortedBanners, setSortedBanners] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dataActivitys, setDataActivitys] = useState<activityModel[]>([]);
  const [dataNews, setDataNews] = useState<activityModel[]>([]);
  const [dataContributions, setDataContributions] = useState<activityModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (isAdmin) {
      fetchBanners();
    }
  }, [isAdmin]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const fetchBanners = async () => {
    const bannerSnapshot = await getDocs(collection(db, "banners_school"));
    const bannerUrls = bannerSnapshot.docs.map((doc) => doc.data().imageUrl);
    setBanners(bannerUrls);
    setSortedBanners(bannerUrls);
  };
  const fetchDataActivity = async () => {
    const activitySnapshot = await getDocs(
      query(
        collection(db, "activitys"),
        orderBy("date_activity", "desc"),
        limit(4)
      )
    );
    const activity = activitySnapshot.docs.map((doc) =>
      doc.data()
    ) as activityModel[];
    setDataActivitys(activity);

    const newSnapshot = await getDocs(
      query(collection(db, "news"), orderBy("date_activity", "desc"), limit(4))
    );
    const newdata = newSnapshot.docs.map((doc) =>
      doc.data()
    ) as activityModel[];
    setDataNews(newdata);

    const workSnapshot = await getDocs(
      query(collection(db, "works"), orderBy("date_activity", "desc"), limit(6))
    );
    const work = workSnapshot.docs.map((doc) => doc.data()) as activityModel[];
    setDataContributions(work);

    // setBanners(bannerUrls);
    // setSortedBanners(bannerUrls);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchBanners();
        await fetchDataActivity();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const deleteBanner = async (bannerUrl: string) => {
    try {
      const storagePath = `${bannerUrl}`;
      const storageRef = ref(storage, storagePath);

      const bannerDocRef = await getDocs(collection(db, "banners_school"));
      const bannerToDelete = bannerDocRef.docs.find(
        (doc) => doc.data().imageUrl === bannerUrl
      );
      if (bannerToDelete) {
        await deleteDoc(doc(db, "banners_school", bannerToDelete.id));
      }

      await deleteObject(storageRef);

      await fetchBanners();
      alert("ลบรูปภาพสำเร็จ!");
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleUploadSuccess = async () => {
    await fetchBanners();
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex justify-center mt-5 px-10 md:px-0">
          <div className="w-full md:w-4/5">
            <div className="w-full flex justify-center">
              <div className="w-full relative rounded-lg overflow-hidden bg-gray-900">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {sortedBanners.map((banner, index) => (
                    <img
                      key={index}
                      src={banner}
                      alt={`Banner ${index}`}
                      className="w-full h-36 md:h-[400px] object-cover flex-shrink-0"
                    />
                  ))}
                </div>

                <button
                  onClick={goToPrevious}
                  className="hidden md:flex absolute top-1/2 left-4 transform -translate-y-1/2 bg-teal-700 text-white rounded-md p-3 shadow-md hover:bg-teal-600 transition-colors duration-300 z-10 opacity-75 hover:opacity-100"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="hidden md:flex absolute top-1/2 right-4 transform -translate-y-1/2 bg-teal-700 text-white rounded-md p-3 shadow-md hover:bg-teal-600 transition-colors duration-300 z-10 opacity-75 hover:opacity-100"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="h-6 w-6" />
                </button>
              </div>
            </div>

            {isAdmin && (
              <>
                <div className="mt-5 text-center">
                  <h2 className="text-lg font-semibold mb-2">
                    เพิ่มรูปภาพ Banner ใหม่
                  </h2>
                  <UploadImage onSuccess={handleUploadSuccess} />
                  <button
                    onClick={() => setModalIsOpen(true)}
                    className="mt-4 bg-teal-700 text-white rounded-md p-2 shadow-md hover:bg-teal-600 transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    ดูรูปภาพที่มีอยู่
                  </button>

                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      รูปภาพที่มีอยู่
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedBanners.map((banner, index) => (
                        <div key={index} className="relative">
                          <img
                            src={banner}
                            alt={`Banner ${index}`}
                            className="w-full h-[200px] object-cover"
                          />
                          <button
                            onClick={() => deleteBanner(banner)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-500 transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="h-4 w-4"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setModalIsOpen(false)}
                      className="mt-4 bg-red-500 text-white rounded-md p-2 shadow-md hover:bg-red-400 transition-colors duration-300"
                    >
                      ปิด
                    </button>
                  </Modal>
                </div>
              </>
            )}

            {/* <div className="relative py-8 ">
              <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
                ข่าวเด่น
                <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
              </h2>
              <div className="absolute inset-x-0 bottom-7 border-b-4 border-lime-200 mt-2"></div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={banner1}
                  alt="News Image 1"
                  className="w-full h-85 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    การปรับแก้ไขคะแนนความประพฤติ
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    วันที่ 1 สิงหาคม 2566...
                  </p>
                  <Link to="/news/1" className="text-red-600 hover:underline">
                    อ่านเพิ่มเติม
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={banner2}
                  alt="News Image 2"
                  className="w-full h-85 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    ผู้บริหาร ข้าราชการและเจ้าหน้าที่
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    วันที่ 2 สิงหาคม 2566...
                  </p>
                  <Link to="/news/2" className="text-red-600 hover:underline">
                    อ่านเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative container mx-auto py-8 ">
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-600 transform translate-y-full"></span>
            </div> */}
            <GridContainer
              to="/show_activity/ข่าวสาร"
              title="ข่าวสาร"
              activity={dataNews}
            />
            {/* <div>
            
              <div className="relative py-8">
                <Link to={`/show_activity/ข่าวสาร`}>
                  <div className="relative inline-block py-2 rounded-tl-lg text-3xl font-bold text-gray-600 hover:text-lime-500">
                    <h2 className="flex items-center gap-2 hover:gap-4 duration-300">
                      ข่าวสาร{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </h2>

                    <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
                  </div>
                </Link>

                <div className="absolute inset-x-0 bottom-7 border-b-4 border-lime-200 mt-2"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dataNews.map((item) => (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={item.img}
                      alt="News Image 1"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <Link
                        to={`/activity/${item.id}`}
                        state={{ item }}
                        className="hover:underline"
                      >
                        <h3 className="text-base font-semibold mb-2 line-clamp-3">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 mb-4">
                        {item.date_activity
                          ? `วันที่ ${item.date_activity
                              .toDate()
                              .toLocaleDateString("th-TH")}`
                          : "ไม่ระบุวันที่"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
<GridContainer
              to="/show_activity/กิจกรรม"
              title="กิจกรรม"
              activity={dataActivitys}
            />
            <GridContainer
              to="/show_activity/ผลงาน"
              title="ผลงาน"
              activity={dataContributions}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
