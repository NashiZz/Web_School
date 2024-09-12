import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const AddPersonalPage = () => {
  const [image, setImage] = useState<string | null>(null);
  // ฟังก์ชันสำหรับการอ่านไฟล์รูปภาพ
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // ตั้งค่าผลลัพธ์จากการอ่านเป็น URL
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="bg-purple-100 py-12 px-6 flex items-center justify-center">
      <div className="container max-w-md bg-white p-8 rounded-lg shadow-lg">
        {!image ? (
          <div className="flex justify-center mb-8">
            <div className="bg-purple-200  w-40 h-52 flex items-center justify-center cursor-pointer">
              <label htmlFor="file">
                <svg
                  className="w-12 h-12 text-purple-500 cursor-pointer"
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
                <svg
                  className="w-12 h-12 text-black cursor-pointer"
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

        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              คำนำหน้า
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>นาย</option>
                <option>นาง</option>
                <option>นางสาว</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ชื่อ
            </label>
            <input
              type="text"
              placeholder="ขื่อ"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              นามสกุล
            </label>
            <input
              type="text"
              placeholder="นามสกุล"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ตำแหน่ง
            </label>
            <input
              type="text"
              placeholder="ตำแหน่ง"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              แผนก
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>คณะผู้บริหารโรงเรียน</option>
                <option>หัวหน้ากลุ่มบริหารงานโรงเรียน</option>
                <option>กลุ่มสาระการเรียนรู้ภาษาไทย</option>
                <option>กลุ่มสาระการเรียนรู้คณิตศาสตร์</option>
                <option>กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</option>
                <option>กลุ่มสาระการเรียนรู้สังคมศึกษาศาสนาและวัฒนธรรม</option>
                <option>กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา</option>
                <option>กลุ่มสาระการเรียนรู้ศิลปะ</option>
                <option>กลุ่มสาระการเรียนรู้การงานอาชีพ</option>
                <option>กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ</option>
                <option>นักการ – แม่บ้าน</option>
              </select>
            </div>
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
