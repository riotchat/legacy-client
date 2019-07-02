import * as React from 'react';

export default class ErrorBoundary extends React.Component<{ customMessage?: React.ReactNode }, { error: Error | undefined }> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: undefined
        }
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error(error);
        console.error("Thrown in the following component:", info.componentStack);
    }

    render() {
        if(!this.state.error) return this.props.children;
        else return (
            <div style={{ margin: "20px", color: "white" }}>
                {this.props.customMessage}
            </div>
        ) || (
            <div style={{ margin: "20px", color: "white" }}>
                <h3>An error has occurred</h3>
                <h5>To prevent the application from crashing, this part of the UI has been shut down</h5><br />
                <h5>A stack trace has been logged to the developer console</h5>
            </div>
        );
    }
}