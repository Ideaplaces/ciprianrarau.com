import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // For now, we'll implement a simple redirect to the CV page with print CSS
  // In a production environment, you would use a library like Puppeteer or Playwright
  // to generate a proper PDF server-side
  
  // Since we can't install new dependencies without npm working properly,
  // we'll create a clean HTML version optimized for PDF generation
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ciprian (Chip) Rarau - CV</title>
  <style>
    @page {
      size: letter;
      margin: 0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      font-size: 11pt;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv-container {
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
      display: flex;
    }

    .main-content {
      flex: 1;
      padding: 0.5in;
      background: white;
    }

    .sidebar {
      width: 3in;
      background: #0891B2;
      color: white;
      padding: 0.5in;
    }

    /* Header Styles */
    .profile-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .profile-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto 15px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      display: block;
      object-fit: cover;
    }

    .name {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .tagline {
      font-size: 13px;
      opacity: 0.9;
    }

    /* Section Styles */
    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #E2E8F0;
      color: #4A5568;
    }

    .sidebar .section-title {
      border-bottom-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    /* Contact Info */
    .contact-item {
      font-size: 12px;
      margin-bottom: 8px;
      opacity: 0.95;
    }

    /* Job Entries */
    .job-entry {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #E2E8F0;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .job-title {
      font-size: 14px;
      font-weight: 600;
      color: #2D3748;
    }

    .job-date {
      font-size: 11px;
      color: #718096;
    }

    .job-company {
      font-size: 12px;
      color: #0891B2;
      margin-bottom: 8px;
    }

    .job-description {
      font-size: 11px;
      color: #4A5568;
      text-align: justify;
    }

    /* Lists */
    ul {
      padding-left: 20px;
      margin: 10px 0;
    }

    li {
      font-size: 11px;
      margin-bottom: 4px;
    }

    /* Skills */
    .skill-category {
      margin-bottom: 15px;
    }

    .skill-title {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 5px;
      opacity: 0.95;
    }

    .skill-list {
      font-size: 11px;
      opacity: 0.85;
    }

    /* Education */
    .education-item {
      margin-bottom: 15px;
    }

    .degree {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .institution {
      font-size: 11px;
      opacity: 0.9;
    }

    .education-date {
      font-size: 10px;
      opacity: 0.8;
    }

    /* Ensure everything fits on one page */
    @media print {
      body {
        margin: 0;
      }
      .cv-container {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="main-content">
      <section class="section">
        <h2 class="section-title">CAREER PROFILE</h2>
        <p style="font-size: 11px; margin-bottom: 10px;">
          I am an entrepreneur and technologist with a deep passion for the intersection of software and business. 
          I'm a systems thinker who thrives on building innovative technology solutions that create real value. 
          My expertise spans the entire technology stack - from infrastructure and architecture to product development and business strategy.
        </p>
        <p style="font-size: 11px; margin-bottom: 10px;">
          I have a proven track record of building businesses from scratch:
        </p>
        <ul style="font-size: 11px;">
          <li><strong>WISK.ai (Co-Founder/CTO/CPO)</strong> - Built and scaled from 0 to 1,000 customers, bootstrapped then raised $3 million and achieved profitability.</li>
          <li><strong>At OMsignal (CTO & 1st employee)</strong> (acquired by Honeywell), I helped raise $10 million.</li>
          <li><strong>IdeaPlaces (Solo Founder)</strong> achieved 25,000 downloads and was featured by Evernote.</li>
          <li>Served as <strong>fractional CTO for 5 venture-backed businesses</strong>.</li>
        </ul>
      </section>

      <section class="section">
        <h2 class="section-title">EXPERIENCES</h2>
        
        <div class="job-entry">
          <div class="job-header">
            <h3 class="job-title">CTO/CPO</h3>
            <span class="job-date">Jan 2025 - Present</span>
          </div>
          <div class="job-company">Mentorly, Remote</div>
          <div class="job-description">
            Leading all technology initiatives for enterprise mentorship platform. Managing end-to-end platform development including backend, infrastructure, AI systems, and internal tools.
          </div>
        </div>

        <div class="job-entry">
          <div class="job-header">
            <h3 class="job-title">Technical Advisor</h3>
            <span class="job-date">Apr 2025 - Present</span>
          </div>
          <div class="job-company">Eli Health, Remote</div>
          <div class="job-description">
            Leading tech strategy for health tech startup measuring hormonal biomarkers. Architecting mobile backend infrastructure with secure health data handling.
          </div>
        </div>

        <div class="job-entry">
          <div class="job-header">
            <h3 class="job-title">CTO/CPO, Co-Founder</h3>
            <span class="job-date">2016 - Jan 2025</span>
          </div>
          <div class="job-company">WISK.ai, Montreal → Remote</div>
          <div class="job-description">
            Built product from zero to 1,000+ clients. Scaled development team to 10 members. Raised $3M and achieved profitability. 
            Developed microservices architecture supporting offline and real-time operations for hospitality sector.
          </div>
        </div>

        <div class="job-entry">
          <div class="job-header">
            <h3 class="job-title">Co-Founder</h3>
            <span class="job-date">Jan 2024 - Present</span>
          </div>
          <div class="job-company">WeHappers.org - non profit</div>
          <div class="job-description">
            Reshaping wealth distribution through technology initiatives. Building platforms for NPOs and measuring happiness impact.
          </div>
        </div>

        <div class="job-entry">
          <div class="job-header">
            <h3 class="job-title">Previous Experience</h3>
          </div>
          <div class="job-description">
            <strong>Venture Developer</strong> at CatalyzeUp (2017-Present) • 
            <strong>Fractional CTO</strong> at Alvéole (2023-2024) • 
            <strong>Fractional CTO</strong> at XpertSea (2021-2024) • 
            <strong>Head of Mobile</strong> at Eastern Bank (2015-2016) • 
            <strong>Solo Founder</strong> at IdeaPlaces (2014-2016) • 
            <strong>VP Engineering</strong> at OMsignal (2012-2014) • 
            <strong>Lead R&D</strong> at Aptilon (2010-2012) • 
            <strong>Senior Java Developer</strong> at Coradiant (2006-2010)
          </div>
        </div>
      </section>
    </div>

    <aside class="sidebar">
      <div class="profile-header">
        <img src="https://ciprianrarau.com/images/profile-chip.jpg" alt="Ciprian Rarau" class="profile-photo" />
        <h1 class="name">Ciprian (Chip) Rarau</h1>
        <p class="tagline">Entrepreneur & Founder & CTO & CPO</p>
      </div>

      <section class="section">
        <div class="contact-item">📧 chip@ciprianrarau.com</div>
        <div class="contact-item">📱 514-560-5016</div>
        <div class="contact-item">🌐 ciprianrarau.com</div>
        <div class="contact-item">💼 linkedin.com/in/ciprianrarau</div>
        <div class="contact-item">💻 github.com/crarau</div>
        <div class="contact-item">📅 cal.com/ciprianrarau/45-min</div>
      </section>

      <section class="section">
        <h3 class="section-title">EDUCATION</h3>
        <div class="education-item">
          <div class="degree">Bachelor in Computer Science Engineering</div>
          <div class="institution">Technical University of Cluj-Napoca</div>
          <div class="education-date">1998 - 2003</div>
        </div>
        <div class="education-item">
          <div class="degree">Computer Science</div>
          <div class="institution">High School of Computer Science</div>
          <div class="education-date">1994 - 1998</div>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">LANGUAGES</h3>
        <div style="font-size: 12px;">
          <div>English (Professional)</div>
          <div>French (Professional)</div>
          <div>Romanian (Native)</div>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">TECHNICAL SKILLS</h3>
        <div class="skill-category">
          <div class="skill-title">Languages & Frameworks</div>
          <div class="skill-list">
            Python, TypeScript, JavaScript, Ruby, Java, Kotlin, Swift, PHP, Go, 
            React, Vue.js, Angular, Node.js, Django, Flask, Rails
          </div>
        </div>
        <div class="skill-category">
          <div class="skill-title">Infrastructure & DevOps</div>
          <div class="skill-list">
            GCP, AWS, Terraform, Ansible, Docker, Kubernetes, 
            PostgreSQL, MySQL, MongoDB, Redis, BigQuery
          </div>
        </div>
        <div class="skill-category">
          <div class="skill-title">Specializations</div>
          <div class="skill-list">
            AI/ML Integration, LLMs, Microservices, Real-time Systems, 
            Mobile Development, Data Analytics
          </div>
        </div>
      </section>

      <section class="section">
        <h3 class="section-title">INTERESTS</h3>
        <div style="font-size: 12px;">
          <div>AI & Large Language Models</div>
          <div>System Architecture</div>
          <div>Business Process Optimization</div>
          <div>Yoga & Meditation</div>
          <div>Psychology</div>
          <div>Nature</div>
        </div>
      </section>
    </aside>
  </div>
</body>
</html>`;

  // Return the HTML with proper headers to trigger download
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': 'attachment; filename="Ciprian_Rarau_CV.html"',
    },
  });
};