import { createContext, useContext, useState } from 'react';

export const DropdownContext = createContext();

export const useDropdown = () => useContext(DropdownContext);

export default function DropdownProvider({ children }) {
  const [dropdown, setDropdown] = useState(true);
  const [sessionLinksClass, setSessionLinksClass] = useState("circle");
  const [hi, setHi] = useState("hi")
  return (
    <DropdownContext.Provider
      value={{
        dropdown,
        setDropdown,
        sessionLinksClass,
        setSessionLinksClass,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}
