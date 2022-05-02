import {useCallback, useState} from "react";

const useStepTransitions = () => {
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const startTransition = useCallback(() => {
        setIsTransitioning(true);
    }, [setIsTransitioning])

    const endTransition = useCallback(() => {
        setIsTransitioning(false);
    }, [setIsTransitioning]);

    return [isTransitioning, startTransition, endTransition] as const;
}

export default useStepTransitions;