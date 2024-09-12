import backgroundImage from "../../../assets/school_history.jpg";
import Logo from "../../../assets/logo.png";
import Por from "../../../assets/po.jpg";
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { InformationSchoolModel } from "../../../model/information_school";

const SchoolHistory = () => {
  const inforRef = collection(db, "information_school");
  const [data, setData] = useState<InformationSchoolModel[] | undefined>(
    undefined
  );

  useEffect(() => {
    // ฟังข้อมูลแบบเรียลไทม์จาก Firestore
    const loadData = onSnapshot(inforRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InformationSchoolModel[]; // แปลงข้อมูลให้ตรงกับประเภทที่กำหนด
      setData(newData); // อัปเดตข้อมูลใน state
    });
    console.log(data?.[0]);

    // ทำการ unsubscribe เมื่อ component ถูก unmount
    return () => loadData();
  }, [inforRef]);
  // กำหนดข้อมูลที่เลือกจาก index
  const currentData = data ? data[0] : undefined;
  return (
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
          <div className="flex flex-wrap -mx-4">
            {/* Left Column: School History */}
            <div className="w-full md:w-2/3 px-4 mb-8 md:mb-0">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-bold mb-4 text-center">
                  ข้อมูลพื้นฐาน
                </h2>
                <p className="text-justify">{currentData?.general_info}</p>
                <h2 className="text-lg font-bold mt-3">
                  บริบทสำคัญ
                </h2>
                <p className="text-justify">{currentData?.important_context}</p>
                <h2 className="text-md font-bold mb-4 ">
                  1. วิสัยทัศน์โรงเรียน Vision
                </h2>
                <p className="text-justify">{currentData?.vision}</p>
                <h2 className="text-md font-bold ">2. พันธกิจ Mission</h2>
                <p className="text-justify">
                  2.1 {currentData?.mission_1}</p>
                  <p className="text-justify">
                  2.2 {currentData?.mission_2}</p>
                  <p className="text-justify">
                  2.3 {currentData?.mission_3}</p>
                  <p className="text-justify">
                  2.4 {currentData?.mission_4}</p>
                  <p className="text-justify">
                  2.5 {currentData?.mission_5}</p>
                  <h2 className="text-md font-bold ">3. จุดมุ่งหมายเพื่อพัฒนาการศึกษา</h2>
                <p className="text-justify">
                  3.1 {currentData?.goal_1}</p>
                  <p className="text-justify">
                  3.2 {currentData?.goal_2}</p>
                  <p className="text-justify">
                  3.3 {currentData?.goal_3}</p>
               
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4">
              <div className="bg-white p-6 mb-5 rounded-md shadow-md">
                <div className="flex items-center justify-center mb-6">
                  <img src={Logo} alt="ตราโรงเรียน" className="h-35" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-center">
                  ตราโรงเรียน
                </h3>
                <ul className="text-gray-700">
                  <li className="mb-2 text-justify">
                    <strong>วันก่อตั้ง :</strong> 10 พฤษภาคม พ.ศ. 2536
                  </li>
                  <li className="mb-2 text-justify">
                    <strong>ที่ตั้ง:</strong> {currentData?.address}
                  </li>
                  <li className="mb-2 text-justify">
                    <strong>Facebook : </strong>
                    <a
                      href={currentData?.link_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Klongkhamwittayakarn School
                    </a>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-md shadow-md">
                <h3 className="text-lg font-bold mb-4 text-center">
                  ผู้อำนวยการโรงเรียน
                </h3>
                <div className="flex items-center justify-center mb-6">
                  <img src={Por} alt="ผู้อำนวยการโรงเรียน" className="h-30" />
                </div>
                <ul className="text-gray-700">
                  <li className="mb-2">
                    <strong>นายประจวบ อินทรโชติ</strong>
                  </li>
                  <li className="mb-2">
                    <strong>ผู้อำนวยการโรงเรียนสามเสนวิทยาลัย</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolHistory;
