function Footer() {
    return (
        <footer className="bg-white shadow-md py-8 mt-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h3 className="text-pink-600 font-bold text-lg mb-4">เมนูด่วน</h3>
                    <ul className="text-gray-700 space-y-2">
                        <li><a href="#">ข่าวประชาสัมพันธ์</a></li>
                        <li><a href="#">ภาพกิจกรรม</a></li>
                        <li><a href="#">ข่าววิชาการ</a></li>
                        <li><a href="#">จัดซื้อจัดจ้าง/รับสมัครงาน</a></li>
                        <li><a href="#">หลักสูตร</a></li>
                        <li><a href="#">ตารางเรียน</a></li>
                        <li><a href="#">เอกสารรับรองประกอบการเบิกจ่ายค่าบำรุงการศึกษา</a></li>
                        <li><a href="#">ดูผลการเรียน</a></li>
                        <li><a href="#">ศูนย์ สอวน.วิชาดาราศาสตร์</a></li>
                        <li><a href="#">ศูนย์ สอวน.วิชาคอมพิวเตอร์</a></li>
                        <li><a href="#">ศูนย์ STEM</a></li>
                        <li><a href="#">ศูนย์ พสวท.</a></li>
                        <li><a href="#">ติดต่อโรงเรียน</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-pink-600 font-bold text-lg mb-4">ติดต่อ</h3>
                    <div className="flex justify-center">
                        <iframe
                            src="https://www.google.com/maps/embed?..."
                            width="300"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="#"><img src="path-to-facebook-icon.png" alt="Facebook" className="h-6" /></a>
                        <a href="#"><img src="path-to-twitter-icon.png" alt="Twitter" className="h-6" /></a>
                        <a href="#"><img src="path-to-instagram-icon.png" alt="Instagram" className="h-6" /></a>
                        <a href="#"><img src="path-to-youtube-icon.png" alt="YouTube" className="h-6" /></a>
                    </div>
                </div>

                <div>
                    <h3 className="text-pink-600 font-bold text-lg mb-4">ติดต่อ</h3>
                    <p className="text-gray-700">
                        ที่อยู่โรงเรียน: 132/11 ถนนพระราม 6 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400<br />
                        สำนักงานผู้อำนวยการ: director@samsenwit.ac.th<br />
                        กลุ่มบริหารวิชาการ: academic@samsenwit.ac.th<br />
                        กลุ่มบริหารกิจการนักเรียน: student@samsenwit.ac.th<br />
                        กลุ่มบริหารทั่วไป: general@samsenwit.ac.th<br />
                        กลุ่มบริหารบุคลากรเงินและสินทรัพย์: financial@samsenwit.ac.th<br />
                        โทรศัพท์: 0-2279-1992, 0-2279-2429<br />
                        โทรสาร: 0-2278-2997, 0-2618-3068, 0-2279-2638<br />
                        งานเว็บไซต์โรงเรียน (Admin): webmaster@samsenwit.ac.th<br />
                        งานประชาสัมพันธ์: pr@samsenwit.ac.th
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
