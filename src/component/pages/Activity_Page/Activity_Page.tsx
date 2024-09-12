
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const ActivityPage = () => {
  const items = Array.from({ length: 22 }, (_, index) => ({
    id: index,
    src: 'src/assets/banner1.jpg',
  }));

  const itemsPerPage = 6;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const StyledPagination = styled(Pagination)({
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "#d9f99d", // lime-200
      color: "#000",
    },
  });

  return (
    <div>
      <div className="relative container mx-auto py-8 px">
        <h2 className="relative inline-block bg-lime-200 px-4 py-2 rounded-tl-lg text-xl font-bold text-gray-600">
          กิจกรรม
          <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-200 transform translate-y-full"></span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 xl:px-60 xl:pr-60 lg:px-40 lg:pr-40 md:px-20 md:pr-20 sm:px-20 sm:pr-20 px-10 pr-10 pt-1 pb-5">
        {currentItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg relative overflow-hidden">
            <img
              src={item.src}
              alt={`News Image ${item.id}`}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">การปรับแก้ไขคะแนนความประพฤติ</h3>
              <p className="text-sm text-gray-600 mb-4">วันที่ 1 สิงหาคม 2566...</p>
              <Link to={`/activity/${item.id}`} className="text-red-600 hover:underline">Read more</Link>
            </div>
          </div>
        ))}
      </div>
      <StyledPagination
        className="flex justify-center pb-9"
        count={totalPages}
        page={currentPage}
        onChange={(_event, value) => {
          console.log(value);
          setCurrentPage(value);
        }}
      />
    </div>
  );
};

export default ActivityPage;

