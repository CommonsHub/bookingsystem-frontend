# Embeddable Request Form

The `EmbeddableRequestForm` component is a standalone, embeddable version of the request form that can be used in other applications or websites without routing dependencies.

## Features

- **Standalone**: No routing dependencies, can be embedded anywhere
- **Authentication-aware**: Handles user authentication automatically
- **Customizable**: Configurable callbacks, default values, and styling
- **Error handling**: Built-in error handling with optional callbacks
- **Flexible**: Supports both embedded and redirect modes

## Basic Usage

```tsx
import { EmbeddableRequestForm } from "@/components/request/EmbeddableRequestForm";

function MyComponent() {
  const handleRequestCreated = (requestId: string) => {
    console.log("Request created:", requestId);
  };

  return (
    <EmbeddableRequestForm
      onRequestCreated={handleRequestCreated}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRequestCreated` | `(requestId: string) => void` | `undefined` | Callback when request is successfully created |
| `onCancel` | `() => void` | `undefined` | Callback when form is cancelled |
| `onError` | `(error: Error) => void` | `undefined` | Callback when an error occurs |
| `defaultValues` | `Partial<RequestFormData>` | `{}` | Default values to pre-populate the form |
| `showHeader` | `boolean` | `true` | Whether to show the form title and description |
| `className` | `string` | `""` | Custom CSS class for the container |
| `redirectAfterSubmit` | `boolean` | `false` | Whether to redirect after successful submission |
| `redirectUrl` | `string` | `"/"` | URL to redirect to after submission (only used if `redirectAfterSubmit` is true) |

## Examples

### Basic Embedding

```tsx
<EmbeddableRequestForm
  onRequestCreated={(requestId) => {
    // Handle successful request creation
    showSuccessMessage(`Request ${requestId} created successfully!`);
  }}
  onCancel={() => {
    // Handle cancellation
    closeModal();
  }}
/>
```

### With Custom Defaults

```tsx
<EmbeddableRequestForm
  defaultValues={{
    requestType: "support",
    priority: "high",
    title: "Technical Issue",
  }}
  showHeader={false}
  className="my-custom-styles"
/>
```

### With Redirect After Submit

```tsx
<EmbeddableRequestForm
  redirectAfterSubmit={true}
  redirectUrl="/thank-you"
  onRequestCreated={(requestId) => {
    // Custom logic before redirect
    analytics.track('request_created', { requestId });
  }}
/>
```

### Error Handling

```tsx
<EmbeddableRequestForm
  onError={(error) => {
    console.error("Failed to create request:", error);
    showErrorMessage("Failed to create request. Please try again.");
  }}
  onRequestCreated={(requestId) => {
    showSuccessMessage("Request created successfully!");
  }}
/>
```

## Authentication

The component automatically handles authentication:

- If the user is not authenticated, it shows a login prompt
- If the user is authenticated, it pre-populates the form with user information
- The component uses the existing authentication context

## Styling

The component uses Tailwind CSS classes and can be customized with:

- The `className` prop for container styling
- Custom CSS classes for specific elements
- The existing design system components

## Integration with Existing App

The embeddable form integrates seamlessly with the existing booking system:

- Uses the same authentication context
- Uses the same request creation logic
- Uses the same form validation and schema
- Maintains consistency with the existing UI

## Example Page

See `EmbeddableRequestExample.tsx` for a complete example of how to use the component with various configurations.

## Notes

- The component requires the `AuthProvider` and `RequestProvider` to be available in the component tree
- The component uses the same translation system as the main app
- The component maintains the same form validation and error handling as the original form 