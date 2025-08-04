# Campundzsbra Tech Club Website

A modern, responsive website for the Campundzsbra student-led innovation and tech club. Built with React, TypeScript, Tailwind CSS, and Supabase backend.

## 🚀 Features

- **Modern Design**: Dark theme with neon blue, purple, and lime green accent colors
- **Responsive Layout**: Mobile-first design that works on all devices
- **Contact Form**: Integrated with Supabase backend for storing submissions
- **Admin Dashboard**: Password-protected admin panel to view contact submissions
- **Team Showcase**: Display team members with icon avatars
- **Project Portfolio**: Featured projects section
- **WhatsApp Integration**: Direct link to club WhatsApp

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Database & Edge Functions)
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account (for backend functionality)

## 🏗️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campundzsbra-website.git
   cd campundzsbra-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Update `/utils/supabase/info.tsx` with your Supabase project details
   - Make sure your Supabase project has the required Edge Functions deployed

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy with default settings
5. Your site will be live at `https://your-project.vercel.app`

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Deploy with default settings
5. Your site will be live at `https://your-project.netlify.app`

### Option 3: GitHub Pages

1. Build the project: `npm run build`
2. Use GitHub Actions for deployment
3. Enable GitHub Pages in repository settings

## 🔐 Admin Access

- Access the admin dashboard by clicking the "Admin" button (bottom right)
- Default password: `0267661515`
- View and export contact form submissions
- Manage club data

## 📱 Contact Integration

- **WhatsApp**: Linked to +233544089673
- **Contact Form**: Stores submissions in Supabase database
- **Email**: hello@campundzsbra.club (update with actual email)

## 👥 Team Members

- **Daniel** - Frontend Lead
- **Micheal** - Backend Architect  
- **Eyeboy** - Mobile Developer
- **Adams** - AI/ML Researcher
- **Wisdom** - UI/UX Designer
- **Jessica** - Project Manager

## 🎨 Customization

### Colors
The website uses a tech-inspired color scheme defined in `/styles/globals.css`:
- **Primary**: Neon Blue (#00d4ff)
- **Secondary**: Neon Purple (#b447ff)
- **Accent**: Neon Lime (#39ff14)

### Content
Update content in `/App.tsx`:
- Hero section text
- About us information
- Services offered
- Team member details
- Contact information

### Styling
- Global styles: `/styles/globals.css`
- Component styles: Tailwind CSS classes
- Dark theme: Enabled by default

## 📊 Backend (Supabase)

The website uses Supabase for:
- **Contact Form Storage**: All submissions stored securely
- **Team Data**: Member information and roles
- **Project Data**: Featured projects showcase
- **Admin Dashboard**: Real-time data viewing

### Database Schema
```sql
-- Contact submissions table
CREATE TABLE kv_store_7cb901af (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

## 🚀 Performance

- **Lighthouse Score**: 95+ (aim for high performance)
- **Core Web Vitals**: Optimized for fast loading
- **SEO**: Meta tags and structured data
- **Accessibility**: WCAG compliant components

## 🔧 Maintenance

### Adding New Team Members
1. Update the team array in `/supabase/functions/server/index.tsx`
2. Add corresponding icon to the iconMap in `/App.tsx`

### Adding New Projects
1. Update the projects array in the Supabase function
2. Use high-quality Unsplash images for project thumbnails

### Updating Contact Information
1. Update email addresses in the contact section
2. Update WhatsApp number in the button onClick handler
3. Update social media links

## 📈 Analytics (Optional)

To add analytics:
1. Install Google Analytics or similar
2. Add tracking code to `/App.tsx`
3. Set up conversion tracking for contact form

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- WhatsApp: +233544089673
- Email: hello@campundzsbra.club
- Open an issue on GitHub

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Supabase** for backend infrastructure
- **Unsplash** for high-quality images
- **Lucide** for consistent icons

---

**Built with ❤️ by the Campundzsbra Tech Club**

*"Follow well. Lead better. Build together."*