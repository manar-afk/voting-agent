import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Voter-saathi UI Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <h2>Oops! Something went wrong.</h2>
          <p>The Voter-saathi assistant encountered an unexpected error. Please refresh the page to continue.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
