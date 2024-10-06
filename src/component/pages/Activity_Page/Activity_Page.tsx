import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { db, storage } from "../../../firebase";
import {
  collection,
  query,
  getDocs,
  limit,
  startAfter,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { activityModel } from "../../../model/activitys";
import { CircularProgress } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import DatePicker from "react-datepicker";
import { Timestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const itemsPerPage = 6; // จำนวนรายการต่อหน้า

const ActivityPage = () => {
  const { activity } = useParams<{ activity: string }>();
  const [data, setData] = useState<activityModel[]>([]); // ใช้ state เดียวสำหรับจัดการทั้ง activitys และ works
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null); // เก็บ reference ของ document ล่าสุดที่ถูกดึง
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selected, setSelectedItem] = useState<activityModel | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fetchData = async (collectionName: string, page: number) => {
    try {
      setLoading(true);
      const colRef = collection(db, collectionName);

      // Query without limit to get total document count
      const totalSnapshot = await getDocs(colRef);
      const totalDocs = totalSnapshot.size; // Get total document count
      setTotalPages(Math.ceil(totalDocs / itemsPerPage));

      let q;
      if (lastVisible && page > 1) {
        q = query(
          colRef,
          orderBy("date_activity", "desc"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else {
        q = query(colRef, orderBy("date_activity", "desc"), limit(itemsPerPage));
      }

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as activityModel[];

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // เก็บ document ล่าสุด
      setData(list);
      console.log(q);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Document successfully deleted!");
      const oldImageRef = ref(storage,selected?.img);
      await deleteObject(oldImageRef);
      window.location.reload();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
    setIsOpen(false);
  };
  const uploadImage = async (file: File) => {
    try {
      let storageRef: any = "";
      if (activity === "กิจกรรม") {
        storageRef = ref(storage, `activitys/${file.name}`);
      } else if (activity === "ผลงาน") {
        storageRef = ref(storage, `works/${file.name}`);
      } else if (activity === "ข่าวสาร") {
        storageRef = ref(storage, `ข่าวสาร/${file.name}`);
      }

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
  async function handleSaveEdit() {
    setLoading(true);
    if (!title || !body || !selectedDate) {
      console.error("ไม่สามารถเข้าถึง input ได้ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }
    if (!selected?.id) {
      console.error("Document ID is not provided.");
      return;
    }
    let collectionName = "";
    if (activity === "กิจกรรม") {
      collectionName = "activitys";
    } else if (activity === "ผลงาน") {
      collectionName = "works";
    } else if (activity === "ข่าวสาร") {
      collectionName = "news";
    }

    const docRef = doc(db, collectionName, selected.id); // ใช้ selected.id

    try {
      let imageUrl = image;

      if (imageFile) {
        if (selected?.img) {
          const oldImageRef = ref(storage,selected.img);
          await deleteObject(oldImageRef);
        }


        let storageRef: any = "";
        if (activity === "กิจกรรม") {
          storageRef = 'activitys';
        } else if (activity === "ผลงาน") {
          storageRef = 'works';
        } else if (activity === "ข่าวสาร") {
          storageRef = 'ข่าวสาร';
        }

        const imageRef = ref(storage, `${storageRef}/${Timestamp.now()}${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);

        imageUrl = await getDownloadURL(imageRef);
        console.log(imageRef);
      }
      
      

      // let imageURL = "";
      // if (imageFile) {
      //   imageURL = (await uploadImage(imageFile)) || "";
      // }

      await updateDoc(docRef, {
        title: title,
        body: body,
        date_activity: selectedDate,
        img:imageUrl
      });
      setSelectedItem(null);
      setIsOpenEdit(false);
      fetchData(collectionName, currentPage);
      console.log("Document successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
  const handleSelectItem = (item: activityModel) => {
    setSelectedItem(item);
    setIsOpen(true);
  };
  const handleSelectItemEdit = (item: activityModel) => {
    setBody(item.body);
    setTitle(item.title);
    setImage(item.img);
    setSelectedDate(item?.date_activity ? item.date_activity.toDate() : null);
    setSelectedItem(item);
    setIsOpenEdit(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false); // ปิด modal
    setSelectedItem(null); // รีเซ็ต selectedItem
  };
  const handleCloseModalEdit = () => {
    setImage(null);
    setSelectedDate(null);
    setIsOpenEdit(false); // ปิด modal
    setSelectedItem(null); // รีเซ็ต selectedItem
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
    return (
      <>
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      </>
    );
  }

  if (localStorage.getItem("isAdmin") == "true") {
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
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                      onClick={() => {
                        handleSelectItem(item);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div
                        id="popup-modal"
                        tabIndex={-1}
                        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center " // ใช้ flex เพื่อจัดตำแหน่ง
                      >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                              type="button"
                              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={handleCloseModal}
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                              <svg
                                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                คุณต้องการลบ {activity} {selected?.title} ใช่ไหม
                              </h3>
                              <button
                                type="button"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                onClick={() => {
                                  if (activity === "กิจกรรม") {
                                    handleRemove(selected!.id, "activitys");
                                  } else if (activity === "ผลงาน") {
                                    handleRemove(selected!.id, "works");
                                  } else if (activity === "ข่าวสาร") {
                                    handleRemove(selected!.id, "news");
                                  }
                                }} // เรียกใช้ฟังก์ชันลบ
                              >
                                Yes, I'm sure
                              </button>
                              <button
                                type="button"
                                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={handleCloseModal} // ปิด modal
                              >
                                No, cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      className="absolute top-14 right-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-950"
                      onClick={() => {
                        handleSelectItemEdit(item);
                      }} // ฟังก์ชันสำหรับลบ
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                    {isOpenEdit && (
                      <div
                        id="popup-modal"
                        tabIndex={-1}
                        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
                      >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button
                              type="button"
                              className="absolute top-1 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={handleCloseModalEdit}
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-10 mt-5">
                              <div className="flex justify-center mb-8">
                                <div className="bg-purple-200 w-80 h-60 flex items-center justify-center cursor-pointer relative">
                                  <img
                                    src={image!}
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

                              {/* หัวเรื่อง */}
                              <div className="mb-4 ">
                                <label className="block text-left text-white text-sm font-bold mb-2">
                                  หัวเรื่อง
                                </label>
                                <input
                                  value={title} // ใช้ title state แทน
                                  onChange={(e) => setTitle(e.target.value)}
                                  type="text"
                                  placeholder="หัวเรื่อง"
                                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* วันที่/เดือน/ปี */}
                              <div className="mb-4">
                                <label className="block text-left text-white text-sm font-bold mb-2">
                                  วันที่/เดือน/ปี
                                </label>
                                <DatePicker
                                  selected={selectedDate}
                                  onChange={(date: Date | null) =>
                                    setSelectedDate(date)
                                  }
                                  showTimeSelect
                                  dateFormat="Pp"
                                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholderText="เลือกวันที่และเวลา"
                                />
                              </div>

                              {/* รายละเอียด */}
                              <div className="mb-4">
                                <label className="block text-left text-white text-sm font-bold mb-2">
                                  รายละเอียด
                                </label>
                                <textarea
                                  value={body} // ใช้ title state แทน
                                  onChange={(e) => setBody(e.target.value)}
                                  placeholder="รายละเอียด"
                                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  rows={4}
                                ></textarea>
                              </div>

                              <div className="flex justify-center mt-4">
                                {" "}
                                {/* เพิ่ม flex และ justify-center */}
                                <button
                                  type="button"
                                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                  onClick={() => {
                                    handleSaveEdit();
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                  onClick={handleCloseModalEdit}
                                >
                                  No, cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <img
                      src={item.img}
                      alt={`Activity Image ${item.id}`}
                      className="w-full h-72 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
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
  } else {
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
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
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
  }
};

export default ActivityPage;
