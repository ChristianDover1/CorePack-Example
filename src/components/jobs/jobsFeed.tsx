import React from 'react';
import { getAllJobs } from '@/utils/prisma/db/jobs';
import JobsFeedClient from './jobsFeedClient';

export default async function JobsFeed() {
    let jobs: any[] = [];
    try {
        jobs = await getAllJobs();
    } catch (error) {
        console.error("Failed to fetch jobs in JobsFeed component:", error);
    }

    // Safely serialize dates to strings to avoid Next.js RSC serialization warnings
    const serializedJobs = jobs.map((job: any) => ({
    })) as any;

    return <JobsFeedClient initialJobs={serializedJobs} />;
}