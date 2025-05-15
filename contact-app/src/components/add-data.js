import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RenderForm, sentenceCase, showError, showSuccess, showWarning } from "../contexts/common";
import { defaultFields, tabItems } from "../constant";
import api from "../api/server";

class AddDataClass extends React.Component {
    constructor(props) {
        super(props);

        // Find current tab's field config
        const tabItem = tabItems.find(item => item.key === props.state.type);
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
            `/${state.type ? `welcome/${state.username}` : 'getalldata/Contact'}`,
            { state: { type: state.type, collection: 'Contact' } }
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
            // Reset all fields
            const clearedState = {};
            this.fields.forEach(f => clearedState[f.name] = '');
            this.setState(clearedState);

            this.redirectToPreviousPage()
        }
    };

    render() {
        return (
            <RenderForm
                title={`Add ${sentenceCase(this.props.state.type)}`}
                fields={this.fields}
                buttonLabel="Add"
                self={this}
            />
        );
    }
}

// Wrapper to use hooks with class component
const AddData = (props) => {
    const { state } = useLocation();  // Access location object to get state
    const { records, setRecords } = props;
    const { location, loggedInUsername: username, type } = state ?? {};

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

    return <AddDataClass addDataHandler={addDataHandler} navigate={useNavigate()} state={{ username, location, type }} />;
};

export default AddData;