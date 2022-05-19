// A global react context api to store the managements

import { createContext, useEffect, useState, useContext } from 'react';

import { getAllManagements } from '../utils/apiWrapper';

const ManagementContext = createContext(null);

export const ManagementProvider = ({ children }) => {
  const [managements, setManagements] = useState([]);

  useEffect(() => {
    const fetchAllManagements = async () => {
      const res = await getAllManagements().catch((error) => ({
        ...error.response,
      }));

      if (res.status && res.status >= 400 && res.status < 500) {
        console.log(res.statusText);
        return;
      }

      setManagements(res.data);
    };

    fetchAllManagements();
  }, []);

  return (
    <ManagementContext.Provider value={managements}>
      {children}
    </ManagementContext.Provider>
  );
};

// A hook to get the managements
export const useManagements = () => {
  const managements = useContext(ManagementContext);

  return managements ? managements : [];
};
