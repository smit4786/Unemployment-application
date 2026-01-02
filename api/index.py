import io
import json
import os
import time
from typing import Any, Dict, List, Optional

import firebase_admin
import requests
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import firestore
from pydantic import BaseModel
from pypdf import PdfReader

app = FastAPI(docs_url="/api/v1/docs", openapi_url="/api/v1/openapi.json")
# Allow CORS for development logic
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/search")
def search_jobs(
    query: str = "", 
    location: str = "Minnesota", 
    date_filter: str = "week",  # today, 3days, week, month
    work_type: str = "any",  # remote, hybrid, onsite, any
    radius: str = "50",  # miles from location
    exp_level: str = "any" # entry, mid, senior, any
):
    # SerpApi Google Jobs API
    serpapi_key = os.environ.get("SERPAPI_KEY")
    
    if not serpapi_key:
        return {"error": "SERPAPI_KEY not configured on server"}

    url = "https://serpapi.com/search"
    
    # Safe query params
    q = query.strip() if query.strip() else "Software"
    loc = location.strip() if location.strip() else "Minnesota"
    
    # Add work type to query if specified
    work_type_query = ""
    if work_type == "remote":
        work_type_query = " remote"
    elif work_type == "hybrid":
        work_type_query = " hybrid"
    elif work_type == "onsite":
        work_type_query = " on-site"
    
    base_params = {
        "engine": "google_jobs",
        "q": f"{q}{work_type_query}",
        "location": loc,
        "hl": "en",
        "api_key": serpapi_key,
        "lrad": radius  # configurable radius from location (km in SerpApi)
    }
    
    # Chips for filtering
    chips = []
    
    # Date filter chips
    date_chips = {
        "today": "date_posted:today",
        "3days": "date_posted:3days",
        "week": "date_posted:week",
        "month": "date_posted:month"
    }
    if date_filter in date_chips:
        chips.append(date_chips[date_filter])

    # Experience Level chips
    exp_chips = {
        "entry": "requirements:no_experience",
        "mid": "requirements:years3under",
        "senior": "requirements:years3plus"
    }
    if exp_level in exp_chips:
        chips.append(exp_chips[exp_level])

    if chips:
        base_params["chips"] = ",".join(chips)

    try:
        all_jobs = []
        seen_ids = set()
        
        # Fetch up to 3 pages
        for page in range(3):
            params = base_params.copy()
            if page > 0:
                params["start"] = page * 10
            
            try:
                response = requests.get(url, params=params, timeout=10)
                # If a secondary page fails, we just return the results from the successful pages
                if response.status_code != 200:
                    print(f"SerpApi Page {page} failed with {response.status_code}: {response.text}")
                    break
                
                data = response.json()
                jobs_list = data.get("jobs_results", [])
                if not jobs_list:
                    break 
            except Exception as e:
                print(f"Error fetching SerpApi page {page}: {e}")
                break
            
            for job in jobs_list:
                job_id = job.get("job_id", "")
                if job_id in seen_ids:
                    continue  # Skip duplicates
                seen_ids.add(job_id)
                
                extensions = job.get("detected_extensions", {})
                
                # Extract rich details
                posted_at = extensions.get("posted_at", "Recently")
                salary = extensions.get("salary", None)
                schedule_type = extensions.get("schedule_type", None)
                work_from_home = extensions.get("work_from_home", False)
                job_type = None
                
                # Parse schedule to determine job type
                if schedule_type:
                    job_type = schedule_type
                elif "Full-time" in str(job.get("extensions", [])):
                    job_type = "Full-time"
                elif "Part-time" in str(job.get("extensions", [])):
                    job_type = "Part-time"
                elif "Contract" in str(job.get("extensions", [])):
                    job_type = "Contract"
                
                # Calculate posting freshness score (lower = more recent)
                freshness_score = 100
                posted_lower = posted_at.lower()
                if "hour" in posted_lower:
                    freshness_score = 1
                elif "today" in posted_lower or "just" in posted_lower:
                    freshness_score = 2
                elif "1 day" in posted_lower or "yesterday" in posted_lower:
                    freshness_score = 3
                elif "2 day" in posted_lower:
                    freshness_score = 4
                elif "3 day" in posted_lower:
                    freshness_score = 5
                elif "day" in posted_lower:
                    freshness_score = 10
                elif "week" in posted_lower:
                    freshness_score = 20
                
                # Get apply link
                apply_options = job.get("apply_options", [])
                apply_url = apply_options[0].get("link") if apply_options else job.get("share_link")
                
                # Get all apply sources
                apply_sources = [opt.get("title", "Apply") for opt in apply_options[:3]] if apply_options else []
                
                # Build highlights from extensions
                highlights = job.get("job_highlights", [])
                qualifications = []
                benefits = []
                responsibilities = []
                
                for highlight in highlights:
                    title = highlight.get("title", "").lower()
                    items = highlight.get("items", [])
                    if "qualif" in title or "require" in title:
                        qualifications = items[:5]
                    elif "benefit" in title:
                        benefits = items[:5]
                    elif "responsib" in title or "duties" in title:
                        responsibilities = items[:3]
                
                all_jobs.append({
                    "id": job.get("job_id", "N/A"),
                    "title": job.get("title", "Unknown Role"),
                    "company": job.get("company_name", "Unknown Company"),
                    "location": job.get("location", loc),
                    "postedDate": posted_at,
                    "freshnessScore": freshness_score,
                    "easyApply": len(apply_options) > 0,
                    "description": job.get("description", "View details.")[:800],
                    "url": apply_url,
                    "logoUrl": job.get("thumbnail"),
                    # Enhanced details
                    "salary": salary,
                    "jobType": job_type,
                    "workFromHome": work_from_home,
                    "applySources": apply_sources,
                    "qualifications": qualifications,
                    "benefits": benefits,
                    "responsibilities": responsibilities,
                    "via": job.get("via", "")
                })
        
        # Sort by freshness (most recent first) and limit to 50
        all_jobs.sort(key=lambda x: x["freshnessScore"])
        final_jobs = all_jobs[:50]
            
        return {"data": final_jobs, "total": len(final_jobs), "pages_fetched": min(3, (len(all_jobs) // 10) + 1)}
        
    except Exception as e:
        print(f"Error fetching jobs from SerpApi: {str(e)}")
        return {"data": [], "error": str(e)}

    return {
        "connected": True,
        "name": "Alex Application",
        "headline": "Software Engineer | #OpenToWork",
        "avatarUrl": "https://ui-avatars.com/api/?name=Alex+A&background=0077b5&color=fff",
        "openToWork": True,
        "profileUrl": "https://www.linkedin.com/in/"
    }


try:
    if not firebase_admin._apps:
        # Attempts to load default credentials (works on Vercel if env vars are set)
        firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"WARNING: Firebase Admin failed to initialize. Database features will be disabled.")
    print(f"Reason: {e}")
    print("Ensure GOOGLE_APPLICATION_CREDENTIALS is set or you are in a GCP environment.")
    db = None

# --- Application Submission Endpoint ---
class ApplicationRequest(BaseModel):
    userId: str
    jobId: Optional[str] = None
    answers: dict

@app.post("/api/v1/apply")
def submit_application(req: ApplicationRequest):
    if not db:
        return {"success": False, "error": "Database not initialized on server."}

    try:
        # Server-side Validation
        if len(req.answers) < 3:
             return {"success": False, "error": "Incomplete application."}

        # Write to Firestore (Securely)
        doc_ref = db.collection("applications").add({
            "userId": req.userId,
            "jobId": req.jobId or "general",
            "answers": req.answers,
            "status": "received",
            "submittedAt": firestore.SERVER_TIMESTAMP
        })
        
        return {"success": True, "id": doc_ref[1].id}
    except Exception as e:
        print(f"Apply Error: {e}")
        return {"success": False, "error": str(e)}


# --- Follow-Up Email Generation Endpoint ---
class FollowUpRequest(BaseModel):
    jobTitle: str
    company: str
    jobDescription: str
    resumeText: Optional[str] = None
    contactName: Optional[str] = None
    contactEmail: Optional[str] = None

@app.post("/api/v1/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Parse text from uploaded PDF resume"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        return {"text": text.strip(), "filename": file.filename}
    except Exception as e:
        print(f"Error parsing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to parse resume PDF")

@app.post("/api/v1/generate-followup")
def generate_followup(req: FollowUpRequest):
    """Generate personalized follow-up email and LinkedIn message using LLM"""
    groq_api_key = os.environ.get("GROQ_API_KEY")
    
    if not groq_api_key:
        # Fallback to template-based response
        contact = req.contactName or "Hiring Manager"
        email_subject = f"Following Up - {req.jobTitle} Application at {req.company}"
        email_body = f"""Dear {contact},

I hope this email finds you well. I recently applied for the {req.jobTitle} position at {req.company} and wanted to follow up on my application.

I am very excited about this opportunity and believe my skills and experience align well with the role. I would welcome the chance to discuss how I can contribute to your team.

Please let me know if you need any additional information from me. I look forward to hearing from you.

Best regards"""
        
        linkedin_msg = f"""Hi {contact},

I recently applied for the {req.jobTitle} role at {req.company} and wanted to connect. I'm very interested in this opportunity and would love to learn more about the team and role. Would you be open to a brief conversation?

Thank you!"""
        
        return {
            "email": {"subject": email_subject, "body": email_body},
            "linkedinMessage": linkedin_msg,
            "ai_powered": False
        }
    
    # Build prompt with context
    resume_context = ""
    if req.resumeText and len(req.resumeText) > 50:
        resume_context = f"\n\nCandidate's Resume/Background:\n{req.resumeText[:2000]}"
    
    contact = req.contactName or "the hiring team"
    
    prompt = f"""Generate a professional follow-up email and LinkedIn message for a job application.

Job Details:
- Position: {req.jobTitle}
- Company: {req.company}
- Job Description (excerpt): {req.jobDescription[:1000]}

Contact: {contact}
{resume_context}

Generate TWO things:
1. A professional follow-up EMAIL with subject line and body. The email should:
   - Be concise (under 200 words)
   - Reference specific skills/experience matching the role
   - Express genuine interest
   - Have a clear call-to-action

2. A short LinkedIn connection/follow-up MESSAGE (under 100 words) that is:
   - Friendly and professional
   - Personalized to the role
   - Appropriate for LinkedIn's informal tone

Respond in this exact JSON format:
{{"email": {{"subject": "...", "body": "..."}}, "linkedinMessage": "..."}}

Only output the JSON, nothing else."""

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are a professional career coach helping job seekers write compelling follow-up messages. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            },
            timeout=15
        )
        
        if response.ok:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            
            # Parse JSON from response
            start = content.find("{")
            end = content.rfind("}") + 1
            if start >= 0 and end > start:
                result = json.loads(content[start:end])
                result["ai_powered"] = True
                return result
        
        raise Exception("Failed to parse LLM response")
        
    except Exception as e:
        print(f"Follow-up generation error: {e}")
        # Return fallback
        contact = req.contactName or "Hiring Manager"
        return {
            "email": {
                "subject": f"Following Up - {req.jobTitle} Application",
                "body": f"Dear {contact},\n\nI wanted to follow up on my application for the {req.jobTitle} position at {req.company}. I remain very interested in this opportunity and would welcome the chance to discuss how I can contribute to your team.\n\nBest regards"
            },
            "linkedinMessage": f"Hi! I recently applied for the {req.jobTitle} role at {req.company} and wanted to connect. Would love to learn more about the opportunity!",
            "ai_powered": False,
            "error": str(e)
        }


# --- Contact Discovery Endpoint ---
@app.get("/api/v1/find-contact")
def find_contact(company: str, job_title: str = ""):
    """Search for hiring manager/recruiter contact info"""
    serpapi_key = os.environ.get("SERPAPI_KEY")
    
    if not serpapi_key:
        return {"contacts": [], "error": "SERPAPI_KEY not configured"}
    
    try:
        # Search for company recruiters/hiring managers
        query = f"{company} recruiter OR hiring manager {job_title}"
        
        response = requests.get(
            "https://serpapi.com/search",
            params={
                "engine": "google",
                "q": f"site:linkedin.com/in {query}",
                "api_key": serpapi_key,
                "num": 5
            },
            timeout=10
        )
        
        contacts = []
        if response.ok:
            data = response.json()
            results = data.get("organic_results", [])
            
            for result in results[:5]:
                title = result.get("title", "")
                link = result.get("link", "")
                snippet = result.get("snippet", "")
                
                if "linkedin.com/in" in link:
                    contacts.append({
                        "name": title.split(" - ")[0] if " - " in title else title,
                        "title": snippet[:100],
                        "linkedinUrl": link
                    })
        
        return {"contacts": contacts}
        
    except Exception as e:
        print(f"Contact search error: {e}")
        return {"contacts": [], "error": str(e)}
class ChatRequest(BaseModel):
    message: str
    userName: str
    context: Optional[str] = None # e.g. "Browsing Job: Software Engineer"

@app.post("/api/v1/ai/chat-assist")
def ai_chat_assist(req: ChatRequest):
    msg = req.message.lower()
    ctx = req.context or ""
    response_text = ""

    # Context-Aware Logic
    if "Software Engineer" in ctx and ("salary" in msg or "pay" in msg):
        response_text = "Software Engineer roles in MN typically range from $90k - $140k depending on experience."
    elif "resume" in msg:
        response_text = f"Hi {req.userName}, strictly format your resume for ATS systems. Use standard headings like 'Experience' and 'Education'."
    elif "interview" in msg:
         response_text = f"For {ctx} interviews, be ready to discuss your past projects in depth using the STAR method."
    elif "job" in msg or "search" in msg:
         response_text = "I recommend checking the 'Job Feed' for the latest tech openings in Minnesota."
    else:
         response_text = f"I see you're interested in {ctx if ctx else 'career advice'}. How can the community help?"

    return {"reply": response_text}


# --- In-Memory Store Logic ---
class ApplicationModel(BaseModel):
    id: str
    firstName: str
    lastName: str
    submittedAt: str = ""
    status: str
    step: int
    progress: int
    estimatedCompletion: str
    week: str
    notifications: List[Dict[str, Any]] = []
    workLog: List[Dict[str, Any]] = []

class InMemoryStore:
    def __init__(self):
        self.applications = {}
        # Seed
        self.seed()

    def seed(self):
        self.applications['MN-2024-555'] = {
            "id": 'MN-2024-555',
            "firstName": 'John',
            "lastName": 'Doe',
            "submittedAt": "2024-12-22T10:00:00Z",
            "status": 'Pending Review',
            "step": 1,
            "progress": 33,
            "estimatedCompletion": '5-7 business days',
            "week": 'Dec 15 - Dec 21',
            "notifications": [
                { "id": 1, "message": 'Application Received', "date": 'Dec 22, 2:30 PM', "type": 'success' },
                { "id": 2, "message": 'Handbook Available', "date": 'Dec 22, 2:31 PM', "type": 'info' }
            ],
            "workLog": []
        }

    def get(self, app_id: str):
        return self.applications.get(app_id)

    def get_all(self):
        return list(self.applications.values())

    def update(self, app_id: str, updates: Dict):
        if app_id in self.applications:
            self.applications[app_id].update(updates)
            return self.applications[app_id]
        return None

store = InMemoryStore()

# --- Ported Endpoints ---

@app.get("/api/v1/status")
def get_status():
    # Return seeded app for MVP dashboard consistency
    return store.get('MN-2024-555')

@app.get("/api/v1/admin")
def get_admin_data():
    return store.get_all()

class LogRequest(BaseModel):
    userId: str
    job: Dict[str, Any]

@app.post("/api/v1/work-log")
def add_work_log(req: LogRequest):
    app = store.get(req.userId) or store.get('MN-2024-555') # Fallback to seed
    if not app:
        return {"error": "User not found"}
    
    log_entry = {
        "id": f"log-{int(time.time())}",
        "jobTitle": req.job.get('title'),
        "company": req.job.get('company'),
        "dateApplied": "Just now", # Simpler date handling
        "status": "Applied"
    }
    
    current_log = app.get('workLog', [])
    store.update(app['id'], {"workLog": [log_entry] + current_log})
    return {"success": True, "log": log_entry}

class AdminAction(BaseModel):
    id: str
    action: str

@app.patch("/api/v1/admin")
def admin_action(req: AdminAction):
    app = store.get(req.id)
    if not app:
        return {"error": "App not found"}
        
    updates = {}
    if req.action == 'approve':
        next_step = min(app['step'] + 1, 3)
        updates['step'] = next_step
        
        if next_step == 1:
            updates.update({"status": "Under Review", "progress": 33})
            app['notifications'].append({"id": int(time.time()), "message": "Your application is being reviewed.", "type": "info"})
        elif next_step == 2:
             updates.update({"status": "Determination Pending", "progress": 66})
             app['notifications'].append({"id": int(time.time()), "message": "Determination pending.", "type": "info"})
        elif next_step == 3:
             updates.update({"status": "Payment Issued", "progress": 100})
             app['notifications'].append({"id": int(time.time()), "message": "Payment authorized.", "type": "success"})
        
    store.update(req.id, updates)
    return store.get(req.id)


# Job title suggestions with related careers
JOB_CAREER_MAP = {
    # Tech
    "software": ["Software Engineer", "Software Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Web Developer", "Mobile Developer", "DevOps Engineer"],
    "developer": ["Software Developer", "Web Developer", "Full Stack Developer", "Application Developer", "Junior Developer", "Senior Developer", "Lead Developer"],
    "engineer": ["Software Engineer", "Data Engineer", "DevOps Engineer", "QA Engineer", "Systems Engineer", "Cloud Engineer", "Machine Learning Engineer"],
    "data": ["Data Analyst", "Data Scientist", "Data Engineer", "Business Intelligence Analyst", "Analytics Manager", "Database Administrator"],
    "analyst": ["Data Analyst", "Business Analyst", "Financial Analyst", "Systems Analyst", "Research Analyst", "Operations Analyst"],
    "product": ["Product Manager", "Product Owner", "Product Designer", "UX Designer", "Project Manager", "Program Manager"],
    "design": ["UX Designer", "UI Designer", "Graphic Designer", "Product Designer", "Web Designer", "Visual Designer"],
    "manager": ["Project Manager", "Product Manager", "Account Manager", "Operations Manager", "HR Manager", "Marketing Manager"],
    
    # Healthcare
    "nurse": ["Registered Nurse", "Licensed Practical Nurse", "Nurse Practitioner", "Clinical Nurse", "Travel Nurse", "Home Health Aide"],
    "medical": ["Medical Assistant", "Medical Technician", "Medical Receptionist", "Phlebotomist", "Lab Technician", "Medical Coder"],
    "healthcare": ["Healthcare Administrator", "Medical Assistant", "Patient Care Technician", "Health Coach", "Care Coordinator"],
    
    # Business
    "sales": ["Sales Representative", "Account Executive", "Sales Manager", "Business Development", "Inside Sales", "Retail Sales Associate"],
    "marketing": ["Marketing Manager", "Digital Marketing", "Content Marketing", "Social Media Manager", "SEO Specialist", "Marketing Coordinator"],
    "finance": ["Financial Analyst", "Accountant", "Bookkeeper", "Financial Advisor", "Tax Preparer", "Auditor"],
    "accounting": ["Accountant", "Bookkeeper", "Tax Accountant", "Staff Accountant", "Accounts Payable", "Accounts Receivable"],
    "hr": ["HR Manager", "HR Coordinator", "Recruiter", "Talent Acquisition", "HR Generalist", "Payroll Specialist"],
    "admin": ["Administrative Assistant", "Office Manager", "Executive Assistant", "Receptionist", "Office Coordinator", "Data Entry"],
    
    # Service/Retail
    "customer": ["Customer Service Rep", "Customer Success Manager", "Call Center Agent", "Client Relations", "Help Desk Support"],
    "retail": ["Retail Sales Associate", "Store Manager", "Cashier", "Merchandiser", "Stock Associate", "Assistant Manager"],
    "food": ["Server", "Cook", "Chef", "Kitchen Manager", "Bartender", "Food Service Worker", "Restaurant Manager"],
    "warehouse": ["Warehouse Associate", "Forklift Operator", "Shipping/Receiving", "Inventory Specialist", "Logistics Coordinator"],
    "driver": ["Delivery Driver", "CDL Driver", "Truck Driver", "Courier", "Route Driver", "Transport Driver"],
    
    # Skilled Trades
    "electrician": ["Electrician", "Electrical Apprentice", "Maintenance Electrician", "Industrial Electrician"],
    "mechanic": ["Auto Mechanic", "Diesel Mechanic", "Maintenance Technician", "HVAC Technician"],
    "construction": ["Construction Worker", "Carpenter", "Plumber", "Welder", "General Laborer", "Superintendent"],
}

@app.get("/api/v1/suggest-jobs")
def suggest_jobs(query: str = ""):
    """Returns AI-powered job title suggestions using Groq LLM"""
    q = query.strip()
    
    if not q:
        return {
            "suggestions": ["Software Developer", "Data Analyst", "Project Manager", "Sales Representative", "Administrative Assistant"],
            "related": ["Customer Service", "Marketing", "Healthcare", "Finance", "Retail"],
            "alternatives": [],
            "tip": "Enter a job title or skill to get AI-powered suggestions"
        }
    
    groq_api_key = os.environ.get("GROQ_API_KEY")
    
    # Try Groq LLM first
    if groq_api_key:
        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a career advisor. Given a job title or skill, suggest related job titles. Respond ONLY with a JSON object in this exact format: {\"suggestions\": [\"Job 1\", \"Job 2\", ...], \"related\": [\"Related 1\", \"Related 2\", ...], \"alternatives\": [\"Alt 1\", \"Alt 2\", ...], \"tip\": \"Helpful tip\"}. Suggestions are direct matches, related are similar roles, alternatives are career pivots. Each array should have 5 items max."
                        },
                        {
                            "role": "user",
                            "content": f"Suggest job titles for someone searching for: {q}"
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 500
                },
                timeout=5
            )
            
            if response.ok:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                # Parse JSON from response
                # Find JSON in response
                start = content.find("{")
                end = content.rfind("}") + 1
                if start >= 0 and end > start:
                    result = json.loads(content[start:end])
                    result["ai_powered"] = True
                    return result
        except Exception as e:
            print(f"Groq API error: {e}")
    
    # Fallback to career mapping
    q_lower = q.lower()
    suggestions = []
    related = []
    
    for keyword, titles in JOB_CAREER_MAP.items():
        if keyword in q_lower or q_lower in keyword:
            suggestions.extend(titles)
        elif any(q_lower in t.lower() for t in titles):
            suggestions.extend([t for t in titles if q_lower in t.lower()])
            related.extend([t for t in titles if q_lower not in t.lower()][:3])
    
    # Generate alternatives
    career_alternatives = []
    if any(k in q_lower for k in ["tech", "software", "developer", "engineer"]):
        career_alternatives = ["Product Manager", "Data Analyst", "UX Designer", "Technical Writer", "IT Support"]
    elif any(k in q_lower for k in ["nurse", "medical", "health"]):
        career_alternatives = ["Medical Assistant", "Health Coach", "Pharmacy Tech", "Medical Coder", "Healthcare Admin"]
    elif any(k in q_lower for k in ["sales", "marketing"]):
        career_alternatives = ["Customer Success", "Account Manager", "Business Development", "Event Coordinator"]
    elif any(k in q_lower for k in ["admin", "office"]):
        career_alternatives = ["Project Coordinator", "HR Assistant", "Bookkeeper", "Office Manager"]
    else:
        career_alternatives = ["Project Manager", "Customer Service", "Data Entry", "Sales Associate"]
    
    # Dedupe
    seen = set()
    unique = [s for s in suggestions if not (s.lower() in seen or seen.add(s.lower()))]
    
    return {
        "suggestions": unique[:8],
        "related": list(set(related))[:5],
        "alternatives": career_alternatives[:5],
        "tip": f"Showing jobs related to '{q}'. Add GROQ_API_KEY for AI suggestions!",
        "ai_powered": False
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
