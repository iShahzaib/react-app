import React from "react";
import { RenderForm, sentenceCase, showWarning } from "../contexts/common";
import { defaultFields } from "../constant";

class FormDataClass extends React.Component {
    constructor(props) {
        super(props);

        const { state, schemaList, mode } = props;
        this.tabItem = schemaList[state.type];
        this.fields = this.tabItem?.fields || defaultFields;

        const initialState = {};

        this.fields.forEach(f => {
            const isUpdate = mode === 'update';
            const existingData = isUpdate ? state.data : {};

            initialState[f.name] = existingData[f.name] ?? '';

            if (f.type === 'select' && f.ref && f.refFields?.length) {
                initialState[`${f.name}_RefFields`] = existingData[`${f.name}_RefFields`] ?? '';
            }
        });

        this.state = {
            ...initialState,
            ...(mode === 'update' ? { _id: state.data._id } : {})
        };
    }

    redirectToPreviousPage = (data) => {
        const { state, navigate, mode } = this.props;
        const navState = { type: state.type, data, collection: `${sentenceCase(state.type)}` };

        const path = mode === 'update' && state.location
            ? `/detail/${state.type}/${state.data._id}`
            : `/getalldata/${sentenceCase(state.type)}`;

        navigate(path, { state: navState });
    };

    handleChange = (e) => {
        const { name, value, refName, refValue } = e.target;
        this.setState({ [name]: value });

        if (refName) {
            this.setState({ [refName]: refValue });
        }
    };

    handleCancel = () => {
        this.redirectToPreviousPage(this.state);
    };

    handleSave = async (e) => {
        e.preventDefault();

        for (let field of this.fields) {
            if (field.required && !this.state[field.name]) {
                showWarning('All the fields are mandatory.');
                return;
            }
        }

        const { mode, addDataHandler, updateDataHandler, state } = this.props;

        const dataToSave = { ...this.state };

        this.fields.forEach(field => {
            if (field.type === 'select' && field.ref && this.state[`${field.name}_RefFields`]) {
                dataToSave[`${field.name}_RefFields`] = this.state[`${field.name}_RefFields`];
            }
        });

        if (mode === 'add') {
            const response = await addDataHandler(dataToSave, sentenceCase(state.type));

            if (response === 'success') {
                const clearedState = {};
                this.fields.forEach(f => clearedState[f.name] = '');
                this.setState(clearedState);
                this.redirectToPreviousPage();
            }
        } else {
            const updatedData = { ...state.data, ...dataToSave };
            updateDataHandler(updatedData);
            this.redirectToPreviousPage(updatedData);
        }
    };

    render() {
        const { mode, state } = this.props;
        const buttonLabel = mode === 'add' ? 'Add' : 'Update';
        const title = mode === 'add' ? `Add ${sentenceCase(state.type)}` : undefined;

        return (
            <RenderForm title={title} buttonLabel={buttonLabel} self={this} />
        );
    }
};

export default FormDataClass;