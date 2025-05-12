import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldCard, showWarning } from "../contexts/common";
import { defaultFields, tabItems } from "../constant";

class UpdateDataClass extends React.Component {
    constructor(props) {
        super(props);

        const tabItem = tabItems.find(item => item.key === props.state.type);
        this.fields = tabItem?.fields || defaultFields;

        const initialState = {};
        this.fields.forEach(f => {
            initialState[f.name] = props.state.data[f.name] ?? '';
        });

        this.state = {
            ...initialState,
            _id: props.state.data._id
        };
    }

    redirectToPreviousPage = (data) => {
        const { state, navigate } = this.props;

        let url = '/contacts';
        const navState = { type: state?.type, data };

        if (state?.location) {
            url = `/detail/${state.type}/${state.data._id}`;
        } else if (state?.type) {
            url = `/welcome/${state.username}`;
        }

        navigate(url, { state: navState });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleCancel = () => {
        this.redirectToPreviousPage(this.state);
    };

    update = (e) => {
        e.preventDefault();

        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const { updateDataHandler, state } = this.props;
        this.updatedData = { ...state.data };

        this.fields.forEach(f => {
            this.updatedData[f.name] = this.state[f.name];
        });

        updateDataHandler(this.updatedData);

        this.redirectToPreviousPage(this.updatedData);
    };

    render() {
        return (
            <div className="ui main" style={{ padding: "1rem" }}>
                <div className="responsive-header">
                    <h2>Edit {this.state.name}</h2>
                </div>
                <form className="ui form" style={{ marginTop: "0.5rem" }} onSubmit={this.update}>
                    {this.fields.map(field => (
                        <div className="field" key={field.name}>
                            <label>{field.label}</label>
                            <FieldCard self={this} field={field} />
                        </div>
                    ))}
                    <button className="ui button blue" type="submit">Update</button>
                    <button className="ui button" type="button" onClick={this.handleCancel}>Cancel</button>
                </form>
            </div>
        );
    }
}

// Functional wrapper
const UpdateData = (props) => {
    const { state } = useLocation();
    const { data, location, loggedInUsername: username, type } = state ?? {};

    return <UpdateDataClass {...props} navigate={useNavigate()} state={{ data, location, username, type }} />;
};

export default UpdateData;