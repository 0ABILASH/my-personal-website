import { Component } from 'react'
import { RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (this.props.onError) this.props.onError(error, info)
  }

  handleReload = () => {
    this.setState({ error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
          <span className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-lg">
            ⚠
          </span>
          <p className="text-[13px] font-semibold text-text-secondary">Something went wrong on this page</p>
          <p className="text-[11.5px] text-text-quaternary max-w-sm break-words">
            {String(this.state.error.message || this.state.error)}
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border hover:border-border-hover text-[12px] font-semibold text-text-secondary hover:text-text transition-all cursor-pointer mt-1"
          >
            <RefreshCw size={12} />
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
