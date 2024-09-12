import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,

} from "firebase/firestore";
import backgroundImage from "../../../assets/school_history.jpg";
import { useEffect, useRef } from "react";
import { PersonnelModel } from "../../../model/persoonal";

const TeacherPage = () => {
  const personnelRef = collection(db, "personnel");
  const personnel = useRef<PersonnelModel[]>([]); // กำหนด type ของ state

  useEffect(() => {
    // ฟังข้อมูลแบบเรียลไทม์จาก Firestore
    const loadData = onSnapshot(personnelRef, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PersonnelModel[]; // แปลงข้อมูลให้ตรงกับประเภทที่กำหนด
      personnel.current = newData; // อัปเดตข้อมูลใน state
    });

    // ทำการ unsubscribe เมื่อ component ถูก unmount
    loadData();
  }, [personnelRef]);

  return (
    <div>
       <div
      className="relative w-full h-[150px] md:h-[400px] lg:h-[500px] xl:h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex items-center justify-center h-full">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
          บุคลากรโรงเรียน
        </h1>
      </div>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:px-40 xl:pr-40  lg:px-30 lg:pr-30 md:px-20 md:pr-20 sm:px-20 sm:pr-20  px-10 pr-10 pt-10 pb-10">
      {personnel.current.map((item) => (
        <div  className="bg-white rounded-lg shadow-lg relative overflow-hidden">
          <img
            src={"src/assets/ผอ.จิตรกร.jpg"}
            className="w-full h-96 object-cover"
          />
          <div className="flex p-4 flex-col justify-center items-center">
          <h4 className="text-lg font-semibold mb-4">{`${item.prefix} ${item.firstname} ${item.lastname} ${item.sid}`}</h4>
            <h4 className="text-md text-gray-600  mb-2">
              {item.role}
            </h4>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TeacherPage;
