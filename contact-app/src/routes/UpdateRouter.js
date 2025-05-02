import { useParams } from "react-router-dom";
import UpdateContact from './../components/update-contact';
import api from '../api/server';
import UpdateUser from "../login/update-user";
import { sentenceCase, showSuccess } from "../contexts/common";

export default function UpdateRouter({ contacts, setContacts, users, setUsers }) {
    const { type } = useParams();

    const updateHandler = (updatedData) => {
        // const isUnique = await checkEmailUnique(updatedData.email, type);

        // if (!isUnique) {
        //     showError('This email already exists.');
        //     return 'failed';
        // }

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

    if (type === 'contact') {
        return <UpdateContact updateContactHandler={updateHandler} />;
    } else if (type === 'user') {
        return <UpdateUser updateUserHandler={updateHandler} />;
    } else {
        return <p>Invalid type in URL.</p>;
    }
}
