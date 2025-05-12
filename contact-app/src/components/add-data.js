import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldCard, sentenceCase, showError, showSuccess, showWarning } from "../contexts/common";
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
            `/${state.type ? `welcome/${state.username}` : 'contacts'}`,
            { state: { type: state.type } }
        );
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleCancel = () => {
        this.redirectToPreviousPage();
    };

    add = async (e) => {
        e.preventDefault();

        // Check for any empty required fields
        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const response = await this.props.addContactHandler(this.state, sentenceCase(this.props.state.type));
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
            <div className="ui main" style={{ padding: "1rem" }}>
                <div className="responsive-header">
                    <h2>Add {sentenceCase(this.props.state.type)}</h2>
                </div>
                <form className="ui form" style={{ marginTop: "0.5rem" }} onSubmit={this.add}>
                    {this.fields.map(field => (
                        <div className="field" key={field.name}>
                            <label>{field.label}</label>
                            <FieldCard self={this} field={field} />
                        </div>
                    ))}
                    <button className="ui button blue" type="submit">Add</button>
                    <button className="ui button" type="button" onClick={this.handleCancel}>Cancel</button>
                </form>
            </div>
        );
    }
}

// Wrapper to use hooks with class component
const AddData = (props) => {
    const { state } = useLocation();  // Access location object to get state
    const { contacts, setContacts } = props;
    const { location, loggedInUsername: username, type } = state ?? {};

    const addContactHandler = async (newContact, type) => {
        // const newContact = { id: uuidv4(), ...contact };
        const response = await api.post(`/api/adddocdata`, {
            data: newContact,
            collection: type
        });

        if (response?.data?.insertedId) {
            setContacts([...contacts, newContact]);

            showSuccess(`${type} has been added successfully.`);
            return 'success';
        } else {
            showError('This email already exists.');
            return 'failed';
        }
    };

    return <AddDataClass addContactHandler={addContactHandler} navigate={useNavigate()} state={{ username, location, type }} />;
};

export default AddData;