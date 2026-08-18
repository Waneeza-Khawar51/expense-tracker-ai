I have three different implementations of data export functionality across three git branches in my expense tracker application. I want to create both Developer Documentation - Technical specs, API details, implementation notes and User Documentation - Simple guide with screenshots placeholders, step-by-step instructions for all three implementations.




BACKGROUND:
- feature-data-export-v1: Simple CSV export (one-button approach)
- feature-data-export-v2: Advanced export with multiple formats and filtering options
- feature-data-export-v3: Cloud integration with sharing and collaboration features

Carefully add technical documentation for developers and user-friendly guides for end users when you add a new feature..

## Review Standards
Examples of excellent code that you should match the design/style/conventions of:
- `src/components/UserProfile/UserProfile.tsx` (React components)
- `src/utils/dataValidation.ts` (utility functions)
- `src/hooks/useUserData.ts` (custom hooks)

## Process

**First**: Read the example files above to understand our design patterns, naming conventions, and code style
**Second**: Analyze $ARGUMENTS against these standards
**Third**: Create detailed critique covering:
   - Code structure and organization
   - Adherence to established patterns
   - Performance considerations
   - Security implications
   - Maintainability concerns
   - Test coverage gaps

Make the command detect if the feature is frontend/backend/full-stack and adjust documentation accordingly
Make it automatically capture and insert screenshots in user-facing documentation
Auto-link to related existing documentation


## Output Requirements
- Save review as `ai-code-reviews/{filename}.review.md` for each file reviewed
- Include specific line references for issues
- Provide concrete suggestions for improvements
- Rate overall quality: Excellent/Good/Needs Improvement/Poor
- Estimate refactoring effort: Low/Medium/High

## Review Checklist
- Follows project naming conventions
- Proper error handling implemented
- No hardcoded values, secrets, or magic numbers
- Appropriate comments and documentation
- Follows existing design principles and consistent with exemplars
- No obvious security vulnerabilities
- Performance optimizations considered (edited)