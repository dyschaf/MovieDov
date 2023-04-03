// import React from "react";

// class ErrorBoundary extends React.Component {
//   constructor(){
//     super();
//     this.state = { hasError: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.log(error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;
import React from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface MyComponentProps {
  name: string;
}

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    // Simulate an error by accessing an undefined property
    
    return (
      <div>
        <h1>Hello,!</h1>
        
      </div>
    );
  }
}

export default ErrorBoundary