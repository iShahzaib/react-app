import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSchema } from "../contexts/SchemaContext";
import FormDataClass from "./form-data";

const UpdateData = (props) => {
    const { state } = useLocation();
    const { schemaList } = useSchema();

    const { data, location, loggedInUsername: username, type } = state ?? {};

    return <FormDataClass mode="update" {...props} navigate={useNavigate()} schemaList={schemaList} state={{ data, location, username, type }} />;
};

export default UpdateData;