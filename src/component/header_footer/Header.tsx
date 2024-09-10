import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Flag from 'react-world-flags';

type DropdownMenu = 'about' | 'humen' | ''; // Define the possible values for dropdownOpen

function Header() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<DropdownMenu>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleDropdownMouseEnter = (menu: DropdownMenu) => {
    setDropdownOpen(menu);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownOpen('');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`bg-header shadow-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'}`}>
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between relative">
        <div className="flex items-center w-full md:w-auto">
          <img
            src={Logo}
            alt="Logo"
            className={`mr-3 transition-all duration-300 my-3 ${isScrolled ? 'h-8 md:h-10 mr-2' : 'h-16 md:h-20 mr-6'} object-cover`}
          />
          {!isScrolled && (
            <div columns-2>
              <h1 className="text-gray-700 text-1xl md:text-2xl font-bold transition-opacity duration-300">
                โรงเรียนคลองขามวิทยาคาร
              </h1>
              <h5 className="text-gray-500 text-lg mb-1">Khongkhamwittayakan School</h5>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-700 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="h-6 w-6" />
        </button>

        <nav className={`md:flex ${isScrolled ? 'md:space-x-4' : 'md:space-x-6'} ${isMobileMenuOpen ? 'block' : 'hidden'} w-full md:w-auto transition-all duration-300`}>
          <Link to="" className="block text-gray-700 hover:text-white py-2">หน้าแรก</Link>
          <div
            className="relative"
            onMouseEnter={() => handleDropdownMouseEnter('about')}
          >
            <button
              className="block text-gray-700 hover:text-white py-2 items-center"
            >
              เกี่ยวกับโรงเรียน
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {dropdownOpen === 'about' && (
              <div
                className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 z-20"
                onMouseLeave={handleDropdownMouseLeave}
              >
                <Link to="/school_history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">ประวัติโรงเรียน</Link>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">วิสัยทัศน์</a>
              </div>
            )}
          </div>
          <div
            className="relative"
            onMouseEnter={() => handleDropdownMouseEnter('humen')}
          >
            <button
              className="block text-gray-700 hover:text-white py-2 items-center"
            >
              บุคลากรโรงเรียน
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </button>
            {dropdownOpen === 'humen' && (
              <div
                className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 z-20"
                onMouseLeave={handleDropdownMouseLeave}
              >
                  <Link to="/showteacher" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">บุคลากรโรงเรียนทั้งหมด</Link>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">นักเรียน</a>
              </div>
            )}
          </div>
          <Link to="/show_activity"  className="block text-gray-700 hover:text-white py-2">กิจกรรม/ผลงาน</Link>
          <a href="#" className="block text-gray-700 hover:text-white py-2">ติดต่อ</a>
        </nav>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button className="text-gray-700 hover:text-white">
            <Flag code="TH" className="h-5 w-7" />
          </button>
          <button className="text-gray-700 hover:text-white">
            <Flag code="US" className="h-5 w-7" /> {/* Adjust flag code as needed */}
          </button>

          {showSearch && (
            <input
              type="text"
              placeholder="ค้นหา..."
              className="ml-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 w-full md:w-64" // Responsive width
            />
          )}
          <button
            className="text-gray-700 hover:text-white"
            onClick={() => setShowSearch(!showSearch)}
          >
            <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
