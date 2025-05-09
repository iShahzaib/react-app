import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showWarning } from "../contexts/common";

class UpdateUserClass extends React.Component {
    state = {
        username: '',
        email: '',
        profilepicture: ''
    };

    componentDidMount() {
        const { _id, username, email, profilepicture } = this.props.state.data;
        this.setState({ _id, username, email, profilepicture });
    }

    update = (e) => {
        e.preventDefault();

        const { _id, username, email } = this.state;
        const { updateUserHandler, state, navigate } = this.props;

        if (!username || !email) {
            showWarning('All the fields are mandatory.');
            return;
        }
        
        const updatedData = { ...state.data, username, email };
        updateUserHandler(updatedData);

        this.setState({ username: '', email: '', profilepicture: '' });

        const { _id: loggedInUserID, username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

        if (_id === loggedInUserID) {
            navigate(`/welcome/${loggedInUsername}`);
        } else {
            navigate('/users');
        }
    };
    render() {
        return (
            <div className="ui main" style={{ padding: "1rem" }}>
                <div className="responsive-header">
                    <h2>Edit {this.state.username}</h2>
                </div>
                <form className="ui form" style={{ marginTop: "0.5rem" }} onSubmit={this.update}>
                    <div className="field">
                        <label>Name</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="User Name"
                            value={this.state.username}
                            onChange={e => this.setState({ username: e.target.value })}
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
                    <div className="field">
                        <label>Profile Picture</label>
                        <input
                            type="text"
                            name="profilepicture"
                            value={this.state.profilepicture}
                            placeholder="Link"
                            onChange={e => this.setState({ profilepicture: e.target.value })}
                        />
                    </div>
                    <button className="ui button blue">Update</button>
                </form>
            </div>
        )
    };
}

// Functional wrapper that uses `useNavigate`
const UpdateUser = (props) => {
    const { state } = useLocation();  // Access location object to get state

    return <UpdateUserClass {...props} navigate={useNavigate()} state={{ data: state.data, username: state.loggedInUsername, type: state.type }} />;
};

export default UpdateUser;