import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import Colors from '@constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { defaultStyles } from '@constants/Styles';
import BoxedIcon from '@components/BoxedIcon';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const settings = () => {
    const devices = useMemo(
        () => [
            {
                name: 'Broadcast Lists',
                icon: 'megaphone',
                backgroundColor: Colors.green,
            },
            {
                name: 'Starred Messages',
                icon: 'star',
                backgroundColor: Colors.yellow,
            },
            {
                name: 'Linked Devices',
                icon: 'laptop-outline',
                backgroundColor: Colors.green,
            },
        ],
        [],
    );

    const items = useMemo(
        () => [
            {
                name: 'Account',
                icon: 'key',
                backgroundColor: Colors.primary,
            },
            {
                name: 'Privacy',
                icon: 'lock-closed',
                backgroundColor: '#33a5d1',
            },
            {
                name: 'Chats',
                icon: 'logo-whatsapp',
                backgroundColor: Colors.green,
            },
            {
                name: 'Notifications',
                icon: 'notifications',
                backgroundColor: Colors.red,
            },
            {
                name: 'Storage and Data',
                icon: 'repeat',
                backgroundColor: Colors.green,
            },
        ],
        [],
    );

    const support = useMemo(
        () => [
            {
                name: 'Help',
                icon: 'information',
                backgroundColor: Colors.primary,
            },
            {
                name: 'Tell a Friend',
                icon: 'heart',
                backgroundColor: Colors.red,
            },
        ],
        [],
    );

    const { signOut } = useAuth();

    return (
        <View style={[styles.flex, styles.container]}>
            <ScrollView contentInsetAdjustmentBehavior='automatic'>
                <GenericList items={devices} />
                <GenericList items={items} />
                <GenericList items={support} />
                <TouchableOpacity onPress={() => signOut()}>
                    <Text style={styles.primaryText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const RenderItem = memo(
    ({
        item,
    }: {
        item: {
            name: string;
            icon: string;
            backgroundColor: string;
        };
    }) => {
        return (
            <View style={defaultStyles.item}>
                <BoxedIcon
                    name={item.icon}
                    backgroundColor={item.backgroundColor}
                />
                <Text style={[styles.flex, styles.text]}>{item.name}</Text>
                <Ionicons
                    name='chevron-forward'
                    size={20}
                    color={Colors.gray}
                />
            </View>
        );
    },
);

const GenericList = memo(
    ({
        items,
    }: {
        items: {
            name: string;
            icon: string;
            backgroundColor: string;
        }[];
    }) => {
        return (
            <View style={defaultStyles.block}>
                <FlatList
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                        <View style={defaultStyles.separator} />
                    )}
                    data={items}
                    renderItem={({ item }) => <RenderItem item={item} />}
                />
            </View>
        );
    },
);

export default settings;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: Colors.background,
    },
    text: {
        fontSize: 18,
    },
    primaryText: {
        color: Colors.primary,
        textAlign: 'center',
        paddingVertical: 14,
    },
});
