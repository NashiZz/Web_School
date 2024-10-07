import backgroundImage from "../../../assets/school_history.jpg";
import director from "../../../assets/ผอ.จิตรกร.jpg";
import { db } from "../../../firebase";
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { InformationSchoolModel } from "../../../model/information_school";
import { CircularProgress } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const SchoolHistory = () => {
  const auth = getAuth();
  const storage = getStorage(); // Firebase Storage
  const currentUser = auth.currentUser;
  const inforRef = collection(db, "information_school");
  const infor = useRef<InformationSchoolModel>();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState({
    generalInfo: "",
    context: "",
    vision: "",
    missions: Array(5).fill(""),
    goals: Array(3).fill(""),
    founding_date: "",
    address: "",
    school_emblem_img: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const querySnapshot = await getDocs(query(collection(db, "admin"), where("uid", "==", currentUser.uid)));
        setIsAdmin(!querySnapshot.empty && querySnapshot.docs[0].data().role === "admin");
      }
    };

    fetchUserRole();
  }, [currentUser]);

  useEffect(() => {
    const loadData = onSnapshot(inforRef, (snapshot) => {
      if (!snapshot.empty) {
        const docData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as InformationSchoolModel;
        infor.current = docData;
        setUpdatedFields({
          generalInfo: docData.general_info,
          context: docData.important_context,
          vision: docData.vision,
          missions: [docData.mission_1, docData.mission_2, docData.mission_3, docData.mission_4, docData.mission_5],
          goals: [docData.goal_1, docData.goal_2, docData.goal_3],
          founding_date: docData.founding_date,
          address: docData.address,
          school_emblem_img: docData.school_emblem_img,
        });
      }
      setLoading(false);
    });

    return () => loadData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedFields((prev) => ({ ...prev, school_emblem_img: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    if (infor.current) {
      const docRef = doc(db, "information_school", infor.current.id);

      try {
        let imageUrl = updatedFields.school_emblem_img;

        if (imageFile) {
          if (infor.current?.school_emblem_img) {
            const oldImageRef = ref(storage, infor.current.school_emblem_img);
            await deleteObject(oldImageRef);
          }

          const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
          const fileNameWithDate = `${timestamp}_${imageFile.name}`;

          const imageRef = ref(storage, `school_emblems/${fileNameWithDate}`);
          await uploadBytes(imageRef, imageFile);

          imageUrl = await getDownloadURL(imageRef);
        }

        await updateDoc(docRef, {
          general_info: updatedFields.generalInfo,
          important_context: updatedFields.context,
          vision: updatedFields.vision,
          mission_1: updatedFields.missions[0],
          mission_2: updatedFields.missions[1],
          mission_3: updatedFields.missions[2],
          mission_4: updatedFields.missions[3],
          mission_5: updatedFields.missions[4],
          goal_1: updatedFields.goals[0],
          goal_2: updatedFields.goals[1],
          goal_3: updatedFields.goals[2],
          founding_date: updatedFields.founding_date,
          address: updatedFields.address,
          school_emblem_img: imageUrl,
        });

        setSaveSuccess(true);
        setEditing(false);
      } catch (error) {
        console.error("Error saving data:", error);
        setSaveError(true);
      } finally {
        setSaving(false);
      }
    }
  };


  const handleCancel = () => {
    if (infor.current) {
      setUpdatedFields({
        generalInfo: infor.current.general_info,
        context: infor.current.important_context,
        vision: infor.current.vision,
        missions: [infor.current.mission_1, infor.current.mission_2, infor.current.mission_3, infor.current.mission_4, infor.current.mission_5],
        goals: [infor.current.goal_1, infor.current.goal_2, infor.current.goal_3],
        founding_date: infor.current.founding_date,
        address: infor.current.address,
        school_emblem_img: infor.current.school_emblem_img,
      });
    }
    setEditing(false);
  };

  const handleEditClick = () => setEditing(true);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("mission")) {
      const index = parseInt(field.split("_")[1], 10);
      setUpdatedFields((prev) => {
        const newMissions = [...prev.missions];
        newMissions[index] = value;
        return { ...prev, missions: newMissions };
      });
    } else if (field.startsWith("goal")) {
      const index = parseInt(field.split("_")[1], 10);
      setUpdatedFields((prev) => {
        const newGoals = [...prev.goals];
        newGoals[index] = value;
        return { ...prev, goals: newGoals };
      });
    } else {
      setUpdatedFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex items-center justify-center h-full">
              <h1 className="text-white text-4xl md:text-6xl font-bold">ประวัติโรงเรียนคลองขามวิทยาคาร</h1>
            </div>
          </div>

          <div className="bg-gray-100 py-12">
            {isAdmin && !editing && (
              <button onClick={handleEditClick} className="text-white bg-blue-500 px-4 py-2 rounded-md">
                แก้ไขข้อมูล
              </button>
            )}
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-md shadow-md h-full">
                    <h2 className="text-xl font-bold mb-4 text-center">ข้อมูลพื้นฐาน</h2>

                    {editing ? (
                      <>
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          style={{ minHeight: '150px', resize: 'vertical' }}
                          value={updatedFields.generalInfo}
                          onChange={(e) => handleChange('generalInfo', e.target.value)}
                        />
                        <h2 className="text-lg font-bold mb-3">บริบทสำคัญ</h2>
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          style={{ minHeight: '100px', resize: 'vertical' }}
                          value={updatedFields.context}
                          onChange={(e) => handleChange('context', e.target.value)}
                        />
                        <h2 className="text-md font-bold">1. วิสัยทัศน์โรงเรียน Vision</h2>
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          value={updatedFields.vision}
                          onChange={(e) => handleChange('vision', e.target.value)}
                        />
                        <h2 className="text-md font-bold">2. พันธกิจ Mission</h2>
                        {updatedFields.missions.map((mission, index) => (
                          <textarea
                            key={index}
                            className="w-full p-2 border rounded-md mb-4"
                            value={mission}
                            onChange={(e) => handleChange(`mission_${index}`, e.target.value)}
                          />
                        ))}
                        <h2 className="text-md font-bold">3. จุดมุ่งหมายเพื่อพัฒนาการศึกษา</h2>
                        {updatedFields.goals.map((goal, index) => (
                          <textarea
                            key={index}
                            className="w-full p-2 border rounded-md mb-4"
                            value={goal}
                            onChange={(e) => handleChange(`goal_${index}`, e.target.value)}
                          />
                        ))}
                        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md" disabled={saving}>
                          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                        </button>
                        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-md ml-4">
                          ยกเลิก
                        </button>
                        {saveSuccess && <p className="text-green-500 mt-4">บันทึกข้อมูลเรียบร้อยแล้ว</p>}
                        {saveError && <p className="text-red-500 mt-4">บันทึกข้อมูลไม่สำเร็จ</p>}
                      </>
                    ) : (
                      <>
                        <p className="text-justify mb-4">{infor.current?.general_info}</p>

                        <h2 className="text-lg font-bold mb-3">บริบทสำคัญ</h2>
                        <p className="text-justify mb-4">{infor.current?.important_context}</p>

                        <h2 className="text-md font-bold mb-3">1. วิสัยทัศน์โรงเรียน Vision</h2>
                        <p className="text-justify mb-4">{infor.current?.vision}</p>

                        <h2 className="text-md font-bold mb-3">2. พันธกิจ Mission</h2>
                        <p className="text-justify mb-4">2.1 {infor.current?.mission_1}</p>
                        <p className="text-justify mb-4">2.2 {infor.current?.mission_2}</p>
                        <p className="text-justify mb-4">2.3 {infor.current?.mission_3}</p>
                        <p className="text-justify mb-4">2.4 {infor.current?.mission_4}</p>
                        <p className="text-justify mb-4">2.5 {infor.current?.mission_5}</p>

                        <h2 className="text-md font-bold mb-3">3. จุดมุ่งหมายเพื่อพัฒนาการศึกษา</h2>
                        <p className="text-justify mb-4">3.1 {infor.current?.goal_1}</p>
                        <p className="text-justify mb-4">3.2 {infor.current?.goal_2}</p>
                        <p className="text-justify mb-4">3.3 {infor.current?.goal_3}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="bg-white p-6 rounded-md shadow-md">
                    {editing ? (
                      <>
                        <div className="mb-4">
                          <label className="block mb-2">เลือกรูปภาพตราโรงเรียน:</label>
                          <input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        {updatedFields.school_emblem_img && (
                          <img
                            src={updatedFields.school_emblem_img}
                            alt="ตราโรงเรียน"
                            className="h-35 mb-4"
                          />
                        )}
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          value={updatedFields.founding_date}
                          onChange={(e) => handleChange('founding_date', e.target.value)}
                        />
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          value={updatedFields.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center mb-6">
                          <img src={updatedFields.school_emblem_img} alt="ตราโรงเรียน" className="h-35" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 text-center">ตราโรงเรียน</h3>
                        <ul className="text-gray-700">
                          <li className="mb-2 text-justify">
                            <strong>วันก่อตั้ง :</strong> {infor.current?.founding_date}
                          </li>
                          <li className="mb-2 text-justify">
                            <strong>ที่ตั้ง:</strong> {infor.current?.address}
                          </li>
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-md shadow-md">
                    {editing ? (
                      <>
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          value={updatedFields.founding_date}
                          onChange={(e) => handleChange('generalInfo', e.target.value)}
                        />
                        <textarea
                          className="w-full p-2 border rounded-md mb-4"
                          value={updatedFields.address}
                          onChange={(e) => handleChange('context', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
