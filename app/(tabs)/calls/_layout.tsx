import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    title: 'Calls',
                    headerLargeTitle: true,
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerBlurEffect: 'regular',
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                    headerSearchBarOptions: {
                        placeholder: 'Search',
                    },
                    headerRight: () => {
                        return (
                            <TouchableOpacity>
                                <Ionicons
                                    name='call-outline'
                                    color={Colors.primary}
                                    size={30}
                                />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
        </Stack>
    );
};

export default Layout;
