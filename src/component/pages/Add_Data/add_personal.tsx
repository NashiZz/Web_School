import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { departmentModel } from "../../../model/department";
import { CircularProgress } from "@mui/material";

const AddPersonalPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const departmentRef = collection(db, "department");
  const department = useRef<departmentModel[]>([]); // กำหนด type ของ state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // ฟังข้อมูลแบบเรียลไทม์จาก Firestore
    const loadData = onSnapshot(departmentRef, (snapshot) => {
      try {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as departmentModel[]; // แปลงข้อมูลให้ตรงกับประเภทที่กำหนด
        department.current = newData; // อัปเดตข้อมูลใน state
        console.log(department.current[0].name);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);

  // ฟังก์ชันสำหรับการอ่านไฟล์รูปภาพ
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // ตั้งค่าผลลัพธ์จากการอ่านเป็น URL
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="bg-purple-100 py-12 px-6 flex items-center justify-center">
          <div className="container max-w-md bg-white p-8 rounded-lg shadow-lg">
            {!image ? (
              <div className="flex justify-center mb-8">
                <div className="bg-purple-200  w-40 h-52 flex items-center justify-center cursor-pointer">
                  <label htmlFor="file">
                    <svg
                      className="w-12 h-12 text-purple-500 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="bg-purple-200 w-40 h-52 flex items-center justify-center cursor-pointer relative">
                  <img
                    src={image}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                  <label
                    htmlFor="file"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-black cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}

            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  คำนำหน้า
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>นาย</option>
                    <option>นาง</option>
                    <option>นางสาว</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ชื่อ
                </label>
                <input
                  type="text"
                  placeholder="ขื่อ"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  นามสกุล
                </label>
                <input
                  type="text"
                  placeholder="นามสกุล"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  placeholder="ตำแหน่ง"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  แผนก
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {department.current.map((dept, index) => (
                      <option key={index} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        </div>
       )} 
    </>
  );
};

export default AddPersonalPage;
