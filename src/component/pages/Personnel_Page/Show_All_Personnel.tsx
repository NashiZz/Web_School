import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
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
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../../../firebase";
import { PersonnelModel } from "../../../model/personnel";
import React, { useEffect, useReducer, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { departmentModel } from "../../../model/department";
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
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("นาย");
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const lastnameRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef<HTMLInputElement | null>(null);
  const [level, setLevel] = useState("นาย");
  const department = useRef<departmentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const handleClickOpen = (person: PersonnelModel) => {
    setActivePersonId(person.id);
    setPrefix(person.prefix || "นาย");

    if (firstnameRef.current) {
      firstnameRef.current.value = person.firstname; 
    }
    if (lastnameRef.current) {
      lastnameRef.current.value = person.lastname; 
    }
  // positionRef.current.value = person.position; 
    setLevel(person.level || "ผู้ช่วย"); 
    setImage(person.img || null); 
    setOpen(true); // Open dialog
  };

  const handleClose = () => {
    setOpen(false);
    setActivePersonId("");
  };
  //   const totalPages = useRef(0);
  //   const currentPage = useRef(1);
  //   const StyledPagination = styled(Pagination)({
  //     "& .MuiPaginationItem-page.Mui-selected": {
  //       backgroundColor: "#d9f99d", // lime-200
  //       color: "#000",
  //     },
  //   });
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const personnelData = await getDocs(query(personnelRef));

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

    loadData();

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
        setLoading(false);
      }
    });
    return () => loadData();
  }, [departmentRef]);

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
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "gray", display: "inline" }}
                        >
                          {person.position} - {person.department}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <React.Fragment>
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
                      maxWidth="sm"
                      fullWidth 
                      
                      PaperProps={{
                        style: {
                          maxHeight: '90vh',
                          overflowY: 'auto',
                          margin: '0 auto',
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
                          <div className="bg-purple-100 py-12 px-6 flex items-center justify-center">
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
                                  ref={firstnameRef}
                                  // defaultValue={firstnameRef.current!.value}
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
                                  <option value="ชำนาญการพิเศษ">
                                    ชำนาญการพิเศษ
                                  </option>
                                  <option value="เชี่ยวชาญ">เชี่ยวชาญ</option>
                                  <option value="เชียวชาญพิเศษ">
                                    เชียวชาญพิเศษ
                                  </option>
                                </select>
                              </div>

                              {/* Save and close buttons */}
                              <DialogActions>
                                <Button onClick={handleClose}>ยกเลิก</Button>
                                <Button autoFocus>บันทึกการแก้ไข</Button>
                              </DialogActions>
                            </div>
                          </div>
                        )}
                      </Dialog>
                    </React.Fragment>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ padding: "5px", marginRight: "8px", color: "red" }}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
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
