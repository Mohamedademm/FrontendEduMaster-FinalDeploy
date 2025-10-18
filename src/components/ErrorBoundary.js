import React from 'react';

/**
 * Error Boundary pour capturer les erreurs React
 * Utilisation: Envelopper l'application dans App.js
 * <ErrorBoundary><App /></ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // TODO: Envoyer l'erreur à un service de monitoring (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>
            <h1 style={styles.title}>Oups ! Quelque chose s'est mal passé</h1>
            <p style={styles.subtitle}>
              Une erreur inattendue s'est produite. Ne vous inquiétez pas, notre équipe a été notifiée.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Détails de l'erreur (dev only)</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.buttonContainer}>
              <button onClick={this.handleReload} style={styles.primaryButton}>
                🔄 Recharger la page
              </button>
              <button onClick={this.handleGoHome} style={styles.secondaryButton}>
                🏠 Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  content: {
    maxWidth: '600px',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '64px',
    display: 'inline-block',
    animation: 'pulse 2s infinite',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.5',
  },
  details: {
    textAlign: 'left',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#666',
  },
  errorText: {
    fontSize: '12px',
    color: '#d32f2f',
    overflow: 'auto',
    maxHeight: '200px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#007bff',
    backgroundColor: 'white',
    border: '2px solid #007bff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default ErrorBoundary;
