import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { PersonnelModel } from "../../../model/personnel";
import React, { useEffect, useReducer,} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; 
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
  const { departmentName } = useParams<{ departmentName: string }>();
  const personnelRef = collection(db, "personnel");
  const [state, dispatch] = useReducer(personnelReducer, {
    personnel: [],
    loading: true,
  });
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
  }, [departmentName]);

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
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      sx={{
                        padding: "5px",
                        marginRight: "8px",
                        color: "green",
                      }}
                    >
                      <EditIcon fontSize="medium" />
                    </IconButton>
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
          {/* <StyledPagination
            className="flex justify-center pb-9"
            count={totalPages.current } // จำนวนหน้าทั้งหมด
            page={currentPage.current} // หน้าในปัจจุบัน
            onChange={(_event, value) => currentPage.current =(value)} // เปลี่ยนหน้า
          /> */}
        </Box>
      )}
    </>
  );
};

export default ShowAllPersonnel;

