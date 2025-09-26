# Frontend Template

A modern, production-ready React template built with Vite, Tailwind CSS, and a comprehensive component system. Perfect for quickly starting new projects with best practices already implemented.

## ✨ Features

- **React 19** - Latest React with all modern features
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with custom theme system
- **React Router DOM** - Client-side routing
- **Dark/Light Theme** - Built-in theme toggle with smooth transitions
- **Theme System** - CSS variables-based theming for easy customization  
- **Component Library** - Pre-built components (Modal, Sidebar, etc.)
- **Toast Notifications** - User feedback with react-hot-toast
- **Responsive Design** - Mobile-first approach
- **ESLint Configuration** - Code quality and consistency
- **Modern Icons** - Lucide React icon library

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd frontend-template
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Modal.jsx       # Modal component with theme support
│   └── SideBar.jsx     # Responsive sidebar navigation
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Main app layout with sidebar
├── pages/              # Page components
│   ├── Home.jsx        # Home page with modal demo
│   └── Example.jsx     # Example page showcasing features
├── assets/             # Static assets
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles and theme variables
```

## 🎨 Theme System

The template uses CSS variables for theming, making it easy to customize colors across the entire application:

```css
:root {
  --primary: 220 14% 96%;
  --primary-foreground: 220.9 39.3% 11%;
  --sidebar-bg: 224 71.4% 4.1%;
  --sidebar-hover: 0 84.2% 60.2%;
  /* ... more theme variables */
}
```

### Dark/Light Mode

The template includes a built-in dark/light theme toggle:

```jsx
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

// The theme toggle automatically saves preference to localStorage
<ThemeToggle />
```

### Customizing Colors

Update the CSS variables in `src/index.css` to change the theme, or extend the Tailwind configuration in `tailwind.config.js`. The template supports both light and dark mode with smooth transitions.

## 🧩 Components

### Modal Component
```jsx
<Modal
  open={modalOpen}
  onBackdropClick={() => setModalOpen(false)}
  title="Modal Title"
  size="lg"
  footer={<button>Close</button>}
>
  Modal content
</Modal>
```

### Sidebar Navigation
The sidebar automatically renders navigation items defined in the `navItems` array and supports:
- Responsive collapse/expand
- Active route highlighting
- Theme-based styling
- Icon integration

### Toast Notifications
```jsx
import { toast } from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast('Info message');
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Add navigation item to `src/components/SideBar.jsx`

### Customizing Styles

- Global styles: `src/index.css`
- Theme colors: CSS variables in `src/index.css`
- Tailwind config: `tailwind.config.js`

## 📦 Dependencies

### Core Dependencies
- `react` & `react-dom` - React library
- `react-router-dom` - Client-side routing
- `react-hot-toast` - Toast notifications
- `lucide-react` - Modern icon library

### Development Dependencies
- `@vitejs/plugin-react` - React support for Vite
- `@tailwindcss/vite` - Tailwind CSS integration
- `eslint` - Code linting and formatting
- Various ESLint plugins for React

## 🚀 Deployment

The template is ready for deployment to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment

Build command: `npm run build`  
Output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## 📄 License

MIT License - feel free to use this template for any project!

---

**Happy coding! 🎉**
