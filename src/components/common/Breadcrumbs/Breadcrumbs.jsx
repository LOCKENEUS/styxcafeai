import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items = [] }) => {
    return (
        <div className="mb-md-3 mb-1 mt-4" style={{ fontSize: '16px' }}>
            <Breadcrumb>
                {items.map((item, index) => (
                    <BreadcrumbItem key={index} active={item.active}>
                        {item.active ? (
                            item.label
                        ) : (
                            <Link to={item.path}>{item.label}</Link>
                        )}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>
        </div>
    );
};