import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../firebase";
import {
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    query,
} from "firebase/firestore";
import 'react-datepicker/dist/react-datepicker.css';
import SyncIcon from "@mui/icons-material/Sync";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { CircularProgress } from "@mui/material";
import { ActivityModel } from "../../../model/activity";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ActivityRequestModel } from "../../../model/activity_req";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Timestamp } from "firebase/firestore";

const AddData_Page = () => {
    const activityRef = collection(db, "activitys");
    const activity = useRef<ActivityModel[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);  
    const [loading2, setLoading2] = useState(true);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const urlRef = useRef<HTMLInputElement | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [type, setType] = useState("ข่าวสาร");

    const getSelectedCollection = () => {
        if (type === "activitys") {
            return collection(db, "activitys");
        } else if (type === "news") {
            return collection(db, "news");
        } else {
            return collection(db, "works"); 
        }
    };

    const uploadImage = async (file: File) => {
        try {
            const storageRef = ref(storage, `${type}/${file.name}`);
            await uploadBytes(storageRef, file);
            const imageURL = await getDownloadURL(storageRef);
            return imageURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            return null;
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const loadData = onSnapshot(activityRef, async (snapshot) => {
            try {
                if (!snapshot.empty) {
                    const activityData = await getDocs(query(activityRef));
                    const getActivity = activityData.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    })) as ActivityModel[];
                    activity.current = getActivity;
                }
            } catch (error) {
                console.log(error);
            } finally {
                console.log("getActivity");
                setLoading2(false);
            }
        });
        return () => loadData();
    }, [activityRef]);

    async function handleSubmit() {
        setLoading(true);

        if (!titleRef.current || !bodyRef.current || !selectedDate) {
            console.error("ไม่สามารถเข้าถึง input ได้ กรุณาลองใหม่อีกครั้ง");
            setLoading(false);
            return;
        }

        const timestamp = Timestamp.fromDate(selectedDate);

        try {
            let imageURL = "";
            if (imageFile) {
                imageURL = (await uploadImage(imageFile)) || "";
            }

            const newActivity: ActivityRequestModel = {
                title: titleRef.current.value,
                body: bodyRef.current.value,
                date_activity: timestamp,
                create_at: Timestamp.now(),
                img: imageURL,
                url_drive_img: urlRef.current ? urlRef.current.value : "",
            };

            // ใช้ collection ที่ได้จากฟังก์ชัน getSelectedCollection()
            await addDoc(getSelectedCollection(), newActivity);

            console.log("Activity added successfully");

            // รีเซ็ตฟอร์มหลังจากบันทึกข้อมูล
            titleRef.current.value = "";
            bodyRef.current.value = "";
            setImage(null);
            setImageFile(null);
        } catch (error) {
            console.error("Error adding activity:", error);
        } finally {
            setLoading(false); 
        }
    }

    return (
        <>
            {loading2 ? (
                <div className="h-screen w-full flex justify-center items-center">
                    <CircularProgress />
                </div>
            ) : (
                <div className="bg-purple-100 py-12 px-6 flex items-center justify-center">
                    <div className="container max-w-md bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-center mb-8">
                            {!image ? (
                                <div className="flex justify-center mb-8">
                                    <div className="bg-purple-200  w-80 h-52 flex items-center justify-center cursor-pointer">
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
                                    <div className="bg-purple-200 w-80 h-52 flex items-center justify-center cursor-pointer relative">
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

                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">หัวเรื่อง</label>
                            <input
                                ref={titleRef}
                                type="text"
                                placeholder="หัวเรื่อง"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">ประเภทข้อมูล</label>
                            <div className="relative">
                                <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}                               
                                >
                                    <option value="news">ข่าวสาร</option>
                                    <option value="activitys">กิจกรรม</option>
                                    <option value="works">ผลงาน</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">วันที่/เดือน/ปี</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholderText="เลือกวันที่และเวลา"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">รายละเอียด</label>
                            <textarea
                                ref={bodyRef}
                                placeholder="รายละเอียด"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={4}
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddData_Page;
