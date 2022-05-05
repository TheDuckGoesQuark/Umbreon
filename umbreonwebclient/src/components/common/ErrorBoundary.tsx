import {Component} from "react";
import {Center} from "@mantine/core";

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
        const {baseMessage} = this.props;
        const {error} = this.state;

        if (error) {
            return (
                <Center>
                    {baseMessage}{error.message}
                </Center>
            );
        } else {
            return <>{this.props.children}</>;
        }
    }
}

export default ErrorBoundary;