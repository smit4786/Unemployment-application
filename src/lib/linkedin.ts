// Simulating a LinkedIn API Client
// In production, this would use OAuth and the official LinkedIn API

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  easyApply: boolean;
  description: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: 'li-101',
    title: 'Software Engineer',
    company: 'TechFlow Solutions',
    location: 'Minneapolis, MN',
    postedDate: '2 days ago',
    easyApply: true,
    description: 'We are looking for a React developer to join our growing team.'
  },
  {
    id: 'li-102',
    title: 'Data Analyst',
    company: 'North Star Data',
    location: 'Remote (MN)',
    postedDate: '5 hours ago',
    easyApply: true,
    description: 'Analyze trends and build dashboards using SQL and Python.'
  },
  {
    id: 'li-103',
    title: 'Project Manager',
    company: 'Skyline Construction',
    location: 'St. Paul, MN',
    postedDate: '1 week ago',
    easyApply: false,
    description: 'Oversee commercial construction projects. PMP preferred.'
  },
  {
    id: 'li-104',
    title: 'Customer Service Rep',
    company: 'HealthFirst',
    location: 'Bloomington, MN',
    postedDate: 'Just now',
    easyApply: true,
    description: 'Help members navigate their health benefits. Training provided.'
  }
];

export async function searchJobs(query: string, location: string): Promise<Job[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple client-side filter
  return MOCK_JOBS.filter(job => 
    (job.title.toLowerCase().includes(query.toLowerCase()) || query === '') &&
    (job.location.toLowerCase().includes(location.toLowerCase()) || location === '')
  );
}

export async function applyToJob(jobId: string, userId: string, jobDetails: Job): Promise<boolean> {
  // Simulate application process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const res = await fetch('/api/work-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, job: jobDetails })
    });
    return res.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}
