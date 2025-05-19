import React, { useState } from 'react';
import CloseableTabs from 'react-closeable-tabs';
import Welcome from '../login/welcome';
import BuildList from './build-list';
import { useSchema } from '../contexts/SchemaContext';

const TabsManager = (props) => {
    const { schemaList } = useSchema();

    const [tabs, setTabs] = useState([
        {
            tab: 'Welcome',
            component: <Welcome />,
            id: 'welcome',
            closeable: false,
        },
    ]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleAddTab = (label, collection) => {
        const id = `${collection}`;
        // const id = `${title}-${Date.now()}`;
        const existingTab = tabs.find(tab => tab.id === id);

        if (existingTab) {
            setActiveIndex(tabs.findIndex(tab => tab.id === id));
            return;
        }

        const newTab = {
            tab: label,
            component: <BuildList type={collection} origin="welcome" />,
            id,
            closeable: true,
        };
        setTabs(prev => [...prev, newTab]);
        setActiveIndex(tabs.length);
    };

    const handleCloseTab = (id, newIndex) => {
        setTabs(tabs.filter(tab => tab.id !== id));
        setActiveIndex(newIndex);
    };

    return (
        <div className="ui container parent-container" style={{ paddingBottom: '1rem' }}>
            {/* Sidebar-style menu */}
            <div className="ui vertical menu" style={{ marginBottom: '1rem' }}>
                {Object.values(schemaList).map(({ collection, icon, label }) => collection && (
                    <div
                        key={label}
                        className="item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleAddTab(label, collection)}
                    >
                        <i className={`${icon} icon`}></i>
                        <span style={{ marginLeft: "0.5rem" }}>{label}</span>
                    </div>
                ))}
            </div>

            <CloseableTabs
                data={tabs}
                activeIndex={activeIndex}
                onCloseTab={handleCloseTab}
                onTabClick={(id, newIndex) => setActiveIndex(newIndex)}
            />
        </div>
    );
};

export default TabsManager;