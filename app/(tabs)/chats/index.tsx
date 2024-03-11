import { View, Text, ScrollView, FlatList } from 'react-native';
import React, { memo } from 'react';
import chats from '@assets/data/chats.json';
import { defaultStyles } from '@constants/Styles';
import ChatRow from '@components/ChatRow';

const Chats = () => {
    return (
        <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            contentContainerStyle={{
                paddingBottom: 40,
                backgroundColor: '#fff',
            }}
        >
            <FlatList
                scrollEnabled={false}
                data={chats}
                renderItem={({ item }) => <ChatRow item={item} />}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        </ScrollView>
    );
};

const ItemSeparatorComponent = memo(() => {
    return <View style={[defaultStyles.separator, { marginLeft: 90 }]} />;
});

export default Chats;
