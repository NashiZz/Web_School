import { Link } from "react-router-dom";
import { activityModel } from "../../../../model/activitys";

interface GridContainerProps {
  to: string;
  title: string;
  activity: activityModel[];
}

const GridContainer: React.FC<GridContainerProps> = ({
  to,
  title,
  activity,
}) => {
  return (
    <>
      <div className="relative py-8">
        <Link to={to}>
          <div className="relative inline-block py-2 rounded-tl-lg text-2xl font-bold text-gray-600 hover:text-lime-500">
            <h2 className="flex items-center gap-2 hover:gap-4 duration-300">
              {title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </h2>
            <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
          </div>
        </Link>

        <div className="absolute inset-x-0 bottom-7 border-b-4 border-lime-200 mt-2"></div>

        
      </div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activity.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title || "News Image"}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <Link
                  to={`/activity/${item.id}`}
                  state={{ item }}
                  className="hover:underline"
                >
                  <h3 className="text-base font-semibold mb-2 line-clamp-3">
                    {item.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-4">
                  {item.date_activity
                    ? `วันที่ ${item.date_activity
                        .toDate()
                        .toLocaleDateString("th-TH")}`
                    : "ไม่ระบุวันที่"}
                </p>
              </div>
            </div>
          ))}
        </div>
    </>
  );
};

export default GridContainer;
