"use client";

import React, { useState, useMemo } from 'react';
import classes from './jobsFeed.module.css';
import JobCard from './jobCard';

interface Employee {
  employee_id: number;
  name: string;
  email: string;
}

interface Customer {
  customer_id: number;
  name: string;
  companyName: string;
  email: string;
}

interface EmployeeJob {
  employee: Employee;
}

interface Job {
  job_id: number;
  job_name: string;
  total_items: number;
  finished_items: number;
  expected_finish_date: string | null;
  actual_finish_date: string | null;
  dateCreated: string;
  customer: Customer;
  employeeJobs: EmployeeJob[];
  _count?: {
    notes: number;
  };
}

interface JobsFeedClientProps {
  initialJobs: Job[];
}

export default function JobsFeedClient({ initialJobs }: JobsFeedClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'N/A';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getJobStatus = (job: Job) => {
    if (job.finished_items >= job.total_items) {
      return { label: 'Completed', key: 'Completed', className: classes.statusCompleted };
    }
    
    if (job.expected_finish_date) {
      const due = new Date(job.expected_finish_date);
      const now = new Date();
      if (due < now) {
        return { label: 'Overdue', key: 'Overdue', className: classes.statusOverdue };
      }
    }
    
    return { label: 'In Progress', key: 'In Progress', className: classes.statusInProgress };
  };

  const processedJobs = useMemo(() => {
    let result = [...initialJobs];

    // Search filter
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      result = result.filter((job) => {
        const jobNameMatch = job.job_name.toLowerCase().includes(query);
        const customerNameMatch = job.customer?.name.toLowerCase().includes(query);
        const customerCompanyMatch = job.customer?.companyName.toLowerCase().includes(query);
        const employeeMatch = job.employeeJobs.some(ej => ej.employee?.name.toLowerCase().includes(query));
        return jobNameMatch || customerNameMatch || customerCompanyMatch || employeeMatch;
      });
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((job) => {
        const status = getJobStatus(job);
        return status.key === statusFilter;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
      }
      if (sortBy === 'dueSoonest') {
        if (!a.expected_finish_date) return 1;
        if (!b.expected_finish_date) return -1;
        return new Date(a.expected_finish_date).getTime() - new Date(b.expected_finish_date).getTime();
      }
      if (sortBy === 'progressHigh') {
        const progressA = a.total_items > 0 ? (a.finished_items / a.total_items) : 0;
        const progressB = b.total_items > 0 ? (b.finished_items / b.total_items) : 0;
        return progressB - progressA;
      }
      if (sortBy === 'progressLow') {
        const progressA = a.total_items > 0 ? (a.finished_items / a.total_items) : 0;
        const progressB = b.total_items > 0 ? (b.finished_items / b.total_items) : 0;
        return progressA - progressB;
      }
      return 0;
    });

    return result;
  }, [initialJobs, search, statusFilter, sortBy]);

  return (
    <div className={classes.container}>
      <header className={classes.headerSection}>
        <div className={classes.titleGroup}>
          <h2 className={classes.feedTitle}>Current Jobs</h2>
          <span className={classes.jobCountBadge}>{processedJobs.length} active jobs</span>
        </div>
        
        <div className={classes.controls}>
          <div className={classes.searchWrapper}>
            <svg className={classes.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, customers, employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={classes.searchInput}
            />
          </div>

          <div className={classes.filterGroup}>
            <div className={classes.controlItem}>
              <label className={classes.controlLabel}>Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className={classes.selectControl}
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className={classes.controlItem}>
              <label className={classes.controlLabel}>Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className={classes.selectControl}
              >
                <option value="newest">Newest Created</option>
                <option value="oldest">Oldest Created</option>
                <option value="dueSoonest">Due Date (Soonest)</option>
                <option value="progressHigh">Progress (Highest)</option>
                <option value="progressLow">Progress (Lowest)</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {processedJobs.length === 0 ? (
        <div className={classes.emptyState}>
          <svg className={classes.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3>No jobs found</h3>
          <p>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className={classes.grid}>
          {processedJobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
