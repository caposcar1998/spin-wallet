## Mandatory: Implement Tests and Add Test IDs

**The task is NOT complete until the tests have been implemented, the required `data-testid` attributes have been added, and the tests have been executed successfully.**

The agent must perform the following actions:

1. Analyze the target code and identify all relevant test scenarios.
2. Create the actual unit test files.
3. Modify production components when necessary to add stable `data-testid` attributes.
4. Implement all test cases.
5. Execute the tests.
6. Fix failures caused by incorrect tests or actual implementation issues.
7. Execute the tests again and report the results.

### Test ID requirements

Add `data-testid` attributes to all relevant interactive and functional elements in the components being tested.

This includes:
- Buttons and clickable elements.
- Inputs and form controls.
- Form submission elements.
- Error and success messages.
- Loading indicators.
- Modals and dialogs.
- Conditional rendering elements.
- Dynamic lists and repeated elements.
- Navigation elements.
- Component sections relevant to functional tests.

Use descriptive kebab-case identifiers.

Examples:

```tsx
<button data-testid="login-submit-button">
  Login
</button>

<input data-testid="login-email-input" />

<div data-testid="login-error-message">
  Invalid credentials
</div>

<div data-testid="login-loading-indicator">
  Loading...
</div>
```

For reusable components, support passing a `testId` prop when appropriate.

Do not add IDs to purely decorative elements.

Prefer accessible queries (`getByRole`, `getByLabelText`) when appropriate, but ensure the required `data-testid` attributes exist on relevant elements.

### Test implementation requirements

- Create real `.test.ts` or `.test.tsx` files.
- Cover successful scenarios, failures, edge cases and conditional behavior.
- Test actual user interactions.
- Test loading, success and error states.
- Mock external dependencies and API calls.
- Verify expected outputs and side effects.
- Avoid testing implementation details.
- Do not leave TODOs, placeholders or empty test suites.

### Execution requirements

Run the tests using the existing project scripts or test runner.

Execute:
1. Newly created tests.
2. All tests in the affected module.
3. TypeScript validation.
4. ESLint, if configured.
5. Coverage, if configured.

If tests fail, investigate and fix the cause. Do not simply skip