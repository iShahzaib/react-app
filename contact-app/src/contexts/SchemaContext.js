import { createContext, useContext, useState } from 'react';

const SchemaContext = createContext();

export const SchemaProvider = ({ children }) => {
    const [schemaList, setSchemaList] = useState({});

    return (
        <SchemaContext.Provider value={{ schemaList, setSchemaList }}>
            {children}
        </SchemaContext.Provider>
    );
};

export const useSchema = () => useContext(SchemaContext);
