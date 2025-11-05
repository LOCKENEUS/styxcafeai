// import { useState, useRef, useEffect } from "react";
// import { Form, InputGroup } from "react-bootstrap";
// import { BsSearch } from "react-icons/bs";

// export const SearchableDropdown = ({ options = [], onSelect, placeholder = "Search Add-On's" }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef();

//   useEffect(() => {
//     setFilteredOptions(
//       options.filter((item) =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [searchTerm, options]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="position-relative" ref={dropdownRef}>
//       <InputGroup className="mb-3">
//         <InputGroup.Text className="bg-white p-3 rounded-start">
//           <BsSearch />
//         </InputGroup.Text>
//         <Form.Control
//           placeholder={placeholder}
//           className="border-end-0"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setShowDropdown(true);
//           }}
//           onClick={() => setShowDropdown(true)}
//         />
//       </InputGroup>

//       {showDropdown && filteredOptions.length > 0 && (
//         <div className="border rounded bg-white w-100 position-absolute zindex-dropdown" style={{ maxHeight: "200px", overflowY: "auto" }}>
//           {filteredOptions.map((item) => (
//             <div
//               key={item.value}
//               className="px-3 py-2 dropdown-item"
//               role="button"
//               onClick={() => {
//                 onSelect(item);
//                 setSearchTerm(item.name);
//                 setShowDropdown(false);
//               }}
//             >
//               {item.name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
