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
        if (this.state.name === '' || this.state.email === '') {
            showWarning('All the fields are mandatory.');
            return;
        }
        this.props.updateDataHandler(this.state);
        this.setState({
            name: '',
            email: ''
        });
        this.props.navigate(`/${this.props.state.type ? `welcome/${this.props.state.username}` : 'contacts'}`, { state: { type: this.props.state.type } });
    };
    render() {
        return (
            <div className="ui main" style={{ padding: "2rem" }}>
                <div className="responsive-header">
                    <h2>Update {this.state.name}</h2>
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

    return <UpdateDataClass {...props} navigate={useNavigate()} state={{ data: state.data, username: state.loggedInUsername, type: state.type }} />;
};

export default UpdateData;