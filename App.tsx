import { useState, useEffect } from "react";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { AdminDashboard } from "./components/AdminDashboard";
import {
  Smartphone,
  Palette,
  Users,
  Code,
  Lightbulb,
  Target,
  Github,
  Instagram,
  MessageCircle,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Rocket,
  Zap,
  Server,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import {
  projectId,
  publicAnonKey,
} from "./utils/supabase/info";

// Icon mapping for team members
const iconMap = {
  Code,
  Server,
  Smartphone,
  Brain,
  Palette,
  Users,
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: keyof typeof iconMap;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  status: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<
    "main" | "admin"
  >("main");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] =
    useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] =
    useState(false);

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const ADMIN_PASSWORD = "0267661515";

  const services = [
    {
      icon: Code,
      title: "App Development",
      description:
        "Building cutting-edge mobile and web applications",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Creating beautiful and intuitive user experiences",
    },
    {
      icon: Users,
      title: "Leadership Training",
      description:
        "Developing future tech leaders and innovators",
    },
    {
      icon: Target,
      title: "Project Collaboration",
      description:
        "Working together on impactful tech solutions",
    },
    {
      icon: Lightbulb,
      title: "Mentorship",
      description:
        "Guiding students through their tech journey",
    },
    {
      icon: Sparkles,
      title: "Research & Innovation",
      description:
        "Exploring new technologies and possibilities",
    },
  ];

  // Handle admin button click
  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentView("admin");
    } else {
      setShowPasswordDialog(true);
      setPassword("");
      setPasswordError("");
    }
  };

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setPasswordError("");

    // Simulate authentication delay for security
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      setCurrentView("admin");
      setPassword("");
    } else {
      setPasswordError("Incorrect password. Access denied.");
      setPassword("");
    }

    setIsAuthenticating(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("main");
  };

  // Check for admin access via URL params (for existing functionality)
  useEffect(() => {
    const urlParams = new URLSearchParams(
      window.location.search,
    );
    if (urlParams.get("admin") === "true") {
      setShowPasswordDialog(true);
    }
  }, []);

  // Fetch team members from backend
  useEffect(() => {
    if (currentView === "main") {
      const fetchTeam = async () => {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-7cb901af/team`,
            {
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setTeam(data.team);
          } else {
            console.error("Failed to fetch team members");
          }
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      };

      fetchTeam();
    }
  }, [currentView]);

  // Fetch projects from backend
  useEffect(() => {
    if (currentView === "main") {
      const fetchProjects = async () => {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-7cb901af/projects`,
            {
              headers: {
                Authorization: `Bearer ${publicAnonKey}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects);
          } else {
            console.error("Failed to fetch projects");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };

      fetchProjects();
    }
  }, [currentView]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7cb901af/contact`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(result.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.error || "Failed to send message",
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show admin dashboard if authenticated
  if (currentView === "admin" && isAuthenticated) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Lock className="w-4 h-4 mr-1" />
            Logout
          </Button>
          <Button
            onClick={() => setCurrentView("main")}
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            ← Back to Website
          </Button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      >
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Lock className="w-5 h-5" />
              Admin Access Required
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the admin password to access the dashboard.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="adminPassword"
                className="text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-input border-border/50 pr-10"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center">
                <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                <span className="text-destructive text-sm">
                  {passwordError}
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
                className="flex-1"
                disabled={isAuthenticating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isAuthenticating || !password}
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Access Admin
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Access Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleAdminClick}
          variant="outline"
          size="sm"
          className="border-accent/30 text-accent hover:bg-accent/10 opacity-20 hover:opacity-100 transition-opacity"
        >
          <Settings className="w-4 h-4 mr-1" />
          Admin
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-muted">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-neon-lime/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8 animate-float">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              Student Innovation Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              We Are Campundzsbra
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Student innovators, leaders, and builders of the
              future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg animate-glow transition-all duration-300 hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              Join the Club
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
            >
              <Rocket className="w-5 h-5 mr-2" />
              See Our Work
            </Button>
          </div>

          <div className="mt-16 text-muted-foreground">
            <p className="text-sm uppercase tracking-wider mb-2">
              Trusted by students at
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <span>Computer Science</span>
              <span>•</span>
              <span>Engineering</span>
              <span>•</span>
              <span>Design</span>
              <span>•</span>
              <span>Business</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
              About Campundzsbra
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Innovation Through Collaboration
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're a student-led community that bridges the gap
              between academic learning and real-world
              innovation. Our mission is to empower students to
              build, learn, and lead in the ever-evolving tech
              landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors duration-300">
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Our Mission
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  To foster a collaborative environment where
                  students from all departments can come
                  together to innovate, learn, and create
                  solutions that matter. We believe in the power
                  of diverse perspectives and the magic that
                  happens when great minds work together.
                </p>
                <blockquote className="border-l-4 border-accent pl-6 italic text-accent">
                  "Follow well. Lead better. Build together."
                </blockquote>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-primary/10 border-primary/20 hover:bg-primary/15 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <Users className="w-6 h-6 text-primary mr-3" />
                  <h4 className="font-semibold">Leadership</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Developing the next generation of tech leaders
                  through mentorship and hands-on experience.
                </p>
              </Card>

              <Card className="p-6 bg-accent/10 border-accent/20 hover:bg-accent/15 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-accent mr-3" />
                  <h4 className="font-semibold">Honesty</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Building trust through transparent
                  communication and ethical practices in all our
                  projects.
                </p>
              </Card>

              <Card className="p-6 bg-neon-lime/10 border-neon-lime/20 hover:bg-neon-lime/15 transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-6 h-6 text-neon-lime mr-3" />
                  <h4 className="font-semibold">Innovation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pushing boundaries and exploring new
                  technologies to create impactful solutions.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              What We Do
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Building Tomorrow's Tech
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From ideation to implementation, we cover every
              aspect of the tech development lifecycle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
              Featured Projects
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Innovation in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Check out some of our latest projects that
              showcase our commitment to building impactful
              solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-lime/20 text-neon-lime border-neon-lime/30">
              Meet the Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Innovators Behind the Magic
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the passionate students driving our mission
              forward and shaping the future of technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const IconComponent = iconMap[member.icon];
              return (
                <Card
                  key={index}
                  className="p-6 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:border-neon-lime/30 hover:shadow-lg hover:shadow-neon-lime/10 transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-neon-lime/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-neon-lime/30">
                      <IconComponent className="w-10 h-10 text-neon-lime" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-neon-lime transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {member.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Contact Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're looking to join our team,
              collaborate on a project, or just want to say
              hello, we'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Get in Touch
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">
                      hello@campundzsbra.club
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground text-sm">
                      Innovation Center, Campus
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">
                  Connect with us
                </h4>
                <div className="flex space-x-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent/10"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10"
                    onClick={() =>
                      window.open(
                        "https://wa.me/233544089673?text=Hello! I'm interested in learning more about Campundzsbra Tech Club.",
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-xl font-semibold mb-6">
                Send us a Message
              </h3>

              {/* Status messages */}
              {submitStatus === "success" && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-500 text-sm">
                    {submitMessage}
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-500 text-sm">
                    {submitMessage}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="bg-input border-border/50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-input border-border/50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project or how you'd like to get involved..."
                    className="bg-input border-border/50 min-h-[100px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Campundzsbra Tech Club. Building the future,
            one project at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}