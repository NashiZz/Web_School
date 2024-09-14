import { useState, useEffect } from "react";
import banner from "../../../assets/banner2.jpg";
import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner3.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faSchool, faChalkboardTeacher, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const banners = [banner, banner1, banner2];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      <div className="relative overflow-hidden bg-gray-900">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`Banner ${index}`}
              className="w-full h-[400px] object-cover flex-shrink-0 md:h-[600px] lg:h-[650px]"
            />
          ))}
        </div>

        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-teal-700 text-white rounded-md p-3 shadow-md hover:bg-teal-600 transition-colors duration-300 z-10 opacity-75 hover:opacity-100"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-teal-700 text-white rounded-md p-3 shadow-md hover:bg-teal-600 transition-colors duration-300 z-10 opacity-75 hover:opacity-100"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-6 w-6" />
        </button>
      </div>

      <div className="container mx-auto py-8">
        <div className="relative container mx-auto py-8 ">
          <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
            ข่าวสาร
            <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
          </h2>
          <div className="border-b-4 border-lime-200 w-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner1}
              alt="News Image 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">การปรับแก้ไขคะแนนความประพฤติ</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 1 สิงหาคม 2566...</p>
              <Link to="/news/1" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 4"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 5"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 6"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
        </div>
        <div className="relative container mx-auto py-8 ">
          <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            ข่าวสารทั้งหมด
          </button>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-600 transform translate-y-full"></span>
        </div>
      </div>

      <div className="container mx-auto  ">
        <div className="relative container mx-auto py-8 ">
          <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
            ข่าวเด่น
            <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
          </h2>
          <div className="border-b-4 border-lime-200 w-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner1}
              alt="News Image 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">การปรับแก้ไขคะแนนความประพฤติ</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 1 สิงหาคม 2566...</p>
              <Link to="/news/1" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 4"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 5"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 6"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
        </div>
        <div className="relative container mx-auto py-8 ">
          <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            ข่าวสารทั้งหมด
          </button>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-600 transform translate-y-full"></span>
        </div>
      </div>

      <div className="container mx-auto  ">
        <div className="relative container mx-auto py-8">
          <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
            กิจกรรม
            <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
          </h2>
          <div className="border-b-4 border-lime-200 w-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner1}
              alt="News Image 1"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">การปรับแก้ไขคะแนนความประพฤติ</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 1 สิงหาคม 2566...</p>
              <Link to="/news/1" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={banner2}
              alt="News Image 2"
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">ผู้บริหาร ข้าราชการและเจ้าหน้าที่</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 2 สิงหาคม 2566...</p>
              <Link to="/news/2" className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
        </div>
        <div className="relative container mx-auto py-8 ">
          <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            ข่าวสารทั้งหมด
          </button>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-600 transform translate-y-full"></span>
        </div>
      </div>

      <div className="relative bg-teal-700 text-white py-8 flex flex-col items-center">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faUserGraduate} className="text-4xl md:text-6xl mb-4 text-white" />
            <h2 className="text-3xl md:text-5xl font-bold">3,297</h2>
            <p className="text-base md:text-lg mt-2">จำนวนนักเรียน</p>
          </div>
          <div className="text-center">
            <FontAwesomeIcon icon={faSchool} className="text-4xl md:text-6xl mb-4 text-white" />
            <h2 className="text-3xl md:text-5xl font-bold">16</h2>
            <p className="text-base md:text-lg mt-2">จำนวนห้องเรียน</p>
          </div>
          <div className="text-center">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-4xl md:text-6xl mb-4 text-white" />
            <h2 className="text-3xl md:text-5xl font-bold">99</h2>
            <p className="text-base md:text-lg mt-2">จำนวนผู้บริหารและข้าราชการครู</p>
          </div>
        </div>
      </div>
    </>
  );
}


export default Home;
