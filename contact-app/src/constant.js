export const schemaList = [
    {
        "key": "user",
        "label": "User List",
        "className": "user",
        "link": null,
        "bgcolor": "#ddd",
        "fields": [
            { "name": "username", "label": "User Name", "type": "text", "placeholder": "User Name", "required": true },
            { "name": "email", "label": "Email", "type": "email", "placeholder": "Email", "required": true, "disabled": true },
            { "name": "profilepicture", "label": "Profile Picture", "type": "text", "placeholder": "Link", "ispicture": true }
        ],
        "icon": "user",
        "collection": "User",
        "IsAccessible": true
    },
    {
        "key": "chats",
        "label": "Chats",
        "className": "chats",
        "link": "/users",
        "bgcolor": "#21ba45",
        "icon": "wechat",
        "IsAccessible": true
    },
    {
        "key": "contact",
        "label": "Contacts",
        "className": "contact",
        "link": null,
        "bgcolor": "#74a9b1",
        "icon": "address book",
        "collection": "Contact",
        "IsAccessible": true
    },
    {
        "key": "student",
        "label": "Students",
        "className": "student",
        "link": null,
        "icon": "student",
        "bgcolor": "#e48670",
        "fields": [
            { "name": "name", "label": "Name", "type": "text", "placeholder": "Name", "required": true },
            { "name": "firstname", "label": "First Name", "type": "text", "placeholder": "First Name" },
            { "name": "lastname", "label": "Last Name", "type": "text", "placeholder": "Last Name" },
            { "name": "email", "label": "Email", "type": "email", "placeholder": "Email", "required": true, "disabled": true },
            { "name": "profilepicture", "label": "Profile Picture", "type": "text", "placeholder": "Link", "ispicture": true },
            { "name": "studentid", "label": "Student ID", "type": "number", "placeholder": "Student ID", "required": true, "disabled": true },
            { "name": "teacherid", "label": "Teacher ID", "type": "number", "placeholder": "Teacher ID", "required": true, "disabled": true }
        ],
        "collection": "Student",
        "IsAccessible": true
    },
    {
        "key": "employee",
        "label": "Employees",
        "className": "employee",
        "link": null,
        "bgcolor": "#aa91bc",
        "fields": [
            { "name": "employeeid", "label": "Employee ID", "type": "number", "placeholder": "Employee ID", "required": true, "disabled": true },
            { "name": "name", "label": "Name", "type": "text", "placeholder": "Name", "required": true },
            { "name": "email", "label": "Email", "type": "email", "placeholder": "Email", "required": true, "disabled": true }
        ],
        "icon": "users",
        "collection": "Employee",
        "IsAccessible": true
    }
];

export const defaultFields = [
    { "name": "name", "label": "Name", "type": "text", "placeholder": "Name", "required": true },
    { "name": "email", "label": "Email", "type": "email", "placeholder": "Email", "required": true, "disabled": true },
    { "name": "profilepicture", "label": "Profile Picture", "type": "text", "placeholder": "Link", "ispicture": true }
];

export const systemFields = [
    { name: 'createdAt', label: 'Created At', type: 'datetime' },
    { name: 'updatedAt', label: 'Updated At', type: 'datetime' }
];

export const menuItems = [
    { label: "Home", icon: "home", action: "home" },
    { label: "My Profile", icon: "user", path: "/myprofile/" },
    { label: "Sign Out", icon: "logout", action: "logout" }
];