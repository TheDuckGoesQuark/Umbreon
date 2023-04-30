import React, {PropsWithChildren} from "react";

interface AggregatedContextsProps extends PropsWithChildren {
    contextProviders: React.FC<PropsWithChildren>[];
}

const AggregatedContextsProvider: React.FC<AggregatedContextsProps> = ({
                                                                           children,
                                                                           contextProviders,
                                                                       }: AggregatedContextsProps) => {
    let aggregatedContext = <>{children}</>;
    [...contextProviders].reverse().forEach((ContextProvider) => {
        aggregatedContext = <ContextProvider>{aggregatedContext}</ContextProvider>;
    });

    return aggregatedContext;
};

export {AggregatedContextsProvider}
