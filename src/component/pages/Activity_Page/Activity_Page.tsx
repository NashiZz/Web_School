import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { db } from "../../../firebase";
import {
  collection,
  query,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { activityModel } from "../../../model/activitys";
import { CircularProgress } from "@mui/material";

const itemsPerPage = 6; // จำนวนรายการต่อหน้า

const ActivityPage = () => {
  const { activity } = useParams<{ activity: string }>();
  const [data, setData] = useState<activityModel[]>([]); // ใช้ state เดียวสำหรับจัดการทั้ง activitys และ works
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null); // เก็บ reference ของ document ล่าสุดที่ถูกดึง
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด

  const fetchData = async (collectionName: string, page: number) => {
    try {
      setLoading(true);
      const colRef = collection(db, collectionName);

      let q;
      if (lastVisible && page > 1) {
        // ใช้ startAfter สำหรับ pagination
        q = query(colRef, startAfter(lastVisible), limit(itemsPerPage));
      } else {
        q = query(colRef, limit(itemsPerPage));
      }

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as activityModel[];

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // เก็บ document ล่าสุด
      setData(list);

      // คำนวณจำนวนหน้าทั้งหมด
      const totalDocs = snapshot.size;
      setTotalPages(Math.ceil(totalDocs / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activity === "กิจกรรม") {
      fetchData("activitys", currentPage);
    } else if (activity === "ผลงาน") {
      fetchData("works", currentPage);
    } else if (activity === "ข่าวสาร") {
      fetchData("news", currentPage);
    }
  }, [activity, currentPage]); // โหลดข้อมูลใหม่เมื่อ activity หรือ page เปลี่ยน

  const StyledPagination = styled(Pagination)({
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "#d9f99d", // lime-200
      color: "#000",
    },
  });

  if (loading) {
    return <>
    <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
    </>
  }
  console.log(data);
  

  return (
    <>
      {data.length === 0 ? (
        <p>ไม่มีข้อมูลที่จะแสดง</p> // แสดงข้อความเมื่อไม่มีข้อมูล
      ) : (
        <div>
          <div className="relative container mx-auto py-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
            <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
              {activity}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
              {data.map((item) => (
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
                     state={{ item }} 
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
      )}
    </>
  );  
};

export default ActivityPage;
