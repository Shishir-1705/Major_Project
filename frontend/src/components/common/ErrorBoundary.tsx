import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error Boundary caught:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6 select-none">
          <div className="bg-[#111827] border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                Application Error Encountered
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected rendering error occurred. The application state has been preserved safely. Click below to reload the platform.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
