import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RenderForm, sentenceCase, showError, showSuccess, showWarning } from "../contexts/common";
import { defaultFields } from "../constant";
import api from "../api/server";
import { useSchema } from "../contexts/SchemaContext";

class AddDataClass extends React.Component {
    constructor(props) {
        super(props);

        // Find current tab's field config
        const tabItem = props.schemaList[props.state.type];
        const fields = tabItem?.fields || defaultFields;

        // Initialize state based on field names
        const initialState = {};
        fields.forEach(f => { initialState[f.name] = ''; });

        this.state = initialState;
        this.fields = fields;
    }

    redirectToPreviousPage = () => {
        const { state, navigate } = this.props;
        navigate(
            // `/${state.type ? `welcome/${state.username}` : 'getalldata/Contact'}`,
            `/getalldata/${sentenceCase(state.type)}`,
            { state: { type: state.type, collection: `${sentenceCase(state.type)}` } }
        );
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleCancel = () => {
        this.redirectToPreviousPage();
    };

    handleSave = async (e) => {
        e.preventDefault();

        // Check for any empty required fields
        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const response = await this.props.addDataHandler(this.state, sentenceCase(this.props.state.type));
        if (response === 'success') {
            const clearedState = {};
            this.fields.forEach(f => clearedState[f.name] = '');
            this.setState(clearedState);

            this.redirectToPreviousPage();
        }
    };

    render() {
        return (
            <RenderForm title={`Add ${sentenceCase(this.props.state.type)}`} buttonLabel="Add" self={this} />
        );
    }
}

// Wrapper to use hooks with class component
const AddData = (props) => {
    const { state } = useLocation();  // Access location object to get state
    const { records, setRecords } = props;
    const { location, loggedInUsername: username, type } = state ?? {};

    const { schemaList } = useSchema();

    const addDataHandler = async (data, type) => {
        const response = await api.post(`/api/adddocdata`, { data, collection: type });

        if (response?.data?.insertedId) {
            setRecords([...records, data]);

            showSuccess(`${type} has been added successfully.`);
            return 'success';
        } else {
            showError('This email already exists.');
            return 'failed';
        }
    };

    return <AddDataClass addDataHandler={addDataHandler} schemaList={schemaList} navigate={useNavigate()} state={{ username, location, type }} />;
};

export default AddData;