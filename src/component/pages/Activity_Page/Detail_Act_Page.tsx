
import banner from "../../../assets/banner1.jpg";
import { useParams, useLocation } from 'react-router-dom';

const DetailAct_Page = () => {
  const { id } = useParams();  // ดึง id จาก URL
  const location = useLocation();  // ดึง state ที่ส่งมาผ่าน Link
  const { item } = location.state || {};  
  console.log(item);
  // รับค่า item จาก state

  if (!item) {
    return <div>ไม่พบกิจกรรม</div>;  // ถ้าไม่มีข้อมูลแสดงข้อความไม่พบกิจกรรม
  }

    return (
        <div className="bg-purple-100 py-12 px-6 ">
            <div className="container mx-auto max-w-2xl bg-white rounded-lg shadow-lg relative">
                <div className="relative">
                    <img
                        src={item.img}
                        alt="No Image"
                        className="w-full h-80 object-cover rounded-t-lg shadow-lg"
                    />
                </div>

                <div className="text-center p-6 mt-10">
                    <p className="text-2xl font-semibold text-gray-800">
                        {item.title}
                    </p>
                    <p className="text-1xl font-semibold text-gray-600 mt-2">{item.date_activity
                        ? `วันที่ ${item.date_activity
                            .toDate()
                            .toLocaleDateString("th-TH")}`
                        : "ไม่ระบุวันที่"}</p>
                </div>
                <div className="py-4">
                    <p className="text-sm text-gray-700 leading-relaxed text-left py-3 px-6">
                        {item.body}
                    </p>
                </div>

                <div className="bg-gray-100 py-4 px-6">
                    <p className="text-gray-600 text-sm text-left">
                        ติดตามข่าวสารเพิ่มเติมที่<br />
                        งานประชาสัมพันธ์ โรงเรียนคลองขามวิทยาคาร <br />
                        <a href="https://www.facebook.com/kkhw2557/?_rdc=1&_rdr" target="_blank" className="text-blue-600 underline">
                            https://www.facebook.com/kkhw2557
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default DetailAct_Page;
