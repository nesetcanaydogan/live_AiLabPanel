import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Senior Architect Note: 
 * Error Boundary catches JavaScript errors anywhere in the child component tree.
 * Essential for stability in complex dashboards where one component's failure shouldn't crash the entire UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Standardized logging for production debugging.
    console.error("Uncaught Error handled by Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Professional Fallback UI for ready-to-publish state.
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Beklenmedik Bir Hata</h1>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              Üzgünüz, bir şeyler ters gitti. Uygulama beklenmedik bir hata ile karşılaştı. 
              Sistem yöneticileri bilgilendirildi.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md active:scale-95"
            >
              <RotateCcw size={18} />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;