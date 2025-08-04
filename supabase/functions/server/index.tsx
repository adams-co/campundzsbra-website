import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7cb901af/health", (c) => {
  return c.json({ status: "ok" });
});

// Submit contact form
app.post("/make-server-7cb901af/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Store contact submission with timestamp
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const submission = {
      id: submissionId,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      status: "new"
    };

    await kv.set(submissionId, submission);

    console.log(`Contact form submission received: ${submissionId} from ${email}`);

    return c.json({ 
      success: true, 
      message: "Thank you for your message! We'll get back to you soon.",
      submissionId 
    });

  } catch (error) {
    console.log(`Error processing contact form: ${error}`);
    return c.json({ error: "Internal server error while processing contact form" }, 500);
  }
});

// Get all contact submissions (for admin use)
app.get("/make-server-7cb901af/contacts", async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact_");
    const sortedContacts = contacts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ contacts: sortedContacts });
  } catch (error) {
    console.log(`Error fetching contacts: ${error}`);
    return c.json({ error: "Internal server error while fetching contacts" }, 500);
  }
});

// Get team members
app.get("/make-server-7cb901af/team", async (c) => {
  try {
    const teamMembers = [
      {
        id: "daniel",
        name: "Daniel",
        role: "Frontend Lead",
        description: "React & UI/UX specialist",
        icon: "Code"
      },
      {
        id: "micheal",
        name: "Micheal",
        role: "Backend Architect",
        description: "Node.js & cloud expert",
        icon: "Server"
      },
      {
        id: "eyeboy",
        name: "Eyeboy",
        role: "Mobile Developer",
        description: "React Native & iOS guru",
        icon: "Smartphone"
      },
      {
        id: "adams",
        name: "Adams",
        role: "AI/ML Researcher",
        description: "Machine learning enthusiast",
        icon: "Brain"
      },
      {
        id: "wisdom",
        name: "Wisdom",
        role: "UI/UX Designer",
        description: "Design systems architect",
        icon: "Palette"
      },
      {
        id: "jessica",
        name: "Jessica",
        role: "Project Manager",
        description: "Agile & innovation leader",
        icon: "Users"
      }
    ];

    // Store team data in KV for future updates
    await kv.set("team_members", teamMembers);

    return c.json({ team: teamMembers });
  } catch (error) {
    console.log(`Error fetching team members: ${error}`);
    return c.json({ error: "Internal server error while fetching team members" }, 500);
  }
});

// Store project data
app.post("/make-server-7cb901af/projects", async (c) => {
  try {
    const projects = [
      {
        id: "edutracker",
        title: "EduTracker Pro",
        description: "Smart student management system with AI-powered analytics and real-time progress tracking.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        tech: ["React", "Node.js", "AI/ML"],
        status: "active"
      },
      {
        id: "campusconnect",
        title: "CampusConnect",
        description: "Social networking platform connecting students across departments for collaboration.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
        tech: ["React Native", "Firebase", "WebRTC"],
        status: "active"
      },
      {
        id: "innovatelab",
        title: "InnovateLab VR",
        description: "Virtual reality application for immersive learning experiences in engineering.",
        image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=400&fit=crop",
        tech: ["Unity", "C#", "VR SDK"],
        status: "active"
      }
    ];

    await kv.set("featured_projects", projects);
    
    return c.json({ 
      success: true, 
      message: "Projects data stored successfully",
      projects 
    });
  } catch (error) {
    console.log(`Error storing projects: ${error}`);
    return c.json({ error: "Internal server error while storing projects" }, 500);
  }
});

// Get projects
app.get("/make-server-7cb901af/projects", async (c) => {
  try {
    const projects = await kv.get("featured_projects");
    
    if (!projects) {
      // Return default projects if none stored
      const defaultProjects = [
        {
          id: "edutracker",
          title: "EduTracker Pro",
          description: "Smart student management system with AI-powered analytics and real-time progress tracking.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
          tech: ["React", "Node.js", "AI/ML"],
          status: "active"
        },
        {
          id: "campusconnect",
          title: "CampusConnect",
          description: "Social networking platform connecting students across departments for collaboration.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
          tech: ["React Native", "Firebase", "WebRTC"],
          status: "active"
        },
        {
          id: "innovatelab",
          title: "InnovateLab VR",
          description: "Virtual reality application for immersive learning experiences in engineering.",
          image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=400&fit=crop",
          tech: ["Unity", "C#", "VR SDK"],
          status: "active"
        }
      ];
      return c.json({ projects: defaultProjects });
    }
    
    return c.json({ projects });
  } catch (error) {
    console.log(`Error fetching projects: ${error}`);
    return c.json({ error: "Internal server error while fetching projects" }, 500);
  }
});

Deno.serve(app.fetch);