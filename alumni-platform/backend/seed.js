const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Opportunity = require("./models/Opportunity");

async function seedDemo() {
  const demo = [
    // Admin
    { email: process.env.ADMIN_EMAIL || "admin@alumni.edu", password: process.env.ADMIN_PASSWORD || "admin123", name: "Platform Admin", role: "admin", industry: "Administration" },

    // Students
    { email: "student1@alumni.edu", password: "student123", name: "Ava Patel", role: "student", bio: "Junior CS student passionate about ML and building products that matter.", skills: ["Python", "React", "ML"], industry: "Technology", graduation_year: 2027 },
    { email: "student2@alumni.edu", password: "student123", name: "Marcus Lee", role: "student", bio: "Sophomore studying finance & economics with a focus on emerging markets.", skills: ["Excel", "SQL", "Finance"], industry: "Finance", graduation_year: 2028 },
    { email: "student3@alumni.edu", password: "student123", name: "Zara Ahmed", role: "student", bio: "Pre-med student interested in global health policy and biotech startups.", skills: ["Research", "Biology", "Data Analysis"], industry: "Healthcare", graduation_year: 2026 },
    { email: "student4@alumni.edu", password: "student123", name: "Liam Chen", role: "student", bio: "Computer science junior building open-source developer tools in my spare time.", skills: ["TypeScript", "Rust", "Node.js"], industry: "Technology", graduation_year: 2027 },
    { email: "student5@alumni.edu", password: "student123", name: "Sofia Rivera", role: "student", bio: "Environmental studies major advocating for sustainable urban infrastructure.", skills: ["GIS", "Policy Writing", "Research"], industry: "Environmental", graduation_year: 2026 },
    { email: "student6@alumni.edu", password: "student123", name: "Noah Kim", role: "student", bio: "Journalism and poli-sci double major with a love for investigative reporting.", skills: ["Writing", "Interviewing", "Fact-Checking"], industry: "Media", graduation_year: 2028 },
    { email: "student7@alumni.edu", password: "student123", name: "Priya Nair", role: "student", bio: "Architecture student exploring the intersection of design and social equity.", skills: ["AutoCAD", "SketchUp", "Urban Design"], industry: "Architecture", graduation_year: 2027 },
    { email: "student8@alumni.edu", password: "student123", name: "Ethan Brooks", role: "student", bio: "Economics major interested in international trade policy and development economics.", skills: ["Stata", "R", "Economics"], industry: "Finance", graduation_year: 2026 },

    // Alumni
    { email: "alumni1@alumni.edu", password: "alumni123", name: "Dr. Elena Ruiz", role: "alumni", bio: "Senior ML Engineer at a leading AI lab. I love mentoring students breaking into the field.", skills: ["Machine Learning", "Python", "Leadership"], industry: "Technology", experience: "10+ years in AI/ML at Google Brain and OpenAI.", graduation_year: 2015 },
    { email: "alumni2@alumni.edu", password: "alumni123", name: "Jordan Okafor", role: "alumni", bio: "IB turned VC. I help founders navigate fundraising and build high-performance teams.", skills: ["Venture Capital", "Finance", "Fundraising"], industry: "Finance", experience: "12+ years across Goldman Sachs and Sequoia Capital.", graduation_year: 2012 },
    { email: "alumni3@alumni.edu", password: "alumni123", name: "Priya Chen", role: "alumni", bio: "Product Design Lead. I craft experiences that balance beauty and functionality.", skills: ["Product Design", "UX Research", "Figma"], industry: "Design", experience: "7 years at Airbnb and Stripe.", graduation_year: 2018 },
    { email: "alumni4@alumni.edu", password: "alumni123", name: "Dr. Samuel Adeyemi", role: "alumni", bio: "Physician-scientist researching immunotherapy. Former NIH fellow, now at UCSF.", skills: ["Clinical Research", "Immunology", "Grant Writing"], industry: "Healthcare", experience: "8 years in academic medicine and biotech.", graduation_year: 2016 },
    { email: "alumni5@alumni.edu", password: "alumni123", name: "Mei-Ling Zhang", role: "alumni", bio: "Engineering manager at a Fortune 500. I help engineers grow into technical leaders.", skills: ["Engineering Management", "Java", "System Design"], industry: "Technology", experience: "9 years, currently EM at Amazon.", graduation_year: 2015 },
    { email: "alumni6@alumni.edu", password: "alumni123", name: "Carlos Mendez", role: "alumni", bio: "Co-founder of two startups. One exit, one still growing. Happy to talk entrepreneurship.", skills: ["Entrepreneurship", "Product Strategy", "Sales"], industry: "Technology", experience: "Serial founder. First startup acquired in 2021.", graduation_year: 2013 },
    { email: "alumni7@alumni.edu", password: "alumni123", name: "Aisha Williams", role: "alumni", bio: "Environmental lawyer working on climate litigation and green energy policy at the federal level.", skills: ["Environmental Law", "Policy", "Litigation"], industry: "Law", experience: "6 years at the EPA and now in private practice.", graduation_year: 2019 },
    { email: "alumni8@alumni.edu", password: "alumni123", name: "Tom Nakamura", role: "alumni", bio: "Data journalist at The Atlantic. I bridge the gap between complex data and compelling stories.", skills: ["Data Journalism", "D3.js", "Investigative Reporting"], industry: "Media", experience: "5 years covering tech and science at national publications.", graduation_year: 2020 },
    { email: "alumni9@alumni.edu", password: "alumni123", name: "Rachel Kim", role: "alumni", bio: "Brand strategist helping mission-driven companies find their voice and grow their audience.", skills: ["Brand Strategy", "Copywriting", "Marketing"], industry: "Marketing", experience: "8 years. Past clients include IDEO and Patagonia.", graduation_year: 2017 },
    { email: "alumni10@alumni.edu", password: "alumni123", name: "David Osei", role: "alumni", bio: "Urban planner and architect focused on affordable housing in mid-sized American cities.", skills: ["Urban Planning", "AutoCAD", "Community Engagement"], industry: "Architecture", experience: "7 years at the NYC Department of City Planning.", graduation_year: 2018 },
    { email: "alumni11@alumni.edu", password: "alumni123", name: "Natasha Ivanova", role: "alumni", bio: "Cybersecurity researcher. I break things so the bad guys can't. Speaker at DEF CON.", skills: ["Penetration Testing", "Python", "Network Security"], industry: "Technology", experience: "8 years in offensive security at CrowdStrike.", graduation_year: 2016 },
    { email: "alumni12@alumni.edu", password: "alumni123", name: "James Okonkwo", role: "alumni", bio: "Investment banker turned impact investor. Now running a fund focused on African fintech.", skills: ["Investment Banking", "M&A", "Impact Investing"], industry: "Finance", experience: "10 years. $500M+ in transactions closed.", graduation_year: 2014 },
  ];

  for (const u of demo) {
    if (await User.findOne({ email: u.email })) continue;
    await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
    console.log("Seeded:", u.email);
  }

  if ((await Opportunity.countDocuments()) === 0) {
    const alum1 = await User.findOne({ email: "alumni1@alumni.edu" });
    const alum2 = await User.findOne({ email: "alumni2@alumni.edu" });
    const alum3 = await User.findOne({ email: "alumni3@alumni.edu" });
    const alum6 = await User.findOne({ email: "alumni6@alumni.edu" });
    const alum8 = await User.findOne({ email: "alumni8@alumni.edu" });

    const ops = [];
    if (alum1) ops.push(
      { title: "ML Engineer Intern", description: "Work on recommendation systems powering millions of users. Strong Python and ML fundamentals required.", company: "Nova AI Labs", location: "Remote", job_type: "Internship", link: "https://example.com/apply", postedBy: alum1._id, postedByName: alum1.name },
      { title: "AI Research Assistant", description: "Support LLM fine-tuning research. Looking for grad students or advanced undergrads with transformer knowledge.", company: "Nova AI Labs", location: "San Francisco, CA", job_type: "Part-time", link: "https://example.com/apply", postedBy: alum1._id, postedByName: alum1.name }
    );
    if (alum2) ops.push(
      { title: "Junior Analyst", description: "Quantitative research role in our graduate program. Exposure to early-stage deal flow and portfolio companies.", company: "Keystone Capital", location: "New York, NY", job_type: "Full-time", link: "https://example.com/apply", postedBy: alum2._id, postedByName: alum2.name },
      { title: "VC Fellow — Summer", description: "10-week fellowship. Source deals, write memos, sit in on partner meetings.", company: "Keystone Capital", location: "New York, NY", job_type: "Internship", link: "https://example.com/apply", postedBy: alum2._id, postedByName: alum2.name }
    );
    if (alum3) ops.push(
      { title: "Product Design Intern", description: "Join our team redesigning our flagship consumer product. Figma proficiency required.", company: "Mosaic Studio", location: "San Francisco, CA", job_type: "Internship", link: "https://example.com/apply", postedBy: alum3._id, postedByName: alum3.name }
    );
    if (alum6) ops.push(
      { title: "Founding Engineer", description: "Early-stage startup building climate data infrastructure. Equity-heavy comp. Looking for generalists who ship fast.", company: "Terrapin Systems", location: "Remote", job_type: "Full-time", link: "https://example.com/apply", postedBy: alum6._id, postedByName: alum6.name }
    );
    if (alum8) ops.push(
      { title: "Editorial Fellow — Data & Tech", description: "Paid fellowship for student journalists. Pitch and report data-driven stories on AI and society.", company: "The Atlantic", location: "Washington, DC", job_type: "Fellowship", link: "https://example.com/apply", postedBy: alum8._id, postedByName: alum8.name }
    );

    if (ops.length) await Opportunity.insertMany(ops);
  }
}

module.exports = { seedDemo };