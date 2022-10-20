import { createContext, useContext, useState } from 'react';

export const DropdownContext = createContext();

export const useDropdown = () => useContext(Context);

export default function DropdownProvider({ children }) {
  const [dropdown, setDropdown] = useState("day");

  return (
    <DropdownContext.Provider
      value={{
        dropdown,
        setDropdown
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}
