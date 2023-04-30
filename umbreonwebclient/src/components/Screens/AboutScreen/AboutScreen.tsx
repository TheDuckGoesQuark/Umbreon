import React from "react";
import {Anchor, Center, Group, List, Stack, Text, Title} from "@mantine/core";
import PageLayout from "../../layout/PageLayout"
import {Link} from "react-router-dom";

const AboutScreen = () => {
    const titleOrders = 2;
    const secondaryTitleOrders = 4;
    return (
        <PageLayout>
            <Center>
                <Stack justify='center' align='center' h="100%" w="40%">
                    <Title order={titleOrders}>What</Title>
                    <Text>
                        Umbreon ={'>'} Eevee ={'>'} EV3
                    </Text>

                    <Text>
                        Umbreon allows you to pair your EV3 Lego Mindstorm to your account so that
                        you can connect and control it from anywhere.
                    </Text>

                    <Text>
                        As development continues, the robot will be able to share more and more information.
                        The current goal is to provide real time dashboards of the robots experiences,
                        and have the user interface adapt to any robot set up.
                    </Text>

                    <Title order={titleOrders}>Why</Title>
                    <Text>
                        I wanted to experiment with new technologies,
                        and make something that might be potentially useful to someone else,
                        and this ticked both those boxes.
                    </Text>

                    <Title order={titleOrders}>How</Title>

                    <Group>
                        <Group>
                            <Title order={secondaryTitleOrders}>Client</Title>
                            <Text>
                                The front end was written during my time at Gravity Sketch, initially as a sandbox for
                                the technologies I was learning as I took on the role of Web Engineer.
                            </Text>
                            <Text>
                                I was able to start from scratch, take the time to pay attention to best practices,
                                which even included testing <i>(gasp!)</i>.
                            </Text>
                            <List>
                                <List.Item>React: Component based web framework.</List.Item>
                                <List.Item>Auth0: Authentication service.</List.Item>
                                <List.Item>Mantine: Component library, transitions, and themes (try the dark mode!).</List.Item>
                            </List>
                        </Group>

                        <Group>
                            <Title order={secondaryTitleOrders}>Server</Title>
                            <Text>
                                Having built fifty-thousand Spring Boot applications, I decided to challenge myself
                                to build a server in the increasingly popular Golang.
                            </Text>

                            <Text>
                                The main application server is responsible for Account and Device management, which
                                is provided by a RESTful API.
                            </Text>

                            <Text>
                                Once a user has set up their account and connected a device to it, they will be
                                handed over to the TURN server which will allow the client (your browser) to connect
                                directly* to your robot.
                            </Text>

                            <Text>
                                Messages between robot and client are sent via UDP Websockets,
                                which is how the real-time interactions are achieved.
                                To decrease latency, protobuf was used to serialising the messages between the devices.
                            </Text>

                            <Text>
                                The infrastructure for all of this is provided by AWS and managed by terraform.
                            </Text>

                            <Text size='xs'>
                                * technically the TURN server is a middleman in this connection,
                                but it was necessary to ensure your device and robot could pair from any two networks.
                            </Text>
                        </Group>

                        <Group>
                            <Title order={secondaryTitleOrders}>Robot</Title>
                            <Text>
                                Since EV3s are pretty resource limited, I chose to write its software in Rust.
                            </Text>
                        </Group>
                    </Group>

                    <Stack justify='apart' align='center'>
                        <Stack align='center' justify='center'>
                            <Title order={titleOrders}>Who</Title>
                            <Text>
                                <Anchor component={Link} to='https://github.com/TheDuckGoesQuark'>This guy.</Anchor>
                            </Text>
                        </Stack>

                        <Stack align='center' justify='center'>
                            <Title order={titleOrders}>When</Title>
                            <Text>
                                <Anchor component={Link} to='https://github.com/TheDuckGoesQuark/Umbreon/'>Early
                                    2022.</Anchor>
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
            </Center>
        </PageLayout>
    )
}

export default AboutScreen