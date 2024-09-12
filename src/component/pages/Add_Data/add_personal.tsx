import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';

const AddPersonalPage = () => {
    // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [image, setImage] = useState<string | null>(null);

    // ฟังก์ชันสำหรับการอ่านไฟล์รูปภาพ
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // ตั้งค่าผลลัพธ์จากการอ่านเป็น URL
            };
            reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
        }
    };

    return (
        <div className="bg-purple-100 py-12 px-6 flex items-center justify-center">
            <div className="container max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mb-8">
                    <div className="bg-purple-200 rounded-full w-32 h-32 flex items-center justify-center">
                        {image ? (
                            <img
                                src={image}
                                alt="Selected"
                                className="w-32 h-32 object-cover rounded-full"
                            />
                        ) : (
                            <svg
                                className="w-12 h-12 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-center"
                    />
                </div>

                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">หัวเรื่อง</label>
                        <input
                            type="text"
                            placeholder="หัวเรื่อง"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">ประเภทข้อมูล</label>
                        <div className="relative">
                            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option>ข่าวสาร</option>
                                <option>กิจกรรม</option>
                                <option>ประกาศ</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">วันที่/เดือน/ปี</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {/* <div className="mb-4 w-full max-w-max">
                        <label className="block text-gray-700 text-sm font-bold mb-2">วันที่/เดือน/ปี</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="w-full !px-3 !py-2 !border !rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholderText="เลือกวันที่"
                            showPopperArrow={false}
                            calendarClassName="custom-calendar"
                        />
                    </div> */}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">รายละเอียด</label>
                        <textarea
                            placeholder="รายละเอียด"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={4}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        บันทึกข้อมูล
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPersonalPage;
