import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage, { HomePageHeader } from '../login/welcome';
import { BuildFormData } from '../components/form-data';
import Detail from '../components/detail';
import BuildList from '../components/build-list';
// import DeletePopup from '../components/delete-popup';
import UpdateRouter from './update-router';
import ChatComponent from '../components/messaging/chat';
import MyProfile from '../login/my-profile';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route element={<PrivateLayout />}>
                <Route path='/myprofile/:username' element={<MyProfile />} />
                <Route path='/welcome/:username' element={
                    <HomePage />
                } />
                <Route path="/chat" element={<ChatComponent />} />
                {/* <Route path='/delete/:id' element={<DeletePopup deleteContact={deleteContact} />} /> */}
                <Route path='/getalldata/:collection' element={<BuildList />} />
                <Route path='/add/:type' element={<BuildFormData mode="add" />} />
                <Route path='/detail/:type/:_id' element={<Detail />} />
                <Route path="/update/:type/:_id" element={<UpdateRouter mode="update" />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    )
};

const PrivateLayout = (props) => {
    return (
        <>
            <HomePageHeader {...props} />
            <Outlet />
        </>
    );
};

export default AuthRoutes;