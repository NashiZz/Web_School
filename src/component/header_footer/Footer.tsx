import QRCode from "../../assets/QRCode.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="bg-white shadow-md py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
                <div>
                    <h3 className="text-pink-600 font-bold text-xl mb-6">Page Facebook</h3>
                    <div className="flex justify-center md:justify-start">
                        <img src={QRCode} alt="QRCode" className="h-40 w-40 object-contain transform transition duration-300 hover:scale-105" />

                    </div>
                    <div className="justify-center space-x-4 mt-6">
                        <a href="https://web.facebook.com/kkhw2557/" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 space-x-2 transform transition duration-300 hover:scale-110">
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                            <p className="text-lg">Facebook</p>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 className="text-pink-600 font-bold text-xl mb-6">แผนที่</h3>
                    <div className="flex justify-center">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.706866473871!2d${103.33897523289427}!3d${16.453283702893057}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3121e6b81b081fd7%3A0xc0c819f8c365eab4!2s${16.453283702893057}%2C%20${103.33897523289427}!5e0!3m2!1sen!2sth!4v1694524943201!5m2!1sen!2sth&language=th`}
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            className="rounded-lg shadow-lg"
                        ></iframe>
                    </div>
                </div>

                <div>
                    <h3 className="text-pink-600 font-bold text-xl mb-6">ติดต่อ</h3>
                    <p className="text-gray-700 leading-relaxed">
                        ที่อยู่โรงเรียน: โรงเรียนคลองขามวิทยาคาร
                        <br />
                        136  หมู่ 4 ตำบลคลองขาม อำเภอยางตลาด จังหวัดกาฬสินธุ์ 46120
                        <br />
                        <br />
                        โทร: 043-123456
                        <br />
                        อีเมล: info@school.ac.th
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
