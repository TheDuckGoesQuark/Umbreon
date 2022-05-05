import {Component} from "react";
import {Button, Center, Group} from "@mantine/core";

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
                <Group direction='column' align='center' position='center'>
                    {baseMessage}{error.message}
                    <Button onClick={() => this.setState({error: undefined})}>
                        Back to Safety
                    </Button>
                </Group>
            );
        } else {
            return <>{this.props.children}</>;
        }
    }
}

export default ErrorBoundary;
