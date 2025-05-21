import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RenderForm, sentenceCase, showWarning } from "../contexts/common";
import { defaultFields } from "../constant";
import { useSchema } from "../contexts/SchemaContext";

class UpdateDataClass extends React.Component {
    constructor(props) {
        super(props);

        const tabItem = props.schemaList[props.state.type];
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
        const navState = { type: state.type, data, collection: `${sentenceCase(state.type)}` };

        navigate(
            state.location ? `/detail/${state.type}/${state.data._id}` : `/getalldata/${sentenceCase(state.type)}`,
            { state: navState }
        );
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleCancel = () => {
        this.redirectToPreviousPage(this.state);
    };

    handleSave = (e) => {
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
            <RenderForm buttonLabel="Update" self={this} />
        );
    }
}

// Functional wrapper
const UpdateData = (props) => {
    const { state } = useLocation();
    const { schemaList } = useSchema();

    const { data, location, loggedInUsername: username, type } = state ?? {};

    return <UpdateDataClass {...props} navigate={useNavigate()} schemaList={schemaList} state={{ data, location, username, type }} />;
};

export default UpdateData;