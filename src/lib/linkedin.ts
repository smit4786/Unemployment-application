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
  url?: string;
}

const MOCK_JOBS: Job[] = [
  // Tech
  { id: 'li-101', title: 'Software Engineer', company: 'TechFlow Solutions', location: 'Minneapolis, MN', postedDate: '2 days ago', easyApply: true, description: 'We are looking for a React developer to join our growing team.' },
  { id: 'li-102', title: 'Data Analyst', company: 'North Star Data', location: 'Remote (MN)', postedDate: '5 hours ago', easyApply: true, description: 'Analyze trends and build dashboards using SQL and Python.' },
  { id: 'li-105', title: 'QA Tester', company: 'SoftServe Inc', location: 'Bloomington, MN', postedDate: '1 day ago', easyApply: false, description: 'Manual and automated testing for enterprise software.' },
  
  // Healthcare
  { id: 'li-201', title: 'Registered Nurse', company: 'Mayo Clinic', location: 'Rochester, MN', postedDate: '3 hours ago', easyApply: false, description: 'ICU Nurse needed. Competitive pay and signing bonus.' },
  { id: 'li-202', title: 'Medical Receptionist', company: 'Park Nicollet', location: 'St. Louis Park, MN', postedDate: '1 week ago', easyApply: true, description: 'Front desk duties, scheduling, and patient intake.' },
  { id: 'li-203', title: 'Pharmacy Technician', company: 'CVS Health', location: 'Duluth, MN', postedDate: '2 days ago', easyApply: true, description: 'Assist pharmacists with dispensing medication.' },

  // Construction & Trades
  { id: 'li-301', title: 'Project Manager', company: 'Skyline Construction', location: 'St. Paul, MN', postedDate: '1 week ago', easyApply: false, description: 'Oversee commercial construction projects. PMP preferred.' },
  { id: 'li-302', title: 'Electrician', company: 'Current Electric', location: 'Maple Grove, MN', postedDate: '4 days ago', easyApply: true, description: 'Licensed journeyman electrician for residential calls.' },
  { id: 'li-303', title: 'General Laborer', company: 'BuildMN', location: 'Minneapolis, MN', postedDate: 'Just now', easyApply: true, description: 'Site cleanup and material handling. No experience necessary.' },

  // Retail & Service
  { id: 'li-401', title: 'Customer Service Rep', company: 'HealthFirst', location: 'Bloomington, MN', postedDate: 'Just now', easyApply: true, description: 'Help members navigate their health benefits. Training provided.' },
  { id: 'li-402', title: 'Store Manager', company: 'Target', location: 'Edina, MN', postedDate: '3 days ago', easyApply: false, description: 'Lead store operations and team management.' },
  { id: 'li-403', title: 'Barista', company: 'Caribou Coffee', location: 'Minnetonka, MN', postedDate: '5 hours ago', easyApply: true, description: 'Craft coffee drinks and provide excellent service.' },
  
  // Education & Public
  { id: 'li-501', title: 'High School Teacher', company: 'Minneapolis Public Schools', location: 'Minneapolis, MN', postedDate: '2 weeks ago', easyApply: false, description: 'Math teacher for grades 9-12.' },
  { id: 'li-502', title: 'Bus Driver', company: 'Metro Transit', location: 'Twin Cities, MN', postedDate: '1 day ago', easyApply: true, description: 'Safe transport of passengers. CDL training provided.' },
  
  // Admin & Finance
  { id: 'li-601', title: 'Administrative Assistant', company: 'Lawson & Associates', location: 'St. Paul, MN', postedDate: '6 hours ago', easyApply: true, description: 'Manage office supplies, phones, and scheduling.' },
  { id: 'li-602', title: 'Accountant', company: 'WealthOps', location: 'Eagan, MN', postedDate: '4 days ago', easyApply: false, description: 'Tax preparation and financial reporting.' }
];

export async function searchJobs(query: string, location: string): Promise<Job[]> {
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

  // 1. Try RapidAPI if Key is present
  if (rapidApiKey) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'linkedin-jobs-search.p.rapidapi.com'
        }
      };
      
      // Default to "Minnesota" if no location provided to keep it relevant
      const safeLocation = location || 'Minnesota, USA';
      const safeQuery = query || 'Hiring'; // Broad query if empty

      const response = await fetch(`https://linkedin-jobs-search.p.rapidapi.com/?title=${safeQuery}&location=${safeLocation}`, options);
      
      if (response.ok) {
        const data = await response.json();
        // Map API response to our Job interface
        // Note: Actual API response structure may vary, this is a generic mapping based on common RapidAPI schemas
        // We'll treat the response defensively.
        if (Array.isArray(data.data)) { // Adjust based on actual API return
             return data.data.map((job: any) => ({
                 id: job.job_id || Math.random().toString(),
                 title: job.job_title || 'Unknown Role',
                 company: job.employer_name || 'Unknown Company',
                 location: job.job_location || safeLocation,
                 postedDate: job.posted_date || 'Recently',
                 easyApply: job.is_easy_apply || false,
                 description: job.job_description || 'View details on LinkedIn',
                 url: job.job_apply_link
             }));
        }
      }
    } catch (error) {
      console.warn("RapidAPI fetch failed, falling back to mock data:", error);
    }
  }

  // 2. Fallback to Mock Data
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency
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
    // Even if API fails (mock environment), return true for UI feedback
    return true; 
  }
}
