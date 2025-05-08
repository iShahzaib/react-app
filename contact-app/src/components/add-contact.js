import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sentenceCase, showWarning } from "../contexts/common";

class AddDataClass extends React.Component {
    state = {
        name: '',
        email: ''
    };

    add = async (e) => {
        e.preventDefault();
        if (this.state.name === '' || this.state.email === '') {
            showWarning('All the fields are mandatory.');
            return;
        }
        const response = await this.props.addContactHandler(this.state, sentenceCase(this.props.state.type));
        if (response === 'success') {
            this.setState({
                name: '',
                email: ''
            });
            this.props.navigate(`/${this.props.state.type ? `welcome/${this.props.state.username}` : 'contacts'}`, { state: { type: this.props.state.type } });
        }
    };

    render() {
        return (
            <div className="ui main" style={{ padding: "2rem" }}>
                <div className="responsive-header">
                    <h2>Add {sentenceCase(this.props.state.type)}</h2>
                </div>
                <form className="ui form" onSubmit={this.add}>
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
                            placeholder="Email"
                            value={this.state.email}
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </div>
                    <button className="ui button blue">Add</button>
                </form>
            </div>
        )
    };
}

// Functional wrapper that uses `useNavigate`
const AddData = (props) => {
    const { state } = useLocation();  // Access location object to get state

    return <AddDataClass {...props} navigate={useNavigate()} state={{ username: state.loggedInUsername, type: state.type }} />;
};

export default AddData;