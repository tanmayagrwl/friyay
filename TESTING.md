# Testing Guide for Friyay

This project uses **Vitest** with **React Testing Library** for comprehensive testing. Here's everything you need to know about testing in this application.

## Quick Start

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode (re-run on file changes)
bun test:watch

# Run tests with UI (visual test runner)
bun test:ui

# Run tests with coverage report
bun test:coverage

# Run specific test file
bun test activity-card.test.tsx

# Run tests matching a pattern
bun test --grep "activity"
```

## Test Structure

### 📁 Test Organization

```
__tests__/
├── components/           # Component tests
├── e2e/                 # End-to-end tests
├── utils/               # Test utilities and helpers
├── types.test.ts        # Type validation tests
├── utils.test.ts        # Utility function tests
└── schedule-store.test.ts # Store/state management tests
```

### 🧪 Types of Tests

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test component interactions
3. **Store Tests** - Test Zustand store logic
4. **E2E Tests** - Test complete user workflows (template provided)

## Writing Tests

### 1. Component Tests

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MyComponent } from '../components/my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<MyComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### 2. Store Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useMyStore } from '../store/my-store'

describe('MyStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMyStore.setState((state) => ({
      ...state,
      items: [],
    }))
  })

  it('adds items correctly', () => {
    const { addItem } = useMyStore.getState()
    addItem('test item')
    
    const { items } = useMyStore.getState()
    expect(items).toContain('test item')
  })
})
```

### 3. Mock External Dependencies

For complex components with external dependencies:

```typescript
// Mock external libraries
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
  }),
}))

// Mock internal modules
vi.mock('../store/my-store', () => ({
  useMyStore: (selector: any) => selector(mockState),
}))
```

## Testing Patterns

### ✅ Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // ✅ Good - tests user behavior
   expect(screen.getByText('Activity added')).toBeInTheDocument()
   
   // ❌ Bad - tests implementation details
   expect(component.state.activities.length).toBe(1)
   ```

2. **Use descriptive test names**
   ```typescript
   // ✅ Good
   it('shows error message when required field is empty', () => {})
   
   // ❌ Bad
   it('validation works', () => {})
   ```

3. **Arrange, Act, Assert**
   ```typescript
   it('adds activity to schedule', () => {
     // Arrange
     const activity = createMockActivity()
     
     // Act
     addActivity(activity, 'saturday', 'morning')
     
     // Assert
     expect(getActivities()).toContain(activity)
   })
   ```

4. **Use test utilities for common operations**
   ```typescript
   import { createMockActivity } from './utils/test-helpers'
   
   const activity = createMockActivity({ title: 'Custom Title' })
   ```

### 🎯 What to Test

#### Components
- ✅ Renders correctly with props
- ✅ Handles user interactions (clicks, form submissions)
- ✅ Shows/hides elements based on state
- ✅ Calls callback functions with correct parameters
- ✅ Accessibility (screen reader support)

#### Store/State Management
- ✅ Initial state is correct
- ✅ Actions update state correctly
- ✅ Complex state transformations
- ✅ Side effects (if any)

#### Utilities
- ✅ Pure functions return expected outputs
- ✅ Edge cases and error handling
- ✅ Type safety

### 🚫 What NOT to Test

- ❌ Third-party library internals
- ❌ CSS styles (unless critical for functionality)
- ❌ Implementation details that users don't see
- ❌ Trivial getters/setters

## Test Configuration

### Files
- `vitest.config.ts` - Main test configuration
- `test-setup.ts` - Global test setup and mocks
- `__tests__/utils/test-helpers.tsx` - Reusable test utilities

### Environment
- **Test Runner**: Vitest
- **DOM Environment**: jsdom
- **Component Testing**: React Testing Library
- **Mocking**: Vitest built-in mocking
- **Assertions**: Vitest + jest-dom matchers

## Troubleshooting

### Common Issues

1. **"vi is not defined"**
   - Make sure `globals: true` is set in `vitest.config.ts`
   - Import `vi` from vitest: `import { vi } from 'vitest'`

2. **Component not rendering**
   - Check if all required props are provided
   - Mock external dependencies
   - Ensure test setup includes necessary providers

3. **Storage warnings in tests**
   - Normal for Zustand persist middleware in test environment
   - Can be safely ignored or mocked if needed

4. **Async operations not completing**
   - Use `waitFor` for async assertions
   - Mock timers if testing time-dependent code

### Performance Tips

- Use `beforeEach` to reset state between tests
- Mock heavy dependencies
- Run specific test files during development
- Use `test.skip()` for temporarily disabled tests

## Examples

Check out the existing test files for practical examples:
- `__tests__/types.test.ts` - Simple unit tests
- `__tests__/utils.test.ts` - Utility function testing
- `__tests__/schedule-store.test.ts` - Store testing
- `__tests__/utils/test-helpers.tsx` - Test utilities

Happy testing! 🧪
