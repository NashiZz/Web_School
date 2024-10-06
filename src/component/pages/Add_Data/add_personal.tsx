import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { db, storage } from "../../../firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddPersonalPage = () => {
  const departmentRef = collection(db, "department");
  const personnelRef = collection(db, "personnel");
  const department = useRef<departmentModel[]>([]);
  const personnel = useRef<PersonnelModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("นาย");
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef<HTMLInputElement | null>(null);
  const [level, setLevel] = useState("นาย");
  const [departmentName, setDepartment] = useState("คณะผู้บริหารโรงเรียน");
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(e.target.checked);
  };

  const uploadImage = async (file: File) => {
    try {
      const storageRef = ref(storage, `personnel/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = onSnapshot(departmentRef, async (snapshot) => {
      try {
        if (!snapshot.empty) {
          const departmentData = await getDocs(
            query(departmentRef, orderBy("did", "asc"))
          );
          const newData = departmentData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as departmentModel[];
          department.current = newData;
        }
      } catch (error) {
        console.log(error);
      } finally {
        console.log("getDepartment");
        setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);

  useEffect(() => {
    const loadData = onSnapshot(personnelRef, async (snapshot) => {
      try {
        if (!snapshot.empty) {
          const personnelData = await getDocs(
            query(personnelRef, orderBy("pid", "asc"))
          );
          const getPersonnel = personnelData.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as PersonnelModel[];
          personnel.current = getPersonnel;
        }
      } catch (error) {
        console.log(error);
      } finally {
        console.log("getPersonnel");
        setLoading2(false);
      }
    });
    return () => loadData();
  }, [personnelRef]);

  async function handleSubmit() {
    setLoading(true);

    try {
      let imageURL = "";
      if (imageFile) {
        imageURL = (await uploadImage(imageFile)) || "";
      }

      const newPersonnel: PersonnelRequestModel = {
        pid: personnel.current.length + 1,
        firstname: firstnameRef.current!.value,
        lastname: lastnameRef.current!.value,
        prefix: prefix,
        position: positionRef.current!.value,
        department: departmentName,
        img: imageURL,
        level: level,
        isLeader: isChecked,
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
      setImageFile(file); // เก็บไฟล์รูปภาพที่ถูกเลือก
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // ตั้งค่าผลลัพธ์จากการอ่านเป็น URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {loading && loading2 ? (
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
                ref={positionRef}
                placeholder="ตำแหน่ง"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                วิทยฐานะ
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="ผู้ช่วย">ผู้ช่วย</option>
                <option value="จิตอาสา">จิตอาสา</option>
                <option value="ค.ศ 1">ค.ศ 1</option>
                <option value="ชำนาญการ">ชำนาญการ</option>
                <option value="ชำนาญการพิเศษ">ชำนาญการพิเศษ</option>
                <option value="เชี่ยวชาญ">เชี่ยวชาญ</option>
                <option value="เชียวชาญพิเศษ">เชียวชาญพิเศษ</option>
              </select>
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
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2 bg-blend-color-dodge text-md">
                  เป็นหัวหน้าหรือไม่ {isChecked ? "เป็น" : "ไม่เป็น"}
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={loading}
            >
              {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPersonalPage;
