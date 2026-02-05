import { createContext, useContext, useState } from "react";


const UserContext = createContext(null);

export const UseContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null)

    return (
        <UserContext.Provider value={{ userDetails, setUserDetails }}>
            {children}
        </UserContext.Provider>
    )

}

export const useUserContext = () => useContext(UserContext);