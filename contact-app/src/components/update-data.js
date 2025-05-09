import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showWarning } from "../contexts/common";
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

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    update = (e) => {
        e.preventDefault();

        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const { updateDataHandler, state, navigate } = this.props;
        const updatedData = { ...state.data };

        this.fields.forEach(f => {
            updatedData[f.name] = this.state[f.name];
        });

        updateDataHandler(updatedData);

        let url = '/contacts';
        const navState = { type: state?.type, data: updatedData };

        if (state?.location) {
            url = `/detail/${state.type}/${state.data._id}`;
        } else if (state?.type) {
            url = `/welcome/${state.username}`;
        }

        navigate(url, { state: navState });
    };

    render() {
        return (
            <div className="ui main" style={{ padding: "2rem" }}>
                <div className="responsive-header">
                    <h2>Edit {this.state.name}</h2>
                </div>
                <form className="ui form" onSubmit={this.update}>
                    {this.fields.map(field => (
                        <div className="field" key={field.name}>
                            <label>{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                disabled={field.disabled}
                                value={this.state[field.name]}
                                onChange={this.handleChange}
                            />
                        </div>
                    ))}
                    <button className="ui button blue">Update</button>
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