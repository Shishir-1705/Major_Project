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
        <div className="h-screen w-screen bg-[#080D18] text-[#F5F7FB] flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="bg-[#111C2E] border border-[#26354A] p-8 rounded-2xl max-w-md w-full text-center space-y-5 shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto shadow-2xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#162238] text-red-400 border border-red-500/30">
                System Alert
              </span>
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F7FB]">
                Application Error Encountered
              </h2>
              <p className="text-xs text-[#8291A8] leading-relaxed">
                An unexpected interface error occurred. Session telemetry has been secured. Click below to reload the platform.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#19D3C5] hover:bg-[#39E4D5] text-[#06151A] font-bold text-xs shadow-xs transition-colors cursor-pointer"
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
