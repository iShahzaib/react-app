import { useParams } from "react-router-dom";
import UpdateContact from './../components/update-contact';
import api from '../api/server';
import Swal from "sweetalert2";
import UpdateUser from "../login/update-user";
import { sentenceCase } from "../contexts/common";

export default function UpdateRouter({ contacts, setContacts, users, setUsers }) {
    const { type, id } = useParams();

    console.log(id);

    const updateHandler = (updatedData) => {
        const updatedtList = type === 'contact'
            ? contacts.map((c) => c.id === updatedData.id ? updatedData : c)
            : users.map((u) => u.id === updatedData.id ? updatedData : u);
        type === 'contact' ? setContacts(updatedtList) : setUsers(updatedtList);
        Swal.fire('Success!', `${sentenceCase(type)} has been updated successfully.`, 'success');
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
