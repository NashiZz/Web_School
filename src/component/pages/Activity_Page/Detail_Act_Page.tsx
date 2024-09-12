import { useParams } from 'react-router-dom';
import banner from "../../../assets/banner1.jpg";

const DetailAct_Page = () => {
    const { id } = useParams<{ id: string }>(); // กำหนดให้ id เป็น string
    const activityItems = [
        { id: 0, title: '“ผู้บริหาร ข้าราชการ และเจ้าหน้าที่การปรับแก้ไขคะแนนความประพฤติ”', date: '17 มีนาคม 2567', src: banner, description: 'ผู้บริหาร ข้าราชการ และเจ้าหน้าที่ของวิทยาลัยอาชีวศึกษาอุดรธานี ไม่ให้และไม่รับของขวัญและของกำนัลทุกประเภทจากการปฏิบัติหน้าที่' },
    ];

    // ตรวจสอบว่า id ไม่ใช่ undefined ก่อนการใช้ parseInt
    const activity = activityItems.find(item => item.id === parseInt(id ?? '', 10));

    if (!activity) {
        return <div>ไม่พบข่าว</div>;
    }

    return (
        <div className="bg-purple-100 py-12 px-6">
            <div className="container mx-auto max-w-2xl bg-white rounded-lg shadow-lg relative">

                <div className="relative">
                    <img
                        src={activity.src}
                        alt="No Image"
                        className="w-full h-80 object-cover rounded-t-lg shadow-lg"
                    />
                </div>

                <div className="text-center p-6 mt-10">
                    <p className="text-2xl font-semibold text-gray-800">
                        {activity.title}
                    </p>
                    <p className="text-1xl font-semibold text-gray-600 mt-2">{activity.date}</p>
                </div>

                <div className="py-4">
                    <p className="text-blue-600 text-sm font-medium text-left px-6">
                        #Khongkham #คลองขามวิทยาคาร <br />
                        #โรงเรียนคลองขามวิทยาคาร
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed text-left py-3 px-6">
                        {activity.description}
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
