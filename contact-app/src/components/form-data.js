import React from "react";
import { RenderForm, sentenceCase, showWarning } from "../contexts/common";
import { defaultFields } from "../constant";

class FormDataClass extends React.Component {
    constructor(props) {
        super(props);

        const { state, schemaList, mode } = props;

        // Find current tab's field config
        this.tabItem = schemaList[state.type];
        this.fields = this.tabItem?.fields || defaultFields;

        // Initialize state based on field names
        const initialState = {};
        this.fields.forEach(f => { initialState[f.name] = ''; });

        this.state = {
            ...initialState,
            ...(mode === 'update' ? { _id: state.data._id } : {})
        };
    }

    redirectToPreviousPage = () => {
        const { state, navigate } = this.props;
        navigate(
            // `/${state.type ? `welcome/${state.username}` : 'getalldata/Contact'}`,
            `/getalldata/${sentenceCase(state.type)}`,
            { state: { type: state.type, collection: `${sentenceCase(state.type)}` } }
        );
    };

    handleChange = (e) => {
        const { name, value, refName, refValue } = e.target;
        this.setState({ [name]: value });

        if (refName) {
            this.setState({ [refName]: refValue });
        }
    };

    handleCancel = () => {
        this.redirectToPreviousPage();
    };

    handleSave = async (e) => {
        e.preventDefault();

        // Check for any empty required fields
        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const dataToSave = { ...this.state };

        this.fields.forEach(field => {
            if (field.type === 'select' && field.ref && this.state[`${field.name}_RefFields`]) {
                dataToSave[`${field.name}_RefFields`] = this.state[`${field.name}_RefFields`]
            }
        });

        const response = await this.props.addDataHandler(dataToSave, sentenceCase(this.props.state.type));

        if (response === 'success') {
            const clearedState = {};
            this.fields.forEach(f => clearedState[f.name] = '');
            this.setState(clearedState);

            this.redirectToPreviousPage();
        }
    };

    render() {
        return (
            <RenderForm title={`Add ${sentenceCase(this.props.state.type)}`} buttonLabel="Add" self={this} />
        );
    }
}

export default FormDataClass;