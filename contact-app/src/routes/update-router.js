import { useParams } from "react-router-dom";
import { BuildFormData } from "../components/form-data";
import api from '../api/server';
import UpdateUser from "../components/update-user";
import { sentenceCase, showError, showSuccess } from "../contexts/common";

export default function UpdateRouter(props) {
    const { type } = useParams();

    const updateHandler = async (updatedData) => {
        const response = await api.post(`/api/updatedocdata`, { data: updatedData, collection: sentenceCase(type) });

        if (response?.status === 201 && response.data) {
            showSuccess(`${sentenceCase(type)} has been updated successfully.`);
            return { res: 'success', entry: response.data };
        } else {
            showError('Error while updating record.');
            return { res: 'failed', entry: response.data };
        }
    };

    switch (type) {
        case 'user':
            return <UpdateUser {...props} updateUserHandler={updateHandler} />;

        default:
            return <BuildFormData {...props} updateDataHandler={updateHandler} />;
    }
}
