import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Mail,
  User,
  Clock,
  MessageSquare,
  RefreshCw,
  Download,
  Eye
} from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: string;
}

export function AdminDashboard() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contact submissions
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7cb901af/contacts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        setError('Failed to fetch contact submissions');
      }
    } catch (err) {
      setError('Error fetching contact submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Format date for display
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Export contacts to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Message', 'Timestamp', 'Status'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.id,
        `"${contact.name}"`,
        contact.email,
        `"${contact.message.replace(/"/g, '""')}"`,
        contact.timestamp,
        contact.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campundzsbra-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage contact form submissions and club data</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-primary">{contacts.length}</p>
              </div>
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Messages</p>
                <p className="text-2xl font-bold text-accent">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Latest Submission</p>
                <p className="text-sm font-medium text-neon-lime">
                  {contacts.length > 0 ? 
                    new Date(contacts[0]?.timestamp).toLocaleDateString() : 
                    'No submissions'
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-neon-lime" />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            onClick={fetchContacts} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>

          <Button 
            onClick={exportToCSV}
            variant="outline"
            disabled={contacts.length === 0}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {/* Contact Submissions List */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">Contact Submissions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              All messages submitted through the contact form
            </p>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="p-6">
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact submissions yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {contacts.map((contact, index) => (
                    <Card key={contact.id} className="p-6 bg-secondary/30 border-border/30 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={contact.status === 'new' ? 'default' : 'secondary'}
                            className={contact.status === 'new' ? 'bg-accent text-accent-foreground' : ''}
                          >
                            {contact.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(contact.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{contact.message}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-muted-foreground">
                          ID: {contact.id}
                        </p>
                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 p-6 bg-muted/30 border-border/50">
          <h3 className="font-semibold mb-3">📊 Data Storage Information</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Database:</strong> All contact submissions are stored in your Supabase database</p>
            <p>• <strong>Table:</strong> Data is stored in the <code className="bg-primary/10 px-1 rounded">kv_store_7cb901af</code> table</p>
            <p>• <strong>Format:</strong> Each submission has a unique ID like <code className="bg-primary/10 px-1 rounded">contact_timestamp_randomid</code></p>
            <p>• <strong>Access:</strong> You can view submissions here or export them as CSV for external analysis</p>
            <p>• <strong>Security:</strong> All data is encrypted and stored securely in Supabase</p>
          </div>
        </Card>
      </div>
    </div>
  );
}