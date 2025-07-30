# Embeddable Request Page

The embeddable request page is accessible at `/embed/request` and provides a standalone request form that can be embedded in other applications or websites using an iframe.

## Features

- **URL-based configuration**: Customize the form behavior using URL parameters
- **Cross-origin messaging**: Communicates with parent window when embedded
- **Seamless authentication**: Creates user account via email verification on form submission
- **Flexible redirects**: Configurable redirect URLs for success and cancellation
- **Pre-populated fields**: Set default values via URL parameters
- **Embed-optimized layout**: Compact design without headers and card borders for seamless embedding

## URL Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `showHeader` | boolean | `true` | Whether to show the form header (set to `false` to hide) |
| `redirectUrl` | string | `/` | URL to redirect to after successful submission |
| `cancelUrl` | string | `redirectUrl` | URL to redirect to when form is cancelled |
| `requestType` | string | `""` | Pre-select the request type |
| `priority` | string | `""` | Pre-select the priority level |
| `title` | string | `""` | Pre-fill the title field |
| `description` | string | `""` | Pre-fill the description field |

## Usage Examples

### Basic Embedding

```html
<iframe 
  src="/embed/request" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

### With Custom Configuration

```html
<iframe 
  src="/embed/request?showHeader=false&requestType=support&priority=high&redirectUrl=/thank-you" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

### Pre-filled Form

```html
<iframe 
  src="/embed/request?title=Technical%20Issue&description=Need%20help%20with%20login&requestType=support&priority=urgent" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

## Cross-Origin Messaging

When embedded in an iframe, the page sends messages to the parent window for integration:

### Message Types

#### REQUEST_CREATED
Sent when a request is successfully created.

```javascript
{
  type: 'REQUEST_CREATED',
  requestId: 'string',
  data: { /* request data */ }
}
```

#### REQUEST_ERROR
Sent when an error occurs during request creation.

```javascript
{
  type: 'REQUEST_ERROR',
  error: 'error message'
}
```

#### REQUEST_CANCELLED
Sent when the user cancels the form.

```javascript
{
  type: 'REQUEST_CANCELLED'
}
```

### Listening for Messages

```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-domain.com') return;
  
  switch (event.data.type) {
    case 'REQUEST_CREATED':
      console.log('Request created:', event.data.requestId);
      // Handle successful request creation
      break;
      
    case 'REQUEST_ERROR':
      console.error('Request error:', event.data.error);
      // Handle error
      break;
      
    case 'REQUEST_CANCELLED':
      console.log('Request cancelled');
      // Handle cancellation
      break;
  }
});
```

## Authentication

- **No login required**: Users can fill out and submit the form without prior authentication
- **Email verification**: When the form is submitted, a verification email is sent to the user's email address
- **Automatic account creation**: After email verification, a user account is automatically created
- **Seamless experience**: The request is automatically submitted after successful verification
- **Pre-populated data**: If the user is already authenticated, the form is pre-populated with their information

## Styling

The embeddable page uses a compact, embed-optimized layout:

- **No headers**: Removes page title and section headers for cleaner embedding
- **Borderless cards**: Removes card borders and shadows for seamless integration
- **Compact spacing**: Reduced spacing between form elements
- **Full-width layout**: Adapts to the container width without max-width constraints
- **Responsive design**: Maintains responsiveness across different screen sizes

## Security Considerations

- The page validates all URL parameters
- Cross-origin messaging is restricted to the same origin
- Email verification is required before request submission
- All form data is validated using the same schema as the main application
- User accounts are created securely via Supabase authentication

## Integration Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Support Request Form</title>
  <style>
    .embed-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .embed-iframe {
      width: 100%;
      height: 800px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="embed-container">
    <h1>Submit a Support Request</h1>
    <iframe 
      src="/embed/request?showHeader=false&requestType=support&redirectUrl=/thank-you" 
      class="embed-iframe"
      frameborder="0">
    </iframe>
  </div>
  
  <script>
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'REQUEST_CREATED') {
        alert(`Request created successfully! ID: ${event.data.requestId}`);
      } else if (event.data.type === 'REQUEST_ERROR') {
        alert(`Error: ${event.data.error}`);
      }
    });
  </script>
</body>
</html>
``` 