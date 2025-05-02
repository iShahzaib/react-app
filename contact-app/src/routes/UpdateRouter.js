import { useParams } from "react-router-dom";
import UpdateContact from './../components/update-contact';
import api from '../api/server';
import UpdateUser from "../login/update-user";
import { sentenceCase, showSuccess } from "../contexts/common";

export default function UpdateRouter({ contacts, setContacts, users, setUsers }) {
    const { type } = useParams();

    const updateHandler = (updatedData) => {
        delete updatedData.email;

        const updatedtList = type === 'contact'
            ? contacts.map((c) => c.id === updatedData.id ? updatedData : c)
            : users.map((u) => u.id === updatedData.id ? updatedData : u);

        if (type === 'user') {
            setUsers(updatedtList);

            const { id } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};
            if (id === updatedData.id) {
                localStorage.setItem('loggedInUser', JSON.stringify(updatedData));
            }
        } else {
            setContacts(updatedtList);
        }
        showSuccess(`${sentenceCase(type)} has been updated successfully.`);

        // api.put(`/${type}/${updatedData.id}`, updatedData);
        api.patch(`/${type}/${updatedData.id}`, updatedData);   // Only update the name field
    };

    switch (type) {
        case 'contact':
            return <UpdateContact updateContactHandler={updateHandler} />;

        case 'user':
            return <UpdateUser updateUserHandler={updateHandler} />;

        default:
            return <p>Invalid type in URL.</p>;
    }
}
