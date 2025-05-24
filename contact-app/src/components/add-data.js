import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../contexts/common";
import api from "../api/server";
import { useSchema } from "../contexts/SchemaContext";
import FormDataClass from "./form-data";

const AddData = () => {
    const { state } = useLocation();  // Access location object to get state
    const { location, loggedInUsername: username, type } = state ?? {};

    const { schemaList } = useSchema();

    const addDataHandler = async (data, type) => {
        const response = await api.post(`/api/adddocdata`, { data, collection: type });

        if (response?.data?.insertedId) {
            showSuccess(`${type} has been added successfully.`);
            return { res: 'success' };
        } else {
            showError('This email already exists.');
            return { res: 'failed' };
        }
    };

    return <FormDataClass mode="add" addDataHandler={addDataHandler} schemaList={schemaList} navigate={useNavigate()} state={{ username, location, type }} />;
};

export default AddData;