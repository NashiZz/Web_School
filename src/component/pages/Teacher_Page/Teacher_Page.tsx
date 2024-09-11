import backgroundImage from "../../../assets/school_history.jpg";

const TeacherPage = () => {
    const items = Array.from({ length: 22 }, (_, index) => ({
        id: index,
        src: 'src/assets/ผอ.จิตรกร.jpg',
        title: 'ผอ จิตรกร',
        subtitle: 'ผู้บริหารโรงเรียน'
      }));
  return (
    <div>
       <div
      className="relative w-full h-[150px] md:h-[400px] lg:h-[500px] xl:h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex items-center justify-center h-full">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
          บุคลากรโรงเรียน
        </h1>
      </div>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:px-40 xl:pr-40  lg:px-30 lg:pr-30 md:px-20 md:pr-20 sm:px-20 sm:pr-20  px-10 pr-10 pt-10 pb-10">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-lg relative overflow-hidden">
          <img
            src={item.src}
            alt={`News Image ${item.id}`}
            className="w-full h-96 object-cover"
          />
          <div className="flex p-4 flex-col justify-center items-center">
            <h4 className="text-sm mb-4">{item.title}</h4>
            <h3 className="text-lg text-gray-600 font-semibold mb-2">
              {item.subtitle}
            </h3>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TeacherPage;
