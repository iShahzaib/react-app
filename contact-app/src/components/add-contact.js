import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

class AddContactClass extends React.Component {
    state = {
        name: '',
        email: ''
    };

    add = (e) => {
        e.preventDefault();
        if (this.state.name === '' || this.state.email === '') {
            Swal.fire('Warning!', 'All the fields are mandatory.', 'warning');
            return;
        }
        this.props.addContactHandler(this.state);
        this.setState({
            name: '',
            email: ''
        });
        // Navigate to '/contacts' path after adding the contact
        this.props.navigate('/contacts');
    };

    render() {
        return (
            <div className="ui main" style={{ padding: "2rem" }}>
                <div className="responsive-header">
                    <h2>Add Contact</h2>
                </div>
                <form className="ui form" onSubmit={this.add}>
                    <div className="field">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
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
const AddContact = (props) => {
    return <AddContactClass {...props} navigate={useNavigate()} />;
};

export default AddContact;