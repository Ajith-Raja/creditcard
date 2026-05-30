import React from 'react';
import AdminPanel from '../../components/admin/AdminPanel';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

const AdminPage = () => {
    return (
        <div>
            <Navigation />
            <AdminPanel />
            <Footer />
        </div>
    );
};

export default AdminPage;