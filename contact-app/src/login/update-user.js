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
        const { id, username, email, profilepicture } = this.props.state.user;
        this.setState({ id, username, email, profilepicture });
    }

    update = (e) => {
        e.preventDefault();
        if (this.state.username === '' || this.state.email === '') {
            showWarning('All the fields are mandatory.');
            return;
        }
        this.props.updateUserHandler(this.state);

        this.setState({
            username: '',
            email: '',
            profilepicture: ''
        });

        // Navigate to '/contacts' path after adding the user
        const { id, username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

        if (this.state.id === id) {
            this.props.navigate(`/welcome/${username}`);
        } else {
            this.props.navigate('/users');
        }
    };
    render() {
        return (
            <div className="ui main" style={{ padding: "2rem" }}>
                <div className="responsive-header">
                    <h2>Update User</h2>
                </div>
                <form className="ui form" onSubmit={this.update}>
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

    return <UpdateUserClass {...props} navigate={useNavigate()} state={{ user: state.user }} />;
};

export default UpdateUser;