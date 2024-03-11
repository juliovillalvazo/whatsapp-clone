import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableHighlight,
    Image,
} from 'react-native';
import React, { memo } from 'react';
import chats from '@assets/data/chats.json';
import { defaultStyles } from '@constants/Styles';
import { Link } from 'expo-router';
import Colors from '@constants/Colors';
import { format } from 'date-fns';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';

type Item = {
    id: string;
    from: string;
    date: string;
    img: string;
    msg: string;
    read: boolean;
    unreadCount: number;
};

const ChatRow = memo(({ item }: { item: Item }) => {
    return (
        <AppleStyleSwipeableRow>
            <Link href={`/(tabs)/chats/${item.id}`} asChild>
                <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor={Colors.lightGray}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 14,
                            paddingLeft: 20,
                            paddingVertical: 10,
                        }}
                    >
                        <Image
                            source={{ uri: item.img }}
                            style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, color: Colors.gray }}>
                                {item.msg.length > 40
                                    ? `${item.msg.substring(0, 40)}...`
                                    : item.msg}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: Colors.gray,
                                paddingRight: 20,
                                alignSelf: 'flex-start',
                            }}
                        >
                            {format(item.date, 'MM.dd.yy')}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Link>
        </AppleStyleSwipeableRow>
    );
});

export default ChatRow;
