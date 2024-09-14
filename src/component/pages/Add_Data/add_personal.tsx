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
import { PersonnelModel } from "../../../model/personnel";
import { PersonnelRequestModel } from "../../../model/personnel_req";
const AddPersonalPage = () => {
  const departmentRef = collection(db, "department");
  const personnelRef = collection(db, "personal");
  const department = useRef<departmentModel[]>([]);
  const personnel = useRef<PersonnelModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("นาย");
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);
  const lvlRef = useRef<HTMLInputElement | null>(null);
  const [departmentName, setDepartment] = useState("");
  useEffect(() => {
    const loadData = onSnapshot(departmentRef, async (snapshot) => {
      try {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as departmentModel[];
        department.current = newData;
        const data = await getDocs(query(personnelRef, orderBy("pid", "asc")));
        const getPersonal = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PersonnelModel[];
        personnel.current = getPersonal;
      } catch (error) {
        console.log(error);
      } finally {
        console.log("getData");
        setLoading(false);
      }
    });
      return () => loadData();
    
  }, [departmentRef, personnelRef]);

 async function handleSubmit() {
  setLoading(true);

    try {
      const newPersonnel: PersonnelRequestModel = {
        pid: personnel.current.length + 1,
        firstname: firstnameRef.current!.value,
        lastname: lastnameRef.current!.value,
        prefix: prefix,
        role: roleRef.current!.value,
        department: departmentName,
        img: image || "",
        lvl: lvlRef.current!.value,
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
                  ref={firstnameRef}
                  placeholder="ชื่อ"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  นามสกุล
                </label>
                <input
                ref={lastnameRef}
                  placeholder="นามสกุล"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ตำแหน่งงาน
                </label>
                <input
                ref={roleRef}
                  placeholder="ตำแหน่ง"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ตำแหน่งครูทางวิชาการ
                </label>
                <input
                ref={lvlRef}
                  placeholder="ตำแหน่งครู เช่น ครูชำนาญการพิเศษ"
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
