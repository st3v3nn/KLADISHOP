import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log the error to console for debugging
    // In production you can send this to a logging service
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-white text-black">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-black mb-4">Something went wrong.</h1>
            <p className="mb-4">An unexpected error occurred while loading the admin panel. Check the console for details.</p>
            <details className="whitespace-pre-wrap text-left text-sm bg-gray-100 p-4 border-2 border-black">
              {this.state.error?.toString()}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
