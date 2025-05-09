import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showWarning } from "../contexts/common";

class UpdateDataClass extends React.Component {
    state = {
        name: '',
        email: ''
    };

    componentDidMount() {
        const { _id, name, email } = this.props.state.data;
        this.setState({ _id, name, email });
    }

    update = (e) => {
        e.preventDefault();

        const { name, email } = this.state;
        const { updateDataHandler, state, navigate } = this.props;

        if (!name || !email) {
            showWarning('All the fields are mandatory.');
            return;
        }

        const updatedData = { ...state.data, name, email };

        updateDataHandler(updatedData);

        this.setState({ name: '', email: '' });

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
                    <div className="field">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Name"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                        />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            disabled
                            placeholder="Email"
                            value={this.state.email}
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </div>
                    <button className="ui button blue">Update</button>
                </form>
            </div>
        )
    };
}

// Functional wrapper that uses `useNavigate`
const UpdateData = (props) => {
    const { state } = useLocation();  // Access location object to get state
    const { data, location, loggedInUsername: username, type } = state ? state : {};

    return <UpdateDataClass {...props} navigate={useNavigate()} state={{ data, location, username, type }} />;
};

export default UpdateData;