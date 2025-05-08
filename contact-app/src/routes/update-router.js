import { useParams } from "react-router-dom";
import UpdateData from '../components/update-contact';
import api from '../api/server';
import UpdateUser from "../login/update-user";
import { sentenceCase, showSuccess } from "../contexts/common";

export default function UpdateRouter({ contacts, setContacts, users, setUsers }) {
    const { type } = useParams();

    const updateHandler = (updatedData) => {
        const updatedtList = type !== 'user'
            ? contacts.map((c) => c._id === updatedData._id ? updatedData : c)
            : users.map((u) => u._id === updatedData._id ? updatedData : u);

        if (type === 'user') {
            setUsers(updatedtList);

            const { _id } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};
            if (_id === updatedData._id) {
                localStorage.setItem('loggedInUser', JSON.stringify(updatedData));
            }
        } else {
            setContacts(updatedtList);
        }
        showSuccess(`${sentenceCase(type)} has been updated successfully.`);

        // delete updatedData.email;
        // api.put(`/${type}/${updatedData._id}`, updatedData);
        // api.patch(`/${type}/${updatedData._id}`, updatedData);   // Only update the name field
        api.post(`/api/updatedocdata`, {
            data: updatedData,
            collection: sentenceCase(type)
        });
    };

    switch (type) {
        case 'user':
            return <UpdateUser updateUserHandler={updateHandler} />;

        default:
            return <UpdateData updateDataHandler={updateHandler} />;
    }
}
