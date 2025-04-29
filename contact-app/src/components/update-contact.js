import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

class UpdateContactClass extends React.Component {
    state = {
        name: '',
        email: ''
    };

    componentDidMount() {
        const { id, name, email } = this.props.state.contact;
        this.setState({ id, name, email });
    }

    update = (e) => {
        e.preventDefault();
        if (this.state.name === '' || this.state.email === '') {
            alert('All the fields are mandatory');
            return;
        }
        this.props.updateContactHandler(this.state);
        this.setState({
            name: '',
            email: ''
        });
        // Navigate to '/contacts' path after adding the contact
        this.props.navigate('/contacts');
    };
    render() {
        return (
            <div className="ui main">
                <h2>Update Contact</h2>
                <form className="ui form" onSubmit={this.update}>
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
                            type="text"
                            name="email"
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
const UpdateContact = (props) => {
    const { state } = useLocation();  // Access location object to get state

    return <UpdateContactClass {...props} navigate={useNavigate()} state={{ contact: state.contact }} />;
};

export default UpdateContact;