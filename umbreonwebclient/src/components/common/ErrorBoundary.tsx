import {Component} from "react";

type ErrorBoundaryProps = {
    baseMessage: string,
}

type ErrorBoundaryState = {
    error?: Error,
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props:ErrorBoundaryProps) {
        super(props);
        this.state = {error: undefined};
    }

    componentDidCatch(error: Error) {
        this.setState({error});
    }

    render() {
        const {error} = this.state;

        if (error) {
            return (
                <div>{error}</div>
            );
        } else {
            return <>{this.props.children}</>;
        }
    }
}

export default ErrorBoundary;