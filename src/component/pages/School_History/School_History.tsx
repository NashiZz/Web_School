import backgroundImage from "../../../assets/school_history.jpg";
import Logo from "../../../assets/logo.png";
import director from "../../../assets/ผอ.จิตรกร.jpg";
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { InformationSchoolModel } from "../../../model/information_school";
import { CircularProgress } from "@mui/material";

const SchoolHistory = () => {
  const inforRef = collection(db, "information_school");
  const infor = useRef<InformationSchoolModel>(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = onSnapshot(inforRef, (snapshot) => {
      try {
        if (!snapshot.empty) {
          const docData = {
            id: snapshot.docs[0].id, 
            ...snapshot.docs[0].data(),
          } as InformationSchoolModel;
          infor.current = docData;
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => loadData();
  }, [inforRef]);
  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div
            className="relative w-full h-[500px] bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex items-center justify-center h-full">
              <h1 className="text-white text-4xl md:text-6xl font-bold">
                ประวัติโรงเรียนคลองขามวิทยาคาร
              </h1>
            </div>
          </div>

          <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-md shadow-md h-full">
                    <h2 className="text-xl font-bold mb-4 text-center">ข้อมูลพื้นฐาน</h2>
                    <p className="text-justify mb-4">{infor.current?.general_info}</p>

                    <h2 className="text-lg font-bold mb-3">บริบทสำคัญ</h2>
                    <p className="text-justify mb-4">{infor.current?.important_context}</p>

                    <h2 className="text-md font-bold">1. วิสัยทัศน์โรงเรียน Vision</h2>
                    <p className="text-justify mb-4">{infor.current?.vision}</p>

                    <h2 className="text-md font-bold">2. พันธกิจ Mission</h2>
                    <p className="text-justify mb-4">2.1 {infor.current?.mission_1}</p>
                    <p className="text-justify mb-4">2.2 {infor.current?.mission_2}</p>
                    <p className="text-justify mb-4">2.3 {infor.current?.mission_3}</p>
                    <p className="text-justify mb-4">2.4 {infor.current?.mission_4}</p>
                    <p className="text-justify mb-4">2.5 {infor.current?.mission_5}</p>

                    <h2 className="text-md font-bold">3. จุดมุ่งหมายเพื่อพัฒนาการศึกษา</h2>
                    <p className="text-justify mb-4">3.1 {infor.current?.goal_1}</p>
                    <p className="text-justify mb-4">3.2 {infor.current?.goal_2}</p>
                    <p className="text-justify mb-4">3.3 {infor.current?.goal_3}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="flex items-center justify-center mb-6">
                      <img src={Logo} alt="ตราโรงเรียน" className="h-35" />
                    </div>
                    <h3 className="text-lg font-bold mb-4 text-center">ตราโรงเรียน</h3>
                    <ul className="text-gray-700">
                      <li className="mb-2 text-justify">
                        <strong>วันก่อตั้ง :</strong> 10 พฤษภาคม พ.ศ. 2536
                      </li>
                      <li className="mb-2 text-justify">
                        <strong>ที่ตั้ง:</strong> {infor.current?.address}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-md shadow-md">
                    <h3 className="text-lg font-bold mb-4 text-center">ผู้อำนวยการโรงเรียน</h3>
                    <div className="flex items-center justify-center mb-6">
                      <img src={director} alt="ผู้อำนวยการโรงเรียน" className="h-30" />
                    </div>
                    <ul className="text-gray-700">
                      <li className="mb-2 text-center">
                        <strong>นายจิตกร  โคตะวินนท์</strong>
                      </li>
                      <li className="mb-2 text-center">
                        <strong>ผู้อำนวยการโรงเรียนคลองขามวิทยาคาร</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SchoolHistory;
