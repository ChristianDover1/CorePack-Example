
import React from 'react';
import JobsFeed from '@/components/jobs/jobsFeed';
import classes from './dashboard.module.css';

export const dynamic = 'force-dynamic';

const DashboardPage: React.FC = () => {
    return (
        <main className={classes.main}>
            <div className={classes.container}>
                <h1 className={classes.title}>
                    Dashboard
                </h1>
                <p className={classes.subtitle}>
                    Monitor progress, track assignments, and manage operations.
                </p>
                <JobsFeed />
            </div>
        </main>
    );
};

export default DashboardPage;