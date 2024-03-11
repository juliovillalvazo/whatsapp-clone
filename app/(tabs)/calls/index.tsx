import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import Colors from '@constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import calls from '@assets/data/calls.json';
import { defaultStyles } from '@constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SegmentedControl } from '@components/SegmentedControl';
import Animated, {
    CurvedTransition,
    FadeInUp,
    FadeOutUp,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import SwipeableRow from '@components/SwipeableRow';
import * as Haptics from 'expo-haptics';

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

const transition = CurvedTransition.delay(100);

const Calls = () => {
    const { bottom } = useSafeAreaInsets();
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(calls);
    const [selectedOption, setSelectedOption] = useState('All');

    const editing = useSharedValue(-30);

    const onEdit = useCallback(() => {
        editing.value = isEditing ? -30 : 0;
        setIsEditing((prev) => !prev);
    }, [isEditing]);

    const removeCall = useCallback((item: Item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setItems(items.filter((i) => i.id !== item.id));
    }, []);

    useEffect(() => {
        if (selectedOption === 'All') {
            setItems(calls);
        } else {
            setItems(calls.filter((item) => item.missed));
        }
    }, [selectedOption]);

    return (
        <View style={[styles.flex, { backgroundColor: Colors.background }]}>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <SegmentedControl
                            options={['All', 'Missed']}
                            selectedOption={selectedOption}
                            onOptionPress={setSelectedOption}
                        />
                    ),
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
                <Animated.View
                    style={[defaultStyles.block, { marginBottom: bottom }]}
                    layout={transition}
                >
                    <Animated.FlatList
                        skipEnteringExitingAnimations
                        data={items}
                        itemLayoutAnimation={transition}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <RenderItem
                                item={item}
                                index={index}
                                editing={editing}
                                removeCall={removeCall}
                            />
                        )}
                    />
                </Animated.View>
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

const RenderItem = memo(
    ({
        item,
        index,
        removeCall,
        editing,
    }: {
        item: Item;
        index: number;
        removeCall: (item: Item) => void;
        editing: SharedValue<number>;
    }) => {
        const animatedRowStyles = useAnimatedStyle(() => ({
            transform: [{ translateX: withTiming(editing.value) }],
        }));
        return (
            <SwipeableRow onDelete={() => removeCall(item)}>
                <Animated.View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    entering={FadeInUp.delay(index * 20)}
                    exiting={FadeOutUp}
                >
                    <AnimatedTouchableOpacity
                        onPress={() => removeCall(item)}
                        style={[animatedRowStyles, { paddingLeft: 8 }]}
                    >
                        <Ionicons
                            name='remove-circle'
                            size={24}
                            color={Colors.red}
                        />
                    </AnimatedTouchableOpacity>
                    <Animated.View
                        style={[defaultStyles.item, animatedRowStyles]}
                    >
                        <Image
                            source={{ uri: item.img }}
                            style={styles.avatar}
                        />
                        <View style={[styles.flex, styles.gap]}>
                            <Text
                                style={[
                                    styles.avatarText,
                                    {
                                        color: item.missed
                                            ? Colors.red
                                            : '#000',
                                    },
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
                    </Animated.View>
                </Animated.View>
            </SwipeableRow>
        );
    },
);

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
