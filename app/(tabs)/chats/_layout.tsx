import React from 'react';
import { Link, Stack } from 'expo-router';
import Colors from '@constants/Colors';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    title: 'Chats',
                    headerLargeTitle: true,
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerBlurEffect: 'regular',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerSearchBarOptions: {
                        placeholder: 'Search',
                    },
                    headerLeft: () => {
                        return (
                            <TouchableOpacity>
                                <Ionicons
                                    name='ellipsis-horizontal-circle-outline'
                                    color={Colors.primary}
                                    size={30}
                                />
                            </TouchableOpacity>
                        );
                    },
                    headerRight: () => {
                        return (
                            <View style={{ flexDirection: 'row', gap: 30 }}>
                                <TouchableOpacity>
                                    <Ionicons
                                        name='camera-outline'
                                        color={Colors.primary}
                                        size={30}
                                    />
                                </TouchableOpacity>
                                <Link href='/(modals)/new-chat' asChild>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name='add-circle'
                                            color={Colors.primary}
                                            size={30}
                                        />
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        );
                    },
                }}
            />
            <Stack.Screen
                name='[id]'
                options={{
                    title: '',
                    headerBackTitleVisible: false,
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', gap: 30 }}>
                            <TouchableOpacity>
                                <Ionicons
                                    name='videocam-outline'
                                    color={Colors.primary}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name='call-outline'
                                    color={Colors.primary}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerTitle: () => {
                        return (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                    paddingBottom: 4,
                                    alignItems: 'center',
                                    width: 220,
                                }}
                            >
                                <Image
                                    source={{
                                        uri: 'https://avatars.githubusercontent.com/u/51309531?v=4',
                                    }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 50,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    Julio Villalvazo
                                </Text>
                            </View>
                        );
                    },
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                }}
            />
        </Stack>
    );
};

export default Layout;
