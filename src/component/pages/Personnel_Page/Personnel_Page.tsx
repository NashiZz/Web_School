import { db } from "../../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"; // ใช้ getDocs แทน onSnapshot สำหรับการโหลดข้อมูลครั้งเดียว
import backgroundImage from "../../../assets/school_history.jpg";
import { useEffect, useReducer } from "react";
import { PersonnelModel } from "../../../model/personnel";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

interface PersonnelState {
  personnel: PersonnelModel[];
  loading: boolean;
}

interface Action {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

const personnelReducer = (state: PersonnelState, action: Action): PersonnelState => {
  switch (action.type) {
    case "SET_PERSONNEL":
      return { ...state, personnel: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const PersonnelPage = () => {
  const { departmentName } = useParams<{ departmentName: string }>();
  const personnelRef = collection(db, "personnel");

  const [state, dispatch] = useReducer(personnelReducer, { personnel: [], loading: true });

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const personnelData = await getDocs(
          query(
            personnelRef,
            where("department", "==", departmentName),
            orderBy("pid", "asc")
          )
        );

        const getPersonnel = personnelData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PersonnelModel[];

        dispatch({ type: "SET_PERSONNEL", payload: getPersonnel });
      } catch (error) {
        console.error("Error fetching personnel data: ", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadData();

  }, [departmentName]);

  return (
    <>
      {state.loading ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div
            className="relative w-full h-[150px] md:h-[400px] lg:h-[500px] xl:h-[500px] bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex items-center justify-center h-full">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                {departmentName}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:px-40 xl:pr-40 lg:px-30 lg:pr-30 md:px-20 md:pr-20 sm:px-20 sm:pr-20 px-10 pr-10 pt-10 pb-10">
            {state.personnel.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden w-64 max-w-xs mx-auto"
              >
                <img
                  src={item.img}
                  alt={`${item.firstname} ${item.lastname}`}
                  className="w-full h-80 object-cover mx-auto"
                />
                <div className="p-2 flex flex-col justify-center items-center">
                  <h4 className="text-md font-bold mb-2 text-center">
                    {`${item.prefix} ${item.firstname} ${item.lastname}`}
                  </h4>
                  <h4 className="text-sm text-gray-700 text-center">
                    {item.position}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PersonnelPage;
