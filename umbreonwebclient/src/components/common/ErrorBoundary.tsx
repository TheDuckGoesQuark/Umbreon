import {Component} from "react";
import {Button, Group, Stack} from "@mantine/core";

type ErrorBoundaryProps = {
    baseMessage: string,
}

type ErrorBoundaryState = {
    error?: Error,
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
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
                <Stack align='center' justify='center'>
                    {baseMessage}{error.message}
                    <Button onClick={() => {
                        this.setState({error: undefined});
                        console.clear()
                    }}>
                        Back to Safety
                    </Button>
                </Stack>
            );
        } else {
            return <>{this.props.children}</>;
        }
    }
}

export default ErrorBoundary;
