import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import banner1 from "../../../assets/banner1.jpg";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { activityModel } from "../../../model/activitys";

const ActivityPage = () => {
  const { activity } = useParams<{ activity: string }>();
  const [activitys, setActivity] = useState<activityModel[]>([]);
  const [works, setWork] = useState<activityModel[]>([]); // สร้าง state สำหรับเก็บข้อมูลกิจกรรม // สร้าง state สำหรับเก็บข้อมูลกิจกรรม
  const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลด
  const [currentPage, setCurrentPage] = useState(1); // กำหนดเพจที่จะแสดง
  const itemsPerPage = 6; // จำนวนรายการต่อหน้า

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('1');
        
        const activityCollectionRef = collection(db, "activitys"); // อ้างอิงไปยัง collection ที่ชื่อว่า "activitys"
        const activitySnapshot = await getDocs(activityCollectionRef); // ดึงข้อมูลทั้งหมดจาก collection
        const activityList = activitySnapshot.docs.map((doc) => ({
          id: doc.id, // doc.id เป็น string อยู่แล้ว
          ...doc.data(), // ดึงข้อมูลในเอกสาร
        })) as activityModel[]; // กำหนดชนิดข้อมูลของกิจกรรมที่ดึงมา
        setActivity(activityList);
        const workCollectionRef = collection(db, "works"); // อ้างอิงไปยัง collection ที่ชื่อว่า "activitys"
        const workSnapshot = await getDocs(workCollectionRef); // ดึงข้อมูลทั้งหมดจาก collection
        const workList = workSnapshot.docs.map((doc) => ({
          id: doc.id, // doc.id เป็น string อยู่แล้ว
          ...doc.data(), // ดึงข้อมูลในเอกสาร
        })) as activityModel[]; // กำหนดชนิดข้อมูลของกิจกรรมที่ดึงมา
        setWork(workList); // อัปเดต state
      } catch (error) {
        console.error("Error fetching activity data: ", error); // แสดงข้อผิดพลาดใน console
      } finally {
        setLoading(false); // เมื่อดึงข้อมูลเสร็จ เปลี่ยนสถานะการโหลด
      }
    };

    fetchData(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  if (activity == "กิจกรรม") {
    const totalPages = Math.ceil(activitys.length / itemsPerPage); // จำนวนหน้าทั้งหมด
    const startIndex = (currentPage - 1) * itemsPerPage; // ดัชนีเริ่มต้นของรายการในแต่ละหน้า
    const endIndex = startIndex + itemsPerPage; // ดัชนีสิ้นสุด
    const currentItems = activitys.slice(startIndex, endIndex); // ตัดข้อมูลสำหรับแต่ละหน้า

    const StyledPagination = styled(Pagination)({
      "& .MuiPaginationItem-page.Mui-selected": {
        backgroundColor: "#d9f99d", // lime-200
        color: "#000",
      },
    });

    if (loading) {
      return <p>Loading...</p>; // แสดงสถานะการโหลดเมื่อข้อมูลยังไม่พร้อม
    }
    console.log(activitys);
    
    return (
      <div>
        <div className="relative container mx-auto py-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
            {activity}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg relative overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={`Activity Image ${item.id}`}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.date_activity
                      ? `วันที่ ${item.date_activity
                          .toDate()
                          .toLocaleDateString("th-TH")}`
                      : "ไม่ระบุวันที่"}
                  </p>
                  <Link
                    to={`/activity/${item.id}`}
                    className="text-red-600 hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <StyledPagination
          className="flex justify-center pb-9"
          count={totalPages} // จำนวนหน้าทั้งหมด
          page={currentPage} // หน้าในปัจจุบัน
          onChange={(_event, value) => setCurrentPage(value)} // เปลี่ยนหน้า
        />
      </div>
    );
  }else if (activity=='ผลงาน') {
    const totalPages = Math.ceil(works.length / itemsPerPage); // จำนวนหน้าทั้งหมด
    const startIndex = (currentPage - 1) * itemsPerPage; // ดัชนีเริ่มต้นของรายการในแต่ละหน้า
    const endIndex = startIndex + itemsPerPage; // ดัชนีสิ้นสุด
    const currentItems = works.slice(startIndex, endIndex); // ตัดข้อมูลสำหรับแต่ละหน้า

    const StyledPagination = styled(Pagination)({
      "& .MuiPaginationItem-page.Mui-selected": {
        backgroundColor: "#d9f99d", // lime-200
        color: "#000",
      },
    });

    if (loading) {
      return <p>Loading...</p>; // แสดงสถานะการโหลดเมื่อข้อมูลยังไม่พร้อม
    }

    return (
      <div>
        <div className="relative container mx-auto py-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
            {activity}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg relative overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={`Activity Image ${item.id}`}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.date_activity
                      ? `วันที่ ${item.date_activity
                          .toDate()
                          .toLocaleDateString("th-TH")}`
                      : "ไม่ระบุวันที่"}
                  </p>
                  <Link
                    to={`/activity/${item.id}`}
                    className="text-red-600 hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <StyledPagination
          className="flex justify-center pb-9"
          count={totalPages} // จำนวนหน้าทั้งหมด
          page={currentPage} // หน้าในปัจจุบัน
          onChange={(_event, value) => setCurrentPage(value)} // เปลี่ยนหน้า
        />
      </div>
    );
  }

  // การคำนวณ pagination
};

export default ActivityPage;
