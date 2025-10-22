# Contributing to AetherCrown98

Thank you for your interest in contributing to AetherCrown98! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AetherCrown98.git
   cd AetherCrown98
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

### Component Structure

```typescript
"use client"; // Only if using client-side features

import { useState } from "react";

interface ComponentProps {
  // Props interface
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes where possible
- Use custom CSS classes from `globals.css` for common patterns
- Follow the green/gold color scheme:
  - Primary green: `#00A86B` or Tailwind classes with `primary`
  - Accent gold: `#FFD700` or Tailwind classes with `accent`
  - Dark backgrounds: Use `background-*` classes

### Custom Classes Available

```css
.btn-primary        /* Green button */
.btn-accent         /* Gold button */
.card               /* Dark card */
.card-glow          /* Card with glow effect */
.gradient-text      /* Green to gold gradient text */
.glow-border        /* Gold border with glow */
.animate-float      /* Floating animation */
.animate-fade-in    /* Fade in animation */
.animate-slide-in   /* Slide in animation */
.animate-glow-pulse /* Glow pulse animation */
```

## 🎨 Design Principles

1. **Futuristic Aesthetic**: Maintain the sleek, modern look
2. **Green/Gold Theme**: Use the established color palette
3. **Smooth Animations**: Add transitions to interactive elements
4. **Responsive Design**: Test on mobile, tablet, and desktop
5. **Accessibility**: Ensure proper contrast and ARIA labels

## 🔧 Making Changes

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Enhancement: `enhance/description`
- Documentation: `docs/description`

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]
[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(dashboard): add revenue chart animation
fix(payments): resolve form validation issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Before Submitting PR

1. Test in development mode:
   ```bash
   npm run dev
   ```

2. Test production build:
   ```bash
   npm run build
   npm start
   ```

3. Check TypeScript:
   ```bash
   npx tsc --noEmit
   ```

4. Test on multiple screen sizes:
   - Mobile (< 768px)
   - Tablet (768px - 1024px)
   - Desktop (> 1024px)

## 📦 Pull Request Process

1. Update documentation if needed
2. Test your changes thoroughly
3. Ensure code follows style guidelines
4. Create a pull request with:
   - Clear title and description
   - Screenshots for UI changes
   - List of changes made
   - Any breaking changes noted

### PR Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Documentation update

## Screenshots
[If UI changes, add before/after screenshots]

## Testing
- [ ] Tested in development
- [ ] Tested production build
- [ ] Tested on mobile
- [ ] Tested on desktop

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive on all screen sizes
```

## 🎯 Areas for Contribution

### High Priority
- Additional page templates
- More AI-powered components
- Performance optimizations
- Accessibility improvements
- Test coverage

### Medium Priority
- Additional animations
- More chart types
- Form validation
- Error handling
- Loading states

### Nice to Have
- Dark/light mode toggle
- Custom themes
- Internationalization (i18n)
- Advanced search
- Data export features

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome 120, Safari 17]
- Node version: [e.g., 18.17.0]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Any alternative solutions or features

**Additional context**
Mockups, examples, or references
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 📞 Contact

- GitHub Issues: For bugs and feature requests
- Discussions: For questions and ideas
- Pull Requests: For code contributions

## 🙏 Thank You

Every contribution, no matter how small, is valued and appreciated. Thank you for helping make AetherCrown98 better!
