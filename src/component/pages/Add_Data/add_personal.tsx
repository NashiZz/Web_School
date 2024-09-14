import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { departmentModel } from "../../../model/department";
import { CircularProgress } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SyncIcon from "@mui/icons-material/Sync";
import { PersonnelModel } from "../../../model/persoonal";
const AddPersonalPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const departmentRef = collection(db, "department");
  const department = useRef<departmentModel[]>([]); // กำหนด type ของ state
  const [loading, setLoading] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [prefix, setPrefix] = useState("");
  const [role, setRole] = useState("");
  const [departmentName, setDepartment] = useState("");
  const [lvl, setLvl] = useState("");
  const personnelRef = collection(db, "personal");
  const personnel = useRef<PersonnelModel[]>([]); // กำหนด type ของ state
  useEffect(() => {
    // ฟังข้อมูลแบบเรียลไทม์จาก Firestore
    const loadData = onSnapshot(departmentRef, async (snapshot) => {
      try {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as departmentModel[]; // แปลงข้อมูลให้ตรงกับประเภทที่กำหนด
        department.current = newData; // อัปเดตข้อมูลใน state
        console.log(department.current[0].name);
        const data = await getDocs(query(personnelRef, orderBy("pid", "asc")));
        const getPersonal = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PersonnelModel[]; // แปลงข้อมูลให้ตรงกับประเภทที่กำหนด
        personnel.current = getPersonal; // อัปเดตข้อมูลใน state // อัปเดตข้อมูลใน state
        console.log(personnel.current[0].firstname);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);
 async function handleSubmit() {
  setLoading(true);

    try {
      const newPersonnel: PersonnelModel = {
        pid: personnel.current.length + 1,
        firstname: firstname,
        lastname: lastname,
        prefix: prefix,
        role: role,
        department: departmentName,
        img: image || "",
        lvl: "",
        id: "",
      };

      await addDoc(personnelRef, newPersonnel);
      console.log("Personnel added successfully");
    } catch (error) {
      console.error("Error adding personnel:", error);
    } finally {
      setLoading(false);
    }
 }
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
                    <AddPhotoAlternateIcon style={{ fontSize: 40 }} />
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
                    <label htmlFor="file">
                      <SyncIcon style={{ fontSize: 40 }} />
                    </label>
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
   
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  คำนำหน้า
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="ชื่อ"
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
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ตำแหน่งงาน
                </label>
                <input
                  type="text"
                  placeholder="ตำแหน่ง"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ตำแหน่งครูทางวิชาการ
                </label>
                <input
                  type="text"
                  placeholder="ตำแหน่งครู เช่น ครูชำนาญการพิเศษ"
                  value={lvl}
                  onChange={(e) => setLvl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  แผนก
                </label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {department.current.map((dept, index) => (
                      <option key={index} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={()=>
                  {handleSubmit()}}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'บันทึกข้อมูล'}
              </button>
          
          </div>
        </div>
      )}
    </>
  );
};

export default AddPersonalPage;
