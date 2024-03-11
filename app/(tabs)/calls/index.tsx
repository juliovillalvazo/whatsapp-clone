import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '@constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import calls from '@assets/data/calls.json';
import { defaultStyles } from '@constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Calls = () => {
    const { bottom } = useSafeAreaInsets();
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(calls);

    const onEdit = useCallback(() => {
        setIsEditing((prev) => !prev);
    }, []);
    return (
        <View style={styles.flex}>
            <Stack.Screen
                options={{
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={onEdit}>
                                <Text
                                    style={{
                                        color: Colors.primary,
                                        fontSize: 18,
                                    }}
                                >
                                    {isEditing ? 'Done' : 'Edit'}
                                </Text>
                            </TouchableOpacity>
                        );
                    },
                }}
            />
            <ScrollView contentInsetAdjustmentBehavior='automatic'>
                <View style={[defaultStyles.block, { marginBottom: bottom }]}>
                    <FlatList
                        data={items}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <RenderItem item={item} />}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

type Item = {
    id: string;
    name: string;
    date: string;
    incoming: boolean;
    missed: boolean;
    img: string;
    video: boolean;
};

const RenderItem = memo(({ item }: { item: Item }) => {
    return (
        <View style={[defaultStyles.item]}>
            <Image source={{ uri: item.img }} style={styles.avatar} />
            <View style={[styles.flex, styles.gap]}>
                <Text
                    style={[
                        styles.avatarText,
                        { color: item.missed ? Colors.red : '#000' },
                    ]}
                >
                    {item.name}
                </Text>
                <View style={styles.avatarIcons}>
                    <Ionicons
                        name={item.video ? 'videocam' : 'call'}
                        size={16}
                        color={Colors.gray}
                    />
                    <Text style={styles.avatarDescription}>
                        {item.incoming ? 'Incoming' : 'Outgoing'}
                    </Text>
                </View>
            </View>
            <View style={styles.informationBracker}>
                <Text style={{ color: Colors.gray }}>
                    {format(item.date, 'MM.dd.yy')}
                </Text>
                <Ionicons
                    name='information-circle-outline'
                    size={24}
                    color={Colors.primary}
                />
            </View>
        </View>
    );
});

const ItemSeparatorComponent = memo(() => (
    <View style={defaultStyles.separator} />
));

export default Calls;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    gap: {
        gap: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarText: {
        fontSize: 18,
    },
    avatarIcons: {
        flexDirection: 'row',
        gap: 4,
    },
    avatarDescription: {
        color: Colors.gray,
        flex: 1,
    },
    informationBracker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
