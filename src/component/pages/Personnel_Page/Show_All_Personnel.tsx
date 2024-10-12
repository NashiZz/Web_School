import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import { db, storage } from "../../../firebase";
import { PersonnelModel } from "../../../model/personnel";
import React, { useEffect, useReducer, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { departmentModel } from "../../../model/department";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { PersonnelRequestModel } from "../../../model/personnel_req";
import { Link } from "react-router-dom";
interface PersonnelState {
  personnel: PersonnelModel[];
  loading: boolean;
}

interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

const personnelReducer = (
  state: PersonnelState,
  action: Action
): PersonnelState => {
  switch (action.type) {
    case "SET_PERSONNEL":
      return { ...state, personnel: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
const ShowAllPersonnel = () => {
  const personnelRef = collection(db, "personnel");
  const [state, dispatch] = useReducer(personnelReducer, {
    personnel: [],
    loading: true,
  });
  const departmentRef = collection(db, "department");
  const [open, setOpen] = React.useState(false);
  const [activePersonId, setActivePersonId] = React.useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("นาย");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("นาย");
  const [image, setImage] = useState<string | null>(null);
  const department = useRef<departmentModel[]>([]);
  const [departmentName, setDepartment] = useState("");
  // State to keep track of the checkbox's checked status
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pid, setPid] = useState(0);
  const [openDialog, setOpenDel] = useState(false);
  const handleClickOpenDel = (person: PersonnelModel) => {
    setActivePersonId(person.id);
    setOpenDel(true);
  };

  const handleCloseDel = () => {
    setOpenDel(false);
    setActivePersonId("");
  };

  const handleRemove = async (person: PersonnelModel) => {
    try {
      const personnelDoc = doc(personnelRef, activePersonId);
      await deleteDoc(personnelDoc);
      console.log("Document successfully deleted!");
      const oldImageRef = ref(storage, person?.img);
      await deleteObject(oldImageRef);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
    setOpenDel(false);
    window.location.reload();
    loadDataPersonnel();
    
  };
  const handleSubmit = async () => {
    if (!activePersonId) {
      console.error("No active person ID for editing");
      return;
    }

    setLoading(true);

    try {
      let imageURL = image; // Keep the existing image URL if no new image is uploaded
      if (imageFile) {
        imageURL = (await uploadImage(imageFile)) || "";
      }

      const updatedPersonnel: Partial<PersonnelRequestModel> = {
        firstname: firstname, // Use state value
        lastname: lastname, // Use state value
        prefix: prefix, // Use state value
        position: position, // Use state value
        department: departmentName, // Use state value
        img: imageURL!, // Image URL from upload
        level: level,
        pid: pid,
        isLeader: isChecked ? isChecked : false,
      } as PersonnelRequestModel;

      // Reference the document by ID and update it
      const personnelDoc = doc(personnelRef, activePersonId);
      await updateDoc(personnelDoc, updatedPersonnel);

      console.log("Personnel updated successfully");
    } catch (error) {
      console.error("Error updating personnel:", error);
    } finally {
      setLoading(false);
      setOpen(false);
      window.location.reload();
      loadDataPersonnel();
    }
  };

  const handleCheckboxChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsChecked(e.target.checked);
  };

  const handleClickOpen = (person: PersonnelModel) => {
    setActivePersonId(person.id);
    setPrefix(person.prefix || "นาย");
    setFirstname(person.firstname);
    setLastname(person.lastname);
    setPosition(person.position || "");
    setLevel(person.level || "ผู้ช่วย");
    setImage(person.img || null);
    setDepartment(person.department || "");
    setPid(person.pid);
    setIsChecked(person.isLeader);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActivePersonId("");
  };
  const loadDataPersonnel = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const personnelData = await getDocs(
        query(personnelRef, orderBy("pid", "asc"))
      );

      const getPersonnel = personnelData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as PersonnelModel[];
      console.log(getPersonnel);

      // totalPages.current = Math.ceil(getPersonnel.length / 10)
      dispatch({ type: "SET_PERSONNEL", payload: getPersonnel });
    } catch (error) {
      console.error("Error fetching personnel data: ", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    loadDataPersonnel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        // setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);

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
      {state.loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <List sx={{ width: "60%", bgcolor: "background.paper" }}>
            <div className="flex flex-row justify-center">
              <form className="max-w-lg mx-auto mt-1">
                <div className="flex">
                  <div className="relative w-full">
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-lime-100  border-lime-200"
                      placeholder="Search"
                    />
                    <button
                      type="submit"
                      className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-black bg-lime-200 rounded-e-lg border border-lime-200 hover:bg-lime-200 focus:ring-4 focus:outline-none focus:ring-bg-lime-200 dark:bg-lime-200 dark:hover:bg-lime-200 dark:focus:ring-lime-200"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
              <Link
                to="/addpersonal"
                className="block text-gray-700 hover:text-white py-2"
              >
                <button
                  type="button"
                  className="p-2.5 text-sm font-medium h-full text-black bg-lime-300 rounded-lg border border-lime-300 hover:bg-lime-400 focus:ring-4 focus:outline-none focus:ring-lime-600 ml-2"
                >
                  เพิ่มบุคลากร
                </button>
              </Link>
            </div>
            {state.personnel.map((person) => (
              <React.Fragment key={person.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      className="object-cover mx-auto"
                      alt={`${person.firstname} ${person.lastname}`}
                      src={person.img}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    className="ml-5"
                    primary={`${person.prefix} ${person.firstname} ${person.lastname}`}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "gray", display: "inline" }}
                      >
                        {person.position} - {person.department}
                      </Typography>
                    }
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      sx={{
                        padding: "5px",
                        marginRight: "8px",
                        color: "green",
                      }}
                      onClick={() => handleClickOpen(person)} // Pass person's id
                    >
                      <EditIcon fontSize="medium" />
                    </IconButton>
                    <Dialog
                      // maxWidth="sm"
                      // fullWidth
                      PaperProps={{
                        style: {
                          // maxHeight: "90vh",
                          overflowY: "auto",
                          margin: "0 auto",
                        },
                      }}
                      open={open && activePersonId === person.id}
                      onClose={handleClose}
                    >
                      {state.loading ? (
                        <div className="h-screen w-full flex justify-center items-center">
                          <CircularProgress />
                        </div>
                      ) : (
                        <div className="container max-w-md bg-white p-8 rounded-lg shadow-lg">
                          {/* Image upload */}
                          {!image ? (
                            <div className="flex justify-center mb-8">
                              <div className="bg-purple-200 w-40 h-52 flex items-center justify-center cursor-pointer">
                                <label htmlFor="file">
                                  <AddPhotoAlternateIcon
                                    style={{ fontSize: 40 }}
                                  />
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
                                  <EditIcon style={{ fontSize: 40 }} />
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

                          {/* Form fields */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              คำนำหน้า
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              value={prefix}
                              defaultValue={prefix}
                              onChange={(e) => setPrefix(e.target.value)}
                            >
                              <option value="นาย">นาย</option>
                              <option value="นาง">นาง</option>
                              <option value="นางสาว">นางสาว</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              ชื่อ
                            </label>
                            <input
                              // ref={firstnameRef}
                              onChange={(e) => setFirstname(e.target.value)}
                              value={firstname}
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
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
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
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
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
                              <option value="ชำนาญการพิเศษ">
                                ชำนาญการพิเศษ
                              </option>
                              <option value="เชี่ยวชาญ">เชี่ยวชาญ</option>
                              <option value="เชียวชาญพิเศษ">
                                เชียวชาญพิเศษ
                              </option>
                              <option value="ไม่มี">ไม่มี</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              แผนก
                            </label>
                            <div className="relative">
                              <select
                                value={departmentName}
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
                                เป็นหัวหน้าหรือไม่{" "}
                                {isChecked ? "เป็น" : "ไม่เป็น"}
                              </span>
                            </label>
                          </div>

                          {/* Save and close buttons */}
                          <DialogActions>
                            <Button onClick={handleClose}>ยกเลิก</Button>
                            <Button onClick={handleSubmit}>
                              {loading
                                ? "กำลังการแก้ไขบันทึกข้อมูล..."
                                : "แก้ไขข้อมูล"}
                            </Button>
                          </DialogActions>
                        </div>
                      )}
                    </Dialog>

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleClickOpenDel(person)}
                      sx={{
                        padding: "5px",
                        marginRight: "8px",
                        color: "red",
                      }}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                    <Dialog
                      open={openDialog && activePersonId == person.id}
                      onClose={handleCloseDel}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <svg
                        className="mx-auto mb-4 mt-5 text-red-600 w-12 h-12 dark:text-red-600"
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
                      <DialogTitle id="alert-dialog-title">
                        {"คุณต้องการลบบุคลากรโรงเรียนคนนี้ใช่ไหม"}
                      </DialogTitle>

                      <DialogActions>
                        <Button onClick={handleCloseDel}>ยกเลิก</Button>
                        <Button autoFocus onClick={() => handleRemove(person)}>
                          ยืนยันการลบ
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export default ShowAllPersonnel;
