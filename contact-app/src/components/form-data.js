import React from "react";
import { getLocalToday, RenderForm, sentenceCase, showWarning } from "../contexts/common";
import { defaultFields } from "../constant";

class FormDataClass extends React.Component {
    constructor(props) {
        super(props);

        const { state, schemaList, mode } = props;
        this.tabItem = schemaList[state.type];
        this.fields = this.tabItem?.fields || defaultFields;

        const initialState = {};

        this.fields.forEach(fld => {
            const { name, ref, refFields, type } = fld;
            const isUpdate = mode === 'update';
            const existingData = isUpdate ? state.data : {};

            initialState[name] = existingData[name] ?? '';

            if (type === 'select' && ref && refFields?.length) {
                initialState[`${name}_RefFields`] = existingData[`${name}_RefFields`] ?? '';
            } else if (type === 'date' && mode === 'add') {
                initialState[name] = getLocalToday();
            } else if (type === 'number') {
                initialState[name] = existingData[name] ? parseInt(existingData[name]) : 0;
            }
        });

        this.state = { ...initialState, ...(mode === 'update' ? { _id: state.data._id } : {}) };
        this.originalData = { ...initialState, ...(mode === 'update' ? { _id: state.data._id } : {}) };
    }

    redirectToPreviousPage = (data) => {
        const { state, navigate, mode } = this.props;
        const navState = {
            type: state.type, data,
            ...(mode === 'update' && state.location ? {} : { collection: `${sentenceCase(state.type)}` })
        };

        const path = mode === 'update' && state.location
            ? `/detail/${state.type}/${state.data._id}`
            : `/getalldata/${sentenceCase(state.type)}`;

        navigate(path, { state: navState });
        // this.props.navigate(-1);
    };

    handleChange = (e) => {
        const { name, type, checked, value, refName, refValue } = e.target;

        const finalValue = type === "checkbox" ? checked : value;

        this.setState({ [name]: finalValue });

        if (refName) {
            this.setState({ [refName]: refValue });
        }
    };

    handleCancel = () => {
        this.redirectToPreviousPage(this.originalData);
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

        let newState = {};
        if (mode === 'add') {
            const response = await addDataHandler(dataToSave, sentenceCase(state.type));

            if (response.res === 'success') {
                this.fields.forEach(f => newState[f.name] = '');
            }
        } else {
            const updatedData = { ...state.data, ...dataToSave };
            const response = await updateDataHandler(updatedData);

            if (response.res === 'success' && response.entry) {
                newState = { ...response.entry };
            }
        }
        this.setState(newState);
        this.redirectToPreviousPage(newState);
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