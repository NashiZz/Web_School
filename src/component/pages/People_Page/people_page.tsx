import backgroundImage from "../../../assets/school_history.jpg";
import Por from "../../../assets/po.jpg";

const People = () => {
    return (
        <div>
            <div
                className="relative w-full h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative flex items-center justify-center h-full">
                    <h1 className="text-white text-4xl md:text-6xl font-bold">
                        กลุ่มสาระฯ การเรียนรู้ภาษาไทย
                    </h1>
                </div>
            </div>

            <div className="bg-purple-100 py-16">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <img
                                src={Por}
                                alt="Teerat Phudokmai"
                                className="w-60 h-90 object-cover mx-auto"
                            />
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">Teerat Phudokmai</h2>
                                <p className="text-gray-600">หัวหน้ากลุ่มสาระฯ</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <img
                                src={Por}
                                alt="Teerat Phudokmai"
                                className="w-60 h-90 object-cover mx-auto"
                            />
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">Teerat Phudokmai</h2>
                                <p className="text-gray-600">หัวหน้ากลุ่มสาระฯ</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <img
                                src={Por}
                                alt="Teerat Phudokmai"
                                className="w-60 h-90 object-cover mx-auto"
                            />
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">Teerat Phudokmai</h2>
                                <p className="text-gray-600">หัวหน้ากลุ่มสาระฯ</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <img
                                src={Por}
                                alt="Teerat Phudokmai"
                                className="w-60 h-90 object-cover mx-auto"
                            />
                            <div className="text-center mt-4">
                                <h2 className="text-xl font-semibold">Teerat Phudokmai</h2>
                                <p className="text-gray-600">หัวหน้ากลุ่มสาระฯ</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default People;
