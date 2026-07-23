import React from 'react';
import classes from './jobCard.module.css';

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

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
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

  const status = getJobStatus(job);
  const progressPercent = job.total_items > 0 
    ? Math.min(100, Math.max(0, Math.round((job.finished_items / job.total_items) * 100))) 
    : 0;

  return (
    <div className={classes.card}>
      <div className={classes.cardHeader}>
        <div className={classes.jobIdBadge}>#{job.job_id}</div>
        <span className={`${classes.statusBadge} ${status.className}`}>
          {status.label}
        </span>
      </div>

      <h3 className={classes.jobName}>{job.job_name}</h3>

      <div className={classes.section}>
        <h4 className={classes.sectionLabel}>Customer</h4>
        <div className={classes.customerInfo}>
          <div className={classes.companyName}>{job.customer?.companyName || 'No Company'}</div>
          <div className={classes.contactName}>{job.customer?.name}</div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.progressHeader}>
          <h4 className={classes.sectionLabel}>Progress</h4>
          <span className={classes.progressValue}>{progressPercent}%</span>
        </div>
        <div className={classes.progressBarBg}>
          <div 
            className={classes.progressBarFill} 
            style={{ 
              width: `${progressPercent}%`
            }} 
          />
        </div>
        <div className={classes.itemCounts}>
          <span>{job.finished_items} completed</span>
          <span>{job.total_items} total items</span>
        </div>
      </div>

      <div className={classes.section}>
        <h4 className={classes.sectionLabel}>Assigned Employees</h4>
        <div className={classes.employeeList}>
          {job.employeeJobs && job.employeeJobs.length > 0 ? (
            job.employeeJobs.map((ej, index) => (
              <div key={ej.employee?.employee_id || index} className={classes.employeeBadge} title={ej.employee?.email}>
                <span className={classes.avatarCircle}>
                  {ej.employee?.name ? ej.employee.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                </span>
                <span className={classes.employeeName}>{ej.employee?.name || 'Unknown'}</span>
              </div>
            ))
          ) : (
            <span className={classes.noEmployees}>Unassigned</span>
          )}
        </div>
      </div>

      <div className={classes.cardFooter}>
        <div className={classes.dateInfo}>
          <span className={classes.dateLabel}>Created:</span>
          <span className={classes.dateValue}>{formatDate(job.dateCreated)}</span>
        </div>
        <div className={classes.dateInfo}>
          <span className={classes.dateLabel}>Due:</span>
          <span className={`${classes.dateValue} ${status.key === 'Overdue' ? classes.overdueDate : ''}`}>
            {formatDate(job.expected_finish_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
